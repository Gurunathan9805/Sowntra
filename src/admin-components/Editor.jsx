import React, { useRef } from 'react';
import {
  Type, 
  Image, 
  Square, 
  Trash2, 
  Copy, 
  Lock, 
  Unlock, 
  Eye, 
  RotateCw, 
  Layout,
  Ruler,
  MousePointer, 
  Hand, 
  Group, 
  Ungroup, 
  Layers, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Save, 
  X
} from 'lucide-react';

// Simple QuickActionsToolbar without complex imports
const QuickActionsToolbar = ({ 
  addTextLayer, 
  fileInputRef, 
  addShapeLayer, 
  showShapesMenu, 
  setShowShapesMenu,
  editorState, 
  setEditorState
}) => {
  const SHAPES = [
    { type: 'rectangle', name: 'Rectangle', icon: Square },
    { type: 'circle', name: 'Circle', icon: Square },
    { type: 'triangle', name: 'Triangle', icon: Square },
    { type: 'line', name: 'Line', icon: Square }
  ];

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg p-2 flex gap-2 shadow-xl z-10 border border-gray-600">
      <button 
        onClick={addTextLayer}
        className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
        title="Add Text"
      >
        <Type className="w-5 h-5" />
      </button>
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
        title="Add Image"
      >
        <Image className="w-5 h-5" />
      </button>
      
      <div className="relative">
        <button 
          onClick={() => setShowShapesMenu(!showShapesMenu)}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Add Shape"
        >
          <Square className="w-5 h-5" />
        </button>
        
        {showShapesMenu && (
          <div className="absolute left-0 top-full mt-2 bg-gray-800 rounded-lg p-2 shadow-xl z-50 border border-gray-600">
            <div className="grid grid-cols-2 gap-2">
              {SHAPES.map(shape => (
                <button
                  key={shape.type}
                  onClick={() => addShapeLayer(shape.type)}
                  className="p-2 hover:bg-gray-700 rounded transition-colors flex flex-col items-center gap-1 text-gray-300 hover:text-white text-xs"
                  title={shape.name}
                >
                  <shape.icon className="w-4 h-4" />
                  <span>{shape.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="w-px bg-gray-600"></div>
      
      <button 
        onClick={() => setEditorState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
        className={`p-2 rounded transition-colors ${editorState.showGrid ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
        title="Toggle Grid"
      >
        <Layout className="w-5 h-5" />
      </button>
      
      <button 
        onClick={() => setEditorState(prev => ({ ...prev, showRulers: !prev.showRulers }))}
        className={`p-2 rounded transition-colors ${editorState.showRulers ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
        title="Toggle Rulers"
      >
        <Ruler className="w-5 h-5" />
      </button>
    </div>
  );
};

// Simple Property Input Component
const PropertyInput = ({ value, onStartEdit, propertyPath, type = 'number', disabled = false }) => {
  return (
    <div
      onClick={() => !disabled && onStartEdit(propertyPath, value, type)}
      className={`w-full bg-gray-600 text-white px-2 py-1 rounded text-sm cursor-text hover:bg-gray-500 transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {type === 'number' ? Math.round(value) : value}
    </div>
  );
};

// Simple Layer Renderer
const LayerRenderer = ({ 
  layer, 
  editorState, 
  editingTextId, 
  textEditValue, 
  setTextEditValue, 
  handleLayerMouseDown, 
  startTextEditing, 
  finishTextEditing 
}) => {
  const isSelected = editorState.selectedLayerIds.includes(layer.id);
  const scale = editorState.zoom / 100;
  const isEditing = editingTextId === layer.id;

  return (
    <div
      key={layer.id}
      className={`absolute canvas-layer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: layer.x * scale,
        top: layer.y * scale,
        width: layer.width * scale,
        height: layer.height * scale,
        transform: `rotate(${layer.rotation || 0}deg)`,
        opacity: layer.opacity || 1,
        pointerEvents: layer.locked ? 'none' : 'auto',
        zIndex: layer.zIndex || 1,
      }}
      onMouseDown={(e) => handleLayerMouseDown(e, layer)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (layer.type === 'text' && !layer.locked) {
          startTextEditing(layer);
        }
      }}
    >
      {layer.type === 'text' && (
        <div className="w-full h-full flex items-center relative">
          {isEditing ? (
            <textarea
              value={textEditValue}
              onChange={(e) => setTextEditValue(e.target.value)}
              onBlur={finishTextEditing}
              className="w-full h-full bg-transparent border-none outline-none resize-none p-2"
              style={{
                fontSize: (layer.fontSize || 16) * scale,
                fontFamily: layer.fontFamily || 'Arial',
                fontWeight: layer.fontWeight || 'normal',
                color: layer.color || '#000000',
                textAlign: layer.textAlign || 'left',
                border: '2px dashed #3b82f6',
                background: 'rgba(59, 130, 246, 0.1)',
              }}
              autoFocus
            />
          ) : (
            <div
              className="w-full h-full flex items-center p-2 cursor-move"
              style={{
                fontSize: (layer.fontSize || 16) * scale,
                fontFamily: layer.fontFamily || 'Arial',
                fontWeight: layer.fontWeight || 'normal',
                color: layer.color || '#000000',
                textAlign: layer.textAlign || 'left',
                userSelect: 'none',
                cursor: 'move',
              }}
            >
              {layer.content || 'Text'}
            </div>
          )}
        </div>
      )}

      {layer.type === 'shape' && (
        <div 
          className="w-full h-full cursor-move"
          style={{
            backgroundColor: layer.fill || '#3b82f6',
            borderRadius: layer.borderRadius || 0,
          }}
        />
      )}

      {layer.type === 'image' && layer.src && (
        <img
          src={layer.src}
          alt=""
          className="w-full h-full object-cover cursor-move"
          draggable={false}
        />
      )}

      {layer.locked && (
        <div className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl z-50">
          <Lock className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};

// Main Editor Component
const Editor = (props) => {
  const {
    editorState,
    setEditorState,
    addTextLayer,
    addShapeLayer,
    deleteSelectedLayers,
    duplicateSelectedLayers,
    groupLayers,
    ungroupLayers,
    bringToFront,
    startTextEditing,
    finishTextEditing,
    editingTextId,
    setEditingTextId,
    textEditValue,
    setTextEditValue,
    fileInputRef,
    handleImageUpload,
    handleCanvasMouseDown,
    handleLayerMouseDown
  } = props;

  const [showShapesMenu, setShowShapesMenu] = React.useState(false);
  const canvasRef = useRef(null); // Added canvasRef

  // Safe handleLayerMouseDown function
  const safeHandleLayerMouseDown = (e, layer) => {
    e.stopPropagation();
    
    // Check if canvasRef exists before using it
    if (!canvasRef.current) {
      console.warn('Canvas reference not available');
      return;
    }

    // If handleLayerMouseDown is provided from props, use it
    if (handleLayerMouseDown) {
      handleLayerMouseDown(e, layer);
    } else {
      // Default behavior - select the layer
      setEditorState(prev => ({
        ...prev,
        selectedLayerIds: [layer.id]
      }));
    }
  };

  // Safe handleCanvasMouseDown function
  const safeHandleCanvasMouseDown = (e) => {
    // Check if canvasRef exists
    if (!canvasRef.current) {
      console.warn('Canvas reference not available');
      return;
    }

    // If handleCanvasMouseDown is provided from props, use it
    if (handleCanvasMouseDown) {
      handleCanvasMouseDown(e);
    } else {
      // Default behavior - deselect all layers
      setEditorState(prev => ({
        ...prev,
        selectedLayerIds: []
      }));
    }
  };

  // Default functions if not provided
  const defaultAddTextLayer = () => {
    const newLayer = {
      id: Date.now().toString(),
      type: 'text',
      content: 'New Text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      fontSize: 16,
      color: '#000000',
      fontFamily: 'Arial',
      zIndex: editorState.layers.length + 1,
      visible: true,
      locked: false
    };
    setEditorState(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer],
      selectedLayerIds: [newLayer.id]
    }));
  };

  const defaultAddShapeLayer = (shapeType) => {
    const newLayer = {
      id: Date.now().toString(),
      type: 'shape',
      shapeType: shapeType,
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      fill: '#3b82f6',
      zIndex: editorState.layers.length + 1,
      visible: true,
      locked: false
    };
    setEditorState(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer],
      selectedLayerIds: [newLayer.id]
    }));
    setShowShapesMenu(false);
  };

  // Default editor state if not provided
  const defaultEditorState = {
    canvasWidth: 800,
    canvasHeight: 600,
    zoom: 100,
    showGrid: false,
    showRulers: false,
    background: { color: '#ffffff' },
    layers: [],
    selectedLayerIds: []
  };

  const currentEditorState = editorState || defaultEditorState;

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Simple Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Editor</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors">
              Save
            </button>
            <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-2">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white">
            <MousePointer className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white">
            <Hand className="w-5 h-5" />
          </button>
          <button 
            onClick={addTextLayer || defaultAddTextLayer}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          >
            <Type className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowShapesMenu(!showShapesMenu)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          >
            <Square className="w-5 h-5" />
          </button>
          <button 
            onClick={() => fileInputRef?.current?.click()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          >
            <Image className="w-5 h-5" />
          </button>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-700 overflow-auto p-8 relative">
          <QuickActionsToolbar 
            addTextLayer={addTextLayer || defaultAddTextLayer}
            fileInputRef={fileInputRef}
            addShapeLayer={addShapeLayer || defaultAddShapeLayer}
            showShapesMenu={showShapesMenu}
            setShowShapesMenu={setShowShapesMenu}
            editorState={currentEditorState}
            setEditorState={setEditorState}
          />
          
          <div className="flex items-center justify-center min-h-full">
            <div
              ref={canvasRef} // Added ref here
              className="relative shadow-2xl bg-white"
              style={{
                width: currentEditorState.canvasWidth * (currentEditorState.zoom / 100),
                height: currentEditorState.canvasHeight * (currentEditorState.zoom / 100),
                background: currentEditorState.background?.color || '#ffffff',
                transformOrigin: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseDown={safeHandleCanvasMouseDown} // Use safe function
            >
              {currentEditorState.showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}
                />
              )}

              {currentEditorState.layers
                .filter(l => l.visible !== false)
                .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
                .map(layer => (
                  <LayerRenderer
                    key={layer.id}
                    layer={layer}
                    editorState={currentEditorState}
                    editingTextId={editingTextId}
                    textEditValue={textEditValue}
                    setTextEditValue={setTextEditValue}
                    handleLayerMouseDown={safeHandleLayerMouseDown} // Use safe function
                    startTextEditing={startTextEditing}
                    finishTextEditing={finishTextEditing}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 overflow-y-auto p-4 text-white">
          <h3 className="font-semibold mb-4">Properties</h3>
          {currentEditorState.selectedLayerIds.length > 0 ? (
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-400 mb-1">Selected Layers</label>
                <div className="text-white">
                  {currentEditorState.selectedLayerIds.length} layer(s) selected
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Select a layer to edit properties</p>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default Editor;
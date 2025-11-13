import React, { useRef, useState } from 'react';
import {
  Type, Image, Square, Trash2, Copy, Layout, Ruler,
  MousePointer, Hand, Group, Ungroup, Layers, Save
} from 'lucide-react';

// Simple QuickActionsToolbar
const QuickActionsToolbar = ({ 
  addTextLayer, 
  fileInputRef, 
  addShapeLayer,
  editorState, 
  setEditorState
}) => {
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const SHAPES = [
    { type: 'rectangle', name: 'Rectangle', icon: Square },
    { type: 'circle', name: 'Circle', icon: Square },
    { type: 'triangle', name: 'Triangle', icon: Square }
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
    </div>
  );
};

// Simple Layer Renderer
const LayerRenderer = ({ layer, editorState, onLayerSelect }) => {
  const scale = editorState.zoom / 100;
  const isSelected = editorState.selectedLayerIds.includes(layer.id);

  return (
    <div
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: layer.x * scale,
        top: layer.y * scale,
        width: layer.width * scale,
        height: layer.height * scale,
        transform: `rotate(${layer.rotation || 0}deg)`,
        opacity: layer.opacity || 1,
        zIndex: layer.zIndex || 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onLayerSelect(layer.id);
      }}
    >
      {layer.type === 'text' && (
        <div className="w-full h-full flex items-center p-2 cursor-move">
          <div
            className="w-full h-full flex items-center"
            style={{
              fontSize: (layer.fontSize || 16) * scale,
              fontFamily: layer.fontFamily || 'Arial',
              color: layer.color || '#000000',
              textAlign: layer.textAlign || 'left',
            }}
          >
            {layer.content || 'Text'}
          </div>
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
    </div>
  );
};

// Main Safe Editor Component
const SafeEditor = (props) => {
  const {
    editorState,
    setEditorState,
    addTextLayer,
    addShapeLayer,
    saveTemplate,
    fileInputRef,
    handleImageUpload,
    setCurrentView
  } = props;

  const canvasRef = useRef(null);

  // Safe mouse handlers
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      setEditorState(prev => ({ ...prev, selectedLayerIds: [] }));
    }
  };

  const handleLayerSelect = (layerId) => {
    setEditorState(prev => ({
      ...prev,
      selectedLayerIds: [layerId]
    }));
  };

  // Default functions if not provided
  const defaultAddTextLayer = () => {
    const newLayer = {
      id: Date.now().toString(),
      type: 'text',
      content: 'Double click to edit text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      fontSize: 24,
      color: '#000000',
      fontFamily: 'Arial',
      zIndex: editorState.layers.length,
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
      shapeType,
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      fill: '#3b82f6',
      zIndex: editorState.layers.length,
    };
    setEditorState(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer],
      selectedLayerIds: [newLayer.id]
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold">Template Editor</h2>
            <input
              type="text"
              value={editorState.name}
              onChange={(e) => setEditorState(prev => ({ ...prev, name: e.target.value }))}
              className="bg-gray-700 px-3 py-1 rounded border border-gray-600"
              placeholder="Template name"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={saveTemplate}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Save Template
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-2">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded text-gray-300 hover:text-white">
            <MousePointer className="w-5 h-5" />
          </button>
          <button 
            onClick={addTextLayer || defaultAddTextLayer}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded text-gray-300 hover:text-white"
          >
            <Type className="w-5 h-5" />
          </button>
          <button 
            onClick={() => defaultAddShapeLayer('rectangle')}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded text-gray-300 hover:text-white"
          >
            <Square className="w-5 h-5" />
          </button>
          <button 
            onClick={() => fileInputRef?.current?.click()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded text-gray-300 hover:text-white"
          >
            <Image className="w-5 h-5" />
          </button>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-gray-700 overflow-auto p-8 relative">
          <QuickActionsToolbar 
            addTextLayer={addTextLayer || defaultAddTextLayer}
            fileInputRef={fileInputRef}
            addShapeLayer={addShapeLayer || defaultAddShapeLayer}
            editorState={editorState}
            setEditorState={setEditorState}
          />
          
          <div className="flex items-center justify-center min-h-full">
            <div
              ref={canvasRef}
              className="relative shadow-2xl bg-white"
              style={{
                width: editorState.canvasWidth * (editorState.zoom / 100),
                height: editorState.canvasHeight * (editorState.zoom / 100),
                background: editorState.background?.color || '#ffffff',
              }}
              onMouseDown={handleCanvasMouseDown}
            >
              {editorState.layers.map(layer => (
                <LayerRenderer
                  key={layer.id}
                  layer={layer}
                  editorState={editorState}
                  onLayerSelect={handleLayerSelect}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 p-4 text-white">
          <h3 className="font-semibold mb-4">Properties</h3>
          {editorState.selectedLayerIds.length > 0 ? (
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-gray-400 mb-1">Template Type</label>
                <select 
                  value={editorState.templateType || 'freemium'}
                  onChange={(e) => setEditorState(prev => ({ 
                    ...prev, 
                    templateType: e.target.value 
                  }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                >
                  <option value="freemium">Freemium</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Category</label>
                <select 
                  value={editorState.category || ''}
                  onChange={(e) => setEditorState(prev => ({ 
                    ...prev, 
                    category: e.target.value 
                  }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  <option value="social">Social Media</option>
                  <option value="poster">Poster</option>
                  <option value="resume">Resume</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Select a layer or edit template properties</p>
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

export default SafeEditor;
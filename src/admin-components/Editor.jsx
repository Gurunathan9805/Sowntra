import React, { useState, useRef, useEffect } from 'react';
import {
  Type, Image, Square, Trash2, Copy, Lock, Unlock, Eye, RotateCw, Grid as GridIcon, Ruler,
  MousePointer, Hand, Group, Ungroup, Layers, AlignLeft, AlignCenter, AlignRight, Save, X
} from 'lucide-react';
import EditorToolbar from './EditorToolbar';
import { animationStyles, SHAPES, CATEGORIES, FONT_FAMILIES, ANIMATIONS, EFFECTS, GRADIENTS } from './constants';
import { generateId, getEffectStyle, getAnimationClass, getGroupBounds, renderShape } from './helpers';

// const SHAPES = [
//   { type: 'rectangle', icon: Square, name: 'Rectangle' },
//   { type: 'circle', icon: Square, name: 'Circle' },
//   { type: 'triangle', icon: Square, name: 'Triangle' },
//   { type: 'star', icon: Square, name: 'Star' },
//   { type: 'hexagon', icon: Square, name: 'Hexagon' },
//   { type: 'line', icon: Square, name: 'Line' }
// ];

// Property Input Component
const PropertyInput = ({ value, onStartEdit, propertyPath, type = 'number', className = '', disabled = false, editingProperty, setEditingProperty, finishPropertyEditing, handlePropertyKeyDown, propertyInputRef }) => {
  const isEditing = editingProperty?.path === propertyPath;

  if (isEditing) {
    return (
      <input
        ref={propertyInputRef}
        type={type === 'number' ? 'number' : 'text'}
        value={editingProperty.value}
        onChange={(e) => setEditingProperty(prev => ({ ...prev, value: e.target.value }))}
        onBlur={finishPropertyEditing}
        onKeyDown={handlePropertyKeyDown}
        className={`w-full bg-gray-500 text-white px-2 py-1 rounded text-sm border border-blue-400 outline-none ${className}`}
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={() => !disabled && onStartEdit(propertyPath, value, type)}
      className={`w-full bg-gray-600 text-white px-2 py-1 rounded text-sm cursor-text hover:bg-gray-500 transition-colors ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {type === 'number' ? Math.round(value) : value}
    </div>
  );
};

// Quick Actions Toolbar Component
const QuickActionsToolbar = ({ addTextLayer, fileInputRef, addShapeLayer, showShapesMenu, setShowShapesMenu, editorState, setEditorState, shapesMenuRef }) => (
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
    <div className="relative" ref={shapesMenuRef}>
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
      <GridIcon className="w-5 h-5" />
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

// Advanced Organizer Component
const AdvancedOrganizer = ({ layer, editorState, handleResizeMouseDown, handleRotateMouseDown }) => {
  if (!editorState.selectedLayerIds.includes(layer.id) || layer.locked) return null;

  const rotation = layer.rotation || 0;
  const rotationHandleDistance = 40;

  return (
    <>
      <div
        className="absolute inset-0 border-2 border-blue-500 pointer-events-none"
        style={{
          borderRadius: '4px',
          transform: `rotate(${rotation}deg)`
        }}
      />

      {['nw', 'ne', 'sw', 'se'].map(handle => (
        <div
          key={handle}
          className={`absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-${handle}-resize z-50`}
          style={{
            left: handle.includes('w') ? -6 : 'auto',
            right: handle.includes('e') ? -6 : 'auto',
            top: handle.includes('n') ? -6 : 'auto',
            bottom: handle.includes('s') ? -6 : 'auto',
            transform: `rotate(${rotation}deg)`
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, layer, handle)}
        />
      ))}

      {['n', 's', 'w', 'e'].map(handle => (
        <div
          key={handle}
          className={`absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-${handle}-resize z-50`}
          style={{
            left: handle === 'w' ? -6 : handle === 'e' ? 'auto' : '50%',
            right: handle === 'e' ? -6 : 'auto',
            top: handle === 'n' ? -6 : handle === 's' ? 'auto' : '50%',
            bottom: handle === 's' ? -6 : 'auto',
            marginLeft: handle === 'w' || handle === 'e' ? 0 : -6,
            marginTop: handle === 'n' || handle === 's' ? 0 : -6,
            transform: `rotate(${rotation}deg)`
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, layer, handle)}
        />
      ))}

      <div
        className="absolute w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-grab z-50 flex items-center justify-center"
        style={{
          left: '50%',
          top: -rotationHandleDistance,
          marginLeft: -12,
          transform: `rotate(${rotation}deg)`
        }}
        onMouseDown={(e) => handleRotateMouseDown(e, layer)}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 4v6h6" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </div>
    </>
  );
};

// Layer Renderer Component
const LayerRenderer = ({ layer, editorState, editingTextId, textEditValue, setTextEditValue, handleLayerMouseDown, startTextEditing, finishTextEditing, getAnimationClass, getEffectStyle, renderShape, handleDoubleClick, toggleLock, canvasRef }) => {
  const isSelected = editorState.selectedLayerIds.includes(layer.id);
  const scale = editorState.zoom / 100;
  const isEditing = editingTextId === layer.id;
  const animationClass = getAnimationClass(layer);
  
  return (
    <div
      key={layer.id}
      className={`absolute canvas-layer ${isSelected ? 'ring-0' : ''} ${animationClass}`}
      style={{
        left: layer.x * scale,
        top: layer.y * scale,
        width: layer.width * scale,
        height: layer.height * scale,
        transform: `rotate(${layer.rotation}deg)`,
        opacity: layer.opacity,
        pointerEvents: layer.locked ? 'none' : 'auto',
        zIndex: layer.zIndex,
        ...getEffectStyle(layer)
      }}
      onMouseDown={(e) => handleLayerMouseDown(e, layer)}
      onDoubleClick={(e) => handleDoubleClick(e, layer, startTextEditing)}
    >
      {isSelected && <AdvancedOrganizer layer={layer} editorState={editorState} handleResizeMouseDown={() => {}} handleRotateMouseDown={() => {}} />}

      {layer.type === 'text' && (
        <div className="w-full h-full flex items-center relative text-editing">
          {isEditing ? (
            <textarea
              value={textEditValue}
              onChange={(e) => setTextEditValue(e.target.value)}
              onBlur={finishTextEditing}
              className="w-full h-full bg-transparent border-none outline-none resize-none p-2 text-editing"
              style={{
                fontSize: layer.fontSize * scale,
                fontFamily: layer.fontFamily,
                fontWeight: layer.fontWeight,
                fontStyle: layer.fontStyle,
                color: layer.color,
                textAlign: layer.textAlign,
                borderRadius: layer.borderRadius,
                border: '2px dashed #3b82f6',
                background: 'rgba(59, 130, 246, 0.1)',
                cursor: 'text',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word'
              }}
              autoFocus
            />
          ) : (
            <div
              className="w-full h-full flex items-center p-2 cursor-move"
              style={{
                fontSize: layer.fontSize * scale,
                fontFamily: layer.fontFamily,
                fontWeight: layer.fontWeight,
                fontStyle: layer.fontStyle,
                color: layer.color,
                textAlign: layer.textAlign,
                userSelect: 'none',
                borderRadius: layer.borderRadius,
                cursor: 'move',
                wordWrap: layer.textWrap ? 'break-word' : 'normal',
                whiteSpace: layer.textWrap ? 'pre-wrap' : 'nowrap',
                overflowWrap: 'break-word',
                overflow: 'hidden'
              }}
            >
              {layer.content}
            </div>
          )}
        </div>
      )}

      {layer.type === 'shape' && (
        <svg 
          width="100%" 
          height="100%" 
          style={{ overflow: 'visible', cursor: 'move' }}
          className="cursor-move"
        >
          {renderShape(layer)}
        </svg>
      )}

      {layer.type === 'image' && (
        <img
          src={layer.src}
          alt=""
          className="w-full h-full object-cover cursor-move"
          style={{ borderRadius: layer.borderRadius }}
          draggable={false}
        />
      )}

      {layer.type === 'group' && (
        <div className="w-full h-full border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 bg-opacity-20 cursor-move">
        </div>
      )}

      {layer.locked && (
        <div className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl z-50">
          <Lock className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};

const Editor = (props) => {
  const {
    currentView, setCurrentView, editorState, setEditorState, currentUser,
    templates, setTemplates, users, setUsers, analytics, setAnalytics,
    history, setHistory, historyIndex, setHistoryIndex, undo, redo,
    addTextLayer, addShapeLayer, addImageLayer, updateLayer, deleteSelectedLayers,
    duplicateSelectedLayers, toggleLock, toggleVisibility, groupLayers, ungroupLayers,
    bringToFront, sendToBack, bringForward, sendBackward, alignLayers, saveTemplate,
    startTextEditing, finishTextEditing, startPropertyEditing, finishPropertyEditing,
    editingProperty, setEditingProperty, handlePropertyKeyDown, editingTextId,
    setEditingTextId, textEditValue, setTextEditValue, showFloatingToolbar,
    floatingToolbarPosition, setShowFloatingToolbar, updateFloatingToolbarPosition,
    canvasRef, fileInputRef, textInputRef, propertyInputRef, shapesMenuRef,
    showShapesMenu, setShowShapesMenu, handleCanvasMouseDown, handleLayerMouseDown,
    handleResizeMouseDown, handleRotateMouseDown, handleMouseMove, handleMouseUp,
    dragState, alignmentLines, autoSave, canEditTemplateSettings, handleImageUpload
  } = props;

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <style>{animationStyles}</style>
      
      <EditorToolbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        editorState={editorState}
        setEditorState={setEditorState}
        autoSave={autoSave}
        historyIndex={historyIndex}
        history={history}
        undo={undo}
        redo={redo}
        saveTemplate={saveTemplate}
        canEditTemplateSettings={canEditTemplateSettings}
        PropertyInput={PropertyInput}
        startPropertyEditing={startPropertyEditing}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-20 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-2">
          <button 
            onClick={() => setEditorState(prev => ({ ...prev, activeTool: 'select' }))}
            className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
              editorState.activeTool === 'select' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Select"
          >
            <MousePointer className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setEditorState(prev => ({ ...prev, activeTool: 'hand' }))}
            className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
              editorState.activeTool === 'hand' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Hand Tool"
          >
            <Hand className="w-6 h-6" />
          </button>
          <button onClick={addTextLayer} className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-all text-gray-300 hover:text-white" title="Add Text">
            <Type className="w-6 h-6" />
          </button>
          
          <div className="relative" ref={shapesMenuRef}>
            <button 
              onClick={() => setShowShapesMenu(!showShapesMenu)}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-all text-gray-300 hover:text-white"
              title="Add Shape"
            >
              <Square className="w-6 h-6" />
            </button>
          </div>

          <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-all text-gray-300 hover:text-white" title="Add Image">
            <Image className="w-6 h-6" />
          </button>
          <div className="w-10 h-px bg-gray-600 my-2"></div>
          <button onClick={duplicateSelectedLayers} disabled={!editorState.selectedLayerIds.length} className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-all text-gray-300 hover:text-white disabled:opacity-30" title="Duplicate">
            <Copy className="w-6 h-6" />
          </button>
          <button onClick={deleteSelectedLayers} disabled={!editorState.selectedLayerIds.length} className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-all text-gray-300 hover:text-white disabled:opacity-30" title="Delete">
            <Trash2 className="w-6 h-6" />
          </button>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-700 overflow-auto p-8 relative">
          <QuickActionsToolbar 
            addTextLayer={addTextLayer}
            fileInputRef={fileInputRef}
            addShapeLayer={addShapeLayer}
            showShapesMenu={showShapesMenu}
            setShowShapesMenu={setShowShapesMenu}
            editorState={editorState}
            setEditorState={setEditorState}
            shapesMenuRef={shapesMenuRef}
          />
          
          <div className="flex items-center justify-center min-h-full">
            <div
              ref={canvasRef}
              className="relative shadow-2xl canvas-container bg-white"
              style={{
                width: editorState.canvasWidth * (editorState.zoom / 100),
                height: editorState.canvasHeight * (editorState.zoom / 100),
                background: editorState.background.type === 'solid' 
                  ? editorState.background.color 
                  : editorState.background.gradient,
                transformOrigin: 'center',
                position: 'relative',
                overflow: 'hidden',
                cursor: editorState.activeTool === 'hand' ? 'grab' : 'default'
              }}
              onMouseDown={handleCanvasMouseDown}
            >
              {editorState.showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                       linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}
                />
              )}

              {alignmentLines.vertical.map((x, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 w-px bg-pink-500 z-40"
                  style={{ left: x * (editorState.zoom / 100) }}
                />
              ))}
              {alignmentLines.horizontal.map((y, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 h-px bg-pink-500 z-40"
                  style={{ top: y * (editorState.zoom / 100) }}
                />
              ))}

              {showFloatingToolbar && editorState.selectedLayerIds.length > 0 && (
                <div 
                  className="floating-toolbar absolute bg-gray-800 rounded-lg shadow-2xl border border-gray-600 z-50 p-2 flex items-center gap-1"
                  style={{
                    left: floatingToolbarPosition.x * (editorState.zoom / 100),
                    top: floatingToolbarPosition.y * (editorState.zoom / 100),
                    transform: 'translateX(-50%)'
                  }}
                >
                  <button
                    onClick={duplicateSelectedLayers}
                    className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={deleteSelectedLayers}
                    className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {editorState.selectedLayerIds.length > 1 && (
                    <>
                      <div className="w-px h-4 bg-gray-600"></div>
                      <button
                        onClick={groupLayers}
                        className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
                        title="Group"
                      >
                        <Group className="w-4 h-4" />
                      </button>
                      <button
                        onClick={ungroupLayers}
                        className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
                        title="Ungroup"
                      >
                        <Ungroup className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <div className="w-px h-4 bg-gray-600"></div>
                  <button
                    onClick={() => editorState.selectedLayerIds.length > 0 && bringToFront(editorState.selectedLayerIds[0])}
                    className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
                    title="Bring to Front"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              )}

              {editorState.layers
                .filter(l => l.visible)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map(layer => (
                  <LayerRenderer
                    key={layer.id}
                    layer={layer}
                    editorState={editorState}
                    editingTextId={editingTextId}
                    textEditValue={textEditValue}
                    setTextEditValue={setTextEditValue}
                    handleLayerMouseDown={handleLayerMouseDown}
                    startTextEditing={startTextEditing}
                    finishTextEditing={finishTextEditing}
                    getAnimationClass={getAnimationClass}
                    getEffectStyle={getEffectStyle}
                    renderShape={renderShape}
                    handleDoubleClick={(e, layer) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (layer.type === 'text' && !layer.locked) {
                        startTextEditing(layer);
                      }
                    }}
                    toggleLock={toggleLock}
                    canvasRef={canvasRef}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Right Properties Panel - Simplified for this example */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto p-4 text-white">
          <h3 className="font-semibold mb-4 text-lg">Properties</h3>
          {editorState.selectedLayerIds.length > 0 ? (
            <div className="space-y-4 text-sm">
              <p className="text-gray-400">Layer properties panel ready</p>
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

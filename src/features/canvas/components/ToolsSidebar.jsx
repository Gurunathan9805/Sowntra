import React, { useState } from 'react';
import {
  MousePointer, Move, Type, Square, Circle, Triangle, Minus, ArrowRight,
  Star, Hexagon, Image, Undo, Redo, Grid, Layers, Shapes, ChevronDown,
  Settings, Copy, Trash2, Lock, Unlock, MinusCircle, PlusCircle,
  Download, Film, Save, FolderOpen, Sparkles
} from 'lucide-react';

/**
 * ToolsSidebar Component
 * Left sidebar with tool selection buttons, shape tools, and canvas controls
 * Hidden on mobile devices
 */
const ToolsSidebar = ({
  t,
  currentTool,
  setCurrentTool,
  addElement,
  fileInputRef,
  handleImageUpload,
  loadProjectInputRef,
  handleProjectFileLoad,
  undo,
  redo,
  historyIndex,
  history,
  showGrid,
  setShowGrid,
  snapToGrid,
  setSnapToGrid,
  // New props for properties panel
  showPropertiesPanel,
  setShowPropertiesPanel,
  selectedElementData,
  selectedElement,
  updateElement,
  duplicateElement,
  deleteElement,
  toggleElementLock,
  changeZIndex,
  lockedElements,
  exportAsImage,
  exportAsPDF,
  handleSaveClick,
  loadProject,
  recording,
  startRecording,
  stopRecording,
  recordingTimeElapsed,
  videoFormat,
  setVideoFormat,
  videoQuality,
  setVideoQuality,
  recordingDuration,
  setRecordingDuration,
}) => {
  return (
    <>
      <div className="tools-panel hidden md:flex">
        <h2 className="text-sm font-bold mb-4 text-center">{t('tools.title')}</h2>
        
        {/* Tool Selection */}
        <div className="space-y-2">
          <button
            onClick={() => setCurrentTool('select')}
            className={`p-2 rounded-lg flex items-center justify-center ${currentTool === 'select' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Select"
          >
            <MousePointer size={20} />
          </button>
          
          <button
            onClick={() => setCurrentTool('pan')}
            className={`p-2 rounded-lg flex items-center justify-center ${currentTool === 'pan' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Pan"
          >
            <Move size={20} />
          </button>
          
          <button
            onClick={() => addElement('text')}
            className="p-2 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            title="Text"
          >
            <Type size={20} />
          </button>
          
          <ShapesDropdown addElement={addElement} />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            title="Image"
          >
            <Image size={20} />
          </button>

          {/* Properties Button */}
          <button
            onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
            className={`p-2 rounded-lg flex items-center justify-center ${
              showPropertiesPanel ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
            }`}
            title="Properties"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Canvas Controls */}
        <div className="mt-6 space-y-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
            title="Undo"
          >
            <Undo size={20} />
          </button>
          
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
            title="Redo"
          >
            <Redo size={20} />
          </button>
          
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg flex items-center justify-center ${showGrid ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Toggle Grid"
          >
            <Grid size={20} />
          </button>
          
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-2 rounded-lg flex items-center justify-center ${snapToGrid ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Snap to Grid"
          >
            <Layers size={20} />
          </button>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        <input
          ref={loadProjectInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleProjectFileLoad}
          className="hidden"
        />
      </div>

      {/* Slide-out Properties Panel */}
      <PropertiesSlidePanel
        show={showPropertiesPanel}
        selectedElement={selectedElement}
        selectedElementData={selectedElementData}
        updateElement={updateElement}
        duplicateElement={duplicateElement}
        deleteElement={deleteElement}
        toggleElementLock={toggleElementLock}
        changeZIndex={changeZIndex}
        lockedElements={lockedElements}
        exportAsImage={exportAsImage}
        exportAsPDF={exportAsPDF}
        handleSaveClick={handleSaveClick}
        loadProject={loadProject}
        recording={recording}
        startRecording={startRecording}
        stopRecording={stopRecording}
        recordingTimeElapsed={recordingTimeElapsed}
        videoFormat={videoFormat}
        setVideoFormat={setVideoFormat}
        videoQuality={videoQuality}
        setVideoQuality={setVideoQuality}
        recordingDuration={recordingDuration}
        setRecordingDuration={setRecordingDuration}
      />
    </>
  );
};

// Shapes Dropdown Component
const ShapesDropdown = ({ addElement }) => {
  const [isOpen, setIsOpen] = useState(false);

  const shapes = [
    { type: 'rectangle', icon: Square, label: 'Rectangle' },
    { type: 'circle', icon: Circle, label: 'Circle' },
    { type: 'triangle', icon: Triangle, label: 'Triangle' },
    { type: 'star', icon: Star, label: 'Star' },
    { type: 'hexagon', icon: Hexagon, label: 'Hexagon' },
    { type: 'line', icon: Minus, label: 'Line' },
    { type: 'arrow', icon: ArrowRight, label: 'Arrow' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 w-full flex items-center justify-center"
        title="Shapes"
      >
        <Shapes size={20} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-full ml-2 top-0 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[160px]">
            {shapes.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => {
                  addElement(type);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-left"
              >
                <Icon size={18} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Properties Slide Panel Component
const PropertiesSlidePanel = ({
  show,
  selectedElement,
  selectedElementData,
  updateElement,
  duplicateElement,
  deleteElement,
  toggleElementLock,
  changeZIndex,
  lockedElements,
  exportAsImage,
  exportAsPDF,
  handleSaveClick,
  loadProject,
  recording,
  startRecording,
  stopRecording,
  recordingTimeElapsed,
  videoFormat,
  setVideoFormat,
  videoQuality,
  setVideoQuality,
  recordingDuration,
  setRecordingDuration,
}) => {
  if (!show) return null;

  return (
    <div className="properties-slide-panel open">
      <div className="p-4 h-full overflow-y-auto">
        {!selectedElementData ? (
          <div className="text-center py-8">
            <Settings size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Element Properties */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Element Properties</h3>
              
              {/* Position and Size */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium mb-1">X</label>
                  <input
                    type="number"
                    value={Math.round(selectedElementData.x)}
                    onChange={(e) => updateElement(selectedElement, { x: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedElementData.y)}
                    onChange={(e) => updateElement(selectedElement, { y: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Width</label>
                  <input
                    type="number"
                    value={Math.round(selectedElementData.width)}
                    onChange={(e) => updateElement(selectedElement, { width: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Height</label>
                  <input
                    type="number"
                    value={Math.round(selectedElementData.height)}
                    onChange={(e) => updateElement(selectedElement, { height: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                    min="1"
                  />
                </div>
              </div>

              {/* Rotation */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rotation</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedElementData.rotation || 0}
                    onChange={(e) => updateElement(selectedElement, { rotation: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium min-w-[50px]">{selectedElementData.rotation || 0}°</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => duplicateElement(selectedElement)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 flex items-center justify-center gap-1"
                  disabled={lockedElements.has(selectedElement)}
                >
                  <Copy size={14} />
                  Duplicate
                </button>
                <button
                  onClick={() => toggleElementLock(selectedElement)}
                  className={`p-2 rounded-lg text-sm flex items-center justify-center gap-1 ${
                    lockedElements.has(selectedElement) 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {lockedElements.has(selectedElement) ? <Unlock size={14} /> : <Lock size={14} />}
                  {lockedElements.has(selectedElement) ? 'Unlock' : 'Lock'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => changeZIndex(selectedElement, 'backward')}
                  className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 flex items-center justify-center gap-1"
                  disabled={lockedElements.has(selectedElement)}
                >
                  <MinusCircle size={14} />
                  Backward
                </button>
                <button
                  onClick={() => changeZIndex(selectedElement, 'forward')}
                  className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 flex items-center justify-center gap-1"
                  disabled={lockedElements.has(selectedElement)}
                >
                  <PlusCircle size={14} />
                  Forward
                </button>
              </div>

              <button
                onClick={() => deleteElement(selectedElement)}
                className="w-full p-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 flex items-center justify-center gap-1 mb-6"
                disabled={lockedElements.has(selectedElement)}
              >
                <Trash2 size={14} />
                Delete Element
              </button>
            </div>

            {/* Export Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Export</h3>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => exportAsImage('png')}
                  className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
                >
                  <Download size={14} className="mr-1" />
                  PNG
                </button>
                <button
                  onClick={() => exportAsImage('jpeg')}
                  className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
                >
                  <Download size={14} className="mr-1" />
                  JPEG
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => exportAsImage('webp')}
                  className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
                >
                  <Download size={14} className="mr-1" />
                  WebP
                </button>
                <button
                  onClick={() => exportAsImage('svg')}
                  className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
                >
                  <Download size={14} className="mr-1" />
                  SVG
                </button>
              </div>
              <button
                onClick={exportAsPDF}
                className="w-full p-2 bg-blue-100 rounded text-sm hover:bg-blue-200 flex items-center justify-center text-blue-700 font-medium mb-4"
              >
                <Download size={14} className="mr-1" />
                PDF
              </button>

              {/* Video Export */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Video Format</label>
                <select
                  value={videoFormat}
                  onChange={(e) => setVideoFormat(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="webm">WebM</option>
                  <option value="mp4">MP4</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Quality</label>
                <select
                  value={videoQuality}
                  onChange={(e) => setVideoQuality(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {!recording ? (
                <button
                  onClick={startRecording}
                  className="w-full p-2 rounded text-sm flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600"
                >
                  <Film size={14} className="mr-1" />
                  Start Recording
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="w-full p-2 bg-red-50 border border-red-200 rounded text-sm flex items-center justify-center text-red-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      Recording: {Math.floor(recordingTimeElapsed / 60)}:{(recordingTimeElapsed % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <button
                    onClick={stopRecording}
                    className="w-full p-2 rounded text-sm flex items-center justify-center bg-red-500 text-white hover:bg-red-600"
                  >
                    <Square size={14} className="mr-1" />
                    Stop Recording
                  </button>
                </div>
              )}
            </div>

            {/* Project Actions */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Project</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSaveClick}
                  className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
                >
                  <Save size={14} className="mr-1" />
                  Save
                </button>
                <button
                  onClick={loadProject}
                  className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
                >
                  <FolderOpen size={14} className="mr-1" />
                  Load
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsSidebar;
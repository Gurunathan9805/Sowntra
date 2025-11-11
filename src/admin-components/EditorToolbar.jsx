import React, { useRef } from 'react';
import { X, RotateCw, ZoomOut, ZoomIn, Save, Clock } from 'lucide-react';

const EditorToolbar = ({
  currentView,
  setCurrentView,
  editorState,
  setEditorState,
  autoSave,
  historyIndex,
  history,
  undo,
  redo,
  saveTemplate,
  canEditTemplateSettings,
  PropertyInput,
  startPropertyEditing
}) => {
  return (
    <div className="bg-gray-800 text-white p-3 flex items-center justify-between border-b border-gray-700">
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('dashboard')} className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
          Sowntra Ht
        </h1>
        <div className="relative">
          <PropertyInput
            value={editorState.name}
            onStartEdit={startPropertyEditing}
            propertyPath="template.name"
            type="text"
            className="bg-gray-700 px-4 py-2 rounded-lg min-w-[200px] text-base"
            disabled={!canEditTemplateSettings()}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">
            {autoSave.lastSaved ? 'Saved' : 'Unsaved'}
          </span>
        </div>
        
        <button onClick={undo} disabled={historyIndex <= 0} className="hover:bg-gray-700 p-2 rounded-lg disabled:opacity-50 transition-colors">
          <RotateCw className="w-5 h-5 transform rotate-180" />
        </button>
        <button onClick={redo} disabled={historyIndex >= history.length - 1} className="hover:bg-gray-700 p-2 rounded-lg disabled:opacity-50 transition-colors">
          <RotateCw className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-gray-600"></div>
        <button onClick={() => setEditorState(prev => ({ ...prev, zoom: Math.max(25, prev.zoom - 25) }))} className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="text-sm min-w-[60px] text-center">{editorState.zoom}%</span>
        <button onClick={() => setEditorState(prev => ({ ...prev, zoom: Math.min(200, prev.zoom + 25) }))} className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
          <ZoomIn className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-gray-600"></div>
        <button 
          onClick={saveTemplate}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <Save className="w-4 h-4" />
          Save Template
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;

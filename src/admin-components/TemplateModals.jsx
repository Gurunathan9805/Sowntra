import React, { useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { CATEGORIES, TEMPLATE_PRESETS } from './constants';

export const UploadModal = ({
  uploadModalOpen,
  setUploadModalOpen,
  uploadData,
  setUploadData,
  handleFileUpload,
  handleUpload,
  handleUploadInputChange,
  handleDragOver,
  handleDragLeave,
  handleDrop
}) => {
  const uploadFileInputRef = useRef(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upload Template</h2>
          <button 
            onClick={() => setUploadModalOpen(false)} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Template Name</label>
            <input 
              type="text" 
              value={uploadData.name}
              onChange={(e) => handleUploadInputChange('name', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="My Awesome Template" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Category</label>
            <select 
              value={uploadData.category}
              onChange={(e) => handleUploadInputChange('category', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Tags (comma separated)</label>
            <input 
              type="text" 
              value={uploadData.tags}
              onChange={(e) => handleUploadInputChange('tags', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="modern, creative, social" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Visibility</label>
            <select 
              value={uploadData.visibility}
              onChange={(e) => handleUploadInputChange('visibility', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="team-only">Team Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Upload Files</label>
            <div 
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                uploadData.isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => uploadFileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, JSON files supported</p>
              <input
                type="file"
                ref={uploadFileInputRef}
                className="hidden"
                accept=".png,.jpg,.jpeg,.json"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </div>
            {uploadData.files && (
              <div className="mt-2 text-sm text-green-600">
                ✓ {uploadData.files[0]?.name} uploaded successfully
              </div>
            )}
          </div>
          <button 
            onClick={handleUpload}
            disabled={!uploadData.name.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg mt-6"
          >
            Upload Template
          </button>
        </div>
      </div>
    </div>
  );
};

export const TemplatePresetModal = ({
  showPresetModal,
  setShowPresetModal,
  createFromPreset
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Choose a Template Preset</h2>
        <button 
          onClick={() => setShowPresetModal(false)} 
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATE_PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => createFromPreset(preset)}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all text-left group"
          >
            <div className="text-4xl mb-4">{preset.thumbnail}</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{preset.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
              {preset.width} × {preset.height}
            </div>
            <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
              Use this preset →
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h3>
        <p className="text-sm text-blue-700">
          You can always change the canvas size and background later in the editor. 
          Choose the preset that matches your intended use case.
        </p>
      </div>
    </div>
  </div>
);

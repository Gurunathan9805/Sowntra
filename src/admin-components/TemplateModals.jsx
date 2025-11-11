import React, { useRef } from 'react';
import { X, Upload, Crown } from 'lucide-react';
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

  if (!uploadModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-gray-100 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-500 text-white">
          <h2 className="text-xl font-semibold">Upload Template</h2>
          <button
            onClick={() => setUploadModalOpen(false)}
            className="hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Template Name
            </label>
            <input
              type="text"
              value={uploadData.name}
              onChange={(e) => handleUploadInputChange("name", e.target.value)}
              className="w-full p-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              placeholder="My Awesome Template"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Category
            </label>
            <select
              value={uploadData.category}
              onChange={(e) =>
                handleUploadInputChange("category", e.target.value)
              }
              className="w-full p-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={uploadData.tags}
              onChange={(e) => handleUploadInputChange("tags", e.target.value)}
              className="w-full p-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              placeholder="modern, creative, social"
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Visibility
            </label>
            <select
              value={uploadData.visibility}
              onChange={(e) =>
                handleUploadInputChange("visibility", e.target.value)
              }
              className="w-full p-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="team-only">Team Only</option>
            </select>
          </div>

          {/* Access Type Toggle */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Access Type
            </label>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-2">
                <Crown
                  className={`w-5 h-5 ${
                    uploadData.isPremium ? "text-yellow-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    uploadData.isPremium ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {uploadData.isPremium ? "Premium" : "Freemium"}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleUploadInputChange("isPremium", !uploadData.isPremium)
                }
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ease-in-out ${
                  uploadData.isPremium ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${
                    uploadData.isPremium ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Upload Files */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Upload Files
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                uploadData.isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => uploadFileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JSON files supported
              </p>
              <input
                type="file"
                ref={uploadFileInputRef}
                className="hidden"
                accept=".png,.jpg,.jpeg,.json"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </div>

            {uploadData.files && (
              <div className="mt-3 text-sm text-green-600 flex items-center space-x-1">
                <span>✓</span>
                <span>{uploadData.files[0]?.name} uploaded successfully</span>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!uploadData.name.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-lg mt-4 shadow-md transition-all"
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

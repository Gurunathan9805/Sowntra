import React from 'react';

const SaveProjectDialog = ({ showSaveDialog, setShowSaveDialog, projectName, setProjectName, confirmSave }) => {
  if (!showSaveDialog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Save Project</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter project name..."
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                confirmSave();
              }
            }}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSaveDialog(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmSave}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Save Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveProjectDialog;
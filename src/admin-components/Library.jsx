import React, { useState } from 'react';
import { Search, Filter, Grid, List, Trash2 } from 'lucide-react';
import { CATEGORIES } from './constants';

const Library = ({
  templates,
  setTemplates,
  currentUser,
  setCurrentView,
  onUseTemplate,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory
}) => {
  const [viewMode, setViewMode] = useState('grid');

  const deleteTemplate = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Sowntra Ht
          </h1>
          <p className="text-gray-600">{filteredTemplates.length} templates available</p>
        </div>
        <button 
          onClick={() => setCurrentView('dashboard')} 
          className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 group">
              <div className="relative group">
                <img src={template.thumbnail} alt={template.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-3">
                  <button
                    onClick={() => onUseTemplate(template)}
                    className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all transform scale-95 hover:scale-100 font-medium"
                  >
                    {currentUser.role === 'viewer' ? 'View Template' : 'Use Template'}
                  </button>
                  {(currentUser.role === 'admin' || template.creatorId === currentUser.id) && (
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-all transform scale-95 hover:scale-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2 text-gray-900">{template.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 font-medium">{template.category}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    template.visibility === 'public' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {template.visibility}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {template.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <img 
                    src={template.creatorAvatar} 
                    alt={template.creator}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600 font-medium">By {template.creator}</span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between pt-3 border-t border-gray-100">
                  <span>{template.date}</span>
                  <span>{template.views} views • {template.uses} uses</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center text-sm font-semibold text-gray-600">
              <div className="w-32">Preview</div>
              <div className="flex-1">Name & Category</div>
              <div className="w-32">Creator</div>
              <div className="w-32">Date</div>
              <div className="w-40 text-right">Actions</div>
            </div>
          </div>
          {filteredTemplates.map(template => (
            <div key={template.id} className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <img src={template.thumbnail} alt={template.name} className="w-28 h-20 object-cover rounded-lg mr-4" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">{template.category}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    template.visibility === 'public' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {template.visibility}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <img 
                    src={template.creatorAvatar} 
                    alt={template.creator}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-xs text-gray-600">By {template.creator}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {template.views} views • {template.uses} uses
                </div>
              </div>
              <div className="w-32 text-sm text-gray-600">{template.creator}</div>
              <div className="w-32 text-sm text-gray-600">{template.date}</div>
              <div className="w-40 flex justify-end gap-2">
                <button
                  onClick={() => onUseTemplate(template)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    currentUser.role === 'viewer' 
                      ? 'bg-gray-600 text-white hover:bg-gray-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } transition-colors`}
                >
                  {currentUser.role === 'viewer' ? 'View' : 'Use'}
                </button>
                {(currentUser.role === 'admin' || template.creatorId === currentUser.id) && (
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No templates found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Library;

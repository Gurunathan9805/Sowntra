import React, { useState } from 'react';
import { Search, Filter, Grid, List, Eye, Download, Star, Trash2, Edit } from 'lucide-react';

const Library = ({ 
  templates, 
  currentUser, 
  setCurrentView, 
  onUseTemplate, 
  onDownloadTemplate,
  onDeleteTemplate,
  onAddToFavorites,
  onRemoveFromFavorites,
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  setFilterCategory,
  categories 
}) => {
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || template.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = async (templateId) => {
    if (favorites.has(templateId)) {
      await onRemoveFromFavorites(templateId);
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        newFavorites.delete(templateId);
        return newFavorites;
      });
    } else {
      await onAddToFavorites(templateId);
      setFavorites(prev => new Set(prev).add(templateId));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Template Library</h1>
        <div className="flex items-center space-x-4">
          <div className="flex bg-white rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative group">
                <img
                  src={template.thumbnail}
                  alt={template.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onUseTemplate(template)}
                      className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="Use Template"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onDownloadTemplate(template.id)}
                      className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                    {currentUser?.role === 'admin' && (
                      <button
                        onClick={() => onDeleteTemplate(template.id)}
                        className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete Template"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(template.id)}
                  className={`absolute top-2 right-2 p-1 rounded-full ${
                    favorites.has(template.id) 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-white text-gray-400 hover:text-yellow-600'
                  } transition-colors`}
                >
                  <Star size={16} fill={favorites.has(template.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {categories.find(cat => cat.id === template.categoryId)?.name || 'Uncategorized'}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Views: {template.viewCount || 0}</span>
                  <span>Uses: {template.usageCount || 0}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List view implementation
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredTemplates.map(template => (
            <div key={template.id} className="border-b border-gray-200 last:border-b-0">
              <div className="p-4 flex items-center space-x-4">
                <img
                  src={template.thumbnail}
                  alt={template.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{template.title}</h3>
                  <p className="text-sm text-gray-600">
                    {categories.find(cat => cat.id === template.categoryId)?.name || 'Uncategorized'}
                  </p>
                  <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                    <span>Views: {template.viewCount || 0}</span>
                    <span>Downloads: {template.downloadCount || 0}</span>
                    <span>Uses: {template.usageCount || 0}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUseTemplate(template)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => toggleFavorite(template.id)}
                    className={`p-1 rounded ${
                      favorites.has(template.id) 
                        ? 'text-yellow-600' 
                        : 'text-gray-400 hover:text-yellow-600'
                    }`}
                  >
                    <Star size={16} fill={favorites.has(template.id) ? 'currentColor' : 'none'} />
                  </button>
                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={() => onDeleteTemplate(template.id)}
                      className="p-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Library;
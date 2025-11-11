import React from 'react';
import { Edit, Plus, Upload, Folder, Shield, Users, Zap, Layers, Eye } from 'lucide-react';
import UserManagement from './UserManagement';
import { AddUserModal, ProfileEditModal } from './UserModals';

const Dashboard = ({
  currentView,
  setCurrentView,
  currentUser,
  setCurrentUser,
  users,
  setUsers,
  templates,
  setTemplates,
  analytics,
  setAnalytics,
  adminState,
  setAdminState,
  newUser,
  setNewUser,
  profileEdit,
  setProfileEdit,
  uploadModalOpen,
  setUploadModalOpen,
  showPresetModal,
  setShowPresetModal,
  createNewTemplate,
  startProfileEdit,
  handleAvatarUpload,
  addNewUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  saveProfileEdit
}) => {
  const canManageUsers = () => {
    return currentUser.role === 'admin';
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Sowntra Ht
            </h1>
            <p className="text-gray-600">Welcome back, {currentUser.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-lg">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{currentUser.name}</p>
                <p className="text-sm text-gray-600 capitalize">{currentUser.role}</p>
              </div>
              <button
                onClick={() => startProfileEdit(currentUser)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Edit Profile"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      {canManageUsers() && (
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Admin Controls</h3>
                  <p className="text-sm text-gray-600">Manage users and system settings</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setAdminState(prev => ({ ...prev, showUserManagement: !prev.showUserManagement }))}
                  className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                    adminState.showUserManagement 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {adminState.showUserManagement ? 'Hide User Management' : 'Manage Users'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Section */}
      {adminState.showUserManagement && canManageUsers() && (
        <UserManagement
          users={users}
          currentUser={currentUser}
          adminState={adminState}
          setAdminState={setAdminState}
          updateUserRole={updateUserRole}
          toggleUserStatus={toggleUserStatus}
          deleteUser={deleteUser}
          startProfileEdit={startProfileEdit}
        />
      )}

      {/* Analytics Cards */}
      {!adminState.showUserManagement && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Users</p>
                  <h3 className="text-2xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</h3>
                  <p className="text-xs text-green-600 font-medium mt-1">Just you</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Users</p>
                  <h3 className="text-2xl font-bold text-gray-900">{analytics.activeUsers.toLocaleString()}</h3>
                  <p className="text-xs text-green-600 font-medium mt-1">Currently online</p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Templates</p>
                  <h3 className="text-2xl font-bold text-gray-900">{analytics.totalTemplates.toLocaleString()}</h3>
                  <p className="text-xs text-green-600 font-medium mt-1">+{templates.length} user created</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl">
                  <Layers className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Template Views</p>
                  <h3 className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</h3>
                  <p className="text-xs text-green-600 font-medium mt-1">+{analytics.viewGrowth}% from last month</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl">
                  <Eye className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Total Template Uses</span>
                    <span className="font-semibold text-gray-900">{analytics.templateUses.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (analytics.templateUses / 5000) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Average Uses per Template</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round(analytics.templateUses / analytics.totalTemplates)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, ((analytics.templateUses / analytics.totalTemplates) / 50) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Templates</h3>
              <div className="space-y-3">
                {templates.slice(0, 3).map((template, index) => (
                  <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{template.name}</p>
                        <p className="text-xs text-gray-600">
                          By {template.creator} • {template.views} views • {template.uses} uses
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{template.category}</p>
                      <p className="text-xs text-gray-600">{template.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={createNewTemplate}
              disabled={currentUser.role === 'viewer'}
              className={`p-8 rounded-2xl transition-all shadow-xl transform hover:-translate-y-1 group ${
                currentUser.role === 'viewer'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
              }`}
            >
              <Plus className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-semibold mb-2">
                {currentUser.role === 'viewer' ? 'View Templates' : 'Create New Template'}
              </h3>
              <p className={currentUser.role === 'viewer' ? 'text-gray-200' : 'text-blue-100'}>
                {currentUser.role === 'viewer' 
                  ? 'View existing templates only' 
                  : 'Design from scratch with powerful tools'
                }
              </p>
            </button>

            <button
              onClick={() => setUploadModalOpen(true)}
              disabled={currentUser.role === 'viewer'}
              className={`p-8 rounded-2xl transition-all shadow-xl transform hover:-translate-y-1 group ${
                currentUser.role === 'viewer'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
              }`}
            >
              <Upload className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-semibold mb-2">
                {currentUser.role === 'viewer' ? 'Browse Templates' : 'Upload Template'}
              </h3>
              <p className={currentUser.role === 'viewer' ? 'text-gray-200' : 'text-purple-100'}>
                {currentUser.role === 'viewer' 
                  ? 'Explore template library' 
                  : 'Import pre-made designs'
                }
              </p>
            </button>

            <button
              onClick={() => setCurrentView('library')}
              className="p-8 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
            >
              <Folder className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-semibold mb-2">Template Library</h3>
              <p className="text-pink-100">Browse {templates.length} templates</p>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Recent Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.slice(0, 3).map(template => (
                <div key={template.id} className="border rounded-xl overflow-hidden hover:shadow-xl transition-shadow group">
                  <img src={template.thumbnail} alt={template.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <img 
                        src={template.creatorAvatar} 
                        alt={template.creator}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">{template.creator}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {template.views} views
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Add User Modal */}
      {adminState.showAddUserModal && (
        <AddUserModal
          newUser={newUser}
          setNewUser={setNewUser}
          adminState={adminState}
          setAdminState={setAdminState}
          addNewUser={addNewUser}
        />
      )}
      
      {/* Profile Edit Modal */}
      {adminState.showProfileEditModal && (
        <ProfileEditModal
          profileEdit={profileEdit}
          setProfileEdit={setProfileEdit}
          adminState={adminState}
          setAdminState={setAdminState}
          saveProfileEdit={saveProfileEdit}
          handleAvatarUpload={handleAvatarUpload}
        />
      )}
    </div>
  );
};

export default Dashboard;

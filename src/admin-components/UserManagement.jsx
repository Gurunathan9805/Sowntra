import React, { useRef } from 'react';
import { Search, UserPlus, Trash2, Camera, Crown } from 'lucide-react';
import { USER_ROLES } from './constants';

const UserManagement = ({ 
  users, 
  currentUser, 
  adminState, 
  setAdminState, 
  updateUserRole, 
  toggleUserStatus, 
  deleteUser, 
  startProfileEdit 
}) => {
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(adminState.userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(adminState.userSearchTerm.toLowerCase());
    const matchesRole = adminState.userFilterRole === 'all' || user.role === adminState.userFilterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            User Management
          </h2>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        <button
          onClick={() => setAdminState(prev => ({ ...prev, showAddUserModal: true }))}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* User Search and Filter */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={adminState.userSearchTerm}
                onChange={(e) => setAdminState(prev => ({ ...prev, userSearchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={adminState.userFilterRole}
            onChange={(e) => setAdminState(prev => ({ ...prev, userFilterRole: e.target.value }))}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            {USER_ROLES.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map(user => (
          <div key={user.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <button
                    onClick={() => startProfileEdit(user)}
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    {user.role === 'admin' && <Crown className="w-4 h-4 text-yellow-500" />}
                    <span className={`text-xs px-2 py-1 rounded-full ${USER_ROLES.find(r => r.value === user.role)?.color || 'bg-gray-100 text-gray-800'}`}>
                      {USER_ROLES.find(r => r.value === user.role)?.label || user.role}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">Joined {user.joinDate} • {user.templatesCreated} templates</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Role Selector */}
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={user.id === currentUser.id}
                >
                  {USER_ROLES.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>

                {/* Status Toggle */}
                <button
                  onClick={() => toggleUserStatus(user.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  } transition-colors`}
                  disabled={user.id === currentUser.id}
                >
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteUser(user.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={user.id === currentUser.id}
                  title={user.id === currentUser.id ? "Cannot delete your own account" : "Delete user"}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Permissions */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Permissions:</p>
              <div className="flex flex-wrap gap-2">
                {user.permissions.map(permission => (
                  <span key={permission} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new user</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

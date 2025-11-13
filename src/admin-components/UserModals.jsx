import React, { useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { USER_ROLES } from './constants';

export const AddUserModal = ({ 
  newUser, 
  setNewUser, 
  adminState, 
  setAdminState, 
  addNewUser 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add Team Member</h2>
        <button 
          onClick={() => setAdminState(prev => ({ ...prev, showAddUserModal: false }))} 
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name *</label>
          <input 
            type="text" 
            value={newUser.name}
            onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="John Designer" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address *</label>
          <input 
            type="email" 
            value={newUser.email}
            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="john@example.com" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Role</label>
          <select 
            value={newUser.role}
            onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            {USER_ROLES.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {USER_ROLES.find(r => r.value === newUser.role)?.description}
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-blue-900 mb-2">Permissions Preview</h4>
          <div className="flex flex-wrap gap-2">
            {(USER_ROLES.find(r => r.value === newUser.role)?.value === 'admin' 
              ? ['all'] 
              : USER_ROLES.find(r => r.value === newUser.role)?.value === 'designer' 
                ? ['create', 'edit', 'view']
                : USER_ROLES.find(r => r.value === newUser.role)?.value === 'marketer'
                  ? ['view', 'use']
                  : ['view']
            ).map(permission => (
              <span key={permission} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-8">
        <button
          onClick={() => setAdminState(prev => ({ ...prev, showAddUserModal: false }))}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={addNewUser}
          disabled={!newUser.name.trim() || !newUser.email.trim()}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          Add User
        </button>
      </div>
    </div>
  </div>
);

export const ProfileEditModal = ({ 
  profileEdit, 
  setProfileEdit, 
  adminState, 
  setAdminState, 
  saveProfileEdit, 
  handleAvatarUpload 
}) => {
  const avatarInputRef = useRef(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button 
            onClick={() => setAdminState(prev => ({ ...prev, showProfileEditModal: false, editingProfile: null }))} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative group mb-4">
              <img 
                src={profileEdit.avatar} 
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            <input
              type="file"
              ref={avatarInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
            <p className="text-sm text-gray-600">Click avatar to change photo</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name *</label>
            <input 
              type="text" 
              value={profileEdit.name}
              onChange={(e) => setProfileEdit(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="John Designer" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address *</label>
            <input 
              type="email" 
              value={profileEdit.email}
              onChange={(e) => setProfileEdit(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="john@example.com" 
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => setAdminState(prev => ({ ...prev, showProfileEditModal: false, editingProfile: null }))}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveProfileEdit}
            disabled={!profileEdit.name.trim() || !profileEdit.email.trim()}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Plus, Search, Filter, Edit, Trash2, Eye, Folder, Tag, Image, Type, Square, Layers, Save, X, ChevronDown, Grid, List, Circle, Star, Triangle, Hexagon, Minus, Move, Lock, Unlock, Copy, AlignLeft, AlignCenter, AlignRight, RotateCw, ZoomIn, ZoomOut, Group, Ungroup, Bold, Italic, Underline, Download, Share, Settings, Menu, MousePointer, Hand, Grid as GridIcon, Ruler, DownloadCloud, Users, History, Clock, Zap, UserPlus, Mail, Phone, Crown, Shield, UserCheck, UserX, Camera } from 'lucide-react';
import UploadModal from './UploadModal';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SowntraTemplateSystem = () => {
  
const [currentView, setCurrentView] = useState('dashboard');
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Social Media Post',
      category: 'Social Media',
      tags: ['instagram', 'post', 'modern'],
      thumbnail: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=Social+Post',
      visibility: 'public',
      creator: 'John Designer',
      creatorId: 1,
      creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      date: '2025-10-01',
      json: { layers: [], assets: [] },
      views: 150,
      uses: 45
    },
    {
      id: 2,
      name: 'Business Presentation',
      category: 'Business',
      tags: ['professional', 'slide', 'corporate'],
      thumbnail: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Business',
      visibility: 'public',
      creator: 'Sarah Designer',
      creatorId: 2,
      creatorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      date: '2025-09-28',
      json: { layers: [], assets: [] },
      views: 89,
      uses: 23
    },
    {
      id: 3,
      name: 'Marketing Banner',
      category: 'Marketing',
      tags: ['banner', 'promotion', 'sale'],
      thumbnail: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Marketing',
      visibility: 'team-only',
      creator: 'Mike Marketer',
      creatorId: 3,
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      date: '2025-09-25',
      json: { layers: [], assets: [] },
      views: 234,
      uses: 67
    }
  ]);
 const navigate = useNavigate();
 const [currentUser, setCurrentUser] = useState(users[0]);
 const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Designer',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'admin',
      joinDate: '2024-01-15',
      templatesCreated: 23,
      lastActive: new Date().toISOString(),
      status: 'active',
      permissions: ['all']
    }
  ]);

const [editorState, setEditorState] = useState({
    name: 'Untitled Template',
    category: 'Social Media',
    tags: '',
    visibility: 'public',
    background: { type: 'solid', color: '#ffffff' },
    layers: [],
    selectedLayerIds: [],
    zoom: 100,
    canvasWidth: 1080,
    canvasHeight: 1080,
    showGrid: true,
    showRulers: true,
    activeTool: 'select',
    snapToGrid: true
  });

const [dragState, setDragState] = useState({
    isDragging: false,
    isResizing: false,
    isRotating: false,
    resizeHandle: null,
    startX: 0,
    startY: 0,
    startLayerX: 0,
    startLayerY: 0,
    startWidth: 0,
    startHeight: 0,
    startRotation: 0,
    startAngle: 0
  });

const [alignmentLines, setAlignmentLines] = useState({ vertical: [], horizontal: [] });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [editingTextId, setEditingTextId] = useState(null);
  const [textEditValue, setTextEditValue] = useState('');
  const [editingProperty, setEditingProperty] = useState(null);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState({ x: 0, y: 0 });
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [autoSave, setAutoSave] = useState({
    enabled: true,
    interval: 30000,
    lastSaved: null
  });

const [uploadData, setUploadData] = useState({
  title: "",
  category: "All",
  style: "All Styles",
  theme: "All Themes",
  format: "All Formats",
  image: null,
  featured: false,
  isDragging: false,
});

  // Admin Management State
  const [adminState, setAdminState] = useState({
    showUserManagement: false,
    showAddUserModal: false,
    editingUser: null,
    userSearchTerm: '',
    userFilterRole: 'all',
    showProfileEditModal: false,
    editingProfile: null
  });

const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'designer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  });

  // Profile Edit State
  const [profileEdit, setProfileEdit] = useState({
    name: '',
    email: '',
    avatar: ''
  });

const canvasRef = useRef(null);
const fileInputRef = useRef(null);
const textInputRef = useRef(null);
const shapesMenuRef = useRef(null);
const propertyInputRef = useRef(null);
const templateNameRef = useRef(null);
const uploadFileInputRef = useRef(null);
const avatarInputRef = useRef(null);

const AdvancedOrganizer = ({ layer }) => {
    if (!editorState.selectedLayerIds.includes(layer.id) || layer.locked) return null;

    const rotation = layer.rotation || 0;
    const rotationHandleDistance = 40;

    return (
      <>
        {/* Bounding Box */}
        <div
          className="absolute inset-0 border-2 border-blue-500 pointer-events-none"
          style={{
            borderRadius: '4px',
            transform: `rotate(${rotation}deg)`
          }}
        />

        {/* 8 Resize Handles */}
        {/* Corners */}
        {['nw', 'ne', 'sw', 'se'].map(handle => (
          <div
            key={handle}
            className={`absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-${handle}-resize z-50`}
            style={{
              left: handle.includes('w') ? -6 : 'auto',
              right: handle.includes('e') ? -6 : 'auto',
              top: handle.includes('n') ? -6 : 'auto',
              bottom: handle.includes('s') ? -6 : 'auto',
              transform: `rotate(${rotation}deg)`
            }}
            onMouseDown={(e) => handleResizeMouseDown(e, layer, handle)}
          />
        ))}

        {/* Sides */}
        {['n', 's', 'w', 'e'].map(handle => (
          <div
            key={handle}
            className={`absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-${handle}-resize z-50`}
            style={{
              left: handle === 'w' ? -6 : handle === 'e' ? 'auto' : '50%',
              right: handle === 'e' ? -6 : 'auto',
              top: handle === 'n' ? -6 : handle === 's' ? 'auto' : '50%',
              bottom: handle === 's' ? -6 : 'auto',
              marginLeft: handle === 'w' || handle === 'e' ? 0 : -6,
              marginTop: handle === 'n' || handle === 's' ? 0 : -6,
              transform: `rotate(${rotation}deg)`
            }}
            onMouseDown={(e) => handleResizeMouseDown(e, layer, handle)}
          />
        ))}

        {/* Rotation Handle */}
        <div
          className="absolute w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-grab z-50 flex items-center justify-center"
          style={{
            left: '50%',
            top: -rotationHandleDistance,
            marginLeft: -12,
            transform: `rotate(${rotation}deg)`
          }}
          onMouseDown={(e) => handleRotateMouseDown(e, layer)}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </div>
      </>
    );
  };
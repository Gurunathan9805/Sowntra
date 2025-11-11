import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Plus, Search, Filter, Edit, Trash2, Eye, Folder, Tag, Image, Type, Square, Layers, Save, X, ChevronDown, Grid, List, Circle, Star, Triangle, Hexagon, Minus, Move, Lock, Unlock, Copy, AlignLeft, AlignCenter, AlignRight, RotateCw, ZoomIn, ZoomOut, Group, Ungroup, Bold, Italic, Underline, Download, Share, Settings, Menu, MousePointer, Hand, Grid as GridIcon, Ruler, DownloadCloud, Users, History, Clock, Zap, UserPlus, Mail, Phone, Crown, Shield, UserCheck, UserX, Camera } from 'lucide-react';

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

  // Users data with admin management
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

  const [currentUser, setCurrentUser] = useState(users[0]);

  // Dashboard Analytics
  const [analytics, setAnalytics] = useState({
    totalUsers: 1,
    activeUsers: 1,
    totalTemplates: 156,
    totalViews: 8456,
    templateUses: 2341,
    userGrowth: 0,
    viewGrowth: 8.3,
    usageGrowth: 15.2
  });

  // Template Presets
  const templatePresets = [
    {
      id: 1,
      name: "Social Media Post",
      width: 1080,
      height: 1080,
      background: { type: 'gradient', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      description: "Perfect for Instagram, Facebook",
      thumbnail: "🖼️"
    },
    {
      id: 2,
      name: "YouTube Thumbnail",
      width: 1280,
      height: 720,
      background: { type: 'solid', color: '#000000' },
      description: "16:9 aspect ratio for videos",
      thumbnail: "🎬"
    },
    {
      id: 3,
      name: "Story Post",
      width: 1080,
      height: 1920,
      background: { type: 'gradient', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
      description: "Vertical format for stories",
      thumbnail: "📱"
    },
    {
      id: 4,
      name: "Blog Header",
      width: 1200,
      height: 630,
      background: { type: 'solid', color: '#ffffff' },
      description: "Open Graph image size",
      thumbnail: "📝"
    },
    {
      id: 5,
      name: "Presentation Slide",
      width: 1920,
      height: 1080,
      background: { type: 'solid', color: '#f8fafc' },
      description: "Widescreen presentation",
      thumbnail: "📊"
    },
    {
      id: 6,
      name: "Business Card",
      width: 750,
      height: 450,
      background: { type: 'solid', color: '#ffffff' },
      description: "Standard business card size",
      thumbnail: "💼"
    }
  ];

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

  // FIXED: Proper state management for upload data
  const [uploadData, setUploadData] = useState({
    name: '',
    category: 'Social Media',
    tags: '',
    visibility: 'public',
    files: null,
    isDragging: false,
    thumbnail: null
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

  // New User Form State
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

  const categories = ['Social Media', 'Poster', 'Business', 'Marketing', 'Educational', 'Personal'];
  
  const shapes = [
    { type: 'rectangle', icon: Square, name: 'Rectangle' },
    { type: 'circle', icon: Circle, name: 'Circle' },
    { type: 'triangle', icon: Triangle, name: 'Triangle' },
    { type: 'star', icon: Star, name: 'Star' },
    { type: 'hexagon', icon: Hexagon, name: 'Hexagon' },
    { type: 'line', icon: Minus, name: 'Line' }
  ];

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  ];

  const fontFamilies = [
    'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 
    'Verdana', 'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS',
    'Arial Black', 'Palatino', 'Garamond', 'Bookman', 'Avant Garde',
    'Brush Script MT', 'Lucida Console', 'Copperplate', 'Papyrus', 'Franklin Gothic'
  ];

  const animations = [
    'none', 'fadeIn', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown', 
    'bounce', 'pulse', 'shake', 'rotate', 'flip', 'zoom'
  ];

  const effects = [
    'none', 'blur', 'brightness', 'contrast', 'grayscale', 'sepia', 
    'invert', 'saturate', 'hue-rotate', 'drop-shadow', 'opacity'
  ];

  // User roles for admin management
  const userRoles = [
    { value: 'admin', label: 'Administrator', description: 'Full system access', color: 'bg-purple-100 text-purple-800' },
    { value: 'designer', label: 'Designer', description: 'Create and edit templates', color: 'bg-blue-100 text-blue-800' },
    { value: 'marketer', label: 'Marketer', description: 'Use and customize templates', color: 'bg-green-100 text-green-800' },
    { value: 'viewer', label: 'Viewer', description: 'View templates only', color: 'bg-gray-100 text-gray-800' }
  ];

  // Animation styles - FIXED for groups and all layer types
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideInLeft {
      from { transform: translateX(-100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideInRight {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideInUp {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideInDown {
      from { transform: translateY(-100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
      40%, 43% { transform: translate3d(0,-30px,0); }
      70% { transform: translate3d(0,-15px,0); }
      90% { transform: translate3d(0,-4px,0); }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes flip {
      0% { transform: perspective(400px) rotateY(0); }
      100% { transform: perspective(400px) rotateY(180deg); }
    }
    @keyframes zoom {
      0% { transform: scale(0); }
      100% { transform: scale(1); }
    }
    
    .animate-fadeIn { animation: fadeIn 1s ease-in-out !important; }
    .animate-slideInLeft { animation: slideInLeft 1s ease-out !important; }
    .animate-slideInRight { animation: slideInRight 1s ease-out !important; }
    .animate-slideInUp { animation: slideInUp 1s ease-out !important; }
    .animate-slideInDown { animation: slideInDown 1s ease-out !important; }
    .animate-bounce { animation: bounce 2s infinite !important; }
    .animate-pulse { animation: pulse 2s infinite !important; }
    .animate-shake { animation: shake 0.5s !important; }
    .animate-rotate { animation: rotate 2s linear infinite !important; }
    .animate-flip { animation: flip 1s !important; }
    .animate-zoom { animation: zoom 0.5s !important; }
    
    /* Ensure animations work on all layer types */
    .canvas-layer {
      animation-fill-mode: both !important;
      animation-iteration-count: 1 !important;
    }
    .canvas-layer.animate-bounce,
    .canvas-layer.animate-pulse,
    .canvas-layer.animate-rotate {
      animation-iteration-count: infinite !important;
    }
  `;

  // Helper Functions
  const generateId = () => `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addToHistory = (newState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newState)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setEditorState(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setEditorState(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  // Enhanced Layer Ordering Functions
  const bringToFront = (id) => {
    const newLayers = [...editorState.layers];
    const layerIndex = newLayers.findIndex(l => l.id === id);
    
    if (layerIndex !== -1) {
      const maxZ = Math.max(...newLayers.map(l => l.zIndex), 0);
      newLayers[layerIndex] = { ...newLayers[layerIndex], zIndex: maxZ + 1 };
      
      const newState = { ...editorState, layers: newLayers };
      setEditorState(newState);
      addToHistory(newState);
    }
  };

  const sendToBack = (id) => {
    const newLayers = [...editorState.layers];
    const layerIndex = newLayers.findIndex(l => l.id === id);
    
    if (layerIndex !== -1) {
      const minZ = Math.min(...newLayers.map(l => l.zIndex), 0);
      newLayers[layerIndex] = { ...newLayers[layerIndex], zIndex: minZ - 1 };
      
      const newState = { ...editorState, layers: newLayers };
      setEditorState(newState);
      addToHistory(newState);
    }
  };

  const bringForward = (id) => {
    const newLayers = [...editorState.layers];
    const layerIndex = newLayers.findIndex(l => l.id === id);
    
    if (layerIndex !== -1) {
      const currentZ = newLayers[layerIndex].zIndex;
      const nextLayers = newLayers.filter(l => l.zIndex > currentZ);
      
      if (nextLayers.length > 0) {
        const nextMinZ = Math.min(...nextLayers.map(l => l.zIndex));
        newLayers[layerIndex] = { ...newLayers[layerIndex], zIndex: nextMinZ + 0.5 };
        
        const newState = { ...editorState, layers: newLayers };
        setEditorState(newState);
        addToHistory(newState);
      }
    }
  };

  const sendBackward = (id) => {
    const newLayers = [...editorState.layers];
    const layerIndex = newLayers.findIndex(l => l.id === id);
    
    if (layerIndex !== -1) {
      const currentZ = newLayers[layerIndex].zIndex;
      const prevLayers = newLayers.filter(l => l.zIndex < currentZ);
      
      if (prevLayers.length > 0) {
        const prevMaxZ = Math.max(...prevLayers.map(l => l.zIndex));
        newLayers[layerIndex] = { ...newLayers[layerIndex], zIndex: prevMaxZ - 0.5 };
        
        const newState = { ...editorState, layers: newLayers };
        setEditorState(newState);
        addToHistory(newState);
      }
    }
  };

  // Property editing functions
  const startPropertyEditing = (propertyPath, initialValue, type = 'number') => {
    setEditingProperty({ path: propertyPath, value: initialValue, type });
    setTimeout(() => {
      propertyInputRef.current?.focus();
      propertyInputRef.current?.select();
    }, 10);
  };

  const finishPropertyEditing = () => {
    if (editingProperty) {
      const { path, value, type } = editingProperty;
      
      // Handle different property paths
      if (path.startsWith('layer.')) {
        const layerId = path.split('.')[1];
        const propertyName = path.split('.')[2];
        const processedValue = type === 'number' ? (parseFloat(value) || 0) : value;
        updateLayer(layerId, { [propertyName]: processedValue });
      } else if (path.startsWith('template.')) {
        const propertyName = path.split('.')[1];
        setEditorState(prev => ({ ...prev, [propertyName]: value }));
      } else if (path.startsWith('canvas.')) {
        const propertyName = path.split('.')[1];
        setEditorState(prev => ({ ...prev, [propertyName]: parseInt(value) || 0 }));
      } else if (path.startsWith('text.')) {
        const layerId = path.split('.')[1];
        const propertyName = path.split('.')[2];
        updateLayer(layerId, { [propertyName]: value });
      }
      
      setEditingProperty(null);
    }
  };

  const handlePropertyKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishPropertyEditing();
    } else if (e.key === 'Escape') {
      setEditingProperty(null);
    }
  };

  // Create New Template
  const createNewTemplate = () => {
    if (currentUser.role === 'viewer') {
      alert('Viewers cannot create templates. Please contact an administrator.');
      return;
    }
    setShowPresetModal(true);
  };

  const createFromPreset = (preset) => {
    const newState = {
      name: preset.name,
      category: 'Social Media',
      tags: '',
      visibility: 'public',
      background: preset.background,
      layers: [],
      selectedLayerIds: [],
      zoom: 100,
      canvasWidth: preset.width,
      canvasHeight: preset.height,
      showGrid: true,
      showRulers: true,
      activeTool: 'select',
      snapToGrid: true
    };
    setEditorState(newState);
    setHistory([JSON.parse(JSON.stringify(newState))]);
    setHistoryIndex(0);
    setCurrentView('editor');
    setShowPresetModal(false);
  };

  // Add Layer Functions
  const addTextLayer = () => {
    const newLayer = {
      id: generateId(),
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      content: 'Double click to edit text',
      fontSize: 24,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#000000',
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      animation: 'none',
      effect: 'none',
      effectValue: 0,
      zIndex: editorState.layers.length,
      borderRadius: 0,
      textWrap: true,
      maxWidth: 200
    };
    const newState = { 
      ...editorState, 
      layers: [...editorState.layers, newLayer], 
      selectedLayerIds: [newLayer.id] 
    };
    setEditorState(newState);
    addToHistory(newState);
  };

  const addShapeLayer = (shapeType) => {
    const newLayer = {
      id: generateId(),
      type: 'shape',
      shapeType,
      x: 100,
      y: 100,
      width: shapeType === 'line' ? 200 : 150,
      height: shapeType === 'line' ? 5 : 150,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      animation: 'none',
      effect: 'none',
      effectValue: 0,
      borderRadius: shapeType === 'circle' ? 75 : 8,
      zIndex: editorState.layers.length
    };
    const newState = { 
      ...editorState, 
      layers: [...editorState.layers, newLayer], 
      selectedLayerIds: [newLayer.id] 
    };
    setEditorState(newState);
    addToHistory(newState);
    setShowShapesMenu(false);
  };

  const addImageLayer = (imageSrc) => {
    const newLayer = {
      id: generateId(),
      type: 'image',
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      src: imageSrc,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      animation: 'none',
      effect: 'none',
      effectValue: 0,
      borderRadius: 0,
      zIndex: editorState.layers.length
    };
    const newState = { 
      ...editorState, 
      layers: [...editorState.layers, newLayer], 
      selectedLayerIds: [newLayer.id] 
    };
    setEditorState(newState);
    addToHistory(newState);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addImageLayer(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Layer Manipulation
  const updateLayer = (id, updates) => {
    const newLayers = editorState.layers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    );
    const newState = { ...editorState, layers: newLayers };
    setEditorState(newState);
  };

  const deleteSelectedLayers = () => {
    const newState = {
      ...editorState,
      layers: editorState.layers.filter(layer => !editorState.selectedLayerIds.includes(layer.id)),
      selectedLayerIds: []
    };
    setEditorState(newState);
    addToHistory(newState);
    setShowFloatingToolbar(false);
  };

  const duplicateSelectedLayers = () => {
    const newLayers = editorState.selectedLayerIds.map(id => {
      const layer = editorState.layers.find(l => l.id === id);
      return { ...layer, id: generateId(), x: layer.x + 20, y: layer.y + 20 };
    });
    const newState = {
      ...editorState,
      layers: [...editorState.layers, ...newLayers],
      selectedLayerIds: newLayers.map(l => l.id)
    };
    setEditorState(newState);
    addToHistory(newState);
  };

  const toggleLock = (id) => {
    const layer = editorState.layers.find(l => l.id === id);
    updateLayer(id, { locked: !layer.locked });
  };

  const toggleVisibility = (id) => {
    const layer = editorState.layers.find(l => l.id === id);
    updateLayer(id, { visible: !layer.visible });
  };

  // Group/Ungroup
  const groupLayers = () => {
    if (editorState.selectedLayerIds.length < 2) return;
    
    const selectedLayers = editorState.layers.filter(l => editorState.selectedLayerIds.includes(l.id));
    const bounds = getGroupBounds(selectedLayers);
    
    // Create group layer
    const groupLayer = {
      id: generateId(),
      type: 'group',
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      children: editorState.selectedLayerIds,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: Math.max(...selectedLayers.map(l => l.zIndex)),
      isGroup: true,
      animation: 'none', // Add animation property to groups
      effect: 'none'
    };

    // Update children positions to be relative to group
    const updatedLayers = editorState.layers.map(layer => {
      if (editorState.selectedLayerIds.includes(layer.id)) {
        return {
          ...layer,
          groupId: groupLayer.id,
          relativeX: layer.x - bounds.x,
          relativeY: layer.y - bounds.y
        };
      }
      return layer;
    });

    const newState = {
      ...editorState,
      layers: [...updatedLayers, groupLayer],
      selectedLayerIds: [groupLayer.id]
    };
    setEditorState(newState);
    addToHistory(newState);
    setShowFloatingToolbar(false);
  };

  const ungroupLayers = () => {
    const groups = editorState.layers.filter(l => 
      l.type === 'group' && editorState.selectedLayerIds.includes(l.id)
    );
    
    if (groups.length === 0) return;

    const childIds = groups.flatMap(g => g.children);
    
    // Remove group references from children
    const updatedLayers = editorState.layers.map(layer => {
      if (childIds.includes(layer.id)) {
        const { groupId, relativeX, relativeY, ...rest } = layer;
        return rest;
      }
      return layer;
    });

    // Remove group layers
    const newState = {
      ...editorState,
      layers: updatedLayers.filter(l => !groups.some(g => g.id === l.id)),
      selectedLayerIds: childIds
    };
    setEditorState(newState);
    addToHistory(newState);
    setShowFloatingToolbar(false);
  };

  const getGroupBounds = (layers) => {
    const xs = layers.map(l => l.x);
    const ys = layers.map(l => l.y);
    const x2s = layers.map(l => l.x + l.width);
    const y2s = layers.map(l => l.y + l.height);
    
    return {
      x: Math.min(...xs),
      y: Math.min(...ys),
      width: Math.max(...x2s) - Math.min(...xs),
      height: Math.max(...y2s) - Math.min(...ys)
    };
  };

  // Get all child layers for a group
  const getChildLayers = (groupId) => {
    return editorState.layers.filter(layer => layer.groupId === groupId);
  };

  // Alignment
  const alignLayers = (alignment) => {
    if (editorState.selectedLayerIds.length < 2) return;

    const selectedLayers = editorState.layers.filter(l => editorState.selectedLayerIds.includes(l.id));
    const bounds = getGroupBounds(selectedLayers);

    const updates = {};
    selectedLayers.forEach(layer => {
      switch (alignment) {
        case 'left':
          updates[layer.id] = { x: bounds.x };
          break;
        case 'center':
          updates[layer.id] = { x: bounds.x + (bounds.width - layer.width) / 2 };
          break;
        case 'right':
          updates[layer.id] = { x: bounds.x + bounds.width - layer.width };
          break;
        case 'top':
          updates[layer.id] = { y: bounds.y };
          break;
        case 'middle':
          updates[layer.id] = { y: bounds.y + (bounds.height - layer.height) / 2 };
          break;
        case 'bottom':
          updates[layer.id] = { y: bounds.y + bounds.height - layer.height };
          break;
      }
    });

    const newLayers = editorState.layers.map(layer => 
      updates[layer.id] ? { ...layer, ...updates[layer.id] } : layer
    );
    const newState = { ...editorState, layers: newLayers };
    setEditorState(newState);
    addToHistory(newState);
  };

  // Text Editing Functions - FIXED
  const startTextEditing = (layer) => {
    if (layer.type === 'text' && !layer.locked) {
      console.log('Starting text editing for layer:', layer.id);
      
      // Clear any drag state
      setDragState({
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
        startRotation: 0
      });

      setEditingTextId(layer.id);
      setTextEditValue(layer.content);
      
      // Use setTimeout to ensure the DOM is updated
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
          textInputRef.current.select();
        }
      }, 50);
    }
  };

  const finishTextEditing = () => {
    if (editingTextId) {
      const layer = editorState.layers.find(l => l.id === editingTextId);
      if (layer && textEditValue.trim() !== '') {
        updateLayer(editingTextId, { content: textEditValue });
      }
      setEditingTextId(null);
      setTextEditValue('');
    }
  };

  // Auto text wrapping function
  const wrapText = (text, maxWidth, fontSize, fontFamily) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + ' ' + word;
      // Simple character-based wrapping (in a real app, you'd use canvas measureText)
      const lineWidth = testLine.length * (fontSize * 0.6);
      
      if (lineWidth < maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines.join('\n');
  };

  // Floating Toolbar Functions
  const updateFloatingToolbarPosition = () => {
    if (editorState.selectedLayerIds.length > 0) {
      const selectedLayers = editorState.layers.filter(l => editorState.selectedLayerIds.includes(l.id));
      const bounds = getGroupBounds(selectedLayers);
      
      setFloatingToolbarPosition({
        x: bounds.x + bounds.width / 2,
        y: bounds.y - 60
      });
      setShowFloatingToolbar(true);
    } else {
      setShowFloatingToolbar(false);
    }
  };

  // Custom alignment icons
  const AlignTop = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="4" x2="21" y2="4"></line>
      <line x1="12" y1="8" x2="12" y2="20"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );

  const AlignMiddle = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="16" x2="16" y2="16"></line>
    </svg>
  );

  const AlignBottom = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="20" x2="21" y2="20"></line>
      <line x1="12" y1="8" x2="12" y2="20"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );

  // Mouse Handlers - COMPLETELY REWRITTEN
  const handleCanvasMouseDown = (e) => {
    // Clear selection when clicking on empty canvas
    if (e.target === canvasRef.current) {
      setEditorState(prev => ({ ...prev, selectedLayerIds: [] }));
      setShowFloatingToolbar(false);
    }
  };

  const handleLayerMouseDown = (e, layer) => {
    if (layer.locked) return;
    e.stopPropagation();

    // If we're already editing text, don't process mouse down
    if (editingTextId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scale = editorState.zoom / 100;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Update selection - if clicking a group, select the group, not children
    let layersToSelect = [layer.id];
    
    // If this layer is part of a group, select the group instead
    if (layer.groupId) {
      const groupLayer = editorState.layers.find(l => l.id === layer.groupId);
      if (groupLayer) {
        layersToSelect = [groupLayer.id];
      }
    }

    if (!e.shiftKey) {
      setEditorState(prev => ({ ...prev, selectedLayerIds: layersToSelect }));
    } else if (e.shiftKey) {
      setEditorState(prev => ({
        ...prev,
        selectedLayerIds: prev.selectedLayerIds.includes(layersToSelect[0])
          ? prev.selectedLayerIds.filter(id => !layersToSelect.includes(id))
          : [...prev.selectedLayerIds, ...layersToSelect]
      }));
    }

    // Find the actual layer we're manipulating (could be group or individual)
    const targetLayer = layersToSelect[0] === layer.id ? layer : editorState.layers.find(l => l.id === layersToSelect[0]);

    // Only set drag state for single clicks, not double clicks
    if (e.detail === 1) { // Single click
      setDragState({
        isDragging: true,
        isResizing: false,
        isRotating: false,
        resizeHandle: null,
        startX: x,
        startY: y,
        startLayerX: targetLayer.x,
        startLayerY: targetLayer.y,
        startWidth: targetLayer.width,
        startHeight: targetLayer.height,
        startRotation: targetLayer.rotation
      });
    }

    updateFloatingToolbarPosition();
  };

  const handleResizeMouseDown = (e, layer, handle) => {
    if (layer.locked || editingTextId) return;
    e.stopPropagation();

    const rect = canvasRef.current.getBoundingClientRect();
    const scale = editorState.zoom / 100;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setDragState({
      isDragging: false,
      isResizing: true,
      isRotating: false,
      resizeHandle: handle,
      startX: x,
      startY: y,
      startLayerX: layer.x,
      startLayerY: layer.y,
      startWidth: layer.width,
      startHeight: layer.height,
      startRotation: layer.rotation
    });
  };

  const handleRotateMouseDown = (e, layer) => {
    if (layer.locked || editingTextId) return;
    e.stopPropagation();

    const rect = canvasRef.current.getBoundingClientRect();
    const scale = editorState.zoom / 100;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const centerX = layer.x + layer.width / 2;
    const centerY = layer.y + layer.height / 2;
    const startAngle = Math.atan2(y - centerY, x - centerX);

    setDragState({
      isDragging: false,
      isResizing: false,
      isRotating: true,
      resizeHandle: null,
      startX: x,
      startY: y,
      startLayerX: layer.x,
      startLayerY: layer.y,
      startWidth: layer.width,
      startHeight: layer.height,
      startRotation: layer.rotation,
      startAngle: startAngle
    });
  };

  const handleMouseMove = (e) => {
    if (!dragState.isDragging && !dragState.isResizing && !dragState.isRotating) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scale = editorState.zoom / 100;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (dragState.isDragging) {
      const deltaX = x - dragState.startX;
      const deltaY = y - dragState.startY;

      // Create a copy of layers to modify
      let newLayers = [...editorState.layers];

      editorState.selectedLayerIds.forEach(id => {
        const layerIndex = newLayers.findIndex(l => l.id === id);
        if (layerIndex !== -1) {
          const layer = newLayers[layerIndex];
          let newX = dragState.startLayerX + deltaX;
          let newY = dragState.startLayerY + deltaY;

          // Constrain to canvas bounds
          newX = Math.max(0, Math.min(newX, editorState.canvasWidth - layer.width));
          newY = Math.max(0, Math.min(newY, editorState.canvasHeight - layer.height));

          // Handle group movement
          if (layer.type === 'group') {
            // Update group position
            newLayers[layerIndex] = { ...layer, x: newX, y: newY };
            
            // Update children positions
            layer.children.forEach(childId => {
              const childIndex = newLayers.findIndex(l => l.id === childId);
              if (childIndex !== -1) {
                const child = newLayers[childIndex];
                const relativeX = child.relativeX || (child.x - dragState.startLayerX);
                const relativeY = child.relativeY || (child.y - dragState.startLayerY);
                
                const childNewX = newX + relativeX;
                const childNewY = newY + relativeY;
                
                const constrainedChildX = Math.max(0, Math.min(childNewX, editorState.canvasWidth - child.width));
                const constrainedChildY = Math.max(0, Math.min(childNewY, editorState.canvasHeight - child.height));
                
                newLayers[childIndex] = {
                  ...child,
                  x: constrainedChildX,
                  y: constrainedChildY,
                  relativeX: constrainedChildX - newX,
                  relativeY: constrainedChildY - newY
                };
              }
            });
          } else {
            // Regular layer movement
            newLayers[layerIndex] = { ...layer, x: newX, y: newY };
          }
        }
      });

      setEditorState(prev => ({ ...prev, layers: newLayers }));
    } 
    else if (dragState.isResizing) {
      const deltaX = x - dragState.startX;
      const deltaY = y - dragState.startY;

      editorState.selectedLayerIds.forEach(id => {
        const layer = editorState.layers.find(l => l.id === id);
        if (!layer) return;

        let newWidth = dragState.startWidth;
        let newHeight = dragState.startHeight;
        let newX = dragState.startLayerX;
        let newY = dragState.startLayerY;

        // Calculate new dimensions based on resize handle
        switch (dragState.resizeHandle) {
          case 'nw':
            newWidth = Math.max(10, dragState.startWidth - deltaX);
            newHeight = Math.max(10, dragState.startHeight - deltaY);
            newX = dragState.startLayerX + deltaX;
            newY = dragState.startLayerY + deltaY;
            break;
          case 'ne':
            newWidth = Math.max(10, dragState.startWidth + deltaX);
            newHeight = Math.max(10, dragState.startHeight - deltaY);
            newY = dragState.startLayerY + deltaY;
            break;
          case 'sw':
            newWidth = Math.max(10, dragState.startWidth - deltaX);
            newHeight = Math.max(10, dragState.startHeight + deltaY);
            newX = dragState.startLayerX + deltaX;
            break;
          case 'se':
            newWidth = Math.max(10, dragState.startWidth + deltaX);
            newHeight = Math.max(10, dragState.startHeight + deltaY);
            break;
          case 'n':
            newHeight = Math.max(10, dragState.startHeight - deltaY);
            newY = dragState.startLayerY + deltaY;
            break;
          case 's':
            newHeight = Math.max(10, dragState.startHeight + deltaY);
            break;
          case 'w':
            newWidth = Math.max(10, dragState.startWidth - deltaX);
            newX = dragState.startLayerX + deltaX;
            break;
          case 'e':
            newWidth = Math.max(10, dragState.startWidth + deltaX);
            break;
        }

        // Constrain to canvas bounds
        newX = Math.max(0, Math.min(newX, editorState.canvasWidth - newWidth));
        newY = Math.max(0, Math.min(newY, editorState.canvasHeight - newHeight));
        newWidth = Math.min(newWidth, editorState.canvasWidth - newX);
        newHeight = Math.min(newHeight, editorState.canvasHeight - newY);

        if (layer.type === 'group') {
          // For groups, scale the children proportionally
          const scaleX = newWidth / dragState.startWidth;
          const scaleY = newHeight / dragState.startHeight;
          const offsetX = newX - dragState.startLayerX;
          const offsetY = newY - dragState.startLayerY;

          // Update group
          updateLayer(id, { width: newWidth, height: newHeight, x: newX, y: newY });

          // Update children with scaling
          layer.children.forEach(childId => {
            const child = editorState.layers.find(l => l.id === childId);
            if (child) {
              const relativeX = (child.x - dragState.startLayerX);
              const relativeY = (child.y - dragState.startLayerY);
              
              updateLayer(childId, {
                x: newX + relativeX * scaleX,
                y: newY + relativeY * scaleY,
                width: child.width * scaleX,
                height: child.height * scaleY,
                relativeX: relativeX * scaleX,
                relativeY: relativeY * scaleY
              });
            }
          });
        } else {
          // Regular layer resize
          updateLayer(id, { width: newWidth, height: newHeight, x: newX, y: newY });
        }
      });
    }
    else if (dragState.isRotating) {
      const layer = editorState.layers.find(l => editorState.selectedLayerIds[0] === l.id);
      if (layer) {
        const centerX = layer.x + layer.width / 2;
        const centerY = layer.y + layer.height / 2;
        const currentAngle = Math.atan2(y - centerY, x - centerX);
        const angleDiff = currentAngle - dragState.startAngle;
        const newRotation = (dragState.startRotation + angleDiff * (180 / Math.PI)) % 360;
        
        updateLayer(layer.id, { rotation: newRotation });
      }
    }

    updateFloatingToolbarPosition();
  };

  const handleMouseUp = () => {
    if (dragState.isDragging || dragState.isResizing || dragState.isRotating) {
      addToHistory(editorState);
    }
    setDragState({
      isDragging: false,
      isResizing: false,
      isRotating: false,
      resizeHandle: null,
      startX: 0,
      startY: 0
    });
    setAlignmentLines({ vertical: [], horizontal: [] });
  };

  // Advanced Organizer Component (Canva-like Bounding Box)
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

  // Upload Template Functions - FIXED INPUT HANDLING
  const handleDragOver = (e) => {
    e.preventDefault();
    setUploadData(prev => ({ ...prev, isDragging: true }));
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setUploadData(prev => ({ ...prev, isDragging: false }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setUploadData(prev => ({ ...prev, isDragging: false }));
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadData(prev => ({ 
          ...prev, 
          files: [file],
          thumbnail: event.target.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // FIXED: Proper input change handlers for upload modal
  const handleUploadInputChange = (field, value) => {
    setUploadData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpload = () => {
    if (!uploadData.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    const newTemplate = {
      id: Date.now(),
      name: uploadData.name,
      category: uploadData.category,
      tags: uploadData.tags.split(',').map(t => t.trim()).filter(t => t),
      thumbnail: uploadData.thumbnail || 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=' + encodeURIComponent(uploadData.name),
      visibility: uploadData.visibility,
      creator: currentUser.name,
      creatorId: currentUser.id,
      creatorAvatar: currentUser.avatar,
      date: new Date().toISOString().split('T')[0],
      json: { layers: [], assets: [] },
      views: 0,
      uses: 0,
      likes: 0,
      downloads: 0
    };

    setTemplates(prev => [newTemplate, ...prev]);
    
    // Update user's template count
    setUsers(prev => prev.map(user => 
      user.id === currentUser.id 
        ? { ...user, templatesCreated: user.templatesCreated + 1 }
        : user
    ));
    
    setUploadModalOpen(false);
    alert('Template uploaded successfully!');
    setUploadData({ 
      name: '', 
      category: 'Social Media', 
      tags: '', 
      visibility: 'public',
      files: null,
      isDragging: false,
      thumbnail: null
    });
  };

  // ADMIN USER MANAGEMENT FUNCTIONS
  const addNewUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const userExists = users.find(user => user.email === newUser.email);
    if (userExists) {
      alert('A user with this email already exists');
      return;
    }

    const userPermissions = {
      admin: ['all'],
      designer: ['create', 'edit', 'view'],
      marketer: ['view', 'use'],
      viewer: ['view']
    };

    const newUserObj = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      role: newUser.role,
      joinDate: new Date().toISOString().split('T')[0],
      templatesCreated: 0,
      lastActive: new Date().toISOString(),
      status: 'active',
      permissions: userPermissions[newUser.role] || ['view']
    };

    setUsers(prev => [...prev, newUserObj]);
    setNewUser({
      name: '',
      email: '',
      role: 'designer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
    });
    setAdminState(prev => ({ ...prev, showAddUserModal: false }));
    
    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      totalUsers: prev.totalUsers + 1
    }));
    
    alert('User added successfully!');
  };

  const updateUserRole = (userId, newRole) => {
    const userPermissions = {
      admin: ['all'],
      designer: ['create', 'edit', 'view'],
      marketer: ['view', 'use'],
      viewer: ['view']
    };

    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, role: newRole, permissions: userPermissions[newRole] || ['view'] }
        : user
    ));
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const deleteUser = (userId) => {
    if (userId === currentUser.id) {
      alert('You cannot delete your own account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('User deleted successfully');
    }
  };

  // Profile Picture Editing
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileEdit(prev => ({ ...prev, avatar: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startProfileEdit = (user) => {
    setProfileEdit({
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
    setAdminState(prev => ({ ...prev, editingProfile: user, showProfileEditModal: true }));
  };

  const saveProfileEdit = () => {
    if (!profileEdit.name.trim() || !profileEdit.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setUsers(prev => prev.map(user => 
      user.id === adminState.editingProfile.id 
        ? { ...user, name: profileEdit.name, email: profileEdit.email, avatar: profileEdit.avatar }
        : user
    ));

    // Update current user if editing own profile
    if (adminState.editingProfile.id === currentUser.id) {
      setCurrentUser(prev => ({ ...prev, name: profileEdit.name, email: profileEdit.email, avatar: profileEdit.avatar }));
    }

    // Update templates created by this user
    setTemplates(prev => prev.map(template => 
      template.creatorId === adminState.editingProfile.id 
        ? { ...template, creator: profileEdit.name, creatorAvatar: profileEdit.avatar }
        : template
    ));

    setAdminState(prev => ({ ...prev, showProfileEditModal: false, editingProfile: null }));
    alert('Profile updated successfully!');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(adminState.userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(adminState.userSearchTerm.toLowerCase());
    const matchesRole = adminState.userFilterRole === 'all' || user.role === adminState.userFilterRole;
    return matchesSearch && matchesRole;
  });

  // Check user permissions
  const canEditTemplateSettings = () => {
    return currentUser.role === 'admin' || currentUser.role === 'designer';
  };

  const canManageUsers = () => {
    return currentUser.role === 'admin';
  };

  // Use Effects
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close shapes menu
      if (shapesMenuRef.current && !shapesMenuRef.current.contains(event.target)) {
        setShowShapesMenu(false);
      }
      
      // Finish property editing
      if (editingProperty && propertyInputRef.current && !propertyInputRef.current.contains(event.target)) {
        finishPropertyEditing();
      }

      // Finish text editing when clicking outside
      if (editingTextId && !event.target.closest('.text-editing')) {
        finishTextEditing();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingProperty, editingTextId]);

  useEffect(() => {
    const handleCanvasDoubleClick = (e) => {
      if (e.target === canvasRef.current) {
        // Clear selection when double-clicking empty canvas
        setEditorState(prev => ({ ...prev, selectedLayerIds: [] }));
        setShowFloatingToolbar(false);
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('dblclick', handleCanvasDoubleClick);
      return () => {
        canvas.removeEventListener('dblclick', handleCanvasDoubleClick);
      };
    }
  }, []);

  useEffect(() => {
    if (dragState.isDragging || dragState.isResizing || dragState.isRotating) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, editorState]);

  useEffect(() => {
    updateFloatingToolbarPosition();
  }, [editorState.selectedLayerIds]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && !editingTextId) {
        switch(e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) redo();
            else undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'c':
            e.preventDefault();
            duplicateSelectedLayers();
            break;
          case 'g':
            e.preventDefault();
            if (editorState.selectedLayerIds.length > 1) groupLayers();
            break;
          case 'd':
            e.preventDefault();
            deleteSelectedLayers();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [editingTextId, editorState.selectedLayerIds]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave.enabled) return;
    
    const interval = setInterval(() => {
      setAutoSave(prev => ({ ...prev, lastSaved: new Date().toISOString() }));
      // In a real app, you would save to backend here
      console.log('Auto-saved template');
    }, autoSave.interval);
    
    return () => clearInterval(interval);
  }, [autoSave.enabled, autoSave.interval]);

  // Render Shape
  const renderShape = (layer) => {
    const style = {
      fill: layer.fill,
      stroke: layer.stroke,
      strokeWidth: layer.strokeWidth
    };

    switch (layer.shapeType) {
      case 'rectangle':
        return <rect width={layer.width} height={layer.height} {...style} rx={layer.borderRadius} />;
      case 'circle':
        return <ellipse cx={layer.width/2} cy={layer.height/2} rx={layer.width/2} ry={layer.height/2} {...style} />;
      case 'triangle':
        return <polygon points={`${layer.width/2},0 ${layer.width},${layer.height} 0,${layer.height}`} {...style} />;
      case 'star':
        const points = [];
        for (let i = 0; i < 10; i++) {
          const radius = i % 2 === 0 ? layer.width/2 : layer.width/4;
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          points.push(`${layer.width/2 + radius * Math.cos(angle)},${layer.height/2 + radius * Math.sin(angle)}`);
        }
        return <polygon points={points.join(' ')} {...style} />;
      case 'hexagon':
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          hexPoints.push(`${layer.width/2 + (layer.width/2) * Math.cos(angle)},${layer.height/2 + (layer.height/2) * Math.sin(angle)}`);
        }
        return <polygon points={hexPoints.join(' ')} {...style} />;
      case 'line':
        return <line x1="0" y1={layer.height/2} x2={layer.width} y2={layer.height/2} {...style} />;
      default:
        return null;
    }
  };

  // Get Effect Style
  const getEffectStyle = (layer) => {
    if (layer.effect === 'none') return {};
    
    const filters = {
      blur: `blur(${layer.effectValue || 5}px)`,
      brightness: `brightness(${layer.effectValue || 150}%)`,
      contrast: `contrast(${layer.effectValue || 150}%)`,
      grayscale: `grayscale(${layer.effectValue || 100}%)`,
      sepia: `sepia(${layer.effectValue || 100}%)`,
      invert: `invert(${layer.effectValue || 100}%)`,
      saturate: `saturate(${layer.effectValue || 200}%)`,
      'hue-rotate': `hue-rotate(${layer.effectValue || 90}deg)`,
      'drop-shadow': `drop-shadow(0 4px 8px rgba(0,0,0,0.3))`,
      opacity: `opacity(${layer.effectValue || 50}%)`
    };

    return { filter: filters[layer.effect] };
  };

  // Get Animation Class - FIXED for all layer types including groups
  const getAnimationClass = (layer) => {
    if (layer.animation === 'none') return '';
    return `animate-${layer.animation}`;
  };

  // Save Template Function
  const saveTemplate = () => {
    if (!editorState.name.trim()) {
      alert('Please enter a template name before saving.');
      return;
    }

    const newTemplate = {
      id: Date.now(),
      name: editorState.name,
      category: editorState.category,
      tags: editorState.tags.split(',').map(t => t.trim()).filter(t => t),
      thumbnail: 'https://via.placeholder.com/300x200/10b981/ffffff?text=' + encodeURIComponent(editorState.name),
      visibility: editorState.visibility,
      creator: currentUser.name,
      creatorId: currentUser.id,
      creatorAvatar: currentUser.avatar,
      date: new Date().toISOString().split('T')[0],
      json: { 
        background: editorState.background, 
        layers: editorState.layers,
        canvasWidth: editorState.canvasWidth,
        canvasHeight: editorState.canvasHeight
      },
      views: 0,
      uses: 0,
      likes: 0,
      downloads: 0
    };
    
    setTemplates(prev => [newTemplate, ...prev]);
    
    // Update user's template count
    setUsers(prev => prev.map(user => 
      user.id === currentUser.id 
        ? { ...user, templatesCreated: user.templatesCreated + 1 }
        : user
    ));
    
    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      totalTemplates: prev.totalTemplates + 1
    }));
    
    alert('Template saved successfully!');
    setCurrentView('dashboard');
  };

  // Property Input Component - FIXED FOR CONTINUOUS EDITING
  const PropertyInput = ({ value, onStartEdit, propertyPath, type = 'number', className = '', disabled = false }) => {
    const isEditing = editingProperty?.path === propertyPath;

    if (isEditing) {
      return (
        <input
          ref={propertyInputRef}
          type={type === 'number' ? 'number' : 'text'}
          value={editingProperty.value}
          onChange={(e) => setEditingProperty(prev => ({ ...prev, value: e.target.value }))}
          onBlur={finishPropertyEditing}
          onKeyDown={handlePropertyKeyDown}
          className={`w-full bg-gray-500 text-white px-2 py-1 rounded text-sm border border-blue-400 outline-none ${className}`}
          autoFocus
        />
      );
    }

    return (
      <div
        onClick={() => !disabled && onStartEdit(propertyPath, value, type)}
        className={`w-full bg-gray-600 text-white px-2 py-1 rounded text-sm cursor-text hover:bg-gray-500 transition-colors ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {type === 'number' ? Math.round(value) : value}
      </div>
    );
  };

  // Quick Actions Toolbar Component
  const QuickActionsToolbar = () => (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg p-2 flex gap-2 shadow-xl z-10 border border-gray-600">
      <button 
        onClick={addTextLayer}
        className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
        title="Add Text"
      >
        <Type className="w-5 h-5" />
      </button>
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
        title="Add Image"
      >
        <Image className="w-5 h-5" />
      </button>
      <div className="relative">
        <button 
          onClick={() => setShowShapesMenu(!showShapesMenu)}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Add Shape"
        >
          <Square className="w-5 h-5" />
        </button>
        {showShapesMenu && (
          <div className="absolute left-0 top-full mt-2 bg-gray-800 rounded-lg p-2 shadow-xl z-50 border border-gray-600">
            <div className="grid grid-cols-2 gap-2">
              {shapes.map(shape => (
                <button
                  key={shape.type}
                  onClick={() => addShapeLayer(shape.type)}
                  className="p-2 hover:bg-gray-700 rounded transition-colors flex flex-col items-center gap-1 text-gray-300 hover:text-white text-xs"
                  title={shape.name}
                >
                  <shape.icon className="w-4 h-4" />
                  <span>{shape.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-px bg-gray-600"></div>
      <button 
        onClick={() => setEditorState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
        className={`p-2 rounded transition-colors ${editorState.showGrid ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
        title="Toggle Grid"
      >
        <GridIcon className="w-5 h-5" />
      </button>
      <button 
        onClick={() => setEditorState(prev => ({ ...prev, showRulers: !prev.showRulers }))}
        className={`p-2 rounded transition-colors ${editorState.showRulers ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
        title="Toggle Rulers"
      >
        <Ruler className="w-5 h-5" />
      </button>
    </div>
  );

  // Admin User Management Component - REMOVED TEAM MEMBERS
  const UserManagement = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6" />
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
            {userRoles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users List - Only showing current user */}
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
                    <span className={`text-xs px-2 py-1 rounded-full ${userRoles.find(r => r.value === user.role)?.color || 'bg-gray-100 text-gray-800'}`}>
                      {userRoles.find(r => r.value === user.role)?.label || user.role}
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
                  {userRoles.map(role => (
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
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new user</p>
        </div>
      )}
    </div>
  );

  // Add User Modal Component
  const AddUserModal = () => (
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
              {userRoles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {userRoles.find(r => r.value === newUser.role)?.description}
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-900 mb-2">Permissions Preview</h4>
            <div className="flex flex-wrap gap-2">
              {(userRoles.find(r => r.value === newUser.role)?.value === 'admin' 
                ? ['all'] 
                : userRoles.find(r => r.value === newUser.role)?.value === 'designer' 
                  ? ['create', 'edit', 'view']
                  : userRoles.find(r => r.value === newUser.role)?.value === 'marketer'
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

  // Profile Edit Modal Component
  const ProfileEditModal = () => (
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

  // Dashboard Component with Analytics - REMOVED TEAM MEMBERS SECTION
  const Dashboard = () => (
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
      {adminState.showUserManagement && canManageUsers() && <UserManagement />}

      {/* Analytics Cards */}
      {!adminState.showUserManagement && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Users</p>
                  <h3 className="text-2xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</h3>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Just you
                  </p>
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
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Currently online
                  </p>
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
                  <p className="text-xs text-green-600 font-medium mt-1">
                    +{templates.length} user created
                  </p>
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
                  <p className="text-xs text-green-600 font-medium mt-1">
                    +{analytics.viewGrowth}% from last month
                  </p>
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
      {adminState.showAddUserModal && <AddUserModal />}
      
      {/* Profile Edit Modal */}
      {adminState.showProfileEditModal && <ProfileEditModal />}
    </div>
  );

  // Template Preset Modal
  const TemplatePresetModal = () => (
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
          {templatePresets.map(preset => (
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

  // Upload Modal Component - FIXED INPUT HANDLING
  const UploadModal = () => (
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
              {categories.map(cat => (
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

  // Editor Component - FIXED ANIMATIONS FOR ALL LAYER TYPES
  const Editor = () => {
    const selectedLayers = editorState.layers.filter(l => editorState.selectedLayerIds.includes(l.id));
    const selectedLayer = selectedLayers[0];

    return (
      <div className="h-screen flex flex-col bg-gray-900">
        {/* Animation Styles */}
        <style>{animationStyles}</style>
        
        {/* Top Toolbar */}
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

        <div className="flex flex-1 overflow-hidden">
          {/* Left Toolbar */}
          <div className="w-20 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-2">
            <button 
              onClick={() => setEditorState(prev => ({ ...prev, activeTool: 'select' }))}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                editorState.activeTool === 'select' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'
              }`}
              title="Select"
            >
              <MousePointer className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setEditorState(prev => ({ ...prev, activeTool: 'hand' }))}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                editorState.activeTool === 'hand' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'
              }`}
              title="Hand Tool"
            >
              <Hand className="w-6 h-6" />
            </button>
            <button onClick={addTextLayer} className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-all text-gray-300 hover:text-white" title="Add Text">
              <Type className="w-6 h-6" />
            </button>
            
            {/* Shapes Button with Dropdown */}
            <div className="relative" ref={shapesMenuRef}>
              <button 
                onClick={() => setShowShapesMenu(!showShapesMenu)}
                className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-all text-gray-300 hover:text-white"
                title="Add Shape"
              >
                <Square className="w-6 h-6" />
              </button>
              {showShapesMenu && (
                <div className="absolute left-full ml-2 bg-gray-800 rounded-lg p-2 shadow-xl z-50 border border-gray-600">
                  <div className="grid grid-cols-2 gap-2">
                    {shapes.map(shape => (
                      <button
                        key={shape.type}
                        onClick={() => addShapeLayer(shape.type)}
                        className="p-3 hover:bg-gray-700 rounded-lg transition-all flex flex-col items-center gap-1 text-gray-300 hover:text-white"
                        title={shape.name}
                      >
                        <shape.icon className="w-5 h-5" />
                        <span className="text-xs">{shape.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-all text-gray-300 hover:text-white" title="Add Image">
              <Image className="w-6 h-6" />
            </button>
            <div className="w-10 h-px bg-gray-600 my-2"></div>
            <button onClick={duplicateSelectedLayers} disabled={!selectedLayer} className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-all text-gray-300 hover:text-white disabled:opacity-30" title="Duplicate">
              <Copy className="w-6 h-6" />
            </button>
            <button onClick={deleteSelectedLayers} disabled={!selectedLayer} className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-all text-gray-300 hover:text-white disabled:opacity-30" title="Delete">
              <Trash2 className="w-6 h-6" />
            </button>
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 bg-gray-700 overflow-auto p-8 relative">
            <QuickActionsToolbar />
            
            <div className="flex items-center justify-center min-h-full">
              <div
                ref={canvasRef}
                className="relative shadow-2xl canvas-container bg-white"
                style={{
                  width: editorState.canvasWidth * (editorState.zoom / 100),
                  height: editorState.canvasHeight * (editorState.zoom / 100),
                  background: editorState.background.type === 'solid' 
                    ? editorState.background.color 
                    : editorState.background.gradient,
                  transformOrigin: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: editorState.activeTool === 'hand' ? 'grab' : 'default'
                }}
                onMouseDown={handleCanvasMouseDown}
              >
                {/* Grid Overlay */}
                {editorState.showGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                       linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}
                  />
                )}

                {/* Alignment Lines */}
                {alignmentLines.vertical.map((x, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute top-0 bottom-0 w-px bg-pink-500 z-40"
                    style={{ left: x * (editorState.zoom / 100) }}
                  />
                ))}
                {alignmentLines.horizontal.map((y, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute left-0 right-0 h-px bg-pink-500 z-40"
                    style={{ top: y * (editorState.zoom / 100) }}
                  />
                ))}

                {/* Floating Toolbar */}
                {showFloatingToolbar && editorState.selectedLayerIds.length > 0 && (
                  <div 
                    className="floating-toolbar absolute bg-gray-800 rounded-lg shadow-2xl border border-gray-600 z-50 p-2 flex items-center gap-1"
                    style={{
                      left: floatingToolbarPosition.x * (editorState.zoom / 100),
                      top: floatingToolbarPosition.y * (editorState.zoom / 100),
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <button
                      onClick={duplicateSelectedLayers}
                      className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={deleteSelectedLayers}
                      className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {editorState.selectedLayerIds.length > 1 && (
                      <>
                        <div className="w-px h-4 bg-gray-600"></div>
                        <button
                          onClick={groupLayers}
                          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
                          title="Group"
                        >
                          <Group className="w-4 h-4" />
                        </button>
                        <button
                          onClick={ungroupLayers}
                          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
                          title="Ungroup"
                        >
                          <Ungroup className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <div className="w-px h-4 bg-gray-600"></div>
                    <button
                      onClick={() => selectedLayer && bringToFront(selectedLayer.id)}
                      className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
                      title="Bring to Front"
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Layers - FIXED ANIMATIONS FOR ALL LAYER TYPES */}
                {editorState.layers
                  .filter(l => l.visible)
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map(layer => {
                    const isSelected = editorState.selectedLayerIds.includes(layer.id);
                    const scale = editorState.zoom / 100;
                    const isEditing = editingTextId === layer.id;
                    const animationClass = getAnimationClass(layer);

                    return (
                      <div
                        key={layer.id}
                        className={`absolute canvas-layer ${isSelected ? 'ring-0' : ''} ${animationClass}`}
                        style={{
                          left: layer.x * scale,
                          top: layer.y * scale,
                          width: layer.width * scale,
                          height: layer.height * scale,
                          transform: `rotate(${layer.rotation}deg)`,
                          opacity: layer.opacity,
                          pointerEvents: layer.locked ? 'none' : 'auto',
                          zIndex: layer.zIndex,
                          ...getEffectStyle(layer)
                        }}
                        onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (layer.type === 'text' && !layer.locked) {
                            startTextEditing(layer);
                          }
                        }}
                      >
                        {/* Advanced Organizer */}
                        {isSelected && <AdvancedOrganizer layer={layer} />}

                        {/* Layer Content */}
                        {layer.type === 'text' && (
                          <div className="w-full h-full flex items-center relative text-editing">
                            {isEditing ? (
                              <textarea
                                ref={textInputRef}
                                value={textEditValue}
                                onChange={(e) => setTextEditValue(e.target.value)}
                                onBlur={finishTextEditing}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    finishTextEditing();
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingTextId(null);
                                    setTextEditValue('');
                                  }
                                }}
                                className="w-full h-full bg-transparent border-none outline-none resize-none p-2 text-editing"
                                style={{
                                  fontSize: layer.fontSize * scale,
                                  fontFamily: layer.fontFamily,
                                  fontWeight: layer.fontWeight,
                                  fontStyle: layer.fontStyle,
                                  color: layer.color,
                                  textAlign: layer.textAlign,
                                  borderRadius: layer.borderRadius,
                                  border: '2px dashed #3b82f6',
                                  background: 'rgba(59, 130, 246, 0.1)',
                                  cursor: 'text',
                                  wordWrap: 'break-word',
                                  whiteSpace: 'pre-wrap',
                                  overflowWrap: 'break-word'
                                }}
                                autoFocus
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center p-2 cursor-move"
                                style={{
                                  fontSize: layer.fontSize * scale,
                                  fontFamily: layer.fontFamily,
                                  fontWeight: layer.fontWeight,
                                  fontStyle: layer.fontStyle,
                                  color: layer.color,
                                  textAlign: layer.textAlign,
                                  userSelect: 'none',
                                  borderRadius: layer.borderRadius,
                                  cursor: 'move',
                                  wordWrap: layer.textWrap ? 'break-word' : 'normal',
                                  whiteSpace: layer.textWrap ? 'pre-wrap' : 'nowrap',
                                  overflowWrap: 'break-word',
                                  overflow: 'hidden'
                                }}
                              >
                                {layer.content}
                              </div>
                            )}
                          </div>
                        )}

                        {layer.type === 'shape' && (
                          <svg 
                            width="100%" 
                            height="100%" 
                            style={{ overflow: 'visible', cursor: 'move' }}
                            className="cursor-move"
                          >
                            {renderShape(layer)}
                          </svg>
                        )}

                        {layer.type === 'image' && (
                          <img
                            src={layer.src}
                            alt=""
                            className="w-full h-full object-cover cursor-move"
                            style={{ borderRadius: layer.borderRadius }}
                            draggable={false}
                          />
                        )}

                        {layer.type === 'group' && (
                          <div className="w-full h-full border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 bg-opacity-20 cursor-move">
                            {/* Group content - animations now work on groups too */}
                          </div>
                        )}

                        {/* Lock Indicator */}
                        {layer.locked && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl z-50">
                            <Lock className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Right Properties Panel */}
          <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-white font-semibold mb-4 text-lg">Properties</h3>

              {selectedLayer ? (
                <div className="space-y-4">
                  {/* Position & Size */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white text-sm font-medium mb-3">Position & Size</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">X</label>
                        <PropertyInput
                          value={selectedLayer.x}
                          onStartEdit={startPropertyEditing}
                          propertyPath={`layer.${selectedLayer.id}.x`}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Y</label>
                        <PropertyInput
                          value={selectedLayer.y}
                          onStartEdit={startPropertyEditing}
                          propertyPath={`layer.${selectedLayer.id}.y`}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Width</label>
                        <PropertyInput
                          value={selectedLayer.width}
                          onStartEdit={startPropertyEditing}
                          propertyPath={`layer.${selectedLayer.id}.width`}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Height</label>
                        <PropertyInput
                          value={selectedLayer.height}
                          onStartEdit={startPropertyEditing}
                          propertyPath={`layer.${selectedLayer.id}.height`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Properties */}
                  {selectedLayer.type === 'text' && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-white text-sm font-medium mb-3">Text</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Content</label>
                          <PropertyInput
                            value={selectedLayer.content}
                            onStartEdit={startPropertyEditing}
                            propertyPath={`text.${selectedLayer.id}.content`}
                            type="text"
                            className="min-h-[60px]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Font Size</label>
                          <PropertyInput
                            value={selectedLayer.fontSize}
                            onStartEdit={startPropertyEditing}
                            propertyPath={`layer.${selectedLayer.id}.fontSize`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Font Family</label>
                          <select
                            value={selectedLayer.fontFamily}
                            onChange={(e) => updateLayer(selectedLayer.id, { fontFamily: e.target.value })}
                            className="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm"
                          >
                            {fontFamilies.map(font => (
                              <option key={font} value={font}>{font}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateLayer(selectedLayer.id, { fontWeight: selectedLayer.fontWeight === 'bold' ? 'normal' : 'bold' })}
                            className={`flex-1 py-2 rounded text-sm ${selectedLayer.fontWeight === 'bold' ? 'bg-blue-600' : 'bg-gray-600'} text-white transition-colors`}
                          >
                            Bold
                          </button>
                          <button
                            onClick={() => updateLayer(selectedLayer.id, { fontStyle: selectedLayer.fontStyle === 'italic' ? 'normal' : 'italic' })}
                            className={`flex-1 py-2 rounded text-sm ${selectedLayer.fontStyle === 'italic' ? 'bg-blue-600' : 'bg-gray-600'} text-white transition-colors`}
                          >
                            Italic
                          </button>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Text Align</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateLayer(selectedLayer.id, { textAlign: 'left' })}
                              className={`flex-1 p-2 rounded ${selectedLayer.textAlign === 'left' ? 'bg-blue-600' : 'bg-gray-600'} transition-colors`}
                            >
                              <AlignLeft className="w-4 h-4 text-white mx-auto" />
                            </button>
                            <button
                              onClick={() => updateLayer(selectedLayer.id, { textAlign: 'center' })}
                              className={`flex-1 p-2 rounded ${selectedLayer.textAlign === 'center' ? 'bg-blue-600' : 'bg-gray-600'} transition-colors`}
                            >
                              <AlignCenter className="w-4 h-4 text-white mx-auto" />
                            </button>
                            <button
                              onClick={() => updateLayer(selectedLayer.id, { textAlign: 'right' })}
                              className={`flex-1 p-2 rounded ${selectedLayer.textAlign === 'right' ? 'bg-blue-600' : 'bg-gray-600'} transition-colors`}
                            >
                              <AlignRight className="w-4 h-4 text-white mx-auto" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Color</label>
                          <input
                            type="color"
                            value={selectedLayer.color}
                            onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
                            className="w-full h-10 bg-gray-600 rounded cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Text Wrapping</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateLayer(selectedLayer.id, { textWrap: true })}
                              className={`flex-1 py-2 rounded text-sm ${selectedLayer.textWrap ? 'bg-blue-600' : 'bg-gray-600'} text-white transition-colors`}
                            >
                              Wrap Text
                            </button>
                            <button
                              onClick={() => updateLayer(selectedLayer.id, { textWrap: false })}
                              className={`flex-1 py-2 rounded text-sm ${!selectedLayer.textWrap ? 'bg-blue-600' : 'bg-gray-600'} text-white transition-colors`}
                            >
                              No Wrap
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Border Radius</label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={selectedLayer.borderRadius}
                            onChange={(e) => updateLayer(selectedLayer.id, { borderRadius: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                          <span className="text-xs text-gray-400">{selectedLayer.borderRadius}px</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shape Properties */}
                  {selectedLayer.type === 'shape' && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-white text-sm font-medium mb-3">Shape</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Fill Color</label>
                          <input
                            type="color"
                            value={selectedLayer.fill}
                            onChange={(e) => updateLayer(selectedLayer.id, { fill: e.target.value })}
                            className="w-full h-10 bg-gray-600 rounded cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Stroke Color</label>
                          <input
                            type="color"
                            value={selectedLayer.stroke}
                            onChange={(e) => updateLayer(selectedLayer.id, { stroke: e.target.value })}
                            className="w-full h-10 bg-gray-600 rounded cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Stroke Width</label>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={selectedLayer.strokeWidth}
                            onChange={(e) => updateLayer(selectedLayer.id, { strokeWidth: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                          <span className="text-xs text-gray-400">{selectedLayer.strokeWidth}px</span>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Border Radius</label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={selectedLayer.borderRadius}
                            onChange={(e) => updateLayer(selectedLayer.id, { borderRadius: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                          <span className="text-xs text-gray-400">{selectedLayer.borderRadius}px</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Properties */}
                  {selectedLayer.type === 'image' && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-white text-sm font-medium mb-3">Image</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Border Radius</label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={selectedLayer.borderRadius}
                            onChange={(e) => updateLayer(selectedLayer.id, { borderRadius: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                          <span className="text-xs text-gray-400">{selectedLayer.borderRadius}px</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transform */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white text-sm font-medium mb-3">Transform</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Rotation</label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={selectedLayer.rotation}
                          onChange={(e) => updateLayer(selectedLayer.id, { rotation: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                        <span className="text-xs text-gray-400">{selectedLayer.rotation}°</span>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Opacity</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={selectedLayer.opacity}
                          onChange={(e) => updateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                        <span className="text-xs text-gray-400">{Math.round(selectedLayer.opacity * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Animation - FIXED FOR ALL LAYER TYPES */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white text-sm font-medium mb-3">Animation</h4>
                    <select
                      value={selectedLayer.animation}
                      onChange={(e) => updateLayer(selectedLayer.id, { animation: e.target.value })}
                      className="w-full bg-gray-600 text-white px-2 py-2 rounded text-sm"
                    >
                      {animations.map(anim => (
                        <option key={anim} value={anim}>{anim}</option>
                      ))}
                    </select>
                  </div>

                  {/* Effects */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white text-sm font-medium mb-3">Effects</h4>
                    <div className="space-y-3">
                      <select
                        value={selectedLayer.effect}
                        onChange={(e) => updateLayer(selectedLayer.id, { effect: e.target.value })}
                        className="w-full bg-gray-600 text-white px-2 py-2 rounded text-sm"
                      >
                        {effects.map(eff => (
                          <option key={eff} value={eff}>{eff}</option>
                        ))}
                      </select>
                      {selectedLayer.effect !== 'none' && selectedLayer.effect !== 'drop-shadow' && (
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Effect Value</label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={selectedLayer.effectValue || 100}
                            onChange={(e) => updateLayer(selectedLayer.id, { effectValue: parseFloat(e.target.value) })}
                            className="w-full"
                          />
                          <span className="text-xs text-gray-400">{selectedLayer.effectValue || 100}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Layer Ordering Actions */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white text-sm font-medium mb-3">Layer Order</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => bringToFront(selectedLayer.id)}
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 rounded text-sm transition-colors"
                      >
                        Bring to Front
                      </button>
                      <button
                        onClick={() => sendToBack(selectedLayer.id)}
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 rounded text-sm transition-colors"
                      >
                        Send to Back
                      </button>
                      <button
                        onClick={() => bringForward(selectedLayer.id)}
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 rounded text-sm transition-colors"
                      >
                        Bring Forward
                      </button>
                      <button
                        onClick={() => sendBackward(selectedLayer.id)}
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 rounded text-sm transition-colors"
                      >
                        Send Backward
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white text-sm font-medium mb-3">Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => toggleLock(selectedLayer.id)}
                        className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
                      >
                        {selectedLayer.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        {selectedLayer.locked ? 'Unlock' : 'Lock'}
                      </button>
                      <button
                        onClick={() => toggleVisibility(selectedLayer.id)}
                        className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        {selectedLayer.visible ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  <p className="text-sm">Select a layer to edit properties</p>
                </div>
              )}

              {/* Multi-selection Tools */}
              {selectedLayers.length > 1 && (
                <div className="bg-gray-700 rounded-lg p-4 mt-4">
                  <h4 className="text-white text-sm font-medium mb-3">Align & Group</h4>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button onClick={() => alignLayers('left')} className="bg-gray-600 hover:bg-gray-500 p-2 rounded transition-colors" title="Align Left">
                      <AlignLeft className="w-4 h-4 text-white mx-auto" />
                    </button>
                    <button onClick={() => alignLayers('center')} className="bg-gray-600 hover:bg-gray-500 p-2 rounded transition-colors" title="Align Center">
                      <AlignCenter className="w-4 h-4 text-white mx-auto" />
                    </button>
                    <button onClick={() => alignLayers('right')} className="bg-gray-600 hover:bg-gray-500 p-2 rounded transition-colors" title="Align Right">
                      <AlignRight className="w-4 h-4 text-white mx-auto" />
                    </button>
                    <button onClick={() => alignLayers('top')} className="bg-gray-600 hover:bg-gray-500 p-2 rounded transition-colors" title="Align Top">
                      <AlignTop />
                    </button>
                    <button onClick={() => alignLayers('middle')} className="bg-gray-600 hover:bg-gray-500 p-2 rounded transition-colors" title="Align Middle">
                      <AlignMiddle />
                    </button>
                    <button onClick={() => alignLayers('bottom')} className="bg-gray-600 hover:bg-gray-500 p-2 rounded transition-colors" title="Align Bottom">
                      <AlignBottom />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={groupLayers}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2 text-sm transition-colors"
                    >
                      <Group className="w-4 h-4" />
                      Group
                    </button>
                    <button
                      onClick={ungroupLayers}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded flex items-center justify-center gap-2 text-sm transition-colors"
                    >
                      <Ungroup className="w-4 h-4" />
                      Ungroup
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Layers Panel at Bottom */}
            <div className="border-t border-gray-700 p-4">
              <h3 className="text-white font-semibold mb-3 text-lg flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Layers ({editorState.layers.length})
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {[...editorState.layers].sort((a, b) => b.zIndex - a.zIndex).map(layer => {
                  const isSelected = editorState.selectedLayerIds.includes(layer.id);
                  return (
                    <div
                      key={layer.id}
                      className={`p-2 rounded flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => setEditorState(prev => ({ ...prev, selectedLayerIds: [layer.id] }))}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {layer.type === 'text' && <Type className="w-4 h-4 text-white flex-shrink-0" />}
                        {layer.type === 'shape' && <Square className="w-4 h-4 text-white flex-shrink-0" />}
                        {layer.type === 'image' && <Image className="w-4 h-4 text-white flex-shrink-0" />}
                        {layer.type === 'group' && <Layers className="w-4 h-4 text-white flex-shrink-0" />}
                        <span className="text-sm text-white truncate">
                          {layer.type === 'text' ? layer.content.substring(0, 20) : 
                           layer.type === 'group' ? 'Group' :
                           `${layer.type} layer`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id); }}
                          className="p-1 hover:bg-gray-600 rounded transition-colors"
                        >
                          <Eye className={`w-4 h-4 ${layer.visible ? 'text-white' : 'text-gray-500'}`} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleLock(layer.id); }}
                          className="p-1 hover:bg-gray-600 rounded transition-colors"
                        >
                          {layer.locked ? <Lock className="w-4 h-4 text-red-400" /> : <Unlock className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Template Settings at Bottom */}
            <div className="border-t border-gray-700 p-4">
              <h3 className="text-white font-semibold mb-3 text-lg">Template Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Category</label>
                  <select
                    value={editorState.category}
                    onChange={(e) => setEditorState(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-gray-600 text-white px-2 py-2 rounded text-sm"
                    disabled={!canEditTemplateSettings()}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tags (comma separated)</label>
                  <PropertyInput
                    value={editorState.tags}
                    onStartEdit={startPropertyEditing}
                    propertyPath="template.tags"
                    type="text"
                    disabled={!canEditTemplateSettings()}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Visibility</label>
                  <select
                    value={editorState.visibility}
                    onChange={(e) => setEditorState(prev => ({ ...prev, visibility: e.target.value }))}
                    className="w-full bg-gray-600 text-white px-2 py-2 rounded text-sm"
                    disabled={!canEditTemplateSettings()}
                  >
                    <option value="public">Public</option>
                    <option value="team-only">Team Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Background</label>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setEditorState(prev => ({ ...prev, background: { ...prev.background, type: 'solid' } }))}
                      className={`flex-1 py-2 rounded text-sm ${editorState.background.type === 'solid' ? 'bg-blue-600' : 'bg-gray-600'} text-white transition-colors`}
                      disabled={!canEditTemplateSettings()}
                    >
                      Solid
                    </button>
                    <button
                      onClick={() => setEditorState(prev => ({ ...prev, background: { ...prev.background, type: 'gradient' } }))}
                      className={`flex-1 py-2 rounded text-sm ${editorState.background.type === 'gradient' ? 'bg-blue-600' : 'bg-gray-600'} text-white transition-colors`}
                      disabled={!canEditTemplateSettings()}
                    >
                      Gradient
                    </button>
                  </div>
                  {editorState.background.type === 'solid' ? (
                    <input
                      type="color"
                      value={editorState.background.color}
                      onChange={(e) => setEditorState(prev => ({ ...prev, background: { type: 'solid', color: e.target.value } }))}
                      className="w-full h-10 bg-gray-600 rounded cursor-pointer"
                      disabled={!canEditTemplateSettings()}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                        {gradients.map((gradient, index) => (
                          <button
                            key={index}
                            onClick={() => setEditorState(prev => ({ ...prev, background: { type: 'gradient', gradient } }))}
                            className="h-10 rounded border-2 border-transparent hover:border-white transition-colors"
                            style={{ background: gradient }}
                            disabled={!canEditTemplateSettings()}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Canvas Width</label>
                    <PropertyInput
                      value={editorState.canvasWidth}
                      onStartEdit={startPropertyEditing}
                      propertyPath={`canvas.canvasWidth`}
                      disabled={!canEditTemplateSettings()}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Canvas Height</label>
                    <PropertyInput
                      value={editorState.canvasHeight}
                      onStartEdit={startPropertyEditing}
                      propertyPath={`canvas.canvasHeight`}
                      disabled={!canEditTemplateSettings()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
    );
  };

  // Library Component
  const Library = () => {
    const filteredTemplates = templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    const useTemplate = (template) => {
      if (currentUser.role === 'viewer') {
        alert('Viewers can only view templates. Please contact an administrator for edit access.');
        return;
      }
      
      setEditorState({
        name: template.name + ' (Copy)',
        category: template.category,
        tags: template.tags.join(', '),
        visibility: template.visibility,
        background: template.json.background || { type: 'solid', color: '#ffffff' },
        layers: template.json.layers || [],
        selectedLayerIds: [],
        zoom: 100,
        canvasWidth: template.json.canvasWidth || 1080,
        canvasHeight: template.json.canvasHeight || 1080,
        showGrid: false,
        showRulers: true,
        activeTool: 'select'
      });
      setCurrentView('editor');
    };

    const deleteTemplate = (id) => {
      if (window.confirm('Are you sure you want to delete this template?')) {
        setTemplates(prev => prev.filter(t => t.id !== id));
      }
    };

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
              {categories.map(cat => (
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
                      onClick={() => useTemplate(template)}
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
                    onClick={() => useTemplate(template)}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
          ${animationStyles}
        `}
      </style>
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'editor' && <Editor />}
      {currentView === 'library' && <Library />}
      {uploadModalOpen && <UploadModal />}
      {showPresetModal && <TemplatePresetModal />}
      {adminState.showAddUserModal && <AddUserModal />}
      {adminState.showProfileEditModal && <ProfileEditModal />}
    </div>
  );
};

export default SowntraTemplateSystem;
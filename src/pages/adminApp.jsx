import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Plus, Search, Filter, Edit, Trash2, Eye, Folder, Tag, Image, Type, Square, Layers, Save, X, ChevronDown, Grid, List, Circle, Star, Triangle, Hexagon, Minus, Move, Lock, Unlock, Copy, AlignLeft, AlignCenter, AlignRight, RotateCw, ZoomIn, ZoomOut, Group, Ungroup, Bold, Italic, Underline, Download, Share, Settings, Menu, MousePointer, Hand, Grid as GridIcon, Ruler, DownloadCloud, Users, History, Clock, Zap, UserPlus, Mail, Phone, Crown, Shield, UserCheck, UserX, Camera } from 'lucide-react';
import Dashboard from '../admin-components/Dashboard';
import Library from '../admin-components/Library';
import Editor from '../admin-components/Editor';
import { UploadModal, TemplatePresetModal } from '../admin-components/TemplateModals';
import { animationStyles, CATEGORIES, FONT_FAMILIES, ANIMATIONS, EFFECTS, GRADIENTS, TEMPLATE_PRESETS, USER_ROLES } from '../admin-components/constants';
import { generateId, getEffectStyle, getAnimationClass, getGroupBounds, renderShape, wrapText, getPermissionsByRole } from '../admin-components/helpers';

const AdminApp = () => {
  // View state
  const [currentView, setCurrentView] = useState('dashboard');

  // Template state
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

  // User state
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

  // Analytics state
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

  // Editor state
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

  // Drag state
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

  // UI state
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

  // Upload state
  const [uploadData, setUploadData] = useState({
    name: '',
    category: 'Social Media',
    tags: '',
    visibility: 'public',
    files: null,
    isDragging: false,
    thumbnail: null,
    isPremium: false
  });

  // Admin state
  const [adminState, setAdminState] = useState({
    showUserManagement: false,
    showAddUserModal: false,
    editingUser: null,
    userSearchTerm: '',
    userFilterRole: 'all',
    showProfileEditModal: false,
    editingProfile: null
  });

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'designer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  });

  // Profile edit state
  const [profileEdit, setProfileEdit] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  // Refs
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const shapesMenuRef = useRef(null);
  const propertyInputRef = useRef(null);
  const templateNameRef = useRef(null);
  const uploadFileInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // Helper functions - History Management
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

  // Layer ordering functions
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

  // Property editing
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

  // Create new template
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

  // Add layer functions
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

  // Layer manipulation
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
      animation: 'none',
      effect: 'none'
    };

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
    
    const updatedLayers = editorState.layers.map(layer => {
      if (childIds.includes(layer.id)) {
        const { groupId, relativeX, relativeY, ...rest } = layer;
        return rest;
      }
      return layer;
    });

    const newState = {
      ...editorState,
      layers: updatedLayers.filter(l => !groups.some(g => g.id === l.id)),
      selectedLayerIds: childIds
    };
    setEditorState(newState);
    addToHistory(newState);
    setShowFloatingToolbar(false);
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

  // Text editing
  const startTextEditing = (layer) => {
    if (layer.type === 'text' && !layer.locked) {
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

  // Floating toolbar
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

  // Mouse handlers
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      setEditorState(prev => ({ ...prev, selectedLayerIds: [] }));
      setShowFloatingToolbar(false);
    }
  };

  const handleLayerMouseDown = (e, layer) => {
    if (layer.locked) return;
    e.stopPropagation();

    if (editingTextId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scale = editorState.zoom / 100;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    let layersToSelect = [layer.id];
    
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

    const targetLayer = layersToSelect[0] === layer.id ? layer : editorState.layers.find(l => l.id === layersToSelect[0]);

    if (e.detail === 1) {
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

      let newLayers = [...editorState.layers];

      editorState.selectedLayerIds.forEach(id => {
        const layerIndex = newLayers.findIndex(l => l.id === id);
        if (layerIndex !== -1) {
          const layer = newLayers[layerIndex];
          let newX = dragState.startLayerX + deltaX;
          let newY = dragState.startLayerY + deltaY;

          newX = Math.max(0, Math.min(newX, editorState.canvasWidth - layer.width));
          newY = Math.max(0, Math.min(newY, editorState.canvasHeight - layer.height));

          if (layer.type === 'group') {
            newLayers[layerIndex] = { ...layer, x: newX, y: newY };
            
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
            newLayers[layerIndex] = { ...layer, x: newX, y: newY };
          }
        }
      });

      setEditorState(prev => ({ ...prev, layers: newLayers }));
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

  // Upload handlers
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

  // User management functions
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
      permissions: getPermissionsByRole(newUser.role)
    };

    setUsers(prev => [...prev, newUserObj]);
    setNewUser({
      name: '',
      email: '',
      role: 'designer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
    });
    setAdminState(prev => ({ ...prev, showAddUserModal: false }));
    
    setAnalytics(prev => ({
      ...prev,
      totalUsers: prev.totalUsers + 1
    }));
    
    alert('User added successfully!');
  };

  const updateUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, role: newRole, permissions: getPermissionsByRole(newRole) }
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

    if (adminState.editingProfile.id === currentUser.id) {
      setCurrentUser(prev => ({ ...prev, name: profileEdit.name, email: profileEdit.email, avatar: profileEdit.avatar }));
    }

    setTemplates(prev => prev.map(template => 
      template.creatorId === adminState.editingProfile.id 
        ? { ...template, creator: profileEdit.name, creatorAvatar: profileEdit.avatar }
        : template
    ));

    setAdminState(prev => ({ ...prev, showProfileEditModal: false, editingProfile: null }));
    alert('Profile updated successfully!');
  };

  // Utility functions
  const canEditTemplateSettings = () => {
    return currentUser.role === 'admin' || currentUser.role === 'designer';
  };

  const handleUseTemplate = (template) => {
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
    
    setUsers(prev => prev.map(user => 
      user.id === currentUser.id 
        ? { ...user, templatesCreated: user.templatesCreated + 1 }
        : user
    ));
    
    setAnalytics(prev => ({
      ...prev,
      totalTemplates: prev.totalTemplates + 1
    }));
    
    alert('Template saved successfully!');
    setCurrentView('dashboard');
  };

  // Mouse move/up listeners
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

  // Click outside handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shapesMenuRef.current && !shapesMenuRef.current.contains(event.target)) {
        setShowShapesMenu(false);
      }
      
      if (editingProperty && propertyInputRef.current && !propertyInputRef.current.contains(event.target)) {
        finishPropertyEditing();
      }

      if (editingTextId && !event.target.closest('.text-editing')) {
        finishTextEditing();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingProperty, editingTextId]);

  // Double click handling
  useEffect(() => {
    const handleCanvasDoubleClick = (e) => {
      if (e.target === canvasRef.current) {
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

  // Auto-save
  useEffect(() => {
    if (!autoSave.enabled) return;
    
    const interval = setInterval(() => {
      setAutoSave(prev => ({ ...prev, lastSaved: new Date().toISOString() }));
    }, autoSave.interval);
    
    return () => clearInterval(interval);
  }, [autoSave.enabled, autoSave.interval]);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
          ${animationStyles}
        `}
      </style>
      {currentView === 'dashboard' && (
        <Dashboard
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          users={users}
          setUsers={setUsers}
          templates={templates}
          setTemplates={setTemplates}
          analytics={analytics}
          setAnalytics={setAnalytics}
          adminState={adminState}
          setAdminState={setAdminState}
          newUser={newUser}
          setNewUser={setNewUser}
          profileEdit={profileEdit}
          setProfileEdit={setProfileEdit}
          uploadModalOpen={uploadModalOpen}
          setUploadModalOpen={setUploadModalOpen}
          showPresetModal={showPresetModal}
          setShowPresetModal={setShowPresetModal}
          createNewTemplate={createNewTemplate}
          startProfileEdit={startProfileEdit}
          handleAvatarUpload={handleAvatarUpload}
          addNewUser={addNewUser}
          updateUserRole={updateUserRole}
          toggleUserStatus={toggleUserStatus}
          deleteUser={deleteUser}
          saveProfileEdit={saveProfileEdit}
        />
      )}
      {currentView === 'editor' && (
        <Editor
          currentView={currentView}
          setCurrentView={setCurrentView}
          editorState={editorState}
          setEditorState={setEditorState}
          currentUser={currentUser}
          templates={templates}
          setTemplates={setTemplates}
          users={users}
          setUsers={setUsers}
          analytics={analytics}
          setAnalytics={setAnalytics}
          history={history}
          setHistory={setHistory}
          historyIndex={historyIndex}
          setHistoryIndex={setHistoryIndex}
          undo={undo}
          redo={redo}
          addTextLayer={addTextLayer}
          addShapeLayer={addShapeLayer}
          addImageLayer={addImageLayer}
          updateLayer={updateLayer}
          deleteSelectedLayers={deleteSelectedLayers}
          duplicateSelectedLayers={duplicateSelectedLayers}
          toggleLock={toggleLock}
          toggleVisibility={toggleVisibility}
          groupLayers={groupLayers}
          ungroupLayers={ungroupLayers}
          bringToFront={bringToFront}
          sendToBack={sendToBack}
          bringForward={bringForward}
          sendBackward={sendBackward}
          alignLayers={alignLayers}
          saveTemplate={saveTemplate}
          startTextEditing={startTextEditing}
          finishTextEditing={finishTextEditing}
          startPropertyEditing={startPropertyEditing}
          finishPropertyEditing={finishPropertyEditing}
          editingProperty={editingProperty}
          setEditingProperty={setEditingProperty}
          handlePropertyKeyDown={handlePropertyKeyDown}
          editingTextId={editingTextId}
          setEditingTextId={setEditingTextId}
          textEditValue={textEditValue}
          setTextEditValue={setTextEditValue}
          showFloatingToolbar={showFloatingToolbar}
          floatingToolbarPosition={floatingToolbarPosition}
          setShowFloatingToolbar={setShowFloatingToolbar}
          updateFloatingToolbarPosition={updateFloatingToolbarPosition}
          canvasRef={canvasRef}
          fileInputRef={fileInputRef}
          textInputRef={textInputRef}
          propertyInputRef={propertyInputRef}
          shapesMenuRef={shapesMenuRef}
          showShapesMenu={showShapesMenu}
          setShowShapesMenu={setShowShapesMenu}
          handleCanvasMouseDown={handleCanvasMouseDown}
          handleLayerMouseDown={handleLayerMouseDown}
          handleResizeMouseDown={handleResizeMouseDown}
          handleRotateMouseDown={handleRotateMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          dragState={dragState}
          alignmentLines={alignmentLines}
          autoSave={autoSave}
          canEditTemplateSettings={canEditTemplateSettings}
          handleImageUpload={handleImageUpload}
        />
      )}
      {currentView === 'library' && (
        <Library
          templates={templates}
          setTemplates={setTemplates}
          currentUser={currentUser}
          setCurrentView={setCurrentView}
          onUseTemplate={handleUseTemplate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        />
      )}
      {uploadModalOpen && (
        <UploadModal
          uploadModalOpen={uploadModalOpen}
          setUploadModalOpen={setUploadModalOpen}
          uploadData={uploadData}
          setUploadData={setUploadData}
          handleFileUpload={handleFileUpload}
          handleUpload={handleUpload}
          handleUploadInputChange={handleUploadInputChange}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
        />
      )}
      {showPresetModal && (
        <TemplatePresetModal
          showPresetModal={showPresetModal}
          setShowPresetModal={setShowPresetModal}
          createFromPreset={createFromPreset}
        />
      )}
    </div>
  );
};

export default AdminApp;

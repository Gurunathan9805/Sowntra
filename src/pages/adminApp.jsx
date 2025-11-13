import React, { useState, useRef, useEffect } from 'react';
import { Upload, Plus, Search, Filter, Edit, Trash2, Eye, Folder, Tag, Image, Type, Square, Layers, Save, X, ChevronDown, Grid, List, Circle, Star, Triangle, Hexagon, Minus, Move, Lock, Unlock, Copy, AlignLeft, AlignCenter, AlignRight, RotateCw, ZoomIn, ZoomOut, Group, Ungroup, Bold, Italic, Underline, Download, Share, Settings, Menu, MousePointer, Hand, Grid as GridIcon, Ruler, DownloadCloud, Users, History, Clock, Zap, UserPlus, Mail, Phone, Crown, Shield, UserCheck, UserX, Camera } from 'lucide-react';
import Dashboard from '../admin-components/Dashboard';
import Library from '../admin-components/Library';
import SafeEditor from '../admin-components/SafeEditor';
import { UploadModal, TemplatePresetModal } from '../admin-components/TemplateModals';
import { animationStyles, CATEGORIES, FONT_FAMILIES, ANIMATIONS, EFFECTS, GRADIENTS, TEMPLATE_PRESETS, USER_ROLES } from '../admin-components/constants';
import { generateId, getEffectStyle, getAnimationClass, getGroupBounds, renderShape, wrapText, getPermissionsByRole } from '../admin-components/helpers';

// Import API services - FIXED IMPORTS
import { templateService } from '../services/template';
import { categoryService } from '../services/category'; // Changed from CategoryService to categoryService
import { favoriteService } from '../services/favorite';
import { subscriptionService } from '../services/subscription';

const AdminApp = () => {
  // View state
  const [currentView, setCurrentView] = useState('dashboard');

  // Template state - Now loaded from API
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // User state
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTemplates: 0,
    totalViews: 0,
    templateUses: 0,
    userGrowth: 0,
    viewGrowth: 0,
    usageGrowth: 0
  });

  // Editor state
  const [editorState, setEditorState] = useState({
    name: 'Untitled Template',
    category: '',
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
    category: '',
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

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('Starting to load initial data...');
      // Load templates
      let templatesData = [];
      try {
      console.log('Loading templates from API...');
      templatesData = await templateService.getAllTemplates();
      console.log('Templates loaded:', templatesData);
      setTemplates(templatesData);
    } catch (templateError) {
      console.error('Failed to load templates:', templateError);
      // Set empty templates if API fails
      setTemplates([]);
    }

      // Load categories - ADDED ERROR HANDLING
      let categoriesData = [];
      try {
        categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.warn('Failed to load categories, using defaults:', error);
        // Set default categories if API fails
        categoriesData = [
          { id: '1', name: 'Social Media' },
          { id: '2', name: 'Business' },
          { id: '3', name: 'Marketing' }
        ];
        setCategories(categoriesData);
      }
      
      // Set default category if available
      if (categoriesData.length > 0) {
        setUploadData(prev => ({ ...prev, category: categoriesData[0].id }));
      }

      // Load analytics
      await loadAnalytics();

      // Load current user (mock for now - replace with actual user API)
      const mockCurrentUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'admin',
        joinDate: '2024-01-15',
        templatesCreated: templatesData.length,
        lastActive: new Date().toISOString(),
        status: 'active',
        permissions: ['all']
      };
      setCurrentUser(mockCurrentUser);
      setUsers([mockCurrentUser]);

    } catch (error) {
      console.error('Failed to load initial data:', error);
      alert('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      // Load popular templates for analytics
      const popularTemplates = await templateService.getPopularTemplates(10);
      
      // Calculate totals
      const totalStats = popularTemplates.reduce(
        (acc, template) => ({
          views: acc.views + (template.viewCount || 0),
          downloads: acc.downloads + (template.downloadCount || 0),
          usage: acc.usage + (template.usageCount || 0),
        }),
        { views: 0, downloads: 0, usage: 0 }
      );

      setAnalytics(prev => ({
        ...prev,
        totalTemplates: templates.length,
        totalViews: totalStats.views,
        templateUses: totalStats.usage,
        totalUsers: users.length
      }));

    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  // ========== ALL THE EXISTING FUNCTIONS REMAIN THE SAME ==========
  // Template creation
  const createNewTemplate = () => {
    if (currentUser?.role === 'viewer') {
      alert('Viewers cannot create templates. Please contact an administrator.');
      return;
    }
    setShowPresetModal(true);
  };

  // Layer management functions
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

  // Layer ordering
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

  // History management
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

  // Text editing
  const startTextEditing = (layer) => {
    if (layer.type === 'text' && !layer.locked) {
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

    // Handle dragging, resizing, rotating...
    // (Implementation details would go here)
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

  // Image upload
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

  // Drag and drop handlers
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

  // File upload handler
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

  // Upload input handler
  const handleUploadInputChange = (field, value) => {
    setUploadData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Template creation from preset
  const createFromPreset = (preset) => {
    const newState = {
      name: preset.name,
      category: categories[0]?.id || '',
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

  // API-integrated template functions
  const handleUpload = async () => {
    if (!uploadData.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    try {
      const templateData = {
        title: uploadData.name,
        categoryId: uploadData.category,
        thumbnail: uploadData.thumbnail || `https://via.placeholder.com/300x200/f59e0b/ffffff?text=${encodeURIComponent(uploadData.name)}`,
        data: { layers: [], assets: [] }, // Empty template data
        type: uploadData.isPremium ? 'premium' : 'freemium',
        tags: uploadData.tags.split(',').map(t => t.trim()).filter(t => t),
        isPublished: true
      };

      const newTemplate = await templateService.createTemplate(templateData);
      
      // Update local state
      setTemplates(prev => [newTemplate, ...prev]);
      
      setUploadModalOpen(false);
      alert('Template uploaded successfully!');
      
      // Reset form
      setUploadData({ 
        name: '', 
        category: categories[0]?.id || '', 
        tags: '', 
        visibility: 'public',
        files: null,
        isDragging: false,
        thumbnail: null,
        isPremium: false
      });

    } catch (error) {
      console.error('Failed to upload template:', error);
      alert('Failed to upload template. Please try again.');
    }
  };

  const saveTemplate = async () => {
    if (!editorState.name.trim()) {
      alert('Please enter a template name before saving.');
      return;
    }

    try {
      const templateData = {
        title: editorState.name,
        categoryId: editorState.category,
        thumbnail: `https://via.placeholder.com/300x200/10b981/ffffff?text=${encodeURIComponent(editorState.name)}`,
        data: {
          background: editorState.background,
          layers: editorState.layers,
          canvasWidth: editorState.canvasWidth,
          canvasHeight: editorState.canvasHeight
        },
        type: editorState.templateType || 'freemium',
        tags: editorState.tags.split(',').map(t => t.trim()).filter(t => t),
        isPublished: true
      };

      const newTemplate = await templateService.createTemplate(templateData);
      
      // Update local state
      setTemplates(prev => [newTemplate, ...prev]);
      
      // Update user stats
      if (currentUser) {
        setUsers(prev => prev.map(user => 
          user.id === currentUser.id 
            ? { ...user, templatesCreated: user.templatesCreated + 1 }
            : user
        ));
      }
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        totalTemplates: prev.totalTemplates + 1
      }));
      
      alert('Template saved successfully!');
      setCurrentView('dashboard');

    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    }
  };

  const handleUseTemplate = async (template) => {
    if (currentUser?.role === 'viewer') {
      alert('Viewers can only view templates. Please contact an administrator for edit access.');
      return;
    }
    
    try {
      // Record template usage
      await templateService.useTemplate(template.id);
      
      // Load template data into editor
      const templateDetail = await templateService.getTemplateById(template.id);
      
      setEditorState({
        name: template.title + ' (Copy)',
        category: template.categoryId,
        tags: template.tags?.join(', ') || '',
        visibility: 'public',
        background: templateDetail.data?.background || { type: 'solid', color: '#ffffff' },
        layers: templateDetail.data?.layers || [],
        selectedLayerIds: [],
        zoom: 100,
        canvasWidth: templateDetail.data?.canvasWidth || 1080,
        canvasHeight: templateDetail.data?.canvasHeight || 1080,
        showGrid: false,
        showRulers: true,
        activeTool: 'select'
      });
      
      setHistory([JSON.parse(JSON.stringify(editorState))]);
      setHistoryIndex(0);
      setCurrentView('editor');
      
    } catch (error) {
      console.error('Failed to use template:', error);
      alert('Failed to load template. Please try again.');
    }
  };

  const deleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await templateService.deleteTemplate(templateId);
        setTemplates(prev => prev.filter(t => t.id !== templateId));
        alert('Template deleted successfully!');
      } catch (error) {
        console.error('Failed to delete template:', error);
        alert('Failed to delete template. Please try again.');
      }
    }
  };

  const handleDownloadTemplate = async (templateId) => {
    try {
      await templateService.downloadTemplate(templateId);
      alert('Template download recorded!');
    } catch (error) {
      console.error('Failed to record download:', error);
    }
  };

  // Category management
  const handleCreateCategory = async (categoryData) => {
    try {
      const newCategory = await categoryService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  };

  // Favorite management
  const handleAddToFavorites = async (templateId) => {
    try {
      await favoriteService.addToFavorites(templateId);
      // Update template favorite status in local state if needed
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  };

  const handleRemoveFromFavorites = async (templateId) => {
    try {
      await favoriteService.removeFromFavorites(templateId);
      // Update template favorite status in local state if needed
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  };

  // Batch operations
  const handleBatchDeleteTemplates = async (templateIds) => {
    if (templateIds.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${templateIds.length} templates?`)) {
      try {
        await templateService.batchDeleteTemplates(templateIds);
        setTemplates(prev => prev.filter(t => !templateIds.includes(t.id)));
        alert(`${templateIds.length} templates deleted successfully!`);
      } catch (error) {
        console.error('Failed to batch delete templates:', error);
        alert('Failed to delete templates. Please try again.');
      }
    }
  };

  // User management functions (placeholder implementations)
  const startProfileEdit = (user) => {
    setProfileEdit({
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
    setAdminState(prev => ({ ...prev, editingProfile: user, showProfileEditModal: true }));
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
    if (userId === currentUser?.id) {
      alert('You cannot delete your own account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('User deleted successfully');
    }
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

    if (adminState.editingProfile.id === currentUser?.id) {
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

  // Utility function
  const canEditTemplateSettings = () => {
    return currentUser?.role === 'admin' || currentUser?.role === 'designer';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
      </div>
    </div>
  );
}

// Add a safety check before rendering
if (!currentUser) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load user data</h3>
        <p className="text-gray-600 mb-4">Please check your connection and try again.</p>
        <button 
          onClick={loadInitialData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

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
          categories={categories}
          onCreateCategory={handleCreateCategory}
          onDeleteTemplate={deleteTemplate}
          onBatchDeleteTemplates={handleBatchDeleteTemplates}
        />
      )}
      
      {currentView === 'editor' && (
  <SafeEditor
    editorState={editorState}
    setEditorState={setEditorState}
    saveTemplate={saveTemplate}
    fileInputRef={fileInputRef}
    handleImageUpload={handleImageUpload}
    setCurrentView={setCurrentView}
    addTextLayer={addTextLayer}
    addShapeLayer={addShapeLayer}
  />
)}
      
      {currentView === 'library' && (
        <Library
          templates={templates}
          setTemplates={setTemplates}
          currentUser={currentUser}
          setCurrentView={setCurrentView}
          onUseTemplate={handleUseTemplate}
          onDownloadTemplate={handleDownloadTemplate}
          onDeleteTemplate={deleteTemplate}
          onAddToFavorites={handleAddToFavorites}
          onRemoveFromFavorites={handleRemoveFromFavorites}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
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
          categories={categories}
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
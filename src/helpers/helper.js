import { useRef, useState } from "react";

const Editor = () => {
  // ====== REFS ======
  const canvasRef = useRef(null);
  const propertyInputRef = useRef(null);
  const textInputRef = useRef(null);

  // ====== STATES ======
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [alignmentLines, setAlignmentLines] = useState({ vertical: [], horizontal: [] });
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const [editingTextId, setEditingTextId] = useState(null);
  const [textEditValue, setTextEditValue] = useState('');
  const [editingProperty, setEditingProperty] = useState(null);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState({ x: 0, y: 0 });
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [autoSave, setAutoSave] = useState({
    enabled: true,
    interval: 30000,
    lastSaved: null,
  });

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
    snapToGrid: true,
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
    startAngle: 0,
  });

  // ====== HELPER FUNCTIONS ======
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

  // ====== LAYER ORDERING ======
  const bringToFront = (id) => {
    const newLayers = [...editorState.layers];
    const layerIndex = newLayers.findIndex((l) => l.id === id);
    if (layerIndex !== -1) {
      const maxZ = Math.max(...newLayers.map((l) => l.zIndex || 0), 0);
      newLayers[layerIndex] = { ...newLayers[layerIndex], zIndex: maxZ + 1 };
      const newState = { ...editorState, layers: newLayers };
      setEditorState(newState);
      addToHistory(newState);
    }
  };

  const sendToBack = (id) => {
    const newLayers = [...editorState.layers];
    const layerIndex = newLayers.findIndex((l) => l.id === id);
    if (layerIndex !== -1) {
      const minZ = Math.min(...newLayers.map((l) => l.zIndex || 0), 0);
    newLayers[layerIndex] = { ...newLayers[layerIndex], zIndex: minZ - 1 };
      const newState = { ...editorState, layers: newLayers };
      setEditorState(newState);
      addToHistory(newState);
    }
  };

  // ====== PROPERTY EDITING ======
  const startPropertyEditing = (path, value, type = 'number') => {
    setEditingProperty({ path, value, type });
    setTimeout(() => {
      propertyInputRef.current?.focus();
      propertyInputRef.current?.select();
    }, 10);
  };

  const finishPropertyEditing = () => {
    if (!editingProperty) return;
    const { path, value, type } = editingProperty;
    if (path.startsWith('layer.')) {
      const [, layerId, prop] = path.split('.');
      updateLayer(layerId, { [prop]: type === 'number' ? parseFloat(value) || 0 : value });
    }
    setEditingProperty(null);
  };

  // ====== LAYER OPERATIONS ======
  const updateLayer = (id, updates) => {
    const newLayers = editorState.layers.map((l) => (l.id === id ? { ...l, ...updates } : l));
    const newState = { ...editorState, layers: newLayers };
    setEditorState(newState);
  };

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
      color: '#000000',
      zIndex: editorState.layers.length,
    };
    const newState = {
      ...editorState,
      layers: [...editorState.layers, newLayer],
      selectedLayerIds: [newLayer.id],
    };
    setEditorState(newState);
    addToHistory(newState);
  };

  const addImageLayer = (src) => {
    const newLayer = {
      id: generateId(),
      type: 'image',
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      src,
      zIndex: editorState.layers.length,
    };
    const newState = {
      ...editorState,
      layers: [...editorState.layers, newLayer],
      selectedLayerIds: [newLayer.id],
    };
    setEditorState(newState);
    addToHistory(newState);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => addImageLayer(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ====== TEXT EDITING ======
  const startTextEditing = (layer) => {
    if (layer.locked) return;
    setEditingTextId(layer.id);
    setTextEditValue(layer.content);
    setTimeout(() => textInputRef.current?.focus(), 50);
  };

  const finishTextEditing = () => {
    if (editingTextId) {
      updateLayer(editingTextId, { content: textEditValue });
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

};

export default Editor;

import { useState, useRef } from "react";

export const useCanvasHandlers = () => {
  // ==================== STATE ====================
  const [alignmentLines, setAlignmentLines] = useState({ vertical: [], horizontal: [] });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState({ x: 0, y: 0 });
  const [editingTextId, setEditingTextId] = useState(null);
 
  const [autoSave, setAutoSave] = useState({
    enabled: true,
    interval: 30000,
    lastSaved: null,
  });

  const [editorState, setEditorState] = useState({
    name: "Untitled Template",
    category: "Social Media",
    tags: "",
    visibility: "public",
    background: { type: "solid", color: "#ffffff" },
    layers: [],
    selectedLayerIds: [],
    zoom: 100,
    canvasWidth: 1080,
    canvasHeight: 1080,
    showGrid: true,
    showRulers: true,
    activeTool: "select",
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

  const canvasRef = useRef(null);
  const propertyInputRef = useRef(null);
  const textInputRef = useRef(null);

  // ==================== HELPERS ====================
  const updateLayer = (id, updates) => {
    setEditorState(prev => ({
      ...prev,
      layers: prev.layers.map(l => (l.id === id ? { ...l, ...updates } : l)),
    }));
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
      height: Math.max(...y2s) - Math.min(...ys),
    };
  };

  const updateFloatingToolbarPosition = () => {
    if (editorState.selectedLayerIds.length > 0) {
      const selectedLayers = editorState.layers.filter(l => editorState.selectedLayerIds.includes(l.id));
      const bounds = getGroupBounds(selectedLayers);
      setFloatingToolbarPosition({ x: bounds.x + bounds.width / 2, y: bounds.y - 60 });
      setShowFloatingToolbar(true);
    } else {
      setShowFloatingToolbar(false);
    }
  };

  const addToHistory = (newState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newState)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // ==================== MOUSE HANDLERS ====================
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
      const groupLayer = editorState.layers.find((l) => l.id === layer.groupId);
      if (groupLayer) layersToSelect = [groupLayer.id];
    }

    setEditorState((prev) => {
      if (!e.shiftKey) {
        return { ...prev, selectedLayerIds: layersToSelect };
      } else {
        const alreadySelected = prev.selectedLayerIds.includes(layersToSelect[0]);
        return {
          ...prev,
          selectedLayerIds: alreadySelected
            ? prev.selectedLayerIds.filter((id) => !layersToSelect.includes(id))
            : [...prev.selectedLayerIds, ...layersToSelect],
        };
      }
    });

    const targetLayer =
      layersToSelect[0] === layer.id
        ? layer
        : editorState.layers.find((l) => l.id === layersToSelect[0]);

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
        startRotation: targetLayer.rotation,
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
      startRotation: layer.rotation,
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
      startAngle,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragState.isDragging && !dragState.isResizing && !dragState.isRotating)
      return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scale = editorState.zoom / 100;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // ================= DRAG =================
    if (dragState.isDragging) {
      const deltaX = x - dragState.startX;
      const deltaY = y - dragState.startY;
      const newLayers = [...editorState.layers];

      editorState.selectedLayerIds.forEach((id) => {
        const i = newLayers.findIndex((l) => l.id === id);
        if (i === -1) return;
        const layer = newLayers[i];
        let newX = dragState.startLayerX + deltaX;
        let newY = dragState.startLayerY + deltaY;

        newX = Math.max(0, Math.min(newX, editorState.canvasWidth - layer.width));
        newY = Math.max(0, Math.min(newY, editorState.canvasHeight - layer.height));

        if (layer.type === "group") {
          newLayers[i] = { ...layer, x: newX, y: newY };
          layer.children.forEach((cid) => {
            const ci = newLayers.findIndex((l) => l.id === cid);
            if (ci !== -1) {
              const child = newLayers[ci];
              const relX = child.x - dragState.startLayerX;
              const relY = child.y - dragState.startLayerY;
              newLayers[ci] = {
                ...child,
                x: newX + relX,
                y: newY + relY,
              };
            }
          });
        } else {
          newLayers[i] = { ...layer, x: newX, y: newY };
        }
      });

      setEditorState((prev) => ({ ...prev, layers: newLayers }));
    }

    // ================= ROTATE =================
    else if (dragState.isRotating) {
      const layer = editorState.layers.find(
        (l) => editorState.selectedLayerIds[0] === l.id
      );
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
      startY: 0,
    });
    setAlignmentLines({ vertical: [], horizontal: [] });
  };

  // ==================== RETURN EVERYTHING ====================
  return {
    canvasRef,
    propertyInputRef,
    textInputRef,
    editorState,
    dragState,
    alignmentLines,
    floatingToolbarPosition,
    showFloatingToolbar,
    handleCanvasMouseDown,
    handleLayerMouseDown,
    handleResizeMouseDown,
    handleRotateMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

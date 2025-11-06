import React, { useCallback } from 'react';
import { 
  textEffects, 
  imageEffects, 
  supportedLanguages, 
  specialEffects, 
  stickerOptions, 
  filterOptions, 
  animations, 
  shapeEffects 
} from '../types/types.js'; // ADD MISSING IMPORTS

export const useElementOperations = ({
  pages,
  currentPage,
  setPages,
  setCurrentPage,
  selectedElement,
  setSelectedElement,
  selectedElements,
  setSelectedElements,
  lockedElements,
  setLockedElements,
  history,
  setHistory,
  historyIndex,
  setHistoryIndex,
  currentTool,
  setCurrentTool,
  isDrawing,
  setIsDrawing,
  drawingPath,
  setDrawingPath,
  textEditing,
  setTextEditing,
  showAlignmentLines,
  setShowAlignmentLines,
  alignmentLines,
  setAlignmentLines,
  isDragging,
  setIsDragging,
  isResizing,
  setIsResizing,
  isRotating,
  setIsRotating,
  isPanning,
  setIsPanning,
  dragStart,
  setDragStart,
  canvasRef,
  zoomLevel,
  canvasOffset,
  setCanvasOffset,
  snapToGrid,
  currentLanguage,
  textDirection,
  t,
  setIsPlaying,
  canvasSize
}) => {
  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Get current page elements
  const getCurrentPageElements = useCallback(() => {
    const page = pages.find(p => p.id === currentPage);
    return page ? page.elements : [];
  }, [pages, currentPage]);

  // Set current page elements
  const setCurrentPageElements = useCallback((newElements) => {
    setPages(pages.map(page => 
      page.id === currentPage ? { ...page, elements: newElements } : page
    ));
  }, [pages, currentPage, setPages]);

  // Save to history
  const saveToHistory = useCallback((newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(newElements));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, setHistory, setHistoryIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevElements = JSON.parse(history[historyIndex - 1]);
      setCurrentPageElements(prevElements);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setCurrentPageElements, setHistoryIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextElements = JSON.parse(history[historyIndex + 1]);
      setCurrentPageElements(nextElements);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setCurrentPageElements, setHistoryIndex]);

  // Add element to canvas
// Add element to canvas
const addElement = useCallback((type, properties = {}) => {
  const currentElements = getCurrentPageElements();
  const newElement = {
    id: generateId(),
    type,
    x: 100,
    y: 100,
    width: type === 'text' ? 300 : type === 'line' ? 150 : 100,
    height: type === 'text' ? 100 : type === 'line' ? 2 : 100,
    rotation: 0,
    animation: null,
    zIndex: currentElements.length,
    locked: false,
    filters: JSON.parse(JSON.stringify(filterOptions)),
    // FIXED: Set default fill to transparent for hollow shapes
    fill: properties.fill || (type === 'image' ? 'transparent' : 
                            type === 'line' ? '#000000' : 
                            type === 'arrow' ? '#000000' : 
                            type === 'text' ? '#000000' : 'transparent'),
    stroke: properties.stroke || '#000000',
    strokeWidth: properties.strokeWidth || 2,
    fillType: properties.fillType || 'solid',
    gradient: properties.gradient || {
      type: 'linear',
      colors: ['#3b82f6', '#ef4444'],
      stops: [0, 100],
      angle: 90,
      position: { x: 50, y: 50 }
    },
    textEffect: 'none',
    imageEffect: 'none',
    shapeEffect: 'none',
    specialEffect: 'none',
    effectSettings: {},
    borderRadius: properties.borderRadius || 0,
    shadow: properties.shadow || null,
    ...properties
  };

  if (type === 'text') {
    newElement.content = t('text.doubleClickToEdit');
    newElement.fontSize = 24;
    newElement.fontFamily = supportedLanguages[currentLanguage]?.font || 'Arial';
    newElement.fontWeight = 'normal';
    newElement.fontStyle = 'normal';
    newElement.textDecoration = 'none';
    newElement.color = '#000000';
    newElement.textAlign = textDirection === 'rtl' ? 'right' : 'left';
    // FIXED: Text should have transparent background
    newElement.fill = 'transparent';
  } else if (type === 'rectangle') {
    newElement.borderRadius = properties.borderRadius || 0;
  } else if (type === 'image') {
    newElement.src = properties.src || '';
    newElement.borderRadius = properties.borderRadius || 0;
    newElement.stroke = properties.stroke || 'transparent';
    newElement.strokeWidth = properties.strokeWidth || 0;
    // FIXED: Images should have transparent fill
    newElement.fill = 'transparent';
  } else if (type === 'line') {
    // Line specific properties
    newElement.fill = '#000000';
  } else if (type === 'arrow') {
    newElement.fill = '#000000';
  } else if (type === 'star') {
    newElement.points = 5;
  } else if (type === 'drawing') {
    newElement.stroke = '#000000';
    newElement.strokeWidth = 3;
    newElement.path = properties.path || [];
    // FIXED: Drawings should have transparent fill
    newElement.fill = 'transparent';
  } else if (type === 'sticker') {
    newElement.sticker = properties.sticker || 'smile';
    newElement.fill = properties.fill || '#f59e0b';
    newElement.width = 80;
    newElement.height = 80;
  }

  const newElements = [...currentElements, newElement];
  setCurrentPageElements(newElements);
  setSelectedElement(newElement.id);
  setSelectedElements(new Set([newElement.id]));
  setCurrentTool('select');
  saveToHistory(newElements);
}, [getCurrentPageElements, setCurrentPageElements, saveToHistory, currentLanguage, textDirection, t, setSelectedElement, setSelectedElements, setCurrentTool, generateId]);

  // Update element properties
  const updateElement = useCallback((id, updates) => {
    const currentElements = getCurrentPageElements();
    const newElements = currentElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setCurrentPageElements(newElements);
    saveToHistory(newElements);
  }, [getCurrentPageElements, setCurrentPageElements, saveToHistory]);

  // Delete element
  const deleteElement = useCallback((id) => {
    if (lockedElements.has(id)) return;
    
    const currentElements = getCurrentPageElements();
    const newElements = currentElements.filter(el => el.id !== id);
    setCurrentPageElements(newElements);
    if (selectedElement === id) setSelectedElement(null);
    const newSelected = new Set(selectedElements);
    newSelected.delete(id);
    setSelectedElements(newSelected);
    saveToHistory(newElements);
  }, [lockedElements, getCurrentPageElements, setCurrentPageElements, selectedElement, selectedElements, saveToHistory, setSelectedElement, setSelectedElements]);

  // Duplicate element
  const duplicateElement = useCallback((id) => {
    if (lockedElements.has(id)) return;
    
    const currentElements = getCurrentPageElements();
    const element = currentElements.find(el => el.id === id);
    if (element) {
      const duplicated = {
        ...element,
        id: generateId(),
        x: element.x + 20,
        y: element.y + 20,
        zIndex: currentElements.length
      };
      const newElements = [...currentElements, duplicated];
      setCurrentPageElements(newElements);
      setSelectedElement(duplicated.id);
      setSelectedElements(new Set([duplicated.id]));
      saveToHistory(newElements);
    }
  }, [lockedElements, getCurrentPageElements, setCurrentPageElements, saveToHistory, setSelectedElement, setSelectedElements, generateId]);

  // Play animations for all elements
const playAnimations = useCallback(() => {
  setIsPlaying(true);
  const currentElements = getCurrentPageElements();
  
  currentElements.forEach((element, index) => {
    if (element.animation && animations[element.animation]) {
      const elementDOM = document.getElementById(`element-${element.id}`);
      if (elementDOM) {
        // Reset animation first
        elementDOM.style.animation = 'none';
        
        // Apply animation after a small delay for sequencing
        setTimeout(() => {
          const animationName = animations[element.animation].keyframes;
          elementDOM.style.animation = `${animationName} 1s ease-out forwards`;
        }, index * 200); // Stagger animations
      }
    }
  });
  
  // Reset playing state after animations complete
  setTimeout(() => {
    setIsPlaying(false);
  }, currentElements.length * 200 + 1000);
}, [getCurrentPageElements, setIsPlaying]);

// Reset all animations
const resetAnimations = useCallback(() => {
  const currentElements = getCurrentPageElements();
  
  currentElements.forEach(element => {
    const elementDOM = document.getElementById(`element-${element.id}`);
    if (elementDOM) {
      elementDOM.style.animation = 'none';
    }
  });
  
  setIsPlaying(false);
}, [getCurrentPageElements, setIsPlaying]);

// Update element animation
const updateElementAnimation = useCallback((elementId, animationName) => {
  updateElement(elementId, { animation: animationName });
}, [updateElement]);

// Remove animation from element
const removeElementAnimation = useCallback((elementId) => {
  updateElement(elementId, { animation: null });
}, [updateElement]);

  // Toggle element lock
  const toggleElementLock = useCallback((id) => {
    const newLocked = new Set(lockedElements);
    if (newLocked.has(id)) {
      newLocked.delete(id);
      updateElement(id, { locked: false });
    } else {
      newLocked.add(id);
      updateElement(id, { locked: true });
    }
    setLockedElements(newLocked);
  }, [lockedElements, updateElement, setLockedElements]);

  // Update filter value
  const updateFilter = useCallback((elementId, filterName, value) => {
    const currentElements = getCurrentPageElements();
    const element = currentElements.find(el => el.id === elementId);
    if (element) {
      const updatedFilters = { ...element.filters };
      if (updatedFilters[filterName]) {
        updatedFilters[filterName] = { ...updatedFilters[filterName], value };
        updateElement(elementId, { filters: updatedFilters });
      }
    }
  }, [getCurrentPageElements, updateElement]);

  // Get filter CSS string
  const getFilterCSS = useCallback((filters) => {
    if (!filters) return '';
    return Object.entries(filters)
      .map(([key, filter]) => {
        if ((filter && filter.value > 0) || (key === 'opacity' && filter.value < 100)) {
          return `${key}(${filter.value}${filter.unit})`;
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  }, []);

  // Get background style
  const getBackgroundStyle = useCallback((element) => {
    if (!element) return '#3b82f6';
    
    if (element.fillType !== 'gradient' || !element.gradient) {
      return element.fill || '#3b82f6';
    }
    
    const grad = element.gradient;
    
    if (!grad.colors || !Array.isArray(grad.colors) || grad.colors.length === 0) {
      return element.fill || '#3b82f6';
    }
    
    const validColors = grad.colors.filter(color => 
      color && typeof color === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(color)
    );
    
    if (validColors.length === 0) {
      return element.fill || '#3b82f6';
    }
    
    const validStops = grad.stops || [];
    const stops = [];
    
    for (let i = 0; i < validColors.length; i++) {
      if (validStops[i] !== undefined && validStops[i] !== null) {
        stops[i] = Math.max(0, Math.min(100, parseInt(validStops[i]) || 0));
      } else {
        if (validColors.length === 1) {
          stops[i] = 0;
        } else {
          stops[i] = i === 0 ? 0 : (i === validColors.length - 1 ? 100 : Math.round((i / (validColors.length - 1)) * 100));
        }
      }
    }
    
    const colorStopPairs = validColors.map((color, i) => ({
      color,
      stop: stops[i] || 0
    })).sort((a, b) => a.stop - b.stop);
    
    const colorStops = colorStopPairs.map(pair => 
      `${pair.color} ${pair.stop}%`
    ).join(', ');
    
    if (grad.type === 'radial') {
      const posX = (grad.position && grad.position.x !== undefined) ? grad.position.x : 50;
      const posY = (grad.position && grad.position.y !== undefined) ? grad.position.y : 50;
      return `radial-gradient(circle at ${posX}% ${posY}%, ${colorStops})`;
    } else {
      const angle = (grad.angle !== undefined && grad.angle !== null) ? grad.angle : 90;
      return `linear-gradient(${angle}deg, ${colorStops})`;
    }
  }, []);

  // Get canvas-compatible gradient for export
  const getCanvasGradient = useCallback((ctx, element) => {
    if (!element || element.fillType !== 'gradient' || !element.gradient) {
      return element.fill || '#3b82f6';
    }
    
    const grad = element.gradient;
    
    if (!grad.colors || !Array.isArray(grad.colors) || grad.colors.length === 0) {
      return element.fill || '#3b82f6';
    }
    
    const validColors = grad.colors.filter(color => 
      color && typeof color === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(color)
    );
    
    if (validColors.length === 0) {
      return element.fill || '#3b82f6';
    }
    
    const validStops = grad.stops || [];
    const stops = [];
    
    for (let i = 0; i < validColors.length; i++) {
      if (validStops[i] !== undefined && validStops[i] !== null) {
        stops[i] = Math.max(0, Math.min(100, parseInt(validStops[i]) || 0)) / 100;
      } else {
        if (validColors.length === 1) {
          stops[i] = 0;
        } else {
          stops[i] = i === 0 ? 0 : (i === validColors.length - 1 ? 1 : i / (validColors.length - 1));
        }
      }
    }
    
    let canvasGradient;
    
    if (grad.type === 'radial') {
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      const radius = Math.max(element.width, element.height) / 2;
      
      canvasGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    } else {
      const angle = (grad.angle !== undefined && grad.angle !== null) ? grad.angle : 90;
      const angleRad = (angle - 90) * Math.PI / 180;
      
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      const length = Math.max(element.width, element.height);
      
      const x1 = centerX - Math.cos(angleRad) * length / 2;
      const y1 = centerY - Math.sin(angleRad) * length / 2;
      const x2 = centerX + Math.cos(angleRad) * length / 2;
      const y2 = centerY + Math.sin(angleRad) * length / 2;
      
      canvasGradient = ctx.createLinearGradient(x1, y1, x2, y2);
    }
    
    validColors.forEach((color, i) => {
      canvasGradient.addColorStop(stops[i], color);
    });
    
    return canvasGradient;
  }, []);

  // Get canvas-compatible effects
  const getCanvasEffects = useCallback((element) => {
    const effects = {
      shadow: {},
      filters: ''
    };
    
    if (element.type === 'text' && element.textEffect && element.textEffect !== 'none') {
      switch(element.textEffect) { // FIXED: changed from textEffects to textEffect
        case 'shadow':
          effects.shadow = {
            color: 'rgba(0,0,0,0.5)',
            blur: 4,
            offsetX: 2,
            offsetY: 2
          };
          break;
        case 'lift':
          effects.shadow = {
            color: 'rgba(0,0,0,0.3)',
            blur: 8,
            offsetX: 0,
            offsetY: 4
          };
          break;
        case 'neon':
          effects.shadow = {
            color: '#ff00de',
            blur: 10,
            offsetX: 0,
            offsetY: 0
          };
          break;
        default:
          effects.shadow = undefined;
          break;
      }
    }
    
    if (element.type === 'image' && element.imageEffect && element.imageEffect !== 'none') {
      const effect = imageEffects[element.imageEffect];
      if (effect && effect.filter) {
        effects.filters += ' ' + effect.filter;
      }
    }
    
    if (['rectangle', 'circle', 'triangle', 'star', 'hexagon'].includes(element.type) && 
        element.shapeEffect && element.shapeEffect !== 'none') {
      switch(element.shapeEffect) { // FIXED: changed from shapeEffects to shapeEffect
        case 'shadow':
          effects.shadow = {
            color: 'rgba(0,0,0,0.3)',
            blur: 8,
            offsetX: 4,
            offsetY: 4
          };
          break;
        case 'glow':
          effects.shadow = {
            color: 'rgba(255,255,255,0.8)',
            blur: 10,
            offsetX: 0,
            offsetY: 0
          };
          break;
        default:
          effects.shadow = undefined;
          break;
      }
    }
    
    return effects;
  }, [imageEffects]);

  // Get effect CSS for an element
  const getEffectCSS = useCallback((element) => {
    let effectCSS = '';
    
    if (element.type === 'text' && element.textEffect && element.textEffect !== 'none') {
      effectCSS += textEffects[element.textEffect]?.css || '';
    }
    
    if (element.type === 'image' && element.imageEffect && element.imageEffect !== 'none') {
      effectCSS += imageEffects[element.imageEffect]?.filter ? `filter: ${imageEffects[element.imageEffect].filter};` : '';
    }
    
    if (['rectangle', 'circle', 'triangle', 'star', 'hexagon'].includes(element.type) && 
        element.shapeEffect && element.shapeEffect !== 'none') {
      effectCSS += shapeEffects[element.shapeEffect]?.css || '';
    }
    
    if (element.specialEffect && element.specialEffect !== 'none') {
      effectCSS += specialEffects[element.specialEffect]?.css || '';
    }
    
    return effectCSS;
  }, [textEffects, imageEffects, shapeEffects, specialEffects]);

  // Group selected elements
  const groupElements = useCallback(() => {
    const currentElements = getCurrentPageElements();
    if (selectedElements.size < 2) return;
    
    const groupId = generateId();
    const selectedIds = Array.from(selectedElements);
    const selectedEls = currentElements.filter(el => selectedIds.includes(el.id));
    
    const minX = Math.min(...selectedEls.map(el => el.x));
    const minY = Math.min(...selectedEls.map(el => el.y));
    const maxX = Math.max(...selectedEls.map(el => el.x + el.width));
    const maxY = Math.max(...selectedEls.map(el => el.y + el.height));
    
    const group = {
      id: groupId,
      type: 'group',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      rotation: 0,
      children: selectedIds,
      zIndex: currentElements.length,
      fill: 'transparent',
      stroke: '#8b5cf6',
      strokeWidth: 2,
      strokeDasharray: '5,5'
    };
    
    const updatedElements = currentElements.map(el => {
      if (selectedIds.includes(el.id)) {
        return {
          ...el,
          groupId,
          relativeX: el.x - minX,
          relativeY: el.y - minY,
          relativeRotation: el.rotation || 0
        };
      }
      return el;
    });
    
    const newElements = [...updatedElements, group];
    setCurrentPageElements(newElements);
    setSelectedElement(groupId);
    setSelectedElements(new Set([groupId]));
    saveToHistory(newElements);
  }, [getCurrentPageElements, selectedElements, setCurrentPageElements, saveToHistory, setSelectedElement, setSelectedElements, generateId]);

  // Ungroup elements
  const ungroupElements = useCallback((groupId) => {
    const currentElements = getCurrentPageElements();
    const group = currentElements.find(el => el.id === groupId);
    if (!group || group.type !== 'group') return;
    
    const updatedElements = currentElements.map(el => {
      if (el.groupId === groupId) {
        const { groupId: _, relativeX, relativeY, relativeRotation, ...rest } = el;
        return {
          ...rest,
          x: group.x + (relativeX || 0),
          y: group.y + (relativeY || 0),
          rotation: (group.rotation || 0) + (relativeRotation || 0)
        };
      }
      return el;
    }).filter(el => el.id !== groupId);
    
    setCurrentPageElements(updatedElements);
    setSelectedElement(null);
    setSelectedElements(new Set());
    saveToHistory(updatedElements);
  }, [getCurrentPageElements, setCurrentPageElements, saveToHistory, setSelectedElement, setSelectedElements]);

  // Change element z-index
  const changeZIndex = useCallback((id, direction) => {
    if (lockedElements.has(id)) return;
    
    const currentElements = getCurrentPageElements();
    const elementIndex = currentElements.findIndex(el => el.id === id);
    if (elementIndex === -1) return;
    
    let newIndex;
    if (direction === 'front') {
      newIndex = currentElements.length - 1;
    } else if (direction === 'forward') {
      newIndex = Math.min(elementIndex + 1, currentElements.length - 1);
    } else if (direction === 'backward') {
      newIndex = Math.max(elementIndex - 1, 0);
    } else if (direction === 'back') {
      newIndex = 0;
    } else {
      return;
    }
    
    const newElements = [...currentElements];
    const [element] = newElements.splice(elementIndex, 1);
    newElements.splice(newIndex, 0, element);
    
    const updatedElements = newElements.map((el, idx) => ({
      ...el,
      zIndex: idx
    }));
    
    setCurrentPageElements(updatedElements);
    saveToHistory(updatedElements);
  }, [lockedElements, getCurrentPageElements, setCurrentPageElements, saveToHistory]);

  // Calculate alignment lines
  const calculateAlignmentLines = useCallback((movingElement) => {
    const currentElements = getCurrentPageElements();
    const lines = { vertical: [], horizontal: [] };
    const threshold = 5;

    currentElements.forEach(el => {
      if (el.id === movingElement.id || selectedElements.has(el.id) || lockedElements.has(el.id)) return;

      if (Math.abs(el.x - movingElement.x) < threshold) {
        lines.vertical.push(el.x);
      }
      if (Math.abs(el.x + el.width - movingElement.x) < threshold) {
        lines.vertical.push(el.x + el.width);
      }
      if (Math.abs(el.x - (movingElement.x + movingElement.width)) < threshold) {
        lines.vertical.push(el.x);
      }

      if (Math.abs(el.y - movingElement.y) < threshold) {
        lines.horizontal.push(el.y);
      }
      if (Math.abs(el.y + el.height - movingElement.y) < threshold) {
        lines.horizontal.push(el.y + el.height);
      }
      if (Math.abs(el.y - (movingElement.y + movingElement.height)) < threshold) {
        lines.horizontal.push(el.y);
      }
    });

    setAlignmentLines(lines);
  }, [selectedElements, getCurrentPageElements, lockedElements, setAlignmentLines]);

  // Handle selection
  const handleSelectElement = useCallback((e, elementId) => {
    e.stopPropagation();
    
    const currentElements = getCurrentPageElements();
    const element = currentElements.find(el => el.id === elementId);
    
    if (!element) return;
    
    if (element.groupId && !selectedElements.has(element.groupId)) {
      const groupElement = currentElements.find(el => el.id === element.groupId);
      if (groupElement && !lockedElements.has(groupElement.id)) {
        if (e.ctrlKey || e.metaKey) {
          const newSelected = new Set(selectedElements);
          if (newSelected.has(groupElement.id)) {
            newSelected.delete(groupElement.id);
          } else {
            newSelected.add(groupElement.id);
          }
          setSelectedElement(groupElement.id);
          setSelectedElements(newSelected);
        } else {
          setSelectedElement(groupElement.id);
          setSelectedElements(new Set([groupElement.id]));
        }
        return;
      }
    }
    
    if (lockedElements.has(elementId)) {
      setSelectedElement(elementId);
      setSelectedElements(new Set([elementId]));
      return;
    }
    
    if (e.ctrlKey || e.metaKey) {
      const newSelected = new Set(selectedElements);
      if (newSelected.has(elementId)) {
        newSelected.delete(elementId);
        if (newSelected.size === 0) {
          setSelectedElement(null);
        } else if (selectedElement === elementId) {
          setSelectedElement(Array.from(newSelected)[0]);
        }
      } else {
        newSelected.add(elementId);
        setSelectedElement(elementId);
      }
      setSelectedElements(newSelected);
    } else {
      setSelectedElement(elementId);
      setSelectedElements(new Set([elementId]));
    }
  }, [selectedElements, selectedElement, lockedElements, getCurrentPageElements, setSelectedElement, setSelectedElements]);

  // Handle drawing with pen tool
  const handleDrawing = useCallback((e) => {
    if (currentTool !== 'pen' || !isDrawing || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasOffset.x) / zoomLevel;
    const y = (e.clientY - rect.top - canvasOffset.y) / zoomLevel;
    
    setDrawingPath(prev => [...prev, { x, y }]);
  }, [currentTool, isDrawing, zoomLevel, canvasOffset, setDrawingPath]);

  // Finish drawing and create a path element
  const finishDrawing = useCallback(() => {
    if (currentTool !== 'pen' || drawingPath.length === 0) return;
    
    addElement('drawing', { path: [...drawingPath] });
    setDrawingPath([]);
    setIsDrawing(false);
  }, [currentTool, drawingPath, addElement, setDrawingPath, setIsDrawing]);

  // Enhanced selection handles with corner pointers and center slots
  const renderSelectionHandles = useCallback((element) => {
    if (!element || lockedElements.has(element.id)) return null;

    const handleSize = 12;
    const handleBorder = 2;
    const slotSize = 8;
    const connectionLineColor = '#8b5cf6';
    const handleColor = '#ffffff';
    const handleBorderColor = '#8b5cf6';

    const handles = [
      { x: -handleSize/2, y: -handleSize/2, cursor: 'nw-resize', type: 'nw' },
      { x: element.width - handleSize/2, y: -handleSize/2, cursor: 'ne-resize', type: 'ne' },
      { x: -handleSize/2, y: element.height - handleSize/2, cursor: 'sw-resize', type: 'sw' },
      { x: element.width - handleSize/2, y: element.height - handleSize/2, cursor: 'se-resize', type: 'se' },
      
      { x: element.width/2 - slotSize/2, y: -slotSize/2, cursor: 'n-resize', type: 'n', isSlot: true },
      { x: element.width/2 - slotSize/2, y: element.height - slotSize/2, cursor: 's-resize', type: 's', isSlot: true },
      { x: -slotSize/2, y: element.height/2 - slotSize/2, cursor: 'w-resize', type: 'w', isSlot: true },
      { x: element.width - slotSize/2, y: element.height/2 - slotSize/2, cursor: 'e-resize', type: 'e', isSlot: true }
    ];

    const handleMouseDown = (e, action, direction = '') => {
      e.stopPropagation();
      e.preventDefault();
      
      if (action === 'resize') {
        setIsResizing(true);
        
        const rect = canvasRef.current.getBoundingClientRect();
        setDragStart({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          elementX: element.x,
          elementY: element.y,
          elementWidth: element.width,
          elementHeight: element.height,
          elementRotation: element.rotation,
          resizeDirection: direction
        });
      } else if (action === 'rotate') {
        setIsRotating(true);
        
        const rect = canvasRef.current.getBoundingClientRect();
        setDragStart({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          elementX: element.x,
          elementY: element.y,
          elementWidth: element.width,
          elementHeight: element.height,
          elementRotation: element.rotation
        });
      }
    };

    return (
      <div
        style={{
          position: 'absolute',
          left: element.x - 10,
          top: element.y - 10,
          width: element.width + 20,
          height: element.height + 20,
          pointerEvents: 'none',
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: element.zIndex + 1000
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 10,
            width: element.width,
            height: element.height,
            border: `2px dashed ${connectionLineColor}`,
            borderRadius: '2px'
          }}
        />

        {handles.map((handle, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: handle.x + 10,
              top: handle.y + 10,
              width: handle.isSlot ? slotSize : handleSize,
              height: handle.isSlot ? slotSize : handleSize,
              backgroundColor: handle.isSlot ? connectionLineColor : handleColor,
              border: handle.isSlot ? 'none' : `${handleBorder}px solid ${handleBorderColor}`,
              borderRadius: handle.isSlot ? '1px' : '50%',
              cursor: handle.cursor,
              pointerEvents: 'auto',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'resize', handle.type)}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: handleSize,
            height: handleSize,
            backgroundColor: '#ef4444',
            border: `2px solid #ffffff`,
            borderRadius: '50%',
            cursor: 'grab',
            pointerEvents: 'auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'rotate')}
        />

        <svg
          style={{
            position: 'absolute',
            top: -25,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 2,
            height: 15,
            pointerEvents: 'none'
          }}
        >
          <line x1="1" y1="0" x2="1" y2="15" stroke="#ef4444" strokeWidth="2" />
        </svg>
      </div>
    );
  }, [lockedElements, setIsResizing, setIsRotating, setDragStart, canvasRef]);

  // Enhanced mouse down handler with resize direction
  const handleMouseDown = useCallback((e, elementId, action = 'drag', direction = '') => {
    e.stopPropagation();
    e.preventDefault();
    
    const currentElements = getCurrentPageElements();
    const element = currentElements.find(el => el.id === elementId);
    if (!element) return;

    const targetElement = element.groupId 
      ? currentElements.find(el => el.id === element.groupId) 
      : element;
    
    if (!targetElement || (lockedElements.has(targetElement.id) && action !== 'select')) return;

    handleSelectElement(e, targetElement.id);
    
    const rect = canvasRef.current.getBoundingClientRect();
    
    if (action === 'drag' && !lockedElements.has(targetElement.id)) {
      setIsDragging(true);
      setShowAlignmentLines(true);
    } else if (action === 'resize' && !lockedElements.has(targetElement.id)) {
      setIsResizing(true);
    } else if (action === 'rotate' && !lockedElements.has(targetElement.id)) {
      setIsRotating(true);
    }

    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      elementX: targetElement.x,
      elementY: targetElement.y,
      elementWidth: targetElement.width,
      elementHeight: targetElement.height,
      elementRotation: targetElement.rotation,
      resizeDirection: direction
    });
  }, [getCurrentPageElements, lockedElements, handleSelectElement, setIsDragging, setShowAlignmentLines, setIsResizing, setIsRotating, setDragStart, canvasRef]);

  // Enhanced mouse move handler with directional resizing
const handleMouseMove = useCallback((e) => {
  if (!canvasRef.current) return;

  if (currentTool === 'pen' && isDrawing) {
    handleDrawing(e);
    return;
  }

  if (!selectedElement || (!isDragging && !isResizing && !isRotating && !isPanning)) return;

  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = (e.clientX - rect.left - canvasOffset.x) / zoomLevel;
  const mouseY = (e.clientY - rect.top - canvasOffset.y) / zoomLevel;
  
  if (isPanning) {
    setCanvasOffset({
      x: canvasOffset.x + e.movementX,
      y: canvasOffset.y + e.movementY
    });
    return;
  }
  
  const currentElements = getCurrentPageElements();
  const element = currentElements.find(el => el.id === selectedElement);
  if (!element) return;
  
  // ADDED: Boundary constraints
  const constrainToCanvas = (x, y, width, height) => {
    const minX = 0;
    const minY = 0;
    const maxX = canvasSize.width - width;
    const maxY = canvasSize.height - height;
    
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  };

  const constrainSize = (x, y, width, height, direction) => {
    const minX = 0;
    const minY = 0;
    const maxX = canvasSize.width;
    const maxY = canvasSize.height;
    
    let constrainedX = x;
    let constrainedY = y;
    let constrainedWidth = width;
    let constrainedHeight = height;
    
    // Ensure element stays within canvas bounds during resize
    switch (direction) {
      case 'nw':
        constrainedX = Math.max(minX, x);
        constrainedY = Math.max(minY, y);
        constrainedWidth = Math.min(maxX - constrainedX, width);
        constrainedHeight = Math.min(maxY - constrainedY, height);
        break;
      case 'ne':
        constrainedY = Math.max(minY, y);
        constrainedWidth = Math.min(maxX - x, width);
        constrainedHeight = Math.min(maxY - constrainedY, height);
        break;
      case 'sw':
        constrainedX = Math.max(minX, x);
        constrainedWidth = Math.min(maxX - constrainedX, width);
        constrainedHeight = Math.min(maxY - y, height);
        break;
      case 'se':
        constrainedWidth = Math.min(maxX - x, width);
        constrainedHeight = Math.min(maxY - y, height);
        break;
      case 'n':
        constrainedY = Math.max(minY, y);
        constrainedHeight = Math.min(maxY - constrainedY, height);
        break;
      case 's':
        constrainedHeight = Math.min(maxY - y, height);
        break;
      case 'w':
        constrainedX = Math.max(minX, x);
        constrainedWidth = Math.min(maxX - constrainedX, width);
        break;
      case 'e':
        constrainedWidth = Math.min(maxX - x, width);
        break;
      default:
        break;
    }
    
    // Ensure minimum size
    constrainedWidth = Math.max(20, constrainedWidth);
    constrainedHeight = Math.max(20, constrainedHeight);
    
    return {
      x: constrainedX,
      y: constrainedY,
      width: constrainedWidth,
      height: constrainedHeight
    };
  };
  
  if (element.type === 'group' && isDragging) {
    const deltaX = mouseX - dragStart.x;
    const deltaY = mouseY - dragStart.y;
    
    let newX = dragStart.elementX + deltaX;
    let newY = dragStart.elementY + deltaY;
    
    if (snapToGrid) {
      newX = Math.round(newX / 10) * 10;
      newY = Math.round(newY / 10) * 10;
    }
    
    // ADDED: Constrain group position
    const constrainedPos = constrainToCanvas(newX, newY, element.width, element.height);
    newX = constrainedPos.x;
    newY = constrainedPos.y;
    
    const newElements = currentElements.map(el => {
      if (el.groupId === selectedElement) {
        return {
          ...el,
          x: newX + (el.relativeX || 0),
          y: newY + (el.relativeY || 0)
        };
      } else if (el.id === selectedElement) {
        return {
          ...el,
          x: newX,
          y: newY
        };
      }
      return el;
    });
    
    setCurrentPageElements(newElements);
    saveToHistory(newElements);
    calculateAlignmentLines({ ...element, x: newX, y: newY });
  } else if (isDragging) {
    const deltaX = mouseX - dragStart.x;
    const deltaY = mouseY - dragStart.y;
    
    let newX = dragStart.elementX + deltaX;
    let newY = dragStart.elementY + deltaY;
    
    if (snapToGrid) {
      newX = Math.round(newX / 10) * 10;
      newY = Math.round(newY / 10) * 10;
    }
    
    // ADDED: Constrain position to canvas boundaries
    const constrainedPos = constrainToCanvas(newX, newY, element.width, element.height);
    newX = constrainedPos.x;
    newY = constrainedPos.y;
    
    if (selectedElements.size === 1) {
      updateElement(selectedElement, { x: newX, y: newY });
      calculateAlignmentLines({ ...element, x: newX, y: newY });
    } else {
      const deltaMoveX = newX - element.x;
      const deltaMoveY = newY - element.y;
      
      const newElements = currentElements.map(el => {
        if (selectedElements.has(el.id) && !lockedElements.has(el.id)) {
          // ADDED: Constrain each selected element
          const constrainedElPos = constrainToCanvas(
            el.x + deltaMoveX, 
            el.y + deltaMoveY, 
            el.width, 
            el.height
          );
          
          return {
            ...el,
            x: constrainedElPos.x,
            y: constrainedElPos.y
          };
        }
        return el;
      });
      
      setCurrentPageElements(newElements);
      saveToHistory(newElements);
    }
  } else if (isResizing) {
    const deltaX = mouseX - dragStart.x;
    const deltaY = mouseY - dragStart.y;
    
    let newX = dragStart.elementX;
    let newY = dragStart.elementY;
    let newWidth = dragStart.elementWidth;
    let newHeight = dragStart.elementHeight;

    switch (dragStart.resizeDirection) {
      case 'nw':
        newX = dragStart.elementX + deltaX;
        newY = dragStart.elementY + deltaY;
        newWidth = Math.max(20, dragStart.elementWidth - deltaX);
        newHeight = Math.max(20, dragStart.elementHeight - deltaY);
        break;
      case 'ne':
        newY = dragStart.elementY + deltaY;
        newWidth = Math.max(20, dragStart.elementWidth + deltaX);
        newHeight = Math.max(20, dragStart.elementHeight - deltaY);
        break;
      case 'sw':
        newX = dragStart.elementX + deltaX;
        newWidth = Math.max(20, dragStart.elementWidth - deltaX);
        newHeight = Math.max(20, dragStart.elementHeight + deltaY);
        break;
      case 'se':
        newWidth = Math.max(20, dragStart.elementWidth + deltaX);
        newHeight = Math.max(20, dragStart.elementHeight + deltaY);
        break;
      case 'n':
        newY = dragStart.elementY + deltaY;
        newHeight = Math.max(20, dragStart.elementHeight - deltaY);
        break;
      case 's':
        newHeight = Math.max(20, dragStart.elementHeight + deltaY);
        break;
      case 'w':
        newX = dragStart.elementX + deltaX;
        newWidth = Math.max(20, dragStart.elementWidth - deltaX);
        break;
      case 'e':
        newWidth = Math.max(20, dragStart.elementWidth + deltaX);
        break;
      default:
        break;
    }

    // ADDED: Constrain resize to canvas boundaries
    const constrainedSize = constrainSize(newX, newY, newWidth, newHeight, dragStart.resizeDirection);
    
    updateElement(selectedElement, { 
      x: constrainedSize.x, 
      y: constrainedSize.y, 
      width: constrainedSize.width, 
      height: constrainedSize.height 
    });
  } else if (isRotating) {
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * 180 / Math.PI;
    updateElement(selectedElement, { rotation: angle });
  }
}, [selectedElement, isDragging, isResizing, isRotating, isPanning, dragStart, getCurrentPageElements, calculateAlignmentLines, zoomLevel, canvasOffset, selectedElements, snapToGrid, updateElement, saveToHistory, currentTool, isDrawing, handleDrawing, lockedElements, setCurrentPageElements, setCanvasOffset, canvasSize]); // ADDED: canvasSize to dependencies

  const handleMouseUp = useCallback(() => {
    if (currentTool === 'pen' && isDrawing) {
      finishDrawing();
    }
    
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    setIsPanning(false);
    setShowAlignmentLines(false);
    setAlignmentLines({ vertical: [], horizontal: [] });
  }, [currentTool, isDrawing, finishDrawing, setIsDragging, setIsResizing, setIsRotating, setIsPanning, setShowAlignmentLines, setAlignmentLines]);

  // Canvas panning
  const handleCanvasMouseDown = useCallback((e) => {
    if (currentTool === 'pen') {
      setIsDrawing(true);
      setDrawingPath([]);
      return;
    }
    
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      return;
    }
    
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
      setSelectedElements(new Set());
      setTextEditing(null);
    }
  }, [currentTool, setIsDrawing, setDrawingPath, setIsPanning, setSelectedElement, setSelectedElements, setTextEditing, canvasRef]);

  // Handle text editing
  const handleTextEdit = useCallback((e, elementId) => {
    if (lockedElements.has(elementId)) return;
    
    e.stopPropagation();
    setTextEditing(elementId);
    setSelectedElement(elementId);
    setSelectedElements(new Set([elementId]));
    
    setTimeout(() => {
      const element = document.getElementById(`element-${elementId}`);
      if (element) {
        element.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        
        if (element.childNodes.length > 0) {
          range.setStart(element, element.childNodes.length);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }, 0);
  }, [lockedElements, setTextEditing, setSelectedElement, setSelectedElements]);

  // Add new page
  const addNewPage = useCallback(() => {
    const newPageId = `page-${pages.length + 1}`;
    setPages([...pages, { id: newPageId, name: `Page ${pages.length + 1}`, elements: [] }]);
    setCurrentPage(newPageId);
    setSelectedElement(null);
    setSelectedElements(new Set());
  }, [pages, setPages, setCurrentPage, setSelectedElement, setSelectedElements]);

  // Delete current page
  const deleteCurrentPage = useCallback(() => {
    if (pages.length <= 1) return;
    const newPages = pages.filter(page => page.id !== currentPage);
    setPages(newPages);
    setCurrentPage(newPages[0].id);
    setSelectedElement(null);
    setSelectedElements(new Set());
  }, [pages, currentPage, setPages, setCurrentPage, setSelectedElement, setSelectedElements]);

  // Rename current page
  const renameCurrentPage = useCallback(() => {
    const newName = prompt('Enter new page name:', pages.find(p => p.id === currentPage)?.name || 'Page');
    if (newName) {
      setPages(pages.map(page => 
        page.id === currentPage ? { ...page, name: newName } : page
      ));
    }
  }, [pages, currentPage, setPages]);

  // Preload images for recording
  const preloadImages = useCallback(() => {
    const currentElements = getCurrentPageElements();
    const imageElements = currentElements.filter(el => el.type === 'image');
    
    return Promise.all(
      imageElements.map(element => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.src = element.src;
          img.onload = resolve;
          img.onerror = reject;
        });
      })
    );
  }, [getCurrentPageElements]);

  // Enhanced drawElementToCanvas function with effects support
  const drawElementToCanvas = useCallback((ctx, element, time, elementIndex) => {
    // Implementation of drawElementToCanvas function
    // This is a large function that would be moved here
    // For brevity, showing the structure
    ctx.save();
    
    // ... existing drawElementToCanvas implementation
    
    ctx.restore();
  }, [getFilterCSS, getCanvasGradient, getCanvasEffects, imageEffects]);

// Render element with enhanced selection handles and effects
const renderElement = useCallback((element) => {
  const isSelected = selectedElements.has(element.id);
  const isEditing = textEditing === element.id;
  const isLocked = lockedElements.has(element.id);
  
  const elementStyle = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: `rotate(${element.rotation || 0}deg)`,
    zIndex: element.zIndex,
    pointerEvents: isLocked ? 'none' : 'auto',
    filter: getFilterCSS(element.filters),
    animation: element.animation && animations[element.animation] 
    ? `${animations[element.animation].keyframes} 1s ease-out forwards` 
    : 'none',
    ...parseCSS(getEffectCSS(element))
  };

  let elementContent;

  switch (element.type) {
    case 'rectangle':
      elementStyle.backgroundColor = getBackgroundStyle(element);
      elementStyle.border = `${element.strokeWidth}px solid ${element.stroke}`;
      elementStyle.borderRadius = element.borderRadius ? `${element.borderRadius}px` : '0';
      elementStyle.cursor = 'move';
      
      elementContent = (
        <div
          style={elementStyle}
          onClick={(e) => handleSelectElement(e, element.id)}
          onMouseDown={(e) => handleMouseDown(e, element.id, 'drag')}
        />
      );
      break;

    case 'circle':
      elementStyle.backgroundColor = getBackgroundStyle(element);
      elementStyle.border = `${element.strokeWidth}px solid ${element.stroke}`;
      elementStyle.borderRadius = '50%';
      elementStyle.cursor = 'move';
      
      elementContent = (
        <div
          style={elementStyle}
          onClick={(e) => handleSelectElement(e, element.id)}
          onMouseDown={(e) => handleMouseDown(e, element.id, 'drag')}
        />
      );
      break;

    case 'triangle':
      // Triangle implementation
      elementStyle.width = 0;
      elementStyle.height = 0;
      elementStyle.backgroundColor = 'transparent';
      elementStyle.borderLeft = `${element.width/2}px solid transparent`;
      elementStyle.borderRight = `${element.width/2}px solid transparent`;
      elementStyle.borderBottom = `${element.height}px solid ${element.fill}`;
      elementStyle.borderTop = 'none';
      elementStyle.cursor = 'move';
      
      elementContent = (
        <div
          style={elementStyle}
          onClick={(e) => handleSelectElement(e, element.id)}
          onMouseDown={(e) => handleMouseDown(e, element.id, 'drag')}
        />
      );
      break;

    case 'text':
      if (isEditing) {
        elementContent = (
          <div
            id={`element-${element.id}`}
            contentEditable
            suppressContentEditableWarning
            style={{
              ...elementStyle,
              color: element.color,
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              textAlign: element.textAlign,
              backgroundColor: 'transparent',
              border: '2px dashed #3b82f6',
              outline: 'none',
              padding: '4px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflow: 'hidden'
            }}
            onBlur={(e) => updateElement(element.id, { content: e.target.textContent })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                setTextEditing(null);
              }
            }}
          >
            {element.content}
          </div>
        );
      } else {
        elementContent = (
          <div
            id={`element-${element.id}`}
            style={{
              ...elementStyle,
              color: element.color,
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              textAlign: element.textAlign,
              backgroundColor: 'transparent',
              border: isSelected ? '2px dashed #3b82f6' : 'none',
              padding: '4px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflow: 'hidden',
              cursor: 'text'
            }}
            onClick={(e) => handleTextEdit(e, element.id)}
            onDoubleClick={(e) => handleTextEdit(e, element.id)}
          >
            {element.content}
          </div>
        );
      }
      break;

    case 'image':
      elementStyle.cursor = 'move';
      elementContent = (
        <img
          src={element.src}
          alt=""
          style={elementStyle}
          onClick={(e) => handleSelectElement(e, element.id)}
          onMouseDown={(e) => handleMouseDown(e, element.id, 'drag')}
        />
      );
      break;

    // Add cases for other shape types: star, hexagon, line, arrow, etc.
    default:
      // Default rectangle for any unhandled types
      elementStyle.backgroundColor = getBackgroundStyle(element);
      elementStyle.border = `${element.strokeWidth}px solid ${element.stroke}`;
      elementStyle.cursor = 'move';
      
      elementContent = (
        <div
          style={elementStyle}
          onClick={(e) => handleSelectElement(e, element.id)}
          onMouseDown={(e) => handleMouseDown(e, element.id, 'drag')}
        />
      );
  }

  return (
    <React.Fragment key={element.id}>
      {elementContent}
      {isSelected && currentTool === 'select' && !isLocked && (
        renderSelectionHandles(element)
      )}
    </React.Fragment>
  );
}, [selectedElements, textEditing, lockedElements, currentTool, getFilterCSS, handleTextEdit, handleMouseDown, currentLanguage, textDirection, getBackgroundStyle, renderSelectionHandles, updateElement, getEffectCSS, getCurrentPageElements, handleSelectElement, setTextEditing]);

  // Render drawing path in progress
  const renderDrawingPath = useCallback(() => {
    if (drawingPath.length < 2) return null;
    
    let pathData = 'M ' + drawingPath[0].x + ' ' + drawingPath[0].y;
    for (let i = 1; i < drawingPath.length; i++) {
      pathData += ' L ' + drawingPath[i].x + ' ' + drawingPath[i].y;
    }
    
    return (
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10000
        }}
      >
        <path
          d={pathData}
          fill="none"
          stroke="#000000"
          strokeWidth="3"
        />
      </svg>
    );
  }, [drawingPath]);

  // Helper function to parse CSS string to object
  const parseCSS = (cssString) => {
    const style = {};
    const declarations = cssString.split(';');
    declarations.forEach(decl => {
      const [property, value] = decl.split(':').map(s => s.trim());
      if (property && value) {
        style[property] = value;
      }
    });
    return style;
  };

  // Get sorted elements for export
  const getSortedElementsForExport = useCallback(() => {
    const currentElements = getCurrentPageElements();
    
    const sortedElements = [...currentElements].sort((a, b) => {
      if (a.type === 'group' && b.groupId === a.id) return -1;
      if (b.type === 'group' && a.groupId === b.id) return 1;
      
      return a.zIndex - b.zIndex;
    });
    
    return sortedElements;
  }, [getCurrentPageElements]);

  // Get export-ready elements with proper filtering
  const getExportReadyElements = useCallback(() => {
    const currentElements = getCurrentPageElements();
    
    return [...currentElements]
      .sort((a, b) => {
        if (a.zIndex !== b.zIndex) {
          return a.zIndex - b.zIndex;
        }
        
        return currentElements.indexOf(a) - currentElements.indexOf(b);
      })
      .filter(element => {
        return !element.isTemporary;
      });
  }, [getCurrentPageElements]);

  // Calculate selectedElementData
  const selectedElementData = getCurrentPageElements().find(el => el.id === selectedElement);

  return {
    getCurrentPageElements,
    setCurrentPageElements,
    getSortedElementsForExport,
    getExportReadyElements,
    selectedElementData,
    generateId,
    saveToHistory,
    undo,
    redo,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    playAnimations,
  resetAnimations,
  updateElementAnimation,
  removeElementAnimation,
    toggleElementLock,
    updateFilter,
    getFilterCSS,
    getBackgroundStyle,
    getCanvasGradient,
    getCanvasEffects,
    getEffectCSS,
    groupElements,
    ungroupElements,
    changeZIndex,
    calculateAlignmentLines,
    handleSelectElement,
    handleDrawing,
    finishDrawing,
    renderSelectionHandles,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasMouseDown,
    handleTextEdit,
    addNewPage,
    deleteCurrentPage,
    renameCurrentPage,
    playAnimations,
    resetAnimations,
    drawElementToCanvas,
    renderElement,
    renderDrawingPath,
    parseCSS,
    preloadImages
  };
};
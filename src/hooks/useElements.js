import { useState, useCallback } from 'react';

export const useElements = (getCurrentPageElements, setCurrentPageElements, saveToHistory) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedElements, setSelectedElements] = useState(new Set());
  const [lockedElements, setLockedElements] = useState(new Set());

  const generateId = () => Math.random().toString(36).substr(2, 9);

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
      ...properties
    };

    const newElements = [...currentElements, newElement];
    setCurrentPageElements(newElements);
    setSelectedElement(newElement.id);
    setSelectedElements(new Set([newElement.id]));
    saveToHistory(newElements);
  }, [getCurrentPageElements, setCurrentPageElements, saveToHistory]);

  const updateElement = useCallback((id, updates) => {
    const currentElements = getCurrentPageElements();
    const newElements = currentElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setCurrentPageElements(newElements);
    saveToHistory(newElements);
  }, [getCurrentPageElements, setCurrentPageElements, saveToHistory]);

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
  }, [lockedElements, getCurrentPageElements, setCurrentPageElements, selectedElement, selectedElements, saveToHistory]);

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
  }, [lockedElements, getCurrentPageElements, setCurrentPageElements, saveToHistory]);

  return {
    selectedElement,
    setSelectedElement,
    selectedElements,
    setSelectedElements,
    lockedElements,
    setLockedElements,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement
  };
};
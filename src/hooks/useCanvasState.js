import { useState } from 'react';

export const useCanvasState = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedElements, setSelectedElements] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAlignmentLines, setShowAlignmentLines] = useState(false);
  const [alignmentLines, setAlignmentLines] = useState({ vertical: [], horizontal: [] });
  const [currentTool, setCurrentTool] = useState('select');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [recording, setRecording] = useState(false);
  const [drawingPath, setDrawingPath] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [textEditing, setTextEditing] = useState(null);
  const [pages, setPages] = useState([{ id: 'page-1', name: 'Page 1', elements: [] }]);
  const [currentPage, setCurrentPage] = useState('page-1');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [lockedElements, setLockedElements] = useState(new Set());
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [textDirection, setTextDirection] = useState('ltr');
  const [transliterationEnabled, setTransliterationEnabled] = useState(false);
  const [videoFormat, setVideoFormat] = useState('webm');
  const [videoQuality, setVideoQuality] = useState('high');
  const [recordingDuration, setRecordingDuration] = useState(10);
  const [recordingTimeElapsed, setRecordingTimeElapsed] = useState(0);
  const [gradientPickerKey, setGradientPickerKey] = useState(0);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [showCustomTemplateModal, setShowCustomTemplateModal] = useState(false);
  const [customTemplateSize, setCustomTemplateSize] = useState({
    width: 800,
    height: 600,
    unit: 'px'
  });
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showLanguageHelp, setShowLanguageHelp] = useState(false);

  return {
    selectedElement,
    setSelectedElement,
    selectedElements,
    setSelectedElements,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    isRotating,
    setIsRotating,
    dragStart,
    setDragStart,
    canvasSize,
    setCanvasSize,
    isPlaying,
    setIsPlaying,
    showAlignmentLines,
    setShowAlignmentLines,
    alignmentLines,
    setAlignmentLines,
    currentTool,
    setCurrentTool,
    zoomLevel,
    setZoomLevel,
    canvasOffset,
    setCanvasOffset,
    isPanning,
    setIsPanning,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    recording,
    setRecording,
    drawingPath,
    setDrawingPath,
    showSaveDialog,
    setShowSaveDialog,
    projectName,
    setProjectName,
    isDrawing,
    setIsDrawing,
    textEditing,
    setTextEditing,
    pages,
    setPages,
    currentPage,
    setCurrentPage,
    showTemplates,
    setShowTemplates,
    showAccountMenu,
    setShowAccountMenu,
    lockedElements,
    setLockedElements,
    currentLanguage,
    setCurrentLanguage,
    textDirection,
    setTextDirection,
    transliterationEnabled,
    setTransliterationEnabled,
    videoFormat,
    setVideoFormat,
    videoQuality,
    setVideoQuality,
    recordingDuration,
    setRecordingDuration,
    recordingTimeElapsed,
    setRecordingTimeElapsed,
    gradientPickerKey,
    setGradientPickerKey,
    showEffectsPanel,
    setShowEffectsPanel,
    showCustomTemplateModal,
    setShowCustomTemplateModal,
    customTemplateSize,
    setCustomTemplateSize,
    showLanguageMenu,
    setShowLanguageMenu,
    showLanguageHelp,
    setShowLanguageHelp
  };
};
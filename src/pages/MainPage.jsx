import React, { useState, useRef, useCallback, useEffect } from 'react';
import { textEffects, imageEffects, fontFamilies, supportedLanguages, specialEffects, stickerOptions, filterOptions, animations, gradientPresets, shapeEffects, socialMediaTemplates } from '../types/types.js';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI } from '../services/api';
import "../styles/MainPageStyles.css";

import Header from './../components/Header';
import TemplateSelector from '../components/TemplateSelector.jsx';
import LeftToolsPanel from '../components/LeftToolsPanel.jsx';
import Canvas from '../components/Canvas.jsx';
import FloatingToolbar from '../components/FloatingToolbar.jsx';
import PagesNav from '../components/PagesNav.jsx';
import PropertiesPanel from '../components/PropertiesPanel.jsx';
import EffectsPanel from '../components/EffectsPanel.jsx';
import CustomTemplateModal from '../components/CustomTemplateModal.jsx';
import GradientPicker from '../components/GradientPicker.jsx';
import LanguageHelpModal from '../components/LanguageHelpModal.jsx';
import RecordingStatus from '../components/RecordingStatus.jsx';
import SaveProjectDialog from '../components/SaveProjectDialog.jsx';

import { useCanvasState } from '../hooks/useCanvasState';
import { useElementOperations } from '../hooks/useElementOperations';
import { useExportFunctions } from '../hooks/useExportFunctions';
import { useRecording } from '../hooks/useRecording';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const MainPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();
  const currentProjectId = searchParams.get('project');

  // State management hooks
  const {
    selectedElement,
    selectedElements,
    setSelectedElement,
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
  } = useCanvasState();

  // Refs
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const floatingToolbarRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const loadProjectInputRef = useRef(null);

  // Element operations hook
  const {
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
    parseCSS
  } = useElementOperations({
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
    setIsPlaying,
    t,
    canvasSize
  });

  // Export functions hook
  const {
    exportAsSVG,
    exportAsImage,
    exportAsPDF
  } = useExportFunctions({
    canvasSize,
    getSortedElementsForExport,
    drawElementToCanvas,
    getBackgroundStyle
  });

  // Recording hook
  const {
    mediaRecorder,
    setMediaRecorder,
    recordingStartTime,
    setRecordingStartTime,
    startRecording,
    stopRecording,
    preloadImages,
    checkRecordingCompatibility
  } = useRecording({
    recording,
    setRecording,
    recordingTimeElapsed,
    setRecordingTimeElapsed,
    recordingIntervalRef,
    canvasSize,
    getSortedElementsForExport,
    drawElementToCanvas,
    recordingDuration,
    videoQuality,
    videoFormat,
    // preloadImages: useCallback(() => preloadImages(), [preloadImages]),
    // checkRecordingCompatibility: useCallback(() => checkRecordingCompatibility(), [checkRecordingCompatibility])
  });

  // Center canvas function
  const centerCanvas = useCallback(() => {
    const canvasContainer = canvasContainerRef.current;
    if (!canvasContainer) return;

    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;
    
    const availableWidth = containerWidth - 20;
    const availableHeight = containerHeight - 20;
    
    const widthRatio = availableWidth / canvasSize.width;
    const heightRatio = availableHeight / canvasSize.height;
    
    const optimalZoom = Math.min(widthRatio, heightRatio);
    
    setZoomLevel(Math.max(0.1, Math.min(5, optimalZoom)));
    setCanvasOffset({ x: 0, y: 0 });
  }, [canvasSize, setZoomLevel]);

  // Project management
  const handleSaveClick = useCallback(() => {
    setProjectName(`My Design ${new Date().toLocaleDateString()}`);
    setShowSaveDialog(true);
  }, [setProjectName, setShowSaveDialog]);

  const saveProject = useCallback(async (customTitle = null) => {
    try {
      const projectData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        title: customTitle || `My Design ${new Date().toLocaleDateString()}`,
        description: 'Created with Sowntra',
        pages: pages,
        currentPage: currentPage,
        canvasSize: canvasSize,
        zoomLevel: zoomLevel,
        canvasOffset: canvasOffset,
        showGrid: showGrid,
        snapToGrid: snapToGrid,
        currentLanguage: currentLanguage,
        textDirection: textDirection
      };

      await projectAPI.saveProject(projectData);
      alert('Project saved successfully to cloud and locally!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Saving locally only...');
    }
  }, [pages, currentPage, canvasSize, zoomLevel, canvasOffset, showGrid, snapToGrid, currentLanguage, textDirection]);

  const confirmSave = useCallback(async () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    setShowSaveDialog(false);
    await saveProject(projectName.trim());
  }, [projectName, saveProject, setShowSaveDialog]);

  const loadProject = useCallback(() => {
    loadProjectInputRef.current?.click();
  }, []);

  const handleProjectFileLoad = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const projectData = JSON.parse(e.target.result);
          
          if (!projectData.version || !projectData.pages) {
            throw new Error('Invalid project file');
          }

          setPages(projectData.pages);
          setCurrentPage(projectData.currentPage || projectData.pages[0]?.id);
          setCanvasSize(projectData.canvasSize || { width: 800, height: 600 });
          setZoomLevel(projectData.zoomLevel || 1);
          setCanvasOffset(projectData.canvasOffset || { x: 0, y: 0 });
          setShowGrid(projectData.showGrid || false);
          setSnapToGrid(projectData.snapToGrid || false);
          setCurrentLanguage(projectData.currentLanguage || 'en');
          setTextDirection(projectData.textDirection || 'ltr');
          
          setSelectedElement(null);
          setSelectedElements(new Set());
          
          alert('Project loaded successfully!');
        } catch (error) {
          console.error('Error loading project:', error);
          alert('Error loading project. Please make sure the file is a valid Sowntra project file.');
        }
      };
      reader.readAsText(file);
    }
    
    event.target.value = '';
  }, [setPages, setCurrentPage, setCanvasSize, setZoomLevel, setCanvasOffset, setShowGrid, setSnapToGrid, setCurrentLanguage, setTextDirection, setSelectedElement, setSelectedElements]);

  // Template functions
  const applyTemplate = useCallback((platform) => {
    if (platform === 'custom') {
      setShowCustomTemplateModal(true);
      return;
    }
    
    const template = socialMediaTemplates[platform];
    if (template) {
      setCanvasSize({ width: template.width, height: template.height });
      setTimeout(() => {
        centerCanvas();
      }, 100);
      setShowTemplates(false);
    }
  }, [setCanvasSize, centerCanvas, setShowTemplates, setShowCustomTemplateModal]);

  const createCustomTemplate = useCallback(() => {
    let width = customTemplateSize.width;
    let height = customTemplateSize.height;
    
    if (customTemplateSize.unit === 'in') {
      width = Math.round(width * 96);
      height = Math.round(height * 96);
    } else if (customTemplateSize.unit === 'mm') {
      width = Math.round(width * 3.779527559);
      height = Math.round(height * 3.779527559);
    } else if (customTemplateSize.unit === 'cm') {
      width = Math.round(width * 37.79527559);
      height = Math.round(height * 37.79527559);
    }
    
    width = Math.max(100, Math.min(10000, width));
    height = Math.max(100, Math.min(10000, height));
    
    setCanvasSize({ width, height });
    setTimeout(() => {
      centerCanvas();
    }, 100);
    
    setShowCustomTemplateModal(false);
    setShowTemplates(false);
  }, [customTemplateSize, setCanvasSize, centerCanvas, setShowCustomTemplateModal, setShowTemplates]);

  // Zoom functions
  const zoom = useCallback((direction) => {
    const newZoom = direction === 'in' 
      ? Math.min(zoomLevel + 0.1, 3)
      : Math.max(zoomLevel - 0.1, 0.5);
    
    setZoomLevel(newZoom);
  }, [zoomLevel, setZoomLevel]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout, navigate]);

  // Canvas mouse handlers
  const handleCanvasMouseEnter = useCallback(() => {
    // Canvas highlight logic if needed
  }, []);

  const handleCanvasMouseLeave = useCallback(() => {
    // Canvas highlight logic if needed
  }, []);

  // Use keyboard shortcuts
  useKeyboardShortcuts({
    selectedElements,
    getCurrentPageElements,
    setCurrentPageElements,
    selectedElement,
    undo,
    redo,
    saveToHistory,
    groupElements,
    ungroupElements,
    toggleElementLock,
    textEditing,
    lockedElements,
    showEffectsPanel,
    setShowEffectsPanel,
    setSelectedElement,
    setSelectedElements,
    setTextEditing
  });

  // Auto-center on window resize
  useEffect(() => {
    const handleResize = () => {
      centerCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [centerCanvas]);

  // Load project if projectId is provided
  useEffect(() => {
    const loadProject = async () => {
      if (currentProjectId) {
        try {
          const response = await projectAPI.loadProject(currentProjectId);
          const { projectData } = response.data;
          
          if (projectData) {
            if (projectData.pages) setPages(projectData.pages);
            if (projectData.currentPage) setCurrentPage(projectData.currentPage);
            if (projectData.canvasSize) setCanvasSize(projectData.canvasSize);
            if (projectData.zoomLevel) setZoomLevel(projectData.zoomLevel);
            if (projectData.canvasOffset) setCanvasOffset(projectData.canvasOffset);
            if (projectData.showGrid !== undefined) setShowGrid(projectData.showGrid);
            if (projectData.snapToGrid !== undefined) setSnapToGrid(projectData.snapToGrid);
            if (projectData.currentLanguage) setCurrentLanguage(projectData.currentLanguage);
            if (projectData.textDirection) setTextDirection(projectData.textDirection);
          }
        } catch (error) {
          console.error('Error loading project:', error);
        }
      }
    };

    loadProject();
  }, [currentProjectId]);

  return (
    <div className={`h-screen flex flex-col ${textDirection === 'rtl' ? 'rtl-layout' : ''}`}>
      <Header
        t={t}
        i18n={i18n}
        navigate={navigate}
        zoom={zoom}
        centerCanvas={centerCanvas}
        zoomLevel={zoomLevel}
        showTemplates={showTemplates}
        setShowTemplates={setShowTemplates}
        showEffectsPanel={showEffectsPanel}
        setShowEffectsPanel={setShowEffectsPanel}
        playAnimations={playAnimations}
        resetAnimations={resetAnimations}
        isPlaying={isPlaying}
        setShowLanguageMenu={setShowLanguageMenu}
        showLanguageMenu={showLanguageMenu}
        supportedLanguages={supportedLanguages}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        setShowLanguageHelp={setShowLanguageHelp}
        showAccountMenu={showAccountMenu}
        setShowAccountMenu={setShowAccountMenu}
        handleLogout={handleLogout}
        setGradientPickerKey={setGradientPickerKey}
      />

      {showTemplates && (
        <TemplateSelector
          applyTemplate={applyTemplate}
          setShowTemplates={setShowTemplates}
        />
      )}

      <CustomTemplateModal
        showCustomTemplateModal={showCustomTemplateModal}
        setShowCustomTemplateModal={setShowCustomTemplateModal}
        customTemplateSize={customTemplateSize}
        setCustomTemplateSize={setCustomTemplateSize}
        createCustomTemplate={createCustomTemplate}
      />

      <PagesNav
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        addNewPage={addNewPage}
        deleteCurrentPage={deleteCurrentPage}
        renameCurrentPage={renameCurrentPage}
        t={t}
      />

      <div className="main-content">
        <LeftToolsPanel
          t={t}
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          addElement={addElement}
          fileInputRef={fileInputRef}
          undo={undo}
          redo={redo}
          historyIndex={historyIndex}
          history={history}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          snapToGrid={snapToGrid}
          setSnapToGrid={setSnapToGrid}
        />

        <Canvas
          canvasContainerRef={canvasContainerRef}
          canvasRef={canvasRef}
          canvasSize={canvasSize}
          zoomLevel={zoomLevel}
          canvasOffset={canvasOffset}
          handleCanvasMouseDown={handleCanvasMouseDown}
          handleCanvasMouseEnter={handleCanvasMouseEnter}
          handleCanvasMouseLeave={handleCanvasMouseLeave}
          handleMouseMove={handleMouseMove}      // ADD this
          handleMouseUp={handleMouseUp} 
          showGrid={showGrid}
          getCurrentPageElements={getCurrentPageElements}
          renderElement={renderElement}
          renderDrawingPath={renderDrawingPath}
          showAlignmentLines={showAlignmentLines}
          alignmentLines={alignmentLines}
        />

        <PropertiesPanel
          t={t}
          selectedElementData={selectedElementData}
          selectedElement={selectedElement}
          updateElement={updateElement}
          updateFilter={updateFilter}
          duplicateElement={duplicateElement}
          toggleElementLock={toggleElementLock}
          changeZIndex={changeZIndex}
          deleteElement={deleteElement}
          lockedElements={lockedElements}
          gradientPickerKey={gradientPickerKey}
          setGradientPickerKey={setGradientPickerKey}
          exportAsImage={exportAsImage}
          exportAsPDF={exportAsPDF}
          exportAsSVG={exportAsSVG}
          recording={recording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          recordingTimeElapsed={recordingTimeElapsed}
          videoFormat={videoFormat}
          setVideoFormat={setVideoFormat}
          videoQuality={videoQuality}
          setVideoQuality={setVideoQuality}
          recordingDuration={recordingDuration}
          setRecordingDuration={setRecordingDuration}
          handleSaveClick={handleSaveClick}
          loadProject={loadProject}
          currentLanguage={currentLanguage}
          transliterationEnabled={transliterationEnabled}
          setTransliterationEnabled={setTransliterationEnabled}
        />
      </div>

      <EffectsPanel
        showEffectsPanel={showEffectsPanel}
        selectedElementData={selectedElementData}
        selectedElement={selectedElement}
        updateElement={updateElement}
        setShowEffectsPanel={setShowEffectsPanel}
        t={t}
      />

      {selectedElements.size > 0 && (
        <FloatingToolbar
          selectedElements={selectedElements}
          selectedElementData={selectedElementData}
          groupElements={groupElements}
          ungroupElements={ungroupElements}
          selectedElement={selectedElement}
          changeZIndex={changeZIndex}
          toggleElementLock={toggleElementLock}
          duplicateElement={duplicateElement}
          deleteElement={deleteElement}
          lockedElements={lockedElements}
        />
      )}

      <LanguageHelpModal
        showLanguageHelp={showLanguageHelp}
        setShowLanguageHelp={setShowLanguageHelp}
        currentLanguage={currentLanguage}
        supportedLanguages={supportedLanguages}
      />

      <RecordingStatus
        recording={recording}
        recordingTimeElapsed={recordingTimeElapsed}
      />

      <SaveProjectDialog
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        projectName={projectName}
        setProjectName={setProjectName}
        confirmSave={confirmSave}
      />

      <input
        type="file"
        ref={loadProjectInputRef}
        onChange={handleProjectFileLoad}
        accept=".json"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default MainPage;
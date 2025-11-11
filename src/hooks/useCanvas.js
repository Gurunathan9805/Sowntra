import { useState, useCallback, useRef } from 'react';

export const useCanvas = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

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
  }, [canvasSize]);

  return {
    canvasSize,
    setCanvasSize,
    zoomLevel,
    setZoomLevel,
    canvasOffset,
    setCanvasOffset,
    isPanning,
    setIsPanning,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    canvasRef,
    canvasContainerRef,
    centerCanvas
  };
};
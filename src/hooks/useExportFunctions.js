import { useCallback } from 'react';
import jsPDF from 'jspdf';

export const useExportFunctions = ({
  canvasSize,
  getSortedElementsForExport,
  drawElementToCanvas,
  getBackgroundStyle
}) => {
  // Export as SVG
  const exportAsSVG = useCallback(() => {
    const currentElements = getSortedElementsForExport();
    
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${canvasSize.width}" height="${canvasSize.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect width="100%" height="100%" fill="white"/>
  <defs>`;
    
    // Add gradient definitions
    currentElements.forEach((element, idx) => {
      if (element.fillType === 'gradient' && element.gradient) {
        const grad = element.gradient;
        if (grad.type === 'linear') {
          svgContent += `
    <linearGradient id="gradient-${idx}" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(${grad.angle || 90} 0.5 0.5)">`;
          grad.colors.forEach((color, i) => {
            svgContent += `
      <stop offset="${grad.stops[i]}%" style="stop-color:${color};stop-opacity:1" />`;
          });
          svgContent += `
    </linearGradient>`;
        } else {
          svgContent += `
    <radialGradient id="gradient-${idx}" cx="${grad.position?.x || 50}%" cy="${grad.position?.y || 50}%">`;
          grad.colors.forEach((color, i) => {
            svgContent += `
      <stop offset="${grad.stops[i]}%" style="stop-color:${color};stop-opacity:1" />`;
          });
          svgContent += `
    </radialGradient>`;
        }
      }
    });
    
    svgContent += `
  </defs>
  `;
    
    // Add elements
    currentElements.forEach((element, idx) => {
      const transform = `rotate(${element.rotation || 0} ${element.x + element.width/2} ${element.y + element.height/2})`;
      const fill = element.fillType === 'gradient' ? `url(#gradient-${idx})` : element.fill;
      
      if (element.type === 'rectangle') {
        svgContent += `
  <rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" 
        fill="${fill}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" 
        rx="${element.borderRadius || 0}" transform="${transform}"/>`;
      } else if (element.type === 'circle') {
        svgContent += `
  <circle cx="${element.x + element.width/2}" cy="${element.y + element.height/2}" r="${element.width/2}" 
          fill="${fill}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" 
          transform="${transform}"/>`;
      } else if (element.type === 'text') {
        svgContent += `
  <text x="${element.x}" y="${element.y + element.fontSize}" 
        font-family="${element.fontFamily}" font-size="${element.fontSize}" 
        fill="${element.color}" text-anchor="${element.textAlign === 'center' ? 'middle' : element.textAlign === 'right' ? 'end' : 'start'}" 
        transform="${transform}">${element.content}</text>`;
      }
    });
    
    svgContent += `
</svg>`;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sowntra-design.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [canvasSize, getSortedElementsForExport, getBackgroundStyle]);

  // Export as image
  const exportAsImage = useCallback((format) => {
    if (format === 'svg') {
      exportAsSVG();
      return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Could not get canvas context');
      alert('Error: Could not create canvas context');
      return;
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    
    const sortedElements = getSortedElementsForExport();
    const imageElements = sortedElements.filter(el => el.type === 'image');
    
    if (imageElements.length > 0) {
      let loadedImages = 0;
      const totalImages = imageElements.length;
      
      const drawAllElements = () => {
        try {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
          
          sortedElements.forEach((element, index) => {
            try {
              drawElementToCanvas(ctx, element, undefined, index);
            } catch (elementError) {
              console.error(`Error drawing element ${element.id}:`, elementError);
            }
          });
          
          const dataUrl = canvas.toDataURL(`image/${format}`, 0.95);
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `sowntra-design.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (error) {
          console.error('Error in drawAllElements:', error);
          alert('Error exporting image. Please try again.');
        }
      };
      
      const checkAllLoaded = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          drawAllElements();
        }
      };
      
      imageElements.forEach(element => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = element.src;
        img.onload = () => {
          checkAllLoaded();
        };
        img.onerror = () => {
          console.error('Failed to load image:', element.src);
          checkAllLoaded();
        };
      });
    } else {
      try {
        sortedElements.forEach((element, index) => {
          drawElementToCanvas(ctx, element, undefined, index);
        });
        
        const dataUrl = canvas.toDataURL(`image/${format}`, 0.95);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `sowntra-design.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error exporting canvas:', error);
        alert('Error exporting image. Please try again.');
      }
    }
  }, [canvasSize, getSortedElementsForExport, drawElementToCanvas, exportAsSVG]);

  // Export as PDF
  const exportAsPDF = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Could not get canvas context');
      alert('Error: Could not create canvas context');
      return;
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    
    const sortedElements = getSortedElementsForExport();
    const imageElements = sortedElements.filter(el => el.type === 'image');
    
    const generatePDF = () => {
      try {
        const imgData = canvas.toDataURL('image/png');
        
        const pdfWidth = canvasSize.width * 0.264583;
        const pdfHeight = canvasSize.height * 0.264583;
        
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('sowntra-design.pdf');
      } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Error exporting PDF. Please try again.');
      }
    };
    
    if (imageElements.length > 0) {
      let loadedImages = 0;
      const totalImages = imageElements.length;
      
      const drawAllElements = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        
        sortedElements.forEach((element, index) => {
          drawElementToCanvas(ctx, element, undefined, index);
        });
        generatePDF();
      };
      
      const checkAllLoaded = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          drawAllElements();
        }
      };
      
      imageElements.forEach(element => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = element.src;
        img.onload = () => {
          checkAllLoaded();
        };
        img.onerror = () => {
          console.error('Failed to load image:', element.src);
          checkAllLoaded();
        };
      });
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      
      sortedElements.forEach((element, index) => {
        drawElementToCanvas(ctx, element, undefined, index);
      });
      generatePDF();
    }
  }, [canvasSize, getSortedElementsForExport, drawElementToCanvas]);

  return {
    exportAsSVG,
    exportAsImage,
    exportAsPDF
  };
};
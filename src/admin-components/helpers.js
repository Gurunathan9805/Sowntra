// Generate unique layer ID
export const generateId = () => `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Get effect style for layers
export const getEffectStyle = (layer) => {
  if (layer.effect === 'none') return {};
  
  const filters = {
    blur: `blur(${layer.effectValue || 5}px)`,
    brightness: `brightness(${layer.effectValue || 150}%)`,
    contrast: `contrast(${layer.effectValue || 150}%)`,
    grayscale: `grayscale(${layer.effectValue || 100}%)`,
    sepia: `sepia(${layer.effectValue || 100}%)`,
    invert: `invert(${layer.effectValue || 100}%)`,
    saturate: `saturate(${layer.effectValue || 200}%)`,
    'hue-rotate': `hue-rotate(${layer.effectValue || 90}deg)`,
    'drop-shadow': `drop-shadow(0 4px 8px rgba(0,0,0,0.3))`,
    opacity: `opacity(${layer.effectValue || 50}%)`
  };

  return { filter: filters[layer.effect] };
};

// Get animation class for layers
export const getAnimationClass = (layer) => {
  if (layer.animation === 'none') return '';
  return `animate-${layer.animation}`;
};

// Calculate bounds for multiple layers
export const getGroupBounds = (layers) => {
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

// Render shape based on type
export const renderShape = (layer) => {
  const style = {
    fill: layer.fill,
    stroke: layer.stroke,
    strokeWidth: layer.strokeWidth
  };

  switch (layer.shapeType) {
    case 'rectangle':
      return <rect width={layer.width} height={layer.height} {...style} rx={layer.borderRadius} />;
    case 'circle':
      return <ellipse cx={layer.width/2} cy={layer.height/2} rx={layer.width/2} ry={layer.height/2} {...style} />;
    case 'triangle':
      return <polygon points={`${layer.width/2},0 ${layer.width},${layer.height} 0,${layer.height}`} {...style} />;
    case 'star':
      const points = [];
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? layer.width/2 : layer.width/4;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        points.push(`${layer.width/2 + radius * Math.cos(angle)},${layer.height/2 + radius * Math.sin(angle)}`);
      }
      return <polygon points={points.join(' ')} {...style} />;
    case 'hexagon':
      const hexPoints = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        hexPoints.push(`${layer.width/2 + (layer.width/2) * Math.cos(angle)},${layer.height/2 + (layer.height/2) * Math.sin(angle)}`);
      }
      return <polygon points={hexPoints.join(' ')} {...style} />;
    case 'line':
      return <line x1="0" y1={layer.height/2} x2={layer.width} y2={layer.height/2} {...style} />;
    default:
      return null;
  }
};

// Wrap text to fit within max width
export const wrapText = (text, maxWidth, fontSize, fontFamily) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + ' ' + word;
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

// Get user permissions based on role
export const getPermissionsByRole = (role) => {
  const rolePermissions = {
    admin: ['all'],
    designer: ['create', 'edit', 'view'],
    marketer: ['view', 'use'],
    viewer: ['view']
  };
  return rolePermissions[role] || ['view'];
};

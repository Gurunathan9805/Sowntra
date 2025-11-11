// Style utility functions for elements
export const getFilterCSS = (filters) => {
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
};

export const getBackgroundStyle = (element) => {
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
};

export const updateFilter = (elementId, filterName, value, getCurrentPageElements, updateElement) => {
  const currentElements = getCurrentPageElements();
  const element = currentElements.find(el => el.id === elementId);
  if (element) {
    const updatedFilters = { ...element.filters };
    if (updatedFilters[filterName]) {
      updatedFilters[filterName] = { ...updatedFilters[filterName], value };
      updateElement(elementId, { filters: updatedFilters });
    }
  }
};
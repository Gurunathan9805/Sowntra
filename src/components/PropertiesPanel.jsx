import React from 'react';
import { 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  Copy, Trash2, Lock, Unlock, MinusCircle, PlusCircle,
  Download, Film, Square, Save, FolderOpen
} from 'lucide-react';
import { filterOptions, fontFamilies, stickerOptions, animations } from '../types/types.js';
import GradientPicker from './GradientPicker.jsx';

const PropertiesPanel = ({
  t,
  selectedElementData,
  selectedElement,
  updateElement,
  updateFilter,
  duplicateElement,
  toggleElementLock,
  changeZIndex,
  deleteElement,
  lockedElements,
  gradientPickerKey,
  setGradientPickerKey,
  exportAsImage,
  exportAsPDF,
  exportAsSVG,
  recording,
  startRecording,
  stopRecording,
  recordingTimeElapsed,
  videoFormat,
  setVideoFormat,
  videoQuality,
  setVideoQuality,
  recordingDuration,
  setRecordingDuration,
  handleSaveClick,
  loadProject,
  currentLanguage,
  transliterationEnabled,
  setTransliterationEnabled
}) => {
  // FIX: Add safety checks for undefined arrays
  const safeFilterOptions = filterOptions || {};
  const safeFontFamilies = fontFamilies || [];
  const safeStickerOptions = stickerOptions || [];
  const safeAnimations = animations || {};

  // Transliteration Toggle Component
  const TransliterationToggle = () => {
    const needsTransliteration = ['hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'or'].includes(currentLanguage);
    
    if (!needsTransliteration) return null;
    
    return (
      <div className="mb-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={transliterationEnabled}
            onChange={() => setTransliterationEnabled(!transliterationEnabled)}
            className="mr-2"
          />
          <span className="text-sm">Enable Transliteration (Type in English)</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Type English letters to get characters
        </p>
      </div>
    );
  };

  // Video Settings Component
  const VideoSettings = () => (
    <div className="mb-4 p-3 bg-gray-100 rounded">
      <h3 className="font-semibold mb-2 text-gray-700">{t?.('export.videoSettings') || 'Video Settings'}</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Format</label>
          <select
            value={videoFormat}
            onChange={(e) => setVideoFormat(e.target.value)}
            className="w-full p-2 border rounded text-sm text-gray-700"
          >
            <option value="webm">WebM (Recommended)</option>
            <option value="mp4">MP4 (Limited Support)</option>
            <option value="gif">GIF (Animated)</option>
          </select>
          {videoFormat === 'mp4' && (
            <p className="text-xs text-orange-600 mt-1">
              MP4 support varies by browser
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Quality</label>
          <select
            value={videoQuality}
            onChange={(e) => setVideoQuality(e.target.value)}
            className="w-full p-2 border rounded text-sm text-gray-700"
          >
            <option value="low">Low Quality</option>
            <option value="medium">Medium Quality</option>
            <option value="high">High Quality</option>
          </select>
        </div>
      </div>
      
      <div className="mt-3">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Animation Loop: {recordingDuration}s
        </label>
        <input
          type="range"
          min="3"
          max="30"
          value={recordingDuration}
          onChange={(e) => setRecordingDuration(parseInt(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">Duration for animations to loop</p>
      </div>
    </div>
  );

  return (
    <div className="properties-panel">
      {/* Properties Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">{t?.('properties.title') || 'Properties'}</h2>
        
        {selectedElementData ? (
          <div>
            {/* Animation Selection */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">{t?.('properties.animation') || 'Animation'}</label>
              <select
                value={selectedElementData.animation || ''}
                onChange={(e) => updateElement(selectedElement, { animation: e.target.value || null })}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="">{t?.('effects.none') || 'None'}</option>
                {Object.entries(safeAnimations).map(([key, anim]) => (
                  <option key={key} value={key}>
                    {anim.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Position and Size */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">{t?.('properties.x') || 'X'}</label>
                <input
                  type="number"
                  value={selectedElementData.x}
                  onChange={(e) => updateElement(selectedElement, { x: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t?.('properties.y') || 'Y'}</label>
                <input
                  type="number"
                  value={selectedElementData.y}
                  onChange={(e) => updateElement(selectedElement, { y: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">{t?.('properties.width') || 'Width'}</label>
                <input
                  type="number"
                  value={selectedElementData.width}
                  onChange={(e) => updateElement(selectedElement, { width: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded text-sm"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t?.('properties.height') || 'Height'}</label>
                <input
                  type="number"
                  value={selectedElementData.height}
                  onChange={(e) => updateElement(selectedElement, { height: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded text-sm"
                  min="1"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">{t?.('properties.rotation') || 'Rotation'}</label>
              <input
                type="range"
                min="0"
                max="360"
                value={selectedElementData.rotation || 0}
                onChange={(e) => updateElement(selectedElement, { rotation: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-xs text-center">{selectedElementData.rotation || 0}°</div>
            </div>

            {/* Filters */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Filters</label>
              {Object.entries(selectedElementData.filters || safeFilterOptions).map(([key, filter]) => (
                <div key={key} className="filter-slider mb-2">
                  <label className="text-sm">{filter.name}</label>
                  <input
                    type="range"
                    min="0"
                    max={filter.max}
                    value={filter.value}
                    onChange={(e) => updateFilter(selectedElement, key, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="filter-value text-xs text-center">{filter.value}{filter.unit}</div>
                </div>
              ))}
            </div>

            {/* Fill Type Selection */}
            {['rectangle', 'circle', 'triangle', 'star', 'hexagon', 'sticker'].includes(selectedElementData.type) && (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Fill Type</label>
                  <div className="flex space-x-2 mb-3">
                    <button
                      onClick={() => updateElement(selectedElement, { fillType: 'solid' })}
                      className={`p-2 rounded text-xs flex-1 ${
                        selectedElementData.fillType === 'solid' ? 'bg-blue-100 text-blue-600 border border-blue-300' : 'bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Solid Color
                    </button>
                    <button
                      onClick={() => updateElement(selectedElement, { fillType: 'gradient' })}
                      className={`p-2 rounded text-xs flex-1 ${
                        selectedElementData.fillType === 'gradient' ? 'bg-blue-100 text-blue-600 border border-blue-300' : 'bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Gradient
                    </button>
                  </div>
                </div>

                {/* SOLID COLOR PICKER */}
                {selectedElementData.fillType === 'solid' && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Fill Color</label>
                    <input
                      type="color"
                      value={selectedElementData.fill}
                      onChange={(e) => updateElement(selectedElement, { fill: e.target.value })}
                      className="w-full p-2 border rounded text-sm h-10 cursor-pointer"
                    />
                  </div>
                )}

                {/* GRADIENT PICKER */}
                {selectedElementData.fillType === 'gradient' && (
                  <GradientPicker
                    key={gradientPickerKey}
                    gradient={selectedElementData.gradient}
                    onGradientChange={(gradient) => updateElement(selectedElement, { gradient })}
                  />
                )}
              </>
            )}

            {/* Text Properties */}
            {selectedElementData.type === 'text' && (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">{t?.('text.fontSize') || 'Font Size'}</label>
                  <input
                    type="number"
                    value={selectedElementData.fontSize}
                    onChange={(e) => updateElement(selectedElement, { fontSize: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded text-sm"
                    min="8"
                    max="72"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">{t?.('text.fontFamily') || 'Font Family'}</label>
                  <select
                    value={selectedElementData.fontFamily}
                    onChange={(e) => updateElement(selectedElement, { fontFamily: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                  >
                    {safeFontFamilies.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">{t?.('text.color') || 'Color'}</label>
                  <input
                    type="color"
                    value={selectedElementData.color}
                    onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                    className="w-full p-2 border rounded text-sm h-10"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">{t?.('text.textAlign') || 'Text Align'}</label>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => updateElement(selectedElement, { textAlign: 'left' })}
                      className={`p-2 rounded ${selectedElementData.textAlign === 'left' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                      title={t?.('text.left') || 'Left'}
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      onClick={() => updateElement(selectedElement, { textAlign: 'center' })}
                      className={`p-2 rounded ${selectedElementData.textAlign === 'center' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                      title={t?.('text.center') || 'Center'}
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button
                      onClick={() => updateElement(selectedElement, { textAlign: 'right' })}
                      className={`p-2 rounded ${selectedElementData.textAlign === 'right' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                      title={t?.('text.right') || 'Right'}
                    >
                      <AlignRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">{t?.('text.textStyle') || 'Text Style'}</label>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => updateElement(selectedElement, { 
                        fontWeight: selectedElementData.fontWeight === 'bold' ? 'normal' : 'bold' 
                      })}
                      className={`p-2 rounded ${selectedElementData.fontWeight === 'bold' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                      title={t?.('text.bold') || 'Bold'}
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      onClick={() => updateElement(selectedElement, { 
                        fontStyle: selectedElementData.fontStyle === 'italic' ? 'normal' : 'italic' 
                      })}
                      className={`p-2 rounded ${selectedElementData.fontStyle === 'italic' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                      title={t?.('text.italic') || 'Italic'}
                    >
                      <Italic size={16} />
                    </button>
                    <button
                      onClick={() => updateElement(selectedElement, { 
                        textDecoration: selectedElementData.textDecoration === 'underline' ? 'none' : 'underline' 
                      })}
                      className={`p-2 rounded ${selectedElementData.textDecoration === 'underline' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                      title={t?.('text.underline') || 'Underline'}
                    >
                      <Underline size={16} />
                    </button>
                  </div>
                </div>
                <TransliterationToggle />
              </>
            )}

            {/* Shape Properties */}
            {['rectangle', 'circle', 'triangle', 'star', 'hexagon'].includes(selectedElementData.type) && (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Stroke Color</label>
                  <input
                    type="color"
                    value={selectedElementData.stroke}
                    onChange={(e) => updateElement(selectedElement, { stroke: e.target.value })}
                    className="w-full p-2 border rounded text-sm h-10 cursor-pointer"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Stroke Width</label>
                  <input
                    type="number"
                    value={selectedElementData.strokeWidth}
                    onChange={(e) => updateElement(selectedElement, { strokeWidth: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded text-sm"
                    min="0"
                  />
                </div>
                {selectedElementData.type === 'rectangle' && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Border Radius</label>
                    <input
                      type="number"
                      value={selectedElementData.borderRadius}
                      onChange={(e) => updateElement(selectedElement, { borderRadius: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded text-sm"
                      min="0"
                    />
                  </div>
                )}
                {selectedElementData.type === 'star' && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Points</label>
                    <input
                      type="number"
                      value={selectedElementData.points || 5}
                      onChange={(e) => updateElement(selectedElement, { points: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded text-sm"
                      min="3"
                      max="20"
                    />
                  </div>
                )}
              </>
            )}

            {/* Image Properties */}
            {selectedElementData.type === 'image' && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Border Radius</label>
                <input
                  type="number"
                  value={selectedElementData.borderRadius}
                  onChange={(e) => updateElement(selectedElement, { borderRadius: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded text-sm"
                  min="0"
                />
              </div>
            )}

            {/* Sticker Properties */}
            {selectedElementData.type === 'sticker' && (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Sticker</label>
                  <div className="sticker-grid grid grid-cols-4 gap-2">
                    {safeStickerOptions.map(sticker => (
                      <button
                        key={sticker.name}
                        onClick={() => updateElement(selectedElement, { sticker: sticker.name })}
                        className={`sticker-button p-2 rounded text-2xl ${
                          selectedElementData.sticker === sticker.name ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
                        } border`}
                      >
                        {sticker.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => duplicateElement(selectedElement)}
                className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center"
                disabled={lockedElements.has(selectedElement)}
              >
                <Copy size={14} className="mr-1" />
                Duplicate
              </button>
              <button
                onClick={() => toggleElementLock(selectedElement)}
                className={`p-2 rounded text-sm flex items-center justify-center ${
                  lockedElements.has(selectedElement) 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {lockedElements.has(selectedElement) ? (
                  <>
                    <Unlock size={14} className="mr-1" />
                    Unlock
                  </>
                ) : (
                  <>
                    <Lock size={14} className="mr-1" />
                    Lock
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => changeZIndex(selectedElement, 'backward')}
                className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center"
                disabled={lockedElements.has(selectedElement)}
              >
                <MinusCircle size={14} className="mr-1" />
                Backward
              </button>
              <button
                onClick={() => changeZIndex(selectedElement, 'forward')}
                className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center"
                disabled={lockedElements.has(selectedElement)}
              >
                <PlusCircle size={14} className="mr-1" />
                Forward
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => changeZIndex(selectedElement, 'back')}
                className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center"
                disabled={lockedElements.has(selectedElement)}
              >
                To Back
              </button>
              <button
                onClick={() => changeZIndex(selectedElement, 'front')}
                className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center"
                disabled={lockedElements.has(selectedElement)}
              >
                To Front
              </button>
            </div>

            <button
              onClick={() => deleteElement(selectedElement)}
              className="w-full p-2 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 flex items-center justify-center"
              disabled={lockedElements.has(selectedElement)}
            >
              <Trash2 size={14} className="mr-1" />
              {t?.('properties.delete') || 'Delete'}
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">{t?.('properties.selectElement') || 'Select an element to edit properties'}</p>
        )}
      </div>

      {/* Export Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4 text-gray-700">{t?.('export.title') || 'Export'}</h2>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => exportAsImage('png')}
            className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
          >
            <Download size={14} className="mr-1" />
            PNG
          </button>
          <button
            onClick={() => exportAsImage('jpeg')}
            className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
          >
            <Download size={14} className="mr-1" />
            JPEG
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => exportAsImage('webp')}
            className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
          >
            <Download size={14} className="mr-1" />
            WebP
          </button>
          <button
            onClick={() => exportAsImage('svg')}
            className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
          >
            <Download size={14} className="mr-1" />
            SVG
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2 mb-3">
          <button
            onClick={exportAsPDF}
            className="p-2 bg-blue-100 rounded text-sm hover:bg-blue-200 flex items-center justify-center text-blue-700 font-medium"
          >
            <Download size={14} className="mr-1" />
            PDF
          </button>
        </div>
        
        {/* Video Export Settings */}
        <VideoSettings />
        
        {!recording ? (
          <button
            onClick={startRecording}
            className="w-full p-2 rounded text-sm flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600"
          >
            <Film size={14} className="mr-1" />
            {t?.('export.exportVideo') || 'Export Video'}
          </button>
        ) : (
          <div className="space-y-2">
            <div className="w-full p-2 bg-red-50 border border-red-200 rounded text-sm flex items-center justify-center text-red-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Recording... {Math.floor(recordingTimeElapsed / 60)}:{(recordingTimeElapsed % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <button
              onClick={stopRecording}
              className="w-full p-2 rounded text-sm flex items-center justify-center bg-red-500 text-white hover:bg-red-600"
            >
              <Square size={14} className="mr-1" />
              {t?.('recording.stop') || 'Stop'}
            </button>
          </div>
        )}
      </div>

      {/* Project Actions */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-700">{t?.('project.title') || 'Project'}</h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSaveClick}
            className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
          >
            <Save size={14} className="mr-1" />
            {t?.('project.save') || 'Save'}
          </button>
          <button
            onClick={loadProject}
            className="p-2 bg-gray-100 rounded text-sm hover:bg-gray-200 flex items-center justify-center text-gray-700"
          >
            <FolderOpen size={14} className="mr-1" />
            {t?.('project.load') || 'Load'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
# Quick Reference Guide - Refactored Admin Components

## File Structure
```
src/
├── admin-components/
│   ├── Dashboard.jsx           # Dashboard view with analytics
│   ├── Library.jsx             # Template library view
│   ├── Editor.jsx              # Canvas editor
│   ├── EditorToolbar.jsx       # Editor toolbar
│   ├── UserManagement.jsx      # User list and management
│   ├── UserModals.jsx          # Add user & Edit profile modals
│   ├── TemplateModals.jsx      # Upload & Preset modals
│   ├── constants.js            # All constants
│   ├── helpers.js              # Utility functions
│   └── README.md               # Full documentation
└── pages/
    └── adminApp.jsx            # Main app composition
```

## Component Import Examples

### Using the main app
```javascript
import AdminApp from './pages/adminApp';

<AdminApp />
```

### Using individual components
```javascript
import Dashboard from './admin-components/Dashboard';
import Library from './admin-components/Library';
import Editor from './admin-components/Editor';
import UserManagement from './admin-components/UserManagement';
```

### Using constants
```javascript
import { CATEGORIES, FONTS_FAMILIES, ANIMATIONS, USER_ROLES } from './admin-components/constants';
```

### Using helpers
```javascript
import { 
  generateId, 
  getEffectStyle, 
  getAnimationClass,
  getGroupBounds,
  renderShape,
  wrapText,
  getPermissionsByRole
} from './admin-components/helpers';
```

## Main State Management Structure

### Current View
```javascript
currentView: 'dashboard' | 'editor' | 'library'
setCurrentView(view)
```

### Templates
```javascript
templates: Array<{
  id, name, category, tags, thumbnail,
  visibility, creator, creatorId, creatorAvatar,
  date, json, views, uses
}>
setTemplates(updater)
```

### Users
```javascript
users: Array<{
  id, name, email, avatar, role,
  joinDate, templatesCreated, lastActive,
  status, permissions
}>
currentUser: User
setUsers(updater)
setCurrentUser(updater)
```

### Editor State
```javascript
editorState: {
  name, category, tags, visibility,
  background, layers, selectedLayerIds,
  zoom, canvasWidth, canvasHeight,
  showGrid, showRulers, activeTool
}
setEditorState(updater)
```

### Editor Layers
```javascript
// Text Layer
{
  id, type: 'text',
  x, y, width, height,
  content, fontSize, fontFamily, fontWeight, fontStyle,
  textAlign, color, textWrap,
  rotation, opacity, locked, visible,
  animation, effect, effectValue, zIndex
}

// Shape Layer
{
  id, type: 'shape', shapeType,
  x, y, width, height,
  fill, stroke, strokeWidth,
  rotation, opacity, locked, visible,
  animation, effect, effectValue, zIndex
}

// Image Layer
{
  id, type: 'image',
  x, y, width, height, src,
  rotation, opacity, locked, visible,
  animation, effect, effectValue, zIndex
}

// Group Layer
{
  id, type: 'group',
  x, y, width, height,
  children: [layerId, ...],
  rotation, opacity, locked, visible,
  animation, effect, zIndex
}
```

## Key Functions Reference

### History Management
```javascript
undo()              // Undo last action
redo()              // Redo last action
addToHistory(state) // Save state to history
```

### Layer Operations
```javascript
addTextLayer()           // Add new text layer
addShapeLayer(type)      // Add shape (rectangle, circle, etc)
addImageLayer(src)       // Add image layer
updateLayer(id, updates) // Update layer properties
deleteSelectedLayers()   // Delete selected layers
duplicateSelectedLayers()// Duplicate selected layers
toggleLock(id)          // Lock/unlock layer
toggleVisibility(id)    // Show/hide layer
```

### Layer Ordering
```javascript
bringToFront(id)   // Bring layer to front
sendToBack(id)     // Send layer to back
bringForward(id)   // Bring one step forward
sendBackward(id)   // Send one step backward
```

### Layer Grouping & Alignment
```javascript
groupLayers()         // Group selected layers
ungroupLayers()       // Ungroup selected layers
alignLayers(alignment) // Align: 'left', 'center', 'right', 'top', 'middle', 'bottom'
```

### Text Editing
```javascript
startTextEditing(layer)  // Enter text edit mode
finishTextEditing()      // Exit text edit mode
```

### Template Management
```javascript
saveTemplate()            // Save current editor state as template
useTemplate(template)     // Load template into editor
createNewTemplate()       // Show preset modal to create new
createFromPreset(preset)  // Create from selected preset
```

### User Management
```javascript
addNewUser()           // Add new user from form
updateUserRole(userId, newRole)  // Change user role
toggleUserStatus(userId)         // Toggle active/inactive
deleteUser(userId)               // Delete user
startProfileEdit(user)           // Open profile edit modal
saveProfileEdit()                // Save profile changes
handleAvatarUpload(event)        // Upload new avatar
```

### Upload Functions
```javascript
handleUpload()        // Upload template to library
handleFileUpload(file) // Handle file selection
handleDragOver(e)     // Handle drag over canvas
handleDragLeave(e)    // Handle drag leave canvas
handleDrop(e)         // Handle file drop
```

## Constants Available

### CATEGORIES
```javascript
['Social Media', 'Poster', 'Business', 'Marketing', 'Educational', 'Personal']
```

### FONT_FAMILIES
```javascript
['Arial', 'Helvetica', 'Georgia', 'Times New Roman', ..., 'Franklin Gothic']
// 20 font options total
```

### ANIMATIONS
```javascript
['none', 'fadeIn', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown', 
 'bounce', 'pulse', 'shake', 'rotate', 'flip', 'zoom']
```

### EFFECTS
```javascript
['none', 'blur', 'brightness', 'contrast', 'grayscale', 'sepia', 
 'invert', 'saturate', 'hue-rotate', 'drop-shadow', 'opacity']
```

### USER_ROLES
```javascript
[
  { value: 'admin', label: 'Administrator', description: 'Full system access', color: '...' },
  { value: 'designer', label: 'Designer', description: 'Create and edit templates', color: '...' },
  { value: 'marketer', label: 'Marketer', description: 'Use and customize templates', color: '...' },
  { value: 'viewer', label: 'Viewer', description: 'View templates only', color: '...' }
]
```

### TEMPLATE_PRESETS
```javascript
[
  { id: 1, name: "Social Media Post", width: 1080, height: 1080, ... },
  { id: 2, name: "YouTube Thumbnail", width: 1280, height: 720, ... },
  // ... 6 total presets
]
```

### GRADIENTS
```javascript
// 16 pre-defined gradient strings for backgrounds
'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
// ... and 15 more
```

## Common Patterns

### Updating Editor State
```javascript
setEditorState(prev => ({
  ...prev,
  propertyName: newValue
}))
```

### Adding to History
```javascript
const newState = { ...editorState, layers: newLayers };
setEditorState(newState);
addToHistory(newState);
```

### Updating a Layer
```javascript
updateLayer(layerId, { 
  color: '#FF0000',
  fontSize: 24,
  opacity: 0.8
});
```

### Selecting Layers
```javascript
setEditorState(prev => ({
  ...prev,
  selectedLayerIds: [layerId] // Single
  // OR
  selectedLayerIds: [...prev.selectedLayerIds, layerId] // Multiple (Shift+Click)
}))
```

## Performance Tips

1. **Use selectedLayerIds instead of selectedLayer** - Array allows multi-select
2. **Memoize components** - Consider React.memo for expensive re-renders
3. **Use ref for canvas** - Avoid re-creating canvas reference
4. **Batch state updates** - Update multiple properties together
5. **Debounce property changes** - Avoid excessive updates during dragging

## Common Issues & Solutions

### Layers not moving
- Check if `dragState` is being updated properly
- Verify `editorState.zoom` is applied to calculations
- Ensure `handleMouseMove` is attached to window

### Text not showing
- Check `layer.visible` is true
- Verify `layer.content` is not empty
- Check font size isn't too small at zoom level

### Undo/Redo not working
- Verify `addToHistory()` is called after state changes
- Check `historyIndex` is being updated
- Ensure history array is properly managed

### Layers disappearing
- Check `layer.zIndex` values
- Verify `layer.visible` property
- Ensure canvas bounds aren't clipping layers

---

**Last Updated**: November 11, 2025
**Maintainer**: Admin Components Team

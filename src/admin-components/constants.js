// Animation styles for all layer types
export const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInUp {
    from { transform: translateY(100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes slideInDown {
    from { transform: translateY(-100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0,-30px,0); }
    70% { transform: translate3d(0,-15px,0); }
    90% { transform: translate3d(0,-4px,0); }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes flip {
    0% { transform: perspective(400px) rotateY(0); }
    100% { transform: perspective(400px) rotateY(180deg); }
  }
  @keyframes zoom {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
  }
  
  .animate-fadeIn { animation: fadeIn 1s ease-in-out !important; }
  .animate-slideInLeft { animation: slideInLeft 1s ease-out !important; }
  .animate-slideInRight { animation: slideInRight 1s ease-out !important; }
  .animate-slideInUp { animation: slideInUp 1s ease-out !important; }
  .animate-slideInDown { animation: slideInDown 1s ease-out !important; }
  .animate-bounce { animation: bounce 2s infinite !important; }
  .animate-pulse { animation: pulse 2s infinite !important; }
  .animate-shake { animation: shake 0.5s !important; }
  .animate-rotate { animation: rotate 2s linear infinite !important; }
  .animate-flip { animation: flip 1s !important; }
  .animate-zoom { animation: zoom 0.5s !important; }
  
  .canvas-layer {
    animation-fill-mode: both !important;
    animation-iteration-count: 1 !important;
  }
  .canvas-layer.animate-bounce,
  .canvas-layer.animate-pulse,
  .canvas-layer.animate-rotate {
    animation-iteration-count: infinite !important;
  }
`;

// Shapes
export const SHAPES = [
  { type: 'rectangle', name: 'Rectangle' },
  { type: 'circle', name: 'Circle' },
  { type: 'triangle', name: 'Triangle' },
  { type: 'star', name: 'Star' },
  { type: 'hexagon', name: 'Hexagon' },
  { type: 'line', name: 'Line' }
];

// Template categories
export const CATEGORIES = ['Social Media', 'Poster', 'Business', 'Marketing', 'Educational', 'Personal'];

// Font families
export const FONT_FAMILIES = [
  'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 
  'Verdana', 'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS',
  'Arial Black', 'Palatino', 'Garamond', 'Bookman', 'Avant Garde',
  'Brush Script MT', 'Lucida Console', 'Copperplate', 'Papyrus', 'Franklin Gothic'
];

// Animation options
export const ANIMATIONS = [
  'none', 'fadeIn', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown', 
  'bounce', 'pulse', 'shake', 'rotate', 'flip', 'zoom'
];

// Effect options
export const EFFECTS = [
  'none', 'blur', 'brightness', 'contrast', 'grayscale', 'sepia', 
  'invert', 'saturate', 'hue-rotate', 'drop-shadow', 'opacity'
];

// User roles
export const USER_ROLES = [
  { value: 'admin', label: 'Administrator', description: 'Full system access', color: 'bg-purple-100 text-purple-800' },
  { value: 'designer', label: 'Designer', description: 'Create and edit templates', color: 'bg-blue-100 text-blue-800' },
  { value: 'marketer', label: 'Marketer', description: 'Use and customize templates', color: 'bg-green-100 text-green-800' },
  { value: 'viewer', label: 'Viewer', description: 'View templates only', color: 'bg-gray-100 text-gray-800' }
];

// Gradients
export const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
  'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
];

// Template presets
export const TEMPLATE_PRESETS = [
  {
    id: 1,
    name: "Social Media Post",
    width: 1080,
    height: 1080,
    background: { type: 'gradient', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    description: "Perfect for Instagram, Facebook",
    thumbnail: "🖼️"
  },
  {
    id: 2,
    name: "YouTube Thumbnail",
    width: 1280,
    height: 720,
    background: { type: 'solid', color: '#000000' },
    description: "16:9 aspect ratio for videos",
    thumbnail: "🎬"
  },
  {
    id: 3,
    name: "Story Post",
    width: 1080,
    height: 1920,
    background: { type: 'gradient', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    description: "Vertical format for stories",
    thumbnail: "📱"
  },
  {
    id: 4,
    name: "Blog Header",
    width: 1200,
    height: 630,
    background: { type: 'solid', color: '#ffffff' },
    description: "Open Graph image size",
    thumbnail: "📝"
  },
  {
    id: 5,
    name: "Presentation Slide",
    width: 1920,
    height: 1080,
    background: { type: 'solid', color: '#f8fafc' },
    description: "Widescreen presentation",
    thumbnail: "📊"
  },
  {
    id: 6,
    name: "Business Card",
    width: 750,
    height: 450,
    background: { type: 'solid', color: '#ffffff' },
    description: "Standard business card size",
    thumbnail: "💼"
  }
];

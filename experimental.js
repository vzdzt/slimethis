// Experimental Three.js Playground
// Global bangers data (placeholder for now)
let allBangers = [];
let allImages = [];

// Global Three.js variables
let camera, renderer, starField, scene = null;
let gui; // lil-gui instance

// Starfield parameters (now controllable via GUI)
let starfieldParams = {
    starCount: 15000,
    starSize: 1.5,
    animationSpeed: 0.0002,
    mouseInfluence: 0.001,
    scaleAmplitude: 0.05,
    baseScale: 1.0,
    color: { r: 0.3, g: 0.3, b: 0.5 },
    // 3D Text parameters
    showText: false,
    textContent: 'SLIME THIS',
    textSize: 2.0,
    textColor: { r: 0.0, g: 1.0, b: 0.0 },
    textPosition: { x: 0, y: 0, z: -800 }, // POSITIONED TO APPEAR IN FRONT OF STARS
    textAnchorX: 'center',
    textAnchorY: 'middle'
};

// Global 3D text variable
let textMesh = null;

// Initialize the experimental page
async function initExperimental() {
    console.log('🚀 Initializing SlimeThis Experimental Playground');

    // Load basic data (placeholder)
    await loadBasicData();

    // Initialize Three.js starfield
    initStarfieldExperimental();

    // Initialize lil-gui controls
    initGUI();

    // Initialize other components
    initThemeSystem();
    initCursorEffects();
    initAnimations();
}

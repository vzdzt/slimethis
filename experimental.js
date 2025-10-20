// Experimental Three.js Playground
// Global bangers data (placeholder for now)
let allBangers = [];
let allImages = [];

// Global Three.js variables
let camera, renderer, starField, scene = null;
let gui; // lil-gui instance
let pane; // Tweakpane instance

// Starfield parameters (now controllable via GUI)
let starfieldParams = {
    starCount: 15000,
    starSize: 1.5,
    animationSpeed: 0.0002,
    mouseInfluence: 0.001,
    scaleAmplitude: 0.05,
    baseScale: 1.0,
    color: { r: 0.3, g: 0.3, b: 0.5 }
};

// Initialize the experimental page
async function initExperimental() {
    console.log('🚀 Initializing SlimeThis Experimental Playground');

    // Load basic data (placeholder)
    await loadBasicData();

    // Initialize Three.js starfield
    initStarfieldExperimental();

    // Initialize lil-gui controls
    initGUI();

    // Initialize Tweakpane controls
    initTweakpane();

    // Initialize other components
    initThemeSystem();
    initCursorEffects();
    initAnimations();
}

function initStarfieldExperimental() {
    if (isInitialized) return;

    // Check for WebGL support and device performance
    const canvas = document.getElementById('universe');
    if (!canvas || typeof THREE === 'undefined') {
        console.error('Three.js or canvas not found.');
        return;
    }

    // Check for Paint Worklet support and performance issues
    const hasWorkletSupport = CSS && 'paintWorklet' in CSS;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPerfBrowser = !window.WebGLRenderingContext || isMobile || !hasWorkletSupport;

    if (isLowPerfBrowser) {
        canvas.style.display = 'none';
        document.body.style.background = 'var(--background)';
        console.log('Starfield disabled on low-performance device');
        return;
    }

    isInitialized = true;

    try {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 1000;

        // Create stars with initial parameters
        createStars();

        let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
        document.addEventListener('mousemove', debounce((e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * starfieldParams.mouseInfluence;
            mouseY = (e.clientY - window.innerHeight / 2) * starfieldParams.mouseInfluence;
        }, 50));

        function animate() {
            requestAnimationFrame(animate);
            if (starField) {
                targetX += (mouseX - targetX) * 0.02;
                targetY += (mouseY - targetY) * 0.02;
                starField.rotation.x += starfieldParams.animationSpeed;
                starField.rotation.y += starfieldParams.animationSpeed * 1.5;
                const time = Date.now() * 0.001;
                starField.scale.setScalar(Math.sin(time) * starfieldParams.scaleAmplitude + starfieldParams.baseScale);
            }
            renderer.render(scene, camera);
        }

        animate();
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        console.log('✅ Starfield initialized with experimental controls');

    } catch (err) {
        console.error('Starfield initialization failed:', err);
    }
}

function createStars() {
    // Remove existing starfield if it exists
    if (starField) {
        scene.remove(starField);
    }

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < starfieldParams.starCount; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
        colors.push(starfieldParams.color.r, starfieldParams.color.g, starfieldParams.color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: starfieldParams.starSize,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
        fog: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    starField = new THREE.Points(geometry, material);
    scene.add(starField);
}

function initGUI() {
    // Initialize lil-gui
    gui = new lil.GUI({ title: 'Starfield Controls' });

    // Starfield parameters
    const starFolder = gui.addFolder('Stars');
    starFolder.add(starfieldParams, 'starCount', 1000, 50000, 1000).onChange(createStars);
    starFolder.add(starfieldParams, 'starSize', 0.5, 5, 0.1).onChange(() => {
        if (starField && starField.material) {
            starField.material.size = starfieldParams.starSize;
            starField.material.needsUpdate = true;
        }
    });

    // Animation parameters
    const animFolder = gui.addFolder('Animation');
    animFolder.add(starfieldParams, 'animationSpeed', 0, 0.002, 0.0001);
    animFolder.add(starfieldParams, 'mouseInfluence', 0, 0.01, 0.0001);
    animFolder.add(starfieldParams, 'scaleAmplitude', 0, 0.2, 0.01);
    animFolder.add(starfieldParams, 'baseScale', 0.5, 2, 0.1);

    // Color controls
    const colorFolder = gui.addFolder('Colors');
    colorFolder.add(starfieldParams.color, 'r', 0, 1, 0.01).onChange(updateStarColors);
    colorFolder.add(starfieldParams.color, 'g', 0, 1, 0.01).onChange(updateStarColors);
    colorFolder.add(starfieldParams.color, 'b', 0, 1, 0.01).onChange(updateStarColors);

    // Utility functions
    gui.add({ regenerateStars: createStars }, 'regenerateStars').name('Regenerate Stars');
    gui.add({ resetToDefaults: resetStarfieldDefaults }, 'resetToDefaults').name('Reset Defaults');

    console.log('✅ lil-gui controls initialized');
}

function initTweakpane() {
    // Debug: Check what's available globally
    console.log('Available globals:', Object.keys(window).filter(key => key.toLowerCase().includes('tweak') || key.toLowerCase().includes('pane')));

    // Initialize Tweakpane - try different approaches
    try {
        // Try direct Pane constructor
        if (typeof Pane !== 'undefined') {
            pane = new Pane({
                title: 'Tweakpane Controls'
            });
            console.log('✅ Pane constructor worked');
        } else if (typeof Tweakpane !== 'undefined') {
            // Try Tweakpane.Pane
            pane = new Tweakpane.Pane({
                title: 'Tweakpane Controls'
            });
            console.log('✅ Tweakpane.Pane constructor worked');
        } else {
            console.error('❌ Neither Pane nor Tweakpane global found');
            return;
        }
    } catch (e) {
        console.error('❌ Tweakpane initialization failed:', e);
        return;
    }

    // Move the pane to a better position (bottom right)
    // Try different property names for the DOM element
    const paneElement = pane.domElement || pane.element || pane.container;
    if (paneElement) {
        paneElement.style.position = 'fixed';
        paneElement.style.bottom = '20px';
        paneElement.style.right = '20px';
        paneElement.style.zIndex = '10000'; // Higher than lil-gui
        paneElement.style.background = 'rgba(0, 0, 0, 0.8)'; // Make it more visible
        paneElement.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        console.log('✅ Tweakpane styling applied');
    } else {
        console.error('❌ Could not find pane DOM element');
    }

    try {
        // Starfield parameters
        const starFolder = pane.addFolder('Stars');
        starFolder.add(starfieldParams, 'starCount', 1000, 50000, 1000).on('change', createStars);
        starFolder.add(starfieldParams, 'starSize', 0.5, 5, 0.1).on('change', () => {
            if (starField && starField.material) {
                starField.material.size = starfieldParams.starSize;
                starField.material.needsUpdate = true;
            }
        });

        // Animation parameters
        const animFolder = pane.addFolder('Animation');
        animFolder.add(starfieldParams, 'animationSpeed', 0, 0.002, 0.0001);
        animFolder.add(starfieldParams, 'mouseInfluence', 0, 0.01, 0.0001);
        animFolder.add(starfieldParams, 'scaleAmplitude', 0, 0.2, 0.01);
        animFolder.add(starfieldParams, 'baseScale', 0.5, 2, 0.1);

        // Color controls
        const colorFolder = pane.addFolder('Colors');
        colorFolder.add(starfieldParams.color, 'r', 0, 1, 0.01).on('change', updateStarColors);
        colorFolder.add(starfieldParams.color, 'g', 0, 1, 0.01).on('change', updateStarColors);
        colorFolder.add(starfieldParams.color, 'b', 0, 1, 0.01).on('change', updateStarColors);

        // Utility buttons
        pane.addButton('Regenerate Stars').on('click', createStars);
        pane.addButton('Reset Defaults').on('click', resetStarfieldDefaults);

        console.log('✅ Tweakpane controls added successfully');
    } catch (e) {
        console.error('❌ Error adding Tweakpane controls:', e);
    }

    console.log('✅ Tweakpane controls initialized');
}

function updateStarColors() {
    if (starField && starField.geometry.attributes.color) {
        const colorArray = starField.geometry.attributes.color.array;
        for (let i = 0; i < colorArray.length; i += 3) {
            colorArray[i] = starfieldParams.color.r + (Math.random() * 0.2 - 0.1);
            colorArray[i + 1] = starfieldParams.color.g + (Math.random() * 0.2 - 0.1);
            colorArray[i + 2] = starfieldParams.color.b + (Math.random() * 0.2 - 0.1);
        }
        starField.geometry.attributes.color.needsUpdate = true;
    }
}

function resetStarfieldDefaults() {
    starfieldParams.starCount = 15000;
    starfieldParams.starSize = 1.5;
    starfieldParams.animationSpeed = 0.0002;
    starfieldParams.mouseInfluence = 0.001;
    starfieldParams.scaleAmplitude = 0.05;
    starfieldParams.baseScale = 1.0;
    starfieldParams.color = { r: 0.3, g: 0.3, b: 0.5 };

    // Update GUI
    gui.controllers.forEach(controller => controller.updateDisplay());

    // Recreate stars
    createStars();
}

function initThemeSystem() {
    document.getElementById('theme-select').addEventListener('change', function() {
        const newTheme = this.value;
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('currentTheme', newTheme);

        // Update starfield colors based on theme
        updateStarfieldForTheme(newTheme);

        const animations = {
            'galactic-nebula': 'nebula-swirl 15s ease-in-out infinite',
            'electric-storm': 'storm-flash 5s infinite',
            'void-pulse': 'void-pulse 3s infinite',
            'prism-shard': 'prism-shift 6s infinite',
            'inferno-core': 'inferno-glow 4s infinite',
            'cosmic-rift': 'rift-swirl 6s infinite',
            'retro-vaporwave': 'vaporwave-glitch 4s infinite',
            'ultra-glass': 'glass-shimmer 8s ease-in-out infinite',
            'satin': 'satin-flow 6s ease-in-out infinite',
            'glass-morphism': 'glass-shimmer 8s ease-in-out infinite',
            'veazy': 'cyber-flow 5s ease-in-out infinite',
            'neon-fluid': 'fluid-flow 4s ease-in-out infinite',
            'aurora-wave': 'aurora-flow 8s ease-in-out infinite'
        };

        document.body.style.animation = animations[newTheme] || 'none';
    });

    // Apply saved theme
    const savedTheme = localStorage.getItem('currentTheme') || 'veazy';
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-select').value = savedTheme;
    updateStarfieldForTheme(savedTheme);
}

function updateStarfieldForTheme(theme) {
    const themeColors = {
        'ultra-glass': { r: 0.8, g: 0.8, b: 1.0 },
        'satin': { r: 1.0, g: 0.84, b: 0.2 },
        'galactic-nebula': { r: 1.0, g: 0.1, b: 0.55 },
        'electric-storm': { r: 0.0, g: 1.0, b: 0.8 },
        'glass-morphism': { r: 0.7, g: 0.9, b: 1.0 },
        'void-pulse': { r: 1.0, g: 0.0, b: 1.0 },
        'prism-shard': { r: 0.4, g: 1.0, b: 0.8 },
        'inferno-core': { r: 1.0, g: 0.2, b: 0.0 },
        'cosmic-rift': { r: 0.7, g: 0.4, b: 1.0 },
        'retro-vaporwave': { r: 1.0, g: 0.41, b: 0.71 },
        'veazy': { r: 0.0, g: 1.0, b: 0.0 },
        'neon-fluid': { r: 0.0, g: 1.0, b: 1.0 },
        'aurora-wave': { r: 0.0, g: 1.0, b: 0.5 }
    };

    const baseColor = themeColors[theme] || { r: 0.3, g: 0.3, b: 0.5 };
    starfieldParams.color = baseColor;
    updateStarColors();

    // Update GUI color controls
    if (gui) {
        const colorFolder = gui.folders.find(f => f._title === 'Colors');
        if (colorFolder) {
            colorFolder.controllers.forEach(controller => controller.updateDisplay());
        }
    }
}

function initCursorEffects() {
    const cursor = document.getElementById('cursor');
    const cursorBlur = document.getElementById('cursor-blur');

    if (cursor && cursorBlur) {
        cursor.style.visibility = 'visible';
        cursorBlur.style.visibility = 'visible';

        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
                cursorBlur.style.left = `${e.clientX}px`;
                cursorBlur.style.top = `${e.clientY}px`;
            });
        });
    }
}

function initAnimations() {
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.from('.nav-title', {
            opacity: 0,
            y: -50,
            duration: 1,
            ease: 'power2.out'
        });
        gsap.from('.subtitle', {
            opacity: 0,
            y: -30,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.3
        });
        gsap.from('#output', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.5
        });
    }
}

async function loadBasicData() {
    // Placeholder for loading any necessary data
    console.log('📊 Loading experimental data...');
}

// Utility functions
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

// Global flag to prevent multiple initializations
let isInitialized = false;

// Start the experimental playground
document.addEventListener('DOMContentLoaded', initExperimental);

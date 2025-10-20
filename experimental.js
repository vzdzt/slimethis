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
    // Initialize lil-gui with custom styling and better positioning
    gui = new lil.GUI({
        title: 'Starfield Controls',
        width: 280
    });

    // Position in bottom-right corner to avoid navbar
    gui.domElement.style.position = 'fixed';
    gui.domElement.style.bottom = '20px';
    gui.domElement.style.right = '20px';
    gui.domElement.style.zIndex = '1000';

    // Apply custom SlimeThis styling
    styleLilGUI();

    // Starfield parameters
    const starFolder = gui.addFolder('🌟 Stars');
    starFolder.add(starfieldParams, 'starCount', 1000, 50000, 1000).onChange(createStars);
    starFolder.add(starfieldParams, 'starSize', 0.5, 5, 0.1).onChange(() => {
        if (starField && starField.material) {
            starField.material.size = starfieldParams.starSize;
            starField.material.needsUpdate = true;
        }
    });

    // Animation parameters
    const animFolder = gui.addFolder('⚡ Animation');
    animFolder.add(starfieldParams, 'animationSpeed', 0, 0.002, 0.0001);
    animFolder.add(starfieldParams, 'mouseInfluence', 0, 0.01, 0.0001);
    animFolder.add(starfieldParams, 'scaleAmplitude', 0, 0.2, 0.01);
    animFolder.add(starfieldParams, 'baseScale', 0.5, 2, 0.1);

    // Color controls
    const colorFolder = gui.addFolder('🎨 Colors');
    colorFolder.add(starfieldParams.color, 'r', 0, 1, 0.01).onChange(updateStarColors);
    colorFolder.add(starfieldParams.color, 'g', 0, 1, 0.01).onChange(updateStarColors);
    colorFolder.add(starfieldParams.color, 'b', 0, 1, 0.01).onChange(updateStarColors);

    // Utility functions
    gui.add({ regenerateStars: createStars }, 'regenerateStars').name('🔄 Regenerate Stars');
    gui.add({ resetToDefaults: resetStarfieldDefaults }, 'resetToDefaults').name('⚙️ Reset Defaults');

    console.log('✅ lil-gui controls initialized with SlimeThis styling');
}

function styleLilGUI() {
    // Wait for GUI to be created, then apply custom styles
    setTimeout(() => {
        if (!gui || !gui.domElement) return;

        const guiElement = gui.domElement;

        // Apply SlimeThis cyber theme
        guiElement.style.background = 'rgba(0, 0, 0, 0.9)';
        guiElement.style.backdropFilter = 'blur(20px)';
        guiElement.style.border = '2px solid var(--primary, #00ff00)';
        guiElement.style.borderRadius = '12px';
        guiElement.style.boxShadow = '0 0 20px var(--glow, rgba(0, 255, 0, 0.3))';
        guiElement.style.fontFamily = 'Arial, sans-serif';

        // Style the title
        const title = guiElement.querySelector('.title');
        if (title) {
            title.style.color = 'var(--primary, #00ff00)';
            title.style.textShadow = '0 0 8px var(--glow, #00ff00)';
            title.style.fontWeight = 'bold';
            title.style.fontSize = '14px';
        }

        // Style folders
        const folders = guiElement.querySelectorAll('.folder');
        folders.forEach(folder => {
            const title = folder.querySelector('.title');
            if (title) {
                title.style.color = 'var(--text-color, #ffffff)';
                title.style.fontSize = '12px';
                title.style.fontWeight = '600';
            }
        });

        // Style controllers
        const controllers = guiElement.querySelectorAll('.controller');
        controllers.forEach(controller => {
            controller.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            controller.style.padding = '4px 0';

            const name = controller.querySelector('.name');
            if (name) {
                name.style.color = 'var(--text-color, #ffffff)';
                name.style.fontSize = '11px';
            }
        });

        // Style buttons
        const buttons = guiElement.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.background = 'rgba(0, 255, 0, 0.1)';
            button.style.border = '1px solid var(--primary, #00ff00)';
            button.style.borderRadius = '6px';
            button.style.color = 'var(--primary, #00ff00)';
            button.style.fontSize = '11px';
            button.style.fontWeight = '600';
            button.style.transition = 'all 0.3s ease';

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(0, 255, 0, 0.2)';
                button.style.boxShadow = '0 0 8px var(--glow, rgba(0, 255, 0, 0.3))';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(0, 255, 0, 0.1)';
                button.style.boxShadow = 'none';
            });
        });

        // Style sliders
        const sliders = guiElement.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.style.accentColor = 'var(--primary, #00ff00)';
        });

        console.log('🎨 lil-gui styled with SlimeThis cyber theme');
    }, 100); // Small delay to ensure GUI is fully rendered
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
        // Note: ScrollTrigger not loaded in experimental page, using basic GSAP
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

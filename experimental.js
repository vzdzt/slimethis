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
    // 3D Text parameters only
};

// Global 3D text variable

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

                // Animate 3D text if it exists
                }
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


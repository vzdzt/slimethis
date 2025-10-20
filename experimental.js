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
    showText: false,
    textContent: 'SLIME THIS',
    textSize: 2.0,
    textColor: { r: 0.0, g: 1.0, b: 0.0 },
    textPosition: { x: 0, y: 0, z: -50 },
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
                if (textMesh) {
                    textMesh.rotation.y += 0.005; // Slow rotation
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

function create3DText() {
    // Remove existing text if it exists
    if (textMesh) {
        scene.remove(textMesh);
        textMesh.dispose();
        textMesh = null;
    }

    if (!starfieldParams.showText) return;

    try {
        // Create new 3D text using Troika Three Text
        textMesh = new TroikaThreeText.Text();

        // Set text properties
        textMesh.text = starfieldParams.textContent;
        textMesh.fontSize = starfieldParams.textSize;
        textMesh.color = new THREE.Color(
            starfieldParams.textColor.r,
            starfieldParams.textColor.g,
            starfieldParams.textColor.b
        );
        textMesh.position.set(
            starfieldParams.textPosition.x,
            starfieldParams.textPosition.y,
            starfieldParams.textPosition.z
        );
        textMesh.anchorX = starfieldParams.textAnchorX;
        textMesh.anchorY = starfieldParams.textAnchorY;

        // Add to scene
        scene.add(textMesh);

        // Sync the text (asynchronous)
        textMesh.sync(() => {
            console.log('✅ 3D Text synced successfully');
        });

        console.log('✅ 3D Text created:', starfieldParams.textContent);

    } catch (error) {
        console.error('❌ 3D Text creation failed:', error);
    }
}

function update3DText() {
    if (!textMesh) return;

    try {
        textMesh.text = starfieldParams.textContent;
        textMesh.fontSize = starfieldParams.textSize;
        textMesh.color = new THREE.Color(
            starfieldParams.textColor.r,
            starfieldParams.textColor.g,
            starfieldParams.textColor.b
        );
        textMesh.position.set(
            starfieldParams.textPosition.x,
            starfieldParams.textPosition.y,
            starfieldParams.textPosition.z
        );
        textMesh.anchorX = starfieldParams.textAnchorX;
        textMesh.anchorY = starfieldParams.textAnchorY;

        // Sync changes
        textMesh.sync();

    } catch (error) {
        console.error('❌ 3D Text update failed:', error);
    }
}

function initGUI() {
    // Create custom collapsible control panel
    createCollapsibleControlPanel();
    console.log('✅ Custom collapsible control panel initialized');
}

function createCollapsibleControlPanel() {
    // Ensure body has position relative for absolute positioning to work
    document.body.style.position = 'relative';

    // Create the main container
    const panel = document.createElement('div');
    panel.id = 'control-panel';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        right: -50px; /* Start with tab visible */
        transform: translateY(-50%);
        z-index: 1000;
        transition: all 0.3s ease;
    `;

    // Create the main control tab (visible part) - positioned relative to document
    const tab = document.createElement('div');
    tab.id = 'control-tab';
    tab.innerHTML = '⚙️';
    tab.style.cssText = `
        position: absolute;
        bottom: -95px; /* Sweet spot below document bottom */
        right: 70px; /* Horizontal position */
        width: 32px;
        height: 32px;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(20px);
        border: 2px solid var(--primary);
        border-radius: 50%;
        color: var(--primary, #00ff00);
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 0 8px var(--glow);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        z-index: 9999; /* Increased z-index to ensure visibility */
        pointer-events: auto; /* Ensure clicks work */
    `;

    // Create the Troika 3D text tab (separate button) - positioned left of main tab
    const troikaTab = document.createElement('div');
    troikaTab.id = 'troika-tab';
    troikaTab.innerHTML = '📝';
    troikaTab.style.cssText = `
        position: absolute;
        bottom: -95px; /* Same level as main tab */
        right: 120px; /* Left of main tab */
        width: 32px;
        height: 32px;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(20px);
        border: 2px solid var(--primary);
        border-radius: 50%;
        color: var(--primary, #00ff00);
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 0 8px var(--glow);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        z-index: 9999; /* Increased z-index to ensure visibility */
        pointer-events: auto; /* Ensure clicks work */
    `;

    // Create the content panel (hidden by default) - 15% smaller
    const content = document.createElement('div');
    content.id = 'control-content';
    content.style.cssText = `
        width: 255px; /* 300px * 0.85 = 255px (15% smaller) */
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(20px);
        border: 2px solid var(--primary, #00ff00);
        border-right: none;
        border-radius: 12px 0 0 12px;
        padding: 17px; /* Slightly smaller padding too */
        margin-right: 50px;
        opacity: 0;
        visibility: hidden;
        transform: translateX(20px);
        transition: all 0.3s ease;
        max-height: 80vh;
        overflow-y: auto;
    `;

    // Create sections - KEPT THE SAME STARFIELD CONTROLS
    content.innerHTML = `
        <h3 style="color: var(--primary, #00ff00); margin: 0 0 15px 0; text-shadow: 0 0 8px var(--glow, #00ff00);">
            🌟 Starfield Controls
        </h3>

        <div class="control-section">
            <h4 style="color: var(--text-color, #ffffff); margin: 10px 0; font-size: 14px;">🌟 Stars</h4>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Count: <span id="star-count-value">15000</span></label>
                <input type="range" id="star-count" min="1000" max="50000" step="1000" value="15000" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Size: <span id="star-size-value">1.5</span></label>
                <input type="range" id="star-size" min="0.5" max="5" step="0.1" value="1.5" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
        </div>

        <div class="control-section">
            <h4 style="color: var(--text-color, #ffffff); margin: 10px 0; font-size: 14px;">⚡ Animation</h4>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Speed: <span id="anim-speed-value">0.0002</span></label>
                <input type="range" id="anim-speed" min="0" max="0.01" step="0.0001" value="0.0002" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Mouse Influence: <span id="mouse-influence-value">0.001</span></label>
                <input type="range" id="mouse-influence" min="0" max="0.01" step="0.0001" value="0.001" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Scale Amplitude: <span id="scale-amplitude-value">0.05</span></label>
                <input type="range" id="scale-amplitude" min="0" max="0.2" step="0.01" value="0.05" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Base Scale: <span id="base-scale-value">1.0</span></label>
                <input type="range" id="base-scale" min="0.5" max="2" step="0.1" value="1.0" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
        </div>

        <div class="control-section">
            <h4 style="color: var(--text-color, #ffffff); margin: 10px 0; font-size: 14px;">🎨 Colors</h4>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Red: <span id="color-r-value">0.3</span></label>
                <input type="range" id="color-r" min="0" max="1" step="0.01" value="0.3" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Green: <span id="color-g-value">0.3</span></label>
                <input type="range" id="color-g" min="0" max="1" step="0.01" value="0.3" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Blue: <span id="color-b-value">0.5</span></label>
                <input type="range" id="color-b" min="0" max="1" step="0.01" value="0.5" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
        </div>

        <div class="control-section" style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 15px; margin-top: 15px;">
            <button id="regenerate-btn" style="
                width: 100%;
                padding: 8px;
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid var(--primary, #00ff00);
                border-radius: 6px;
                color: var(--primary, #00ff00);
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 8px;
            ">🔄 Regenerate Stars</button>
            <button id="reset-btn" style="
                width: 100%;
                padding: 8px;
                background: rgba(255, 100, 100, 0.1);
                border: 1px solid #ff6464;
                border-radius: 6px;
                color: #ff6464;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">⚙️ Reset Defaults</button>
        </div>
    `;

    // Add hover effects to tab (matching profile picture)
    tab.addEventListener('mouseenter', () => {
        tab.style.transform = 'scale(1.1)';
        tab.style.boxShadow = '0 0 12px var(--glow)';
    });

    tab.addEventListener('mouseleave', () => {
        if (!panel.classList.contains('open')) {
            tab.style.transform = 'scale(1)';
            tab.style.boxShadow = '0 0 8px var(--glow)';
        }
    });

    // Toggle panel on tab click
    let isOpen = false;
    tab.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            panel.classList.add('open');
            content.style.opacity = '1';
            content.style.visibility = 'visible';
            content.style.transform = 'translateX(0)';
            tab.innerHTML = '✕';
            tab.style.background = 'rgba(0, 255, 0, 0.2)';
        } else {
            panel.classList.remove('open');
            content.style.opacity = '0';
            content.style.visibility = 'hidden';
            content.style.transform = 'translateX(20px)';
            tab.innerHTML = '⚙️';
            tab.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });

    // Add control event listeners - KEPT ALL STARFIELD CONTROLS
    setTimeout(() => {
        // Star controls
        const starCountInput = document.getElementById('star-count');
        const starCountValue = document.getElementById('star-count-value');
        starCountInput.addEventListener('input', (e) => {
            starfieldParams.starCount = parseInt(e.target.value);
            starCountValue.textContent = e.target.value;
            createStars();
        });

        const starSizeInput = document.getElementById('star-size');
        const starSizeValue = document.getElementById('star-size-value');
        starSizeInput.addEventListener('input', (e) => {
            starfieldParams.starSize = parseFloat(e.target.value);
            starSizeValue.textContent = e.target.value;
            if (starField && starField.material) {
                starField.material.size = starfieldParams.starSize;
                starField.material.needsUpdate = true;
            }
        });

        // Animation controls
        const animSpeedInput = document.getElementById('anim-speed');
        const animSpeedValue = document.getElementById('anim-speed-value');
        animSpeedInput.addEventListener('input', (e) => {
            starfieldParams.animationSpeed = parseFloat(e.target.value);
            animSpeedValue.textContent = e.target.value;
        });

        const mouseInfluenceInput = document.getElementById('mouse-influence');
        const mouseInfluenceValue = document.getElementById('mouse-influence-value');
        mouseInfluenceInput.addEventListener('input', (e) => {
            starfieldParams.mouseInfluence = parseFloat(e.target.value);
            mouseInfluenceValue.textContent = e.target.value;
        });

        const scaleAmplitudeInput = document.getElementById('scale-amplitude');
        const scaleAmplitudeValue = document.getElementById('scale-amplitude-value');
        scaleAmplitudeInput.addEventListener('input', (e) => {
            starfieldParams.scaleAmplitude = parseFloat(e.target.value);
            scaleAmplitudeValue.textContent = e.target.value;
        });

        const baseScaleInput = document.getElementById('base-scale');
        const baseScaleValue = document.getElementById('base-scale-value');
        baseScaleInput.addEventListener('input', (e) => {
            starfieldParams.baseScale = parseFloat(e.target.value);
            baseScaleValue.textContent = e.target.value;
        });

        // Color controls
        const colorRInput = document.getElementById('color-r');
        const colorRValue = document.getElementById('color-r-value');
        colorRInput.addEventListener('input', (e) => {
            starfieldParams.color.r = parseFloat(e.target.value);
            colorRValue.textContent = e.target.value;
            updateStarColors();
        });

        const colorGInput = document.getElementById('color-g');
        const colorGValue = document.getElementById('color-g-value');
        colorGInput.addEventListener('input', (e) => {
            starfieldParams.color.g = parseFloat(e.target.value);
            colorGValue.textContent = e.target.value;
            updateStarColors();
        });

        const colorBInput = document.getElementById('color-b');
        const colorBValue = document.getElementById('color-b-value');
        colorBInput.addEventListener('input', (e) => {
            starfieldParams.color.b = parseFloat(e.target.value);
            colorBValue.textContent = e.target.value;
            updateStarColors();
        });

        // Button controls
        document.getElementById('regenerate-btn').addEventListener('click', createStars);
        document.getElementById('reset-btn').addEventListener('click', resetStarfieldDefaults);
    }, 100);

    // Create Troika 3D text panel
    const troikaPanel = document.createElement('div');
    troikaPanel.id = 'troika-panel';
    troikaPanel.style.cssText = `
        position: fixed;
        top: 50%;
        left: -50px; /* Left edge for Troika panel */
        transform: translateY(-50%);
        z-index: 1000;
        transition: all 0.3s ease;
    `;

    // Create Troika content panel
    const troikaContent = document.createElement('div');
    troikaContent.id = 'troika-content';
    troikaContent.style.cssText = `
        width: 220px;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(20px);
        border: 2px solid var(--primary, #00ff00);
        border-left: none;
        border-radius: 0 12px 12px 0;
        padding: 15px;
        margin-left: 50px;
        opacity: 0;
        visibility: hidden;
        transform: translateX(-20px);
        transition: all 0.3s ease;
        max-height: 60vh;
        overflow-y: auto;
    `;

    // Troika panel content
    troikaContent.innerHTML = `
        <h3 style="color: var(--primary, #00ff00); margin: 0 0 15px 0; text-shadow: 0 0 8px var(--glow, #00ff00);">
            📝 3D Text (Troika)
        </h3>

        <div class="control-section">
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Show Text: <span id="show-text-value">false</span></label>
                <input type="checkbox" id="show-text" style="accent-color: var(--primary, #00ff00);">
            </div>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Text: <span id="text-content-value">SLIME THIS</span></label>
                <input type="text" id="text-content" value="SLIME THIS" style="width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-color); color: var(--text-color); padding: 5px; border-radius: 4px;">
            </div>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Size: <span id="text-size-value">2.0</span></label>
                <input type="range" id="text-size" min="0.5" max="10" step="0.1" value="2.0" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Text Red: <span id="text-color-r-value">0.0</span></label>
                <input type="range" id="text-color-r" min="0" max="1" step="0.01" value="0.0" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Text Green: <span id="text-color-g-value">1.0</span></label>
                <input type="range" id="text-color-g" min="0" max="1" step="0.01" value="1.0" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
            <div class="control-item">
                <label style="color: var(--text-color, #ffffff); font-size: 12px;">Text Blue: <span id="text-color-b-value">0.0</span></label>
                <input type="range" id="text-color-b" min="0" max="1" step="0.01" value="0.0" style="width: 100%; accent-color: var(--primary, #00ff00);">
            </div>
        </div>
    `;

    // Add hover effects to Troika tab
    troikaTab.addEventListener('mouseenter', () => {
        troikaTab.style.transform = 'scale(1.1)';
        troikaTab.style.boxShadow = '0 0 12px var(--glow)';
    });

    troikaTab.addEventListener('mouseleave', () => {
        if (!troikaPanel.classList.contains('open')) {
            troikaTab.style.transform = 'scale(1)';
            troikaTab.style.boxShadow = '0 0 8px var(--glow)';
        }
    });

    // Toggle Troika panel on tab click
    let troikaIsOpen = false;
    troikaTab.addEventListener('click', () => {
        troikaIsOpen = !troikaIsOpen;
        if (troikaIsOpen) {
            troikaPanel.classList.add('open');
            troikaContent.style.opacity = '1';
            troikaContent.style.visibility = 'visible';
            troikaContent.style.transform = 'translateX(0)';
            troikaTab.innerHTML = '✕';
            troikaTab.style.background = 'rgba(0, 255, 0, 0.2)';
        } else {
            troikaPanel.classList.remove('open');
            troikaContent.style.opacity = '0';
            troikaContent.style.visibility = 'hidden';
            troikaContent.style.transform = 'translateX(20px)';
            troikaTab.innerHTML = '📝';
            troikaTab.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });

    // Add Troika event listeners
    setTimeout(() => {
        const showTextInput = document.getElementById('show-text');
        const showTextValue = document.getElementById('show-text-value');
        showTextInput.addEventListener('change', (e) => {
            starfieldParams.showText = e.target.checked;
            showTextValue.textContent = e.target.checked;
            create3DText();
        });

        const textContentInput = document.getElementById('text-content');
        const textContentValue = document.getElementById('text-content-value');
        textContentInput.addEventListener('input', (e) => {
            starfieldParams.textContent = e.target.value;
            textContentValue.textContent = e.target.value;
            update3DText();
        });

        const textSizeInput = document.getElementById('text-size');
        const textSizeValue = document.getElementById('text-size-value');
        textSizeInput.addEventListener('input', (e) => {
            starfieldParams.textSize = parseFloat(e.target.value);
            textSizeValue.textContent = e.target.value;
            update3DText();
        });

        const textColorRInput = document.getElementById('text-color-r');
        const textColorRValue = document.getElementById('text-color-r-value');
        textColorRInput.addEventListener('input', (e) => {
            starfieldParams.textColor.r = parseFloat(e.target.value);
            textColorRValue.textContent = e.target.value;
            update3DText();
        });

        const textColorGInput = document.getElementById('text-color-g');
        const textColorGValue = document.getElementById('text-color-g-value');
        textColorGInput.addEventListener('input', (e) => {
            starfieldParams.textColor.g = parseFloat(e.target.value);
            textColorGValue.textContent = e.target.value;
            update3DText();
        });

        const textColorBInput = document.getElementById('text-color-b');
        const textColorBValue = document.getElementById('text-color-b-value');
        textColorBInput.addEventListener('input', (e) => {
            starfieldParams.textColor.b = parseFloat(e.target.value);
            textColorBValue.textContent = e.target.value;
            update3DText();
        });
    }, 100);

    // Assemble the panels - KEPT STARFIELD PANEL AND ADDED TROIKA PANEL
    panel.appendChild(content);
    panel.appendChild(tab);
    document.body.appendChild(panel);

    troikaPanel.appendChild(troikaContent);
    troikaPanel.appendChild(troikaTab);
    document.body.appendChild(troikaPanel);

    console.log('✅ Collapsible control panel created');
    console.log('✅ Troika 3D text panel created');
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
    // Reset 3D text parameters
    starfieldParams.showText = false;
    starfieldParams.textContent = 'SLIME THIS';
    starfieldParams.textSize = 2.0;
    starfieldParams.textColor = { r: 0.0, g: 1.0, b: 0.0 };
    starfieldParams.textPosition = { x: 0, y: 0, z: -50 };
    starfieldParams.textAnchorX = 'center';
    starfieldParams.textAnchorY = 'middle';

    // Update all controls
    setTimeout(() => {
        document.getElementById('star-count').value = starfieldParams.starCount;
        document.getElementById('star-count-value').textContent = starfieldParams.starCount;
        document.getElementById('star-size').value = starfieldParams.starSize;
        document.getElementById('star-size-value').textContent = starfieldParams.starSize;
        document.getElementById('anim-speed').value = starfieldParams.animationSpeed;
        document.getElementById('anim-speed-value').textContent = starfieldParams.animationSpeed;
        document.getElementById('mouse-influence').value = starfieldParams.mouseInfluence;
        document.getElementById('mouse-influence-value').textContent = starfieldParams.mouseInfluence;
        document.getElementById('scale-amplitude').value = starfieldParams.scaleAmplitude;
        document.getElementById('scale-amplitude-value').textContent = starfieldParams.scaleAmplitude;
        document.getElementById('base-scale').value = starfieldParams.baseScale;
        document.getElementById('base-scale-value').textContent = starfieldParams.baseScale;
        document.getElementById('color-r').value = starfieldParams.color.r;
        document.getElementById('color-r-value').textContent = starfieldParams.color.r;
        document.getElementById('color-g').value = starfieldParams.color.g;
        document.getElementById('color-g-value').textContent = starfieldParams.color.g;
        document.getElementById('color-b').value = starfieldParams.color.b;
        document.getElementById('color-b-value').textContent = starfieldParams.color.b;
        document.getElementById('show-text').checked = starfieldParams.showText;
        document.getElementById('show-text-value').textContent = starfieldParams.showText;
        document.getElementById('text-content').value = starfieldParams.textContent;
        document.getElementById('text-content-value').textContent = starfieldParams.textContent;
        document.getElementById('text-size').value = starfieldParams.textSize;
        document.getElementById('text-size-value').textContent = starfieldParams.textSize;
        document.getElementById('text-color-r').value = starfieldParams.textColor.r;
        document.getElementById('text-color-r-value').textContent = starfieldParams.textColor.r;
        document.getElementById('text-color-g').value = starfieldParams.textColor.g;
        document.getElementById('text-color-g-value').textContent = starfieldParams.textColor.g;
        document.getElementById('text-color-b').value = starfieldParams.textColor.b;
        document.getElementById('text-color-b-value').textContent = starfieldParams.textColor.b;
    }, 100);

    // Recreate stars and remove text
    createStars();
    create3DText(); // This will remove existing text if showText is false
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

// Banger Generator
document.getElementById('generate-btn').addEventListener('click', generateBanger);

function generateBanger() {
    const output = document.getElementById('output');
    const typeSelect = document.getElementById('type-select').value;
    const bangers = [
        // Quotes
        { type: 'quote', content: 'i be like "ngl" and then lie' },
        { type: 'quote', content: '我们杀了他并将他的尸体藏在树林里'},
        { type: 'quote', content: 'blocked her on everything and my tv started ringing' },
        { type: 'quote', content: 'i delete tweets cuz im not the same man i was 3 minutes ago' },
        { type: 'quote', content: '👣ATTENTION👣PLEASEE👣 <br> Guys 👣 if 👣 you👣 receive 👣 an 👣 email 👣 that 👣 says 👣 feet 👣 pictures 👣 of 👣 Ice 👣 Spice 👣 do 👣 NOT 👣 open 👣 it 👣 cuz 👣 its 👣 a 👣 virus 👣 that 👣 puts 👣 the 👣 feet👣emoji 👣 in 👣 between 👣 everything 👣 you👣type👣' },
        { type: 'quote', content: '"do better" does worse' },
        { type: 'quote', content: 'real mfs dont sleep they just close their eyes and wait' },
        { type: 'quote', content: 'sorry i didnt text you back i was ignoring you'},
        { type: 'quote', content: 'if she randomly texts "i love you" outta nowhere she just cheated' },
        { type: 'quote', content: '"turn on your hotspot" bro pay your phone bill' },
        { type: 'quote', content: 'therapy not enough i need everyone who wronged me to suffer' },
        { type: 'quote', content: 'u are not future bro love ur gf' },
        { type: 'quote', content: 'you gotta be a sick ass woman to ask a dude for a nut video' },
        { type: 'quote', content: 'apple music cant shuffle for shit' },
        { type: 'quote', content: 'how tf the corner store have apple pay but walmart doesnt' },
        { type: 'quote', content: 'sex supposed to happened naturally but yall out here talkin bout "please"😭' },
        { type: 'quote', content: 'girls be like "this my comfort show" and its a netflix serial killer series' },
        { type: 'quote', content: 'saying all water tastes the same tells me everything i need to know about you' },
        { type: 'quote', content: 'she was anemic and i was her iron man' },
        { type: 'quote', content: '"what percent you on?" bro this is MY charger' },
        { type: 'quote', content: '"ima tell u later" tell me now or ima throw up' },
        { type: 'quote', content: 'im forever loyal to that password i made when i was 12' },
        { type: 'quote', content: 'nobody flirts better than a girl whos unhappy with her boyfriend 😭' },
        { type: 'quote', content: 'stop double texting her' },
        { type: 'quote', content: 'cant trust anyone who uses light mode' },
        { type: 'quote', content: 'real mfs use dark mode on every app' },
        { type: 'quote', content: 'the older i get the more i understand why roosters start their day off by screaming' },
        { type: 'quote', content: 'i knew i was the problem when motivational speakers started to annoy me' },
        { type: 'quote', content: 'life after 18 is terrible. you breathe and you owe $100' },
        { type: 'quote', content: 'she dont want you' },
        { type: 'quote', content: 'its been "one of those days" for like 3 years now' },
        { type: 'quote', content: 'mfs be in a secret competition with you and still be losing' },
        { type: 'quote', content: 'instagram is literally just screenshots of twitter' },
        { type: 'quote', content: 'whenever i wanna go on a diet i check her likes' },
        { type: 'quote', content: 'hating on shit you never watched/listened to >>>>>>>' },
        { type: 'quote', content: 'theres no reason for you to post yourself crying on the internet' },
        { type: 'quote', content: 'glad i got to experience disney channel & nickelodeon before they fell off' },
        { type: 'quote', content: 'i can save her' },
        { type: 'quote', content: 'them breakups when yall wasnt even together be hurting a lil bit' },
        { type: 'quote', content: 'if she say "i hate youuu" congrats bro you won' },
        { type: 'quote', content: 'i be like "lol" then kms' },
        { type: 'quote', content: '"it takes time to heal" BRO HOW LONG' },
        { type: 'quote', content: 'not to flex but im probably better at making bad decisions than you' },
        { type: 'quote', content: '"why would i lie" is my best lie' },
        { type: 'quote', content: '"you changed" bro i hate you' },
        { type: 'quote', content: 'stealing tweets is good actually and the madder the original poster the better' },
        { type: 'quote', content: 'if you ever think im ignoring you i swear to god i am my phone be in my hand 24/7' },
        { type: 'quote', content: '“men can’t handle me” ya bitch we not psychward staff members' },
        { type: 'quote', content: 'real mfs wake up to "battery sufficiently charged" as their only notification' },
        { type: 'quote', content: 'ima sucker for deep talks.. i wanna know what made you a lying ass bitch' },
        { type: 'quote', content: 'yall forgiving your girl if she catches you cheating?' },
        // Memes
        { 
            type: 'meme', 
            image: 'payrent.jpeg', 
            caption: 'I love my dog but this mf gotta pay rent' 
        },
        {
            type: 'meme',
            image: 'tyingshoes.jpeg',
            caption: 'me tryna get my shoes on without untying it',
        },
        { 
            type: 'meme', 
            image: 'sillyandlie.jpeg', 
            caption: 'me logging in to act silly and lie',
        },
        {
            type: 'meme',
            image: 'smallaccounts.jpeg',
            caption: 'us small accounts carrying meme twt',
        },
        { 
            type: 'meme', 
            image: 'rapszn1.jpeg', 
            caption: 'bro listening to rap music from Season 1 💀' 
        },
        { 
            type: 'meme', 
            image: 'batbite.jpeg', 
            caption: 'just got bitten by a bat its OVER for you criminals' 
        },
        {
            type: 'meme',
            image: 'meatbeach.jpeg',
            caption: 'dont forget to enjoy life',
        },
        {
            type: 'meme',
            image: 'tookthispic.jpeg',
            caption: 'took this picture',
        },
        {
            type: 'meme',
            image: 'canadagangs.jpeg',
            caption: 'street gangs in canada are out of control',
        },
         {
            type: 'meme',
            image: 'brotext.jpeg',
            caption: 'bro 😭',
        },
         {
            type: 'meme',
            image: 'pigeonbot.jpeg',
            caption: 'for how much longer will they lie to us',
        },
        {
            type: 'meme',
            image: 'girlsflirt.jpeg',
            caption: 'girls flirt by just staring at you like this',
        },
        {
            type: 'meme',
            image: '2019air.jpeg',
            caption: 'just to feel something',
        },
        {
            type: 'meme',
            image: 'pikachu.jpeg',
            caption: 'NOOO WHAT THEY DO TO PIKACHU',
        },
        {
            type: 'meme',
            image: 'foodgood.jpeg',
            caption: 'this food bouta be good af',
        },
        {
            type: 'meme',
            image: 'scoobycall.jpeg',
            caption: 'GUYS YOU WONT BELIEVE IT',
        },
        {
            type: 'meme',
            image: 'hedgehogno.jpeg',
            caption: 'NOOO I HIT A HEDGEHOG',
        },
        {
            type: 'meme',
            image: 'walkitoff.jpeg',
            caption: 'y’all think i can walk it off?',
        },
        {
            type: 'meme',
            image: 'semitruck.jpeg',
            caption: 'im getting fired',
        },
        {
            type: 'meme',
            image: 'disneyland.jpeg',
            caption: 'I’m going to Disneyland and your not 😂😂😂',
        },
        {
            type: 'meme',
            image: 'aicouldnever.jpeg',
            caption: 'AI could never make this',
        },
        {
            type: 'meme',
            image: 'curtains.jpeg',
            caption: 'Strong, independent women all feeling seen here. 🫣🤭',
        },
        {
            type: 'meme',
            image: 'nosmoking.jpeg',
            caption: 'this "no smoking in front of kids" thing is ridiculous look how cold he is',
        },
        {
            type: 'meme',
            image: 'brotext2.jpeg',
            caption: 'bro wtf 😭😭',
        },
        {
            type: 'meme',
            image: 'diabetes.jpeg',
            caption: 'pray for my bro',
        },
        {
            type: 'meme',
            image: 'goodbye.jpeg',
            caption: 'goodbye world',
        },
        {
            type: 'meme',
            image: 'vegetable.jpeg',
            caption: 'that probly feels so good if ur a vegetable',
        },
        {
            type: 'meme',
            image: 'mainquest.jpeg',
            caption: 'every morning i wake up to a main quest marker',
        },
        // Videos
        { 
            type: 'video', 
            src: 'shakinghishead.mp4', 
            caption: 'he not even going fast he just shaking his head 😭' 
        },
         { 
            type: 'video', 
            src: 'gtalobby1.mp4', 
            caption: 'bro lives in a GTA lobby' 
        },
        {
            type: 'video',
            src: '2020hood.mp4',
            caption: 'covid had the hood stressin',
        },
        { 
            type: 'video', 
            src: 'trustissues.mp4', 
            caption: 'lil bro gon have trust issues after this😭' 
        },
        // Double Images
        { 
            type: 'double-image', 
            leftImage: 'looklikethis1.jpeg', 
            rightImage: 'looklikethis2.jpeg', 
            caption: 'her hands look like this so that mine can look like this' 
        },
        {
            type: 'double-image',
            leftImage: 'fingerrock.jpeg',
            rightImage: 'fingerrock2.jpeg',
            caption: 'whoever painted this rock to look like a finger, fuck you'
        },
        { 
            type: 'double-image', 
            leftImage: 'childhood1.jpeg', 
            rightImage: 'childhood2.jpeg', 
            caption: 'another celebrity lost to drugs' 
        },
        {
            type: 'double-image',
            leftImage: 'beyblades1.jpeg',
            rightImage: 'beyblades2.jpeg',
            caption: 'yall wasnt there'
        },
        // Images (No Caption)
        {
            type: 'image',
            image: 'stroker.jpeg'
        },
        {
            type: 'image',
            image: 'friendship.jpeg',
        },
        // Quad Images
        {
            type: 'quad-image',
            topLeftImage: 'sleep1.jpeg',
            topRightImage: 'sleep2.jpeg',
            bottomLeftImage: 'sleep3.jpeg',
            bottomRightImage: 'sleep4.jpeg',
            caption: 'im about to have the best sleep of my life'
        }
    ];

    // Filter bangers based on selected type
    const filteredBangers = typeSelect === 'all' 
        ? bangers 
        : bangers.filter(banger => banger.type === typeSelect);

    if (filteredBangers.length === 0) {
        output.innerHTML = `<p>No bangers available for this type!</p>`;
        return;
    }

    // Randomly select a banger
    const randomBanger = filteredBangers[Math.floor(Math.random() * filteredBangers.length)];

    // Clear previous content and animate
    output.style.opacity = '0';
    gsap.to(output, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
            output.innerHTML = '';
            if (randomBanger.type === 'quote') {
                output.innerHTML = `<p>${randomBanger.content}</p>`;
            } else if (randomBanger.type === 'meme') {
                output.innerHTML = `
                    <img src="${randomBanger.image}" alt="Meme">
                    <p>${randomBanger.caption}</p>
                `;
            } else if (randomBanger.type === 'video') {
                output.innerHTML = `
                    <video src="${randomBanger.src}" controls autoplay loop muted></video>
                    <p>${randomBanger.caption}</p>
                `;
            } else if (randomBanger.type === 'double-image') {
                output.innerHTML = `
                    <div class="double-image-container">
                        <img src="${randomBanger.leftImage}" alt="Left Image">
                        <img src="${randomBanger.rightImage}" alt="Right Image">
                    </div>
                    <p>${randomBanger.caption}</p>
                `;
            } else if (randomBanger.type === 'image') {
                output.innerHTML = `
                    <img src="${randomBanger.image}" alt="Image">
                `;
            } else if (randomBanger.type === 'quad-image') {
                output.innerHTML = `
                    <div class="quad-image-container">
                        <img src="${randomBanger.topLeftImage}" alt="Top Left Image">
                        <img src="${randomBanger.topRightImage}" alt="Top Right Image">
                        <img src="${randomBanger.bottomLeftImage}" alt="Bottom Left Image">
                        <img src="${randomBanger.bottomRightImage}" alt="Bottom Right Image">
                    </div>
                    <p>${randomBanger.caption}</p>
                `;
            }
            gsap.fromTo(output, 
                { opacity: 0, y: -20 }, 
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
        }
    });

    // Button click animation
    gsap.to('#generate-btn', {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut'
    });
}

// Debounce utility
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

// Three.js Starfield
let camera, renderer, starField, scene = null;
let isInitialized = false;

function initStarfield() {
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

        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const starCount = 15000;

        for (let i = 0; i < starCount; i++) {
            vertices.push(
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000
            );
            colors.push(0.3, 0.3, 0.5);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1.5,
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

        let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
        document.addEventListener('mousemove', debounce((e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
        }, 50));

        function animate() {
            requestAnimationFrame(animate);
            if (starField) {
                targetX += (mouseX - targetX) * 0.02;
                targetY += (mouseY - targetY) * 0.02;
                starField.rotation.x += 0.0002 + targetY * 0.05;
                starField.rotation.y += 0.0003 + targetX * 0.05;
                const time = Date.now() * 0.001;
                starField.scale.setScalar(Math.sin(time) * 0.05 + 1);
            }
            renderer.render(scene, camera);
        }

        animate();
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    } catch (err) {
        console.error('Starfield initialization failed:', err);
    }
}

function updateStarfieldColors(theme) {
    if (!starField || !starField.geometry.attributes.color) return;
    const colorArray = starField.geometry.attributes.color.array;
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
        'neon-fluid': { r: 0.0, g: 1.0, b: 1.0 }
    };
    const baseColor = themeColors[theme] || { r: 0.3, g: 0.3, b: 0.5 };
    for (let i = 0; i < colorArray.length; i += 3) {
        colorArray[i] = baseColor.r + (Math.random() * 0.2 - 0.1);
        colorArray[i + 1] = baseColor.g + (Math.random() * 0.2 - 0.1);
        colorArray[i + 2] = baseColor.b + (Math.random() * 0.2 - 0.1);
    }
    starField.geometry.attributes.color.needsUpdate = true;
}

// Main Event Listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Starfield
    initStarfield();

    // GSAP Animations
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.from('.slime-title', {
            opacity: 0,
            y: -50,
            duration: 1,
            ease: 'power2.out'
        });
        gsap.from('.theme-switcher, .type-switcher', {
            opacity: 0,
            x: -30,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            delay: 0.5
        });
        gsap.from('#output', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.7
        });
        gsap.from('#generate-btn', {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: 'back.out(1.7)',
            delay: 0.9
        });
        gsap.from('.social-container', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
            delay: 1.1
        });
    }

    // Custom Cursor
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

    // Card, Button, Select, Profile Pic, and X Link Hover Effects
    document.querySelectorAll('.card, button, select, .profile-pic, .x-link').forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            gsap.to(elem, {
                scale: elem.classList.contains('profile-pic') ? 1.1 : elem.classList.contains('generate-btn') ? 1.03 : 1.05,
                boxShadow: `0 0 20px var(--glow, rgba(255, 255, 255, 0.8))`,
                y: elem.id === 'generate-btn' ? 2 : 0, // Move button down slightly
                duration: 0.3,
                ease: 'power1.out'
            });
            if (cursor) gsap.to(cursor, { scale: 1.5, duration: 0.2 });
            if (cursorBlur) gsap.to(cursorBlur, { scale: 1.5, duration: 0.2 });
        });
        elem.addEventListener('mouseleave', () => {
            gsap.to(elem, {
                scale: 1,
                boxShadow: elem.classList.contains('card') 
                    ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)' 
                    : elem.classList.contains('profile-pic') 
                    ? '0 0 15px var(--glow)' 
                    : 'none',
                y: 0,
                duration: 0.3,
                ease: 'power1.out'
            });
            if (cursor) gsap.to(cursor, { scale: 1, duration: 0.2 });
            if (cursorBlur) gsap.to(cursorBlur, { scale: 1, duration: 0.2 });
        });
    });

    // Theme Management
    document.getElementById('theme-select').addEventListener('change', function() {
        const newTheme = this.value;
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('currentTheme', newTheme);
        updateStarfieldColors(newTheme);

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
            'neon-fluid': 'fluid-flow 4s ease-in-out infinite'
        };

        document.body.style.animation = animations[newTheme] || 'none';
    });

    // Color Customization
    const primaryColorInput = document.getElementById('primary-color');
    const secondaryColorInput = document.getElementById('secondary-color');
    const accentColorInput = document.getElementById('accent-color');
    const intensitySlider = document.getElementById('intensity-slider');
    const intensityValueSpan = document.getElementById('intensity-value');
    const resetButton = document.getElementById('reset-colors');

    // HEX display elements
    const primaryHex = document.getElementById('primary-hex');
    const secondaryHex = document.getElementById('secondary-hex');
    const accentHex = document.getElementById('accent-hex');

    // Current customization values
    let currentCustomizations = {
        primary: '#00ffff',
        secondary: '#ff00ff',
        accent: '#ffff00',
        intensity: 100
    };

    // Load saved customizations
    const savedCustomizations = localStorage.getItem('colorCustomizations');
    if (savedCustomizations) {
        currentCustomizations = JSON.parse(savedCustomizations);
        applyColorCustomizations(currentCustomizations);
    }

    // Update HEX displays
    function updateHexDisplays() {
        if (primaryHex) primaryHex.textContent = currentCustomizations.primary.toUpperCase();
        if (secondaryHex) secondaryHex.textContent = currentCustomizations.secondary.toUpperCase();
        if (accentHex) accentHex.textContent = currentCustomizations.accent.toUpperCase();
    }

    // Color picker event listeners
    primaryColorInput.addEventListener('input', (e) => {
        currentCustomizations.primary = e.target.value;
        updateHexDisplays();
        applyColorCustomizations(currentCustomizations);
        saveColorCustomizations();
    });

    secondaryColorInput.addEventListener('input', (e) => {
        currentCustomizations.secondary = e.target.value;
        updateHexDisplays();
        applyColorCustomizations(currentCustomizations);
        saveColorCustomizations();
    });

    accentColorInput.addEventListener('input', (e) => {
        currentCustomizations.accent = e.target.value;
        updateHexDisplays();
        applyColorCustomizations(currentCustomizations);
        saveColorCustomizations();
    });

    // Intensity slider
    intensitySlider.addEventListener('input', (e) => {
        currentCustomizations.intensity = parseInt(e.target.value);
        intensityValueSpan.textContent = currentCustomizations.intensity + '%';
        applyColorCustomizations(currentCustomizations);
        saveColorCustomizations();
    });

    // Reset button
    resetButton.addEventListener('click', () => {
        // Reset to Neon Fluid theme defaults
        currentCustomizations = {
            primary: '#00ffff',
            secondary: '#ff00ff',
            accent: '#ffff00',
            intensity: 100
        };
        applyColorCustomizations(currentCustomizations);
        saveColorCustomizations();
    });

    function applyColorCustomizations(customizations) {
        // Apply CSS custom properties for the current theme
        const currentTheme = document.body.getAttribute('data-theme') || 'ultra-glass';

        // Update color inputs to show current values
        primaryColorInput.value = customizations.primary;
        secondaryColorInput.value = customizations.secondary;
        accentColorInput.value = customizations.accent;
        intensitySlider.value = customizations.intensity;
        intensityValueSpan.textContent = customizations.intensity.toFixed(1) + 'x';

        // Apply custom colors to CSS variables (only for neon-fluid theme for now)
        if (currentTheme === 'neon-fluid') {
            // Force style recalculation by temporarily removing and re-adding the theme
            document.body.removeAttribute('data-theme');
            document.documentElement.style.setProperty('--custom-primary', customizations.primary);
            document.documentElement.style.setProperty('--custom-secondary', customizations.secondary);
            document.documentElement.style.setProperty('--custom-accent', customizations.accent);
            document.documentElement.style.setProperty('--intensity-scale', customizations.intensity);

            // Re-apply theme to trigger CSS recalculation
            requestAnimationFrame(() => {
                document.body.setAttribute('data-theme', 'neon-fluid');
            });
        }
    }

    function saveColorCustomizations() {
        localStorage.setItem('colorCustomizations', JSON.stringify(currentCustomizations));
    }

    // Apply saved theme
    const savedTheme = localStorage.getItem('currentTheme') || 'ultra-glass';
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-select').value = savedTheme;
    updateStarfieldColors(savedTheme);

    // Initialize color inputs
    applyColorCustomizations(currentCustomizations);
});

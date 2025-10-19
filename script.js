// Copy and Save functionality
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copied to clipboard!', 'success');
    }
}

async function saveMedia(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
        showNotification('Media saved!', 'success');
    } catch (err) {
        showNotification('Failed to save media', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateY(-10px)',
        transition: 'all 0.3s ease'
    });

    // Color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#3b82f6';
    }

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function copyCurrentBanger() {
    const output = document.getElementById('output');
    if (!output) {
        showNotification('No content to copy', 'error');
        return;
    }

    // Get text content from the output
    const textToCopy = output.textContent.trim() || output.innerText.trim();

    // Always try to copy text if it exists (for captions)
    if (textToCopy) {
        copyToClipboard(textToCopy);
    }

    // Always check for media to save (images, videos, GIFs)
    const img = output.querySelector('img');
    const video = output.querySelector('video');

    if (img && img.src) {
        const filename = `slime-this-${Date.now()}.jpg`;
        saveMedia(img.src, filename);
    } else if (video && video.src) {
        const filename = `slime-this-${Date.now()}.mp4`;
        saveMedia(video.src, filename);
    }

    // Only show "no content" error if there's neither text nor media
    if (!textToCopy && !img && !video) {
        showNotification('No content to copy', 'error');
    }
}

// Global bangers data
let allBangers = [];
let allImages = []; // Separate array for images only
let currentPage = 1;
const IMAGES_PER_PAGE = 20;

// Pagination functions
function createPaginationControls() {
    const paginationContainer = document.createElement('div');
    paginationContainer.id = 'pagination-controls';
    paginationContainer.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: 20px 0;
        flex-wrap: wrap;
    `;

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Previous';
    prevBtn.onclick = () => changePage(currentPage - 1);
    prevBtn.style.cssText = `
        padding: 8px 16px;
        background: var(--glass);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    const pageInfo = document.createElement('span');
    pageInfo.id = 'page-info';
    pageInfo.style.cssText = `
        color: var(--text-color);
        font-weight: 500;
        min-width: 100px;
        text-align: center;
    `;

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next →';
    nextBtn.onclick = () => changePage(currentPage + 1);
    nextBtn.style.cssText = prevBtn.style.cssText;

    paginationContainer.appendChild(prevBtn);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(nextBtn);

    return paginationContainer;
}

function changePage(page) {
    const totalPages = Math.ceil(allImages.length / IMAGES_PER_PAGE);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayImageGallery();
    updatePaginationControls();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(allImages.length / IMAGES_PER_PAGE);
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    // Update button states
    const prevBtn = document.querySelector('#pagination-controls button:first-child');
    const nextBtn = document.querySelector('#pagination-controls button:last-child');

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

function displayImageGallery() {
    const output = document.getElementById('output');
    const start = (currentPage - 1) * IMAGES_PER_PAGE;
    const end = start + IMAGES_PER_PAGE;
    const pageImages = allImages.slice(start, end);

    let galleryHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; padding: 10px;">';

    pageImages.forEach(image => {
        galleryHTML += `
            <div style="position: relative; cursor: pointer; border-radius: 8px; overflow: hidden; background: var(--glass); border: 1px solid var(--border-color); transition: transform 0.3s ease;" onclick="selectImage('${image}')">
                <img src="${image}" alt="Meme" style="width: 100%; height: 120px; object-fit: cover; display: block;" loading="lazy">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 4px; font-size: 10px; text-align: center; opacity: 0; transition: opacity 0.3s ease;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'">
                    Click to select
                </div>
            </div>
        `;
    });

    galleryHTML += '</div>';

    // Add pagination controls if they don't exist
    if (!document.getElementById('pagination-controls')) {
        const paginationControls = createPaginationControls();
        output.parentNode.insertBefore(paginationControls, output.nextSibling);
    }

    output.innerHTML = galleryHTML;
    updatePaginationControls();
}

function selectImage(imageSrc) {
    const output = document.getElementById('output');
    output.innerHTML = `<img src="${imageSrc}" alt="Selected Meme" class="auto-resize" style="max-width: 100%; border-radius: 8px;">`;
    copyCurrentBanger();
    showNotification('Image selected and copied!', 'success');
}

// Load content on page load
async function loadContent() {
    try {
        // Load assets configuration
        const configResponse = await fetch('assets-config.json');
        const config = await configResponse.json();

        // Load bangers data
        const bangersResponse = await fetch('bangers.json');
        if (!bangersResponse.ok) {
            throw new Error(`Failed to load bangers.json: ${bangersResponse.status}`);
        }
        const bangersData = await bangersResponse.json();

        // Combine all content sources
        allBangers = [];

        // Add quotes
        if (bangersData.quotes) {
            allBangers.push(...bangersData.quotes.map(content => ({ type: 'quote', content })));
        }

        // Add memes
        if (bangersData.memes) {
            allBangers.push(...bangersData.memes.map(item => ({ type: 'meme', ...item })));
        }

        // Add videos
        if (bangersData.videos) {
            allBangers.push(...bangersData.videos.map(item => ({ type: 'video', ...item })));
        }

        // Add double images
        if (bangersData['double-images']) {
            allBangers.push(...bangersData['double-images'].map(item => ({ type: 'double-image', ...item })));
        }

        // Add quad images
        if (bangersData['quad-images']) {
            allBangers.push(...bangersData['quad-images'].map(item => ({ type: 'quad-image', ...item })));
        }

        // Add images from JSON (existing images in project) - DISABLED to avoid duplicates
        // if (bangersData.images) {
        //     allBangers.push(...bangersData.images.map(filename => ({
        //         type: 'image',
        //         image: filename // Use relative path for images in project
        //     })));
        // }

        // Load from folders - dynamic scanning (limited by browser security)
        // For now, we'll use a hybrid approach: try to load known files + allow manual addition

        // Common image extensions to look for
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4'];
        const maxFilesToCheck = 50; // Limit to prevent too many requests

        // All images from images/ folder
        const knownImageFiles = [
            '0a731d8a55a42f9fffe42728d65647f4.jpg', '00ab07126e655cdde010900681696e65.jpg',
            '037e31191571021e1947d83235128399.jpg', '038a6c2d382179337ab55db7f4b7422b.jpg',
            '086bb60cf35fcf21da74113486144895.jpg', '111.jpeg', '111a.jpg', '111a1.jpg',
            '111xf.jpg', '112aa.jpg', '121ll.jpg', '1.jpg', '1a.jpg', '1a1uhuh.jpg',
            '1a6f8bc0c17ca0728682b99b873e4866.jpg', '1a2232e4871b1478d8f02a7dcb11226f.jpg',
            '1aaah.jpg', '1aadh.jpg', '1aafam.jpg', '1aahsh.jpg', '1aal.jpg', '1aasss.jpg',
            '1aauhuh.jpg', '1adfw.jpg', '1afhwu.jpg', '1ah.jpg', '1ahau.jpg', '1ahauhu.jpg',
            '1ahsuww.jpg', '1ahwu.jpg', '1aital.jpg', '1ashuf.jpg', '1asss.jpg', '1asuhu.jpg',
            '1asw.jpg', '1auah.jpg', '1awhwwh.jpg', '1awk.jpg', '1awywyw.jpg', '1b8bb50c62adfed845c32d98a52e265a.jpg',
            '1bhsx.jpg', '1bkh.jpg', '1c0ff6c442689284cadb7eb0be927a97.jpg', '1cx.jpg', '1d2f2.jpg',
            '1ddyh.jpg', '1dgyd.jpg', '1dp2.jpg', '1ds.jpg', '1dyh.jpg', '1f7ff.jpg', '1ffg.jpg',
            '1fhf.jpg', '1fhwu.jpg', '1gdy.jpg', '1h1uh.jpg', '1h1uhd.jpg', '1h1uhu.jpg', '1hsugh.jpg',
            '1hswhw.jpg', '1hu1h.jpg', '1hu1huf.jpg', '1hufhf.jpg', '1huh.jpg', '1huhf.jpg',
            '1huhfss.jpg', '1huhhuh.jpg', '1huhq.jpg', '1lhllul.jpg', '1lll.jpg', '1lllhuh.jpg',
            '1llljoihu.jpg', '1lllkoi.jpg', '1llllhy.jpg', '1llllhyg.jpg', '1llllkw.jpg', '1lllll.jpg',
            '1lllllhyh.jpg', '1llllll.jpg', '1llllluhl.jpg', '1ogxtd.jpg', '1omok.jpg', '1ouho.jpg',
            '1ouhod.jpg', '1ouhuh.jpg', '1p1ppoo.jpg', '1p1pu.jpg', '1pdhdu.jpg', '1phpb.jpg',
            '1pipipx.jpg', '1qasss.jpg', '1qhuh.jpg', '1qs.jpg', '1sa.jpg', '1sfaw.jpg', '1sff.jpg',
            '1ssuh.jpg', '1suh.jpg', '1tdgd.jpg', '1tgyj.jpg', '1udcd.jpg', '1udhy.jpg', '1ueh.jpg',
            '1uhgd.jpg', '1uhu.jpg', '1ulh.jpg', '1wfhwuh.jpg', '1wgfw.jpg', '1whf.jpg', '1whuh.jpg',
            '1wohw.jpg', '1wshuw.jpg', '1xz.jpg', '1ydh.jpg', '1yfeh.jpg', '1yhy.jpg', '1yhye.jpg',
            '1yqar.jpg', '1yrhf.jpg', '1zx.jpg', '2bcc16fe1ae6d30e70ed6681637cdadf.jpg',
            '2cf6778cfbb050deb3b734577b064d4e.jpg', '2dsw.jpg', '2dwfw.jpg', '2l.jpg', '2sdslss.jpg',
            '2slfsww.jpg', '2ssqqql.jpg', '2wg.jpg', '2wllw.jpg', '2wrww.jpg', '3c991ce35c45eb28915e4ea6a2d1e23b.jpg',
            '3cf516bbb9229b0f46ce6282ea63d82d.jpg', '3e4e87bb4b346254c414fb77a2791a1.jpg',
            '3e6ee007efc38922024d0a72fd1210cc.jpg', '3ec5ecccce93bb45c4197ad0be927a97.jpg',
            '3fe32abd0cd481f181f80c27782a4787.jpg', '3llllshs.jpg', '3lllsus.jpg', '3lls.jpg',
            '3slkl.jpg', '3slslw.jpg', '3slss.jpg', '3ssslkg.jpg', '3wlfw.jpg', '3www.jpg',
            '3wwwfgg.jpg', '4a744812ac50b16c05f30c4dfa6d1eb6.jpg', '4ccfc51d5a22812214d91ea86ccb9475.jpg',
            '09a90b6eb26c2013adbf77902c0f657c.jpg', '11aa.jpg', '11fh.jpg', '11h1uh.jpg', '11hdh.jpg',
            '11huf.jpg', '11huh.jpg', '11huhd.jpg', '11hwu.jpg', '11ouhuh.jpg', '11u1hu.jpg',
            '11uhff.jpg', '11uhg.jpg', '11uhuhu.jpg', '11uhus.jpg', '11uydfhe.jpg', '12dede.jpg',
            '12hduyd.jpg', '22ffd21ae9b21452a14e944fac5c1688.jpg', '24c9a1ca52c706366f4cf7151caf64f8.jpg',
            '34d9515b4b430e99d8b15049def0c8a7.jpg', '35cents.jpg', '36.jpg', '37d1cb33ab959a9d65ff69695ea336e0.jpg',
            '038a6c2d382179337ab55db7f4b7422b.jpg', '086bb60cf35fcf21da74113486144895.jpg', '111.jpeg',
            '111a.jpg', '111a1.jpg', '111xf.jpg', '112aa.jpg', '121ll.jpg', '200.jpg', '222.jpg',
            '232.jpg', '383e785d204a289ea09a373c4951a572.jpg', '455f9e0ecfda3d6cfcf2bd479df73bab.jpg',
            '0482c2c3955cb73d0eb1c62629de1ee4.jpg', '1111aaa.jpg', '1234aa.jpg', '1413r2.jpg',
            '4629b50d1ceade82f74399d0f96c9b4f.jpg', '14748d0178674f8578f09f48d8f6d50b.jpg',
            '16975bc5276d1c21cbc9d8c484e38725.jpg', '24700b6b99dc49341df3396081f7c00a.jpg',
            '32289dc07896c85ba693d334825f770f.jpg', '49792fb62e98ae216bdd21706cd494da.jpg',
            '153171c5187be2176650d90af3b0966f.jpg', '184485db506a11b52de4fea50e09de41.jpg',
            '249084b1373552f0fe19643db3381823.jpg', '1498398c54448f54e88fecc6fb6aa24b.jpg',
            '1llllllx/.jpg', '1oko/.jpg', '1sybyd/.jpg', '10/.jpg', '2019air.jpeg', '2020hood.mp4',
            'aicouldnever.jpeg', 'batbite.jpeg', 'beyblades1.jpeg', 'beyblades2.jpeg', 'brotext.jpeg',
            'brotext2.jpeg', 'canadagangs.jpeg', 'childhood1.jpeg', 'childhood2.jpeg', 'curtains.jpeg',
            'diabetes.jpeg', 'disneyland.jpeg', 'fingerrock.jpeg', 'fingerrock2.jpeg', 'foodgood.jpeg',
            'friendship.jpeg', 'girlsflirt.jpeg', 'goodbye.jpeg', 'hedgehogno.jpeg', 'looklikethis1.jpeg',
            'looklikethis2.jpeg', 'mainquest.jpeg', 'meatbeach.jpeg', 'nosmoking.jpeg', 'payrent.jpeg',
            'pigeonbot.jpeg', 'pikachu.jpeg', 'rapszn1.jpeg', 'scoobycall.jpeg', 'semitruck.jpeg',
            'sleep1.jpeg', 'sleep2.jpeg', 'sleep3.jpeg', 'sleep4.jpeg', 'smallaccounts.jpeg',
            'spritecroc.jpeg', 'stroker.jpeg', 'tookthispic.jpeg', 'vegetable.jpeg', 'walkitoff.jpeg'
        ];

        // Add known images (now in main directory)
        allImages = knownImageFiles; // Store images separately for gallery
        allBangers.push(...knownImageFiles.map(filename => ({
            type: 'image',
            image: filename
        })));

        // GIFs from gifs/ folder
        const knownGifFiles = [
            '_00_240x320_010_reasonably_small.gif', 'aaoa.gif', 'amalaprint-cat.gif',
            'anime-girl-blush-cat.gif', 'balls-218.gif', 'batman-cat.gif', 'bear.gif',
            'bingus-dynamite.gif', 'bongo-cat-pumpkin-bongo.gif', 'boom.gif',
            'bro-got-little-turbulence-plane.gif', 'caseoh-ai.gif', 'cat-car.gif'
        ];

        allBangers.push(...knownGifFiles.map(filename => ({
            type: 'gif',
            image: `gifs/${filename}`
        })));

        // TODO: For true automatic folder scanning, we'd need:
        // 1. A backend API that lists directory contents
        // 2. Or a build script that generates this list
        // 3. Or manual updates when adding new files

        console.log(`Note: To add new images/GIFs, manually add filenames to the knownImageFiles/knownGifFiles arrays in script.js`);

        console.log(`Loaded ${allBangers.length} bangers from JSON files and folders`);

    } catch (error) {
        console.error('Failed to load content:', error);
        // Fallback to basic functionality
    }
}


// Banger Generator
async function generateBanger() {
    const output = document.getElementById('output');
    const typeSelect = document.getElementById('type-select').value;

    // Filter bangers based on selected type
    const filteredBangers = typeSelect === 'all'
        ? allBangers
        : allBangers.filter(banger => banger.type === typeSelect);

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
                    <img src="${randomBanger.image}" alt="Meme" class="auto-resize">
                    <p>${randomBanger.caption}</p>
                `;
            } else if (randomBanger.type === 'video') {
                output.innerHTML = `
                    <video src="${randomBanger.src}" controls autoplay loop muted class="auto-resize"></video>
                    <p>${randomBanger.caption}</p>
                `;
            } else if (randomBanger.type === 'gif') {
                output.innerHTML = `
                    <img src="${randomBanger.image}" alt="GIF" class="auto-resize">
                `;
            } else if (randomBanger.type === 'double-image') {
                output.innerHTML = `
                    <div class="double-image-container">
                        <img src="${randomBanger.leftImage}" alt="Left Image" class="auto-resize">
                        <img src="${randomBanger.rightImage}" alt="Right Image" class="auto-resize">
                    </div>
                    <p>${randomBanger.caption}</p>
                `;
            } else if (randomBanger.type === 'image') {
                output.innerHTML = `
                    <img src="${randomBanger.image}" alt="Image" class="auto-resize">
                `;
            } else if (randomBanger.type === 'quad-image') {
                output.innerHTML = `
                    <div class="quad-image-container">
                        <img src="${randomBanger.topLeftImage}" alt="Top Left Image" class="auto-resize">
                        <img src="${randomBanger.topRightImage}" alt="Top Right Image" class="auto-resize">
                        <img src="${randomBanger.bottomLeftImage}" alt="Bottom Left Image" class="auto-resize">
                        <img src="${randomBanger.bottomRightImage}" alt="Bottom Right Image" class="auto-resize">
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

// Banger Generator
document.getElementById('generate-btn').addEventListener('click', async () => {
    await generateBanger();
    copyCurrentBanger();
});

// Copy and Save functionality
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copied to clipboard!', 'success');
    }
}

async function saveMedia(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
        showNotification('Media saved!', 'success');
    } catch (err) {
        showNotification('Failed to save media', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateY(-10px)',
        transition: 'all 0.3s ease'
    });

    // Color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#3b82f6';
    }

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
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
document.addEventListener('DOMContentLoaded', async () => {
    // Load content first
    await loadContent();

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

    // Type selector auto-generate
    document.getElementById('type-select').addEventListener('change', async function() {
        const selectedType = this.value;

        if (selectedType === 'gallery') {
            // Show image gallery
            displayImageGallery();
        } else {
            // Auto-generate a banger when type changes
            await generateBanger();
            copyCurrentBanger();
        }
    });

    // Output card click handler
    document.getElementById('output').addEventListener('click', function() {
        // Generate banger when clicking on the output area
        generateBanger();
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

    // Update HEX displays and color picker buttons
    function updateHexDisplays() {
        if (primaryHex) primaryHex.textContent = currentCustomizations.primary.toUpperCase();
        if (secondaryHex) secondaryHex.textContent = currentCustomizations.secondary.toUpperCase();
        if (accentHex) accentHex.textContent = currentCustomizations.accent.toUpperCase();

        // Update color picker button backgrounds to show current colors
        const primaryPicker = document.getElementById('primary-color');
        const secondaryPicker = document.getElementById('secondary-color');
        const accentPicker = document.getElementById('accent-color');

        if (primaryPicker) primaryPicker.style.backgroundColor = currentCustomizations.primary;
        if (secondaryPicker) secondaryPicker.style.backgroundColor = currentCustomizations.secondary;
        if (accentPicker) accentPicker.style.backgroundColor = currentCustomizations.accent;
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
        intensityValueSpan.textContent = customizations.intensity + '%';

        // Apply custom colors to CSS variables (only for neon-fluid theme for now)
        if (currentTheme === 'neon-fluid') {
            // Use the actual selected colors directly for the gradient
            const gradient = `linear-gradient(135deg, ${customizations.primary} 0%, ${customizations.secondary} 50%, ${customizations.accent} 100%)`;

            // Force style recalculation by temporarily removing and re-adding the theme
            document.body.removeAttribute('data-theme');
            document.documentElement.style.setProperty('--custom-primary', customizations.primary);
            document.documentElement.style.setProperty('--custom-secondary', customizations.secondary);
            document.documentElement.style.setProperty('--custom-accent', customizations.accent);
            document.documentElement.style.setProperty('--intensity-scale', customizations.intensity / 100);
            document.documentElement.style.setProperty('--custom-gradient', gradient);

            // Re-apply theme to trigger CSS recalculation
            requestAnimationFrame(() => {
                document.body.setAttribute('data-theme', 'neon-fluid');
            });
        }
    }

    // Helper functions for color conversion
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 360, s: s, l: l };
    }

    function hslToRgb(h, s, l) {
        h /= 360;
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
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

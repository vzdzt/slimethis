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

    // Always check for media to save (images, videos, GIFs) - handle multiple images
    const images = output.querySelectorAll('img');
    const video = output.querySelector('video');

    if (images.length > 0) {
        // Save all images found
        images.forEach((img, index) => {
            if (img.src) {
                const filename = images.length > 1
                    ? `slime-this-${Date.now()}-${index + 1}.jpg`
                    : `slime-this-${Date.now()}.jpg`;
                saveMedia(img.src, filename);
            }
        });
    } else if (video && video.src) {
        const filename = `slime-this-${Date.now()}.mp4`;
        saveMedia(video.src, filename);
    }

    // Only show "no content" error if there's neither text nor media
    if (!textToCopy && images.length === 0 && !video) {
        showNotification('No content to copy', 'error');
    }
}

// Global bangers data
let allBangers = [];
let allImages = []; // Separate array for images only
let currentPage = 1;
const IMAGES_PER_PAGE = 10;

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

    // Create a 2x5 grid that fits in viewport
    let galleryHTML = `
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(2, 120px); gap: 10px; padding: 10px; max-width: 100%; margin: 0 auto;">
    `;

    pageImages.forEach((image, index) => {
        if (index < 10) { // Limit to 10 images (2x5 grid)
            galleryHTML += `
                <div style="position: relative; cursor: pointer; border-radius: 8px; overflow: hidden; background: var(--glass); border: 1px solid var(--border-color); transition: transform 0.3s ease, box-shadow 0.3s ease;" onclick="event.stopPropagation(); selectImage('${image}')">
                    <img src="${image}" alt="Meme" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                    <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.7); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; opacity: 0; transition: opacity 0.3s ease;">
                        Select
                    </div>
                </div>
            `;
        }
    });

    galleryHTML += '</div>';

    // Add simple navigation buttons
    const totalPages = Math.ceil(allImages.length / IMAGES_PER_PAGE);
    galleryHTML += `
        <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
            <button onclick="event.stopPropagation(); changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} style="padding: 8px 16px; background: var(--glass); border: 1px solid var(--border-color); color: var(--text-color); border-radius: 6px; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='var(--rgb-glow)'" onmouseout="this.style.background='var(--glass)'">← Previous</button>
            <span style="color: var(--text-color); font-weight: 500; align-self: center;">Page ${currentPage} of ${totalPages}</span>
            <button onclick="event.stopPropagation(); changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} style="padding: 8px 16px; background: var(--glass); border: 1px solid var(--border-color); color: var(--text-color); border-radius: 6px; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='var(--rgb-glow)'" onmouseout="this.style.background='var(--glass)'">Next →</button>
        </div>
    `;

    output.innerHTML = galleryHTML;
}

function selectImage(imageSrc, currentIndex = null) {
    // If no index provided, find it in the current page
    if (currentIndex === null) {
        const start = (currentPage - 1) * IMAGES_PER_PAGE;
        const end = start + IMAGES_PER_PAGE;
        const pageImages = allImages.slice(start, end);
        currentIndex = pageImages.indexOf(imageSrc);
    }

    const start = (currentPage - 1) * IMAGES_PER_PAGE;
    const end = start + IMAGES_PER_PAGE;
    const pageImages = allImages.slice(start, end);
    const hasNext = currentIndex < pageImages.length - 1;
    const hasPrev = currentIndex > 0;

    // Display the selected image in the output area with navigation buttons
    const output = document.getElementById('output');
    output.innerHTML = `
        <div style="position: relative; display: inline-block; width: 100%;">
            <button onclick="displayImageGallery()" style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; z-index: 10;">← Back to Gallery</button>
            ${hasPrev ? `<button onclick="selectImage('${pageImages[currentIndex - 1]}', ${currentIndex - 1})" style="position: absolute; top: 50%; left: 10px; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: none; padding: 12px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; z-index: 10;">‹</button>` : ''}
            ${hasNext ? `<button onclick="selectImage('${pageImages[currentIndex + 1]}', ${currentIndex + 1})" style="position: absolute; top: 50%; right: 10px; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: none; padding: 12px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; z-index: 10;">›</button>` : ''}
            <img src="${imageSrc}" alt="Selected Meme" class="auto-resize" style="max-width: 100%; border-radius: 8px; display: block; margin: 0 auto;">
        </div>
    `;

    // Copy the image URL to clipboard
    copyToClipboard(imageSrc);
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
const knownImageFiles = [
"00ab07126e655cdde010900681696e65.jpg",
"037e31191571021e1947d83235128399.jpg",
"038a6c2d382179337ab55db7f4b7422b.jpg",
"0482c2c3955cb73d0eb1c62629de1ee4.jpg",
"086bb60cf35fcf21da74113486144895.jpg",
"09a90b6eb26c2013adbf77902c0f657c.jpg",
"0a731d8a55a42f9fffe42728d65647f4.jpg",
"0afb4fee0f38f3598dd32fe306222206.jpg",
"0b68a930c0ab333552d6ba950b2a2b63.jpg",
"0e4d916495665b831ad2c82cf9c0adaa.jpg",
"1.jpg",
"10\.jpg",
"111.jpeg",
"1111aaa.jpg",
"111a.jpg",
"111a1.jpg",
"111xf.jpg",
"112aa.jpg",
"11aa.jpg",
"11fh.jpg",
"11h1uh.jpg",
"11hdh.jpg",
"11huf.jpg",
"11huh.jpg",
"11huhd.jpg",
"11hwu.jpg",
"11ouhuh.jpg",
"11u1hu.jpg",
"11uhff.jpg",
"11uhg.jpg",
"11uhuhu.jpg",
"11uhus.jpg",
"11uydfhe.jpg",
"121ll.jpg",
"1234aa.jpg",
"12dede.jpg",
"12hduyd.jpg",
"1413r2.jpg",
"14748d0178674f8578f09f48d8f6d50b.jpg",
"1498398c54448f54e88fecc6fb6aa24b.jpg",
"153171c5187be2176650d90af3b0966f.jpg",
"16975bc5276d1c21cbc9d8c484e38725.jpg",
"184485db506a11b52de4fea50e09de41.jpg",
"1a.jpg",
"1a1uhuh.jpg",
"1a2232e4871b1478d8f02a7dcb11226f.jpg",
"1a6f8bc0c17ca0728682b99b873e4866.jpg",
"1aaah.jpg",
"1aadh.jpg",
"1aafam.jpg",
"1aahsh.jpg",
"1aal.jpg",
"1aasss.jpg",
"1aauhuh.jpg",
"1adfw.jpg",
"1afhwu.jpg",
"1ah.jpg",
"1ahau.jpg",
"1ahauhu.jpg",
"1ahsuww.jpg",
"1ahwu.jpg",
"1aital.jpg",
"1ashuf.jpg",
"1asss.jpg",
"1asuhu.jpg",
"1asw.jpg",
"1auah.jpg",
"1awhwwh.jpg",
"1awk.jpg",
"1awywyw.jpg",
"1b8bb50c62adfed845c32d98a52e265a.jpg",
"1bhsx.jpg",
"1bkh.jpg",
"1c0ff6c442689284cadb7eb0be927a97.jpg",
"1cx.jpg",
"1d2f2.jpg",
"1ddyh.jpg",
"1dgyd.jpg",
"1dp2.jpg",
"1ds.jpg",
"1dyh.jpg",
"1f7ff.jpg",
"1ffg.jpg",
"1fhf.jpg",
"1fhwu.jpg",
"1gdy.jpg",
"1h1uh.jpg",
"1h1uhd.jpg",
"1h1uhu.jpg",
"1hsugh.jpg",
"1hswhw.jpg",
"1hu1h.jpg",
"1hu1huf.jpg",
"1hufhf.jpg",
"1huh.jpg",
"1huhf.jpg",
"1huhfss.jpg",
"1huhhuh.jpg",
"1huhq.jpg",
"1lhllul.jpg",
"1lll.jpg",
"1lllhuh.jpg",
"1llljoihu.jpg",
"1lllkoi.jpg",
"1llllhy.jpg",
"1llllhyg.jpg",
"1llllkw.jpg",
"1lllll.jpg",
"1lllllhyh.jpg",
"1llllll.jpg",
"1llllllx\.jpg",
"1llllluhl.jpg",
"1ogxtd.jpg",
"1oko\.jpg",
"1omok.jpg",
"1ouho.jpg",
"1ouhod.jpg",
"1ouhuh.jpg",
"1p1ppoo.jpg",
"1p1pu.jpg",
"1pdhdu.jpg",
"1phpb.jpg",
"1pipipx.jpg",
"1qasss.jpg",
"1qhuh.jpg",
"1qs.jpg",
"1sa.jpg",
"1sfaw.jpg",
"1sff.jpg",
"1ssuh.jpg",
"1suh.jpg",
"1sybyd\.jpg",
"1tdgd.jpg",
"1tgyj.jpg",
"1udcd.jpg",
"1udhy.jpg",
"1ueh.jpg",
"1uhgd.jpg",
"1uhu.jpg",
"1ulh.jpg",
"1wfhwuh.jpg",
"1wgfw.jpg",
"1whf.jpg",
"1whuh.jpg",
"1wohw.jpg",
"1wshuw.jpg",
"1xz.jpg",
"1ydh.jpg",
"1yfeh.jpg",
"1yhy.jpg",
"1yhye.jpg",
"1yqar.jpg",
"1yrhf.jpg",
"1zx.jpg",
"200.jpg",
"222.jpg",
"22ffd21ae9b21452a14e944fac5c1688.jpg",
"232.jpg",
"24700b6b99dc49341df3396081f7c00a.jpg",
"249084b1373552f0fe19643db3381823.jpg",
"24c9a1ca52c706366f4cf7151caf64f8.jpg",
"2bcc16fe1ae6d30e70ed6681637cdadf.jpg",
"2cf6778cfbb050deb3b734577b064d4e.jpg",
"2dsw.jpg",
"2dwfw.jpg",
"2l.jpg",
"2sdslss.jpg",
"2slfsww.jpg",
"2ssqqql.jpg",
"2wg.jpg",
"2wllw.jpg",
"2wrww.jpg",
"32289dc07896c85ba693d334825f770f.jpg",
"34d9515b4b430e99d8b15049def0c8a7.jpg",
"35cents.jpg",
"36.jpg",
"37d1cb33ab959a9d65ff69695ea336e0.jpg",
"383e785d204a289ea09a373c4951a572.jpg",
"3c991ce35c45eb28915e4ea6a2d1e23b.jpg",
"3cf516bbb9229b0f46ce6282ea63d82d.jpg",
"3e4e87bb4b3462545c414fb77a2791a1.jpg",
"3e6ee007efc38922024d0a72fd1210cc.jpg",
"3ec5ecccce93bb45c4197ad2c6b01057.jpg",
"3fe32abd0cd481f181f80c27782a4787.jpg",
"3llllshs.jpg",
"3lllsus.jpg",
"3lls.jpg",
"3slkl.jpg",
"3slslw.jpg",
"3slss.jpg",
"3ssslkg.jpg",
"3wlfw.jpg",
"3www.jpg",
"3wwwfgg.jpg",
"455f9e0ecfda3d6cfcf2bd479df73bab.jpg",
"4629b50d1ceade82f74399d0f96c9b4f.jpg",
"49792fb62e98ae216bdd21706cd494da.jpg",
"4a744812ac50b16c05f30c4dfa6d1eb6.jpg",
"4ccfc51d5a22812214d91ea86ccb9475.jpg",
"4cebb60701ea2f73e9ad437b9ca70674.jpg",
"4f624ede68e2004c58886ac69812b063.jpg",
"4f7fc31ea36c7808007cee5d25564e18.jpg",
"4llek.jpg",
"4slk.jpg",
"4slve.jpg",
"4w.jpg",
"4wlf.jpg",
"515be0eb482f6d77d24055b191777e48.jpg",
"525b0517184052c4b1181c4479a6945e.jpg",
"595c57c0d7fce3b41e5420c80638f23f.jpg",
"5996e6020d4a47fded9154b4b6ffcb27.jpg",
"59eae030a7846369845810faf1b858c7.jpg",
"5c5a12ebcf3101e5994ca247fc2995b1.jpg",
"5d433bf44ea4a36f0a05765721aa6836.jpg",
"5d8a2ef1b3fa65a924bdf9384b71dc79.jpg",
"5hq5w.jpg",
"60$.jpg",
"6270c08b72803bb19875ade3bb5a1528.jpg",
"653d0f7ca756a82ae11ab36d7a49a40f.jpg",
"67f29e3c94c3875f6eb660433bfd7d7b.jpg",
"69.jpeg",
"754b3fb8114de50ce60e181abcd09994.jpg",
"76ddb2c3e68bc42d164095b330a6796d.jpg",
"76f4596f8410dc209f60cd4aac2720cb.jpg",
"7d7548298a9367039fd4d49fe32ff13d.jpg",
"801b41fb0f562c158a8a7767275559bb.jpg",
"8476f36dcfc304de7fd84d3b4818fe6c.jpg",
"87f6d2507ba09bd1ed2d328c2fad9f27.jpg",
"88b0df13444ea75d3bfada97f4660a51.jpg",
"8b13b1438459b0ff54ae719b74be23e9.jpg",
"8cae37f0baa0117d7a5ec57a2db59822.jpg",
"8db48aa1819aec034c10b97495d26007.jpg",
"8sma.jpg",
"9160e7eaf4757ba209deb25a9a54d0cf.jpg",
"925e753c08dff3331b64b08f2d5c3318.jpg",
"94754f859ab554c878e1be809ba26e74.jpg",
"94d57fe2b9ce1bf2976e738795eb0863.jpg",
"9561400bb18e19994637a20c7b60fc8b.jpg",
"958e03d4269de1c675fe5f98f738ae27.jpg",
"98ad4a02e42dc8badefce4f4d7df9a50.jpg",
"9a687cb82bd0b1a486cdc1c591dd2b19.jpg",
"9c3873275cdb8aaa92892e7dde23e041.jpg",
"9ce30190e053d0d5f15988706f97404d.jpg",
"9fdfcb97c11501da462a5c8fd0407c80.jpg",
"a.jpg",
"a1111111.jpg",
"a111111111.jpg",
"a1111uh.jpg",
"a1111uh1uh.jpg",
"a111hu111.jpg",
"a111l.jpg",
"a11hu.jpg",
"a11hu1hde.jpg",
"a11hu1hu.jpg",
"a11hudd.jpg",
"a11hyh.jpg",
"a11i1oouu.jpg",
"a11o1u.jpg",
"a11uy1ou.jpg",
"a1aaaa.jpg",
"a1adfadlfak.jpg",
"a1alfkalk.jpg",
"a1h1u.jpg",
"a1h1u1h.jpg",
"a1h1uh.jpg",
"a1h1uh111.jpg",
"a1h1uh1u.jpg",
"a1h1uhwl.jpg",
"a1hu1h.jpg",
"a1hu1h1u1.jpg",
"a1lakdsl.jpg",
"a1laksl.jpg",
"a1lfsak.jpg",
"a1lwio.jpg",
"a1lwkow.jpg",
"a1o1ou.jpg",
"a1oioi.jpg",
"a1oiwoi.jpg",
"a1oouu3.jpg",
"a1oouuu.jpg",
"a1owio.jpg",
"a1slk.jpg",
"a1soiwo.jpg",
"a1u1h1h.jpg",
"a1u1h1o1o1uo.jpg",
"a1u1hu.jpg",
"a1urhu.jpg",
"a1uyoo2.jpg",
"a1wio.jpg",
"a1y19y.jpg",
"a1y2i.jpg",
"a1yii2.jpg",
"a471c6f70bafb9790cf6b856d5e01588.jpg",
"a571efb3183a878ae0358de13aaf4821.jpg",
"a834606716b5001c907bf5ff1338556e.jpg",
"a93e15210ee0bfeb242ab2d36ba97f4f.jpg",
"a992d18ea06b26fb481d38b108e5f3ed.jpg",
"aaa.jpg",
"aaaa.jpg",
"aaaaaa.jpg",
"aaaaaaa.jpg",
"aaaaaaaa.jpg",
"aaaaaahah.jpg",
"aaaaaajah.jpg",
"aaaaaao.jpg",
"aaaaaaoaoa.jpg",
"aaaaaaygayga.jpg",
"aaaaah.jpg",
"aaaaahahaha.jpg",
"aaaaahahau.jpg",
"aaaaahhh'.jpg",
"aaaaaican.jpg",
"aaaaalala.jpg",
"aaaaan.jpg",
"aaaaana.jpg",
"aaaaaoauaou.jpg",
"aaaaass.jpg",
"aaaaauaau.jpg",
"aaaafasfo.jpg",
"aaaafwoqi.jpg",
"aaaahahah.jpg",
"aaaahq.jpg",
"aaaaiaoi.jpg",
"aaaalalal.jpg",
"aaaalalalalla.jpg",
"aaaaoaaoo.jpg",
"aaaaoaoao.jpg",
"aaaaoaoaoao.jpg",
"aaaaoaoo.jpg",
"aaaaokao.jpg",
"aaaaola.jpg",
"aaaaoooao.jpg",
"aaaaos.jpg",
"aaaapapaphapap.jpg",
"aaaasn.jpg",
"aaaaspoapp.jpg",
"aaaauaa.jpg",
"aaagaga.jpg",
"aaahaahah.jpg",
"aaaiai.jpg",
"aaalalal.jpg",
"aaaoaia.jpg",
"aaaoaoaooa.jpg",
"aaaoaoiss.jpg",
"aaaoiao.jpg",
"aaaoiaoia.jpg",
"aaaooao.jpg",
"aaasad.jpg",
"aaasaois.jpg",
"aaasois\.jpg",
"aaasosos.jpg",
"aaaygayg.jpg",
"aad.jpg",
"aafa.jpg",
"aaiaiiiw.jpg",
"aaiaiqa.jpg",
"aalalal.jpg",
"aalfalv.jpg",
"aalfjslfung.jpg",
"aaoaioaoi.jpg",
"aaoaisoi.jpg",
"aaoao.jpg",
"aaoaoao.jpg",
"aaoaoaojd.jpg",
"aaoauao.jpg",
"aaoiass.jpg",
"aaosio.jpg",
"aasaoa.jpg",
"aasosi.jpg",
"aass.jpg",
"aasslfk.jpg",
"aayaapsoso.jpg",
"ab.jpg",
"ab7c94e1e40a19580a883ae1aa3f4822.jpg",
"abc.jpg",
"abcd.jpg",
"abdc.jpg",
"abraham.jpg",
"acmah.jpg",
"adaaffuck.jpg",
"adf.jpg",
"adhd.jpg",
"adver.jpg",
"ae651177af710e40e37af710258b9168.jpg",
"aeaoi.jpg",
"af0605d11b069cee3d9abf3844fba6d8.jpg",
"afadfo.jpg",
"afafwwaaa.jpg",
"afasae.jpg",
"afasdfwl.jpg",
"aflana.jpg",
"afmer.jpg",
"afsfcaaaa.jpg",
"afteri.jpg",
"ahahaha.jpg",
"ahas.jpg",
"aheadd.jpg",
"ahua.jpg",
"aiaaaaaa.jpg",
"aiaaaaaaa.jpg",
"aiaaiai.jpg",
"aiaiaiaia.jpg",
"aii.jpg",
"aiplatform.jpg",
"airepl.jpg",
"airpsod.jpg",
"ajerster.jpg",
"alakalka.jpg",
"aligatortalking.jpg",
"allthiemi.jpg",
"allwron.jpeg",
"almostripe.jpg",
"aloboaut.jpg",
"alone.jpg",
"alvin.jpg",
"always.jpg",
"amkng;'.jpg",
"amubla.jpg",
"and ate.jpg",
"ange.jpg",
"angelr.jpg",
"angryb.jpg",
"anihalia.jpg",
"animaljam.jpg",
"another kno.jpg",
"anttiii.jpg",
"anylas.jpg",
"anythin.jpg",
"anything their.jpg",
"anything.jpg",
"ao2io.jpg",
"aoaaoaos.jpg",
"aoaoa.jpg",
"aoaoaaa.jpg",
"aoaoao.jpg",
"aoaus.jpg",
"aodosiq.jpg",
"apenny.jpg",
"apocalpsp.jpg",
"aralaa.jpg",
"ARCH.jpg",
"are you dumbbb.jpeg",
"are you.jpg",
"aresafe.jpg",
"around.jpg",
"artic.jpg",
"asdfaoia.jpg",
"ashshs.jpg",
"assemel.jpg",
"asssoda.jpg",
"assss.jpg",
"AT BRUCN.jpg",
"atheie.jpg",
"attacked.jpg",
"attentionnn.jpg",
"auaauaukke.jpg",
"auraa.jpg",
"autissi.jpg",
"autum.jpg",
"avigna.jpg",
"awfulacak.jpg",
"awkawa.jpg",
"b2838fa455b79ebe07dd53f361ff2210.jpg",
"b4bef72366be63257c1e6e1c460cd482.jpg",
"b65e5841505a81a240bb38589bbfe2d0.jpg",
"baby lion.jpg",
"babycostume.jpg",
"babyelep.jpg",
"back in stock.jpg",
"backsto.jpg",
"bafab.jpg",
"bald and obese.jpg",
"barefee.jpg",
"barefuu.jpg",
"basqca.jpg",
"bathroo.jpg",
"be me.jpeg",
"bearrr.jpg",
"beastbro.jpg",
"beats.jpeg",
"beatufi.jpg",
"beautiful.jpg",
"bedamned.jpg",
"bedazzled.jpg",
"befed607f11fa748d37d71525fb2205d.jpg",
"being aliv.jpg",
"being sick.jpg",
"belyingg.jpg",
"benten.jpg",
"besigns.jpeg",
"bestcoaa.jpg",
"bitch.jpg",
"blcs.jpg",
"blinding stew.jpeg",
"blso.jpeg",
"blucat.jpg",
"bluef.jpg",
"bluewa.jpg",
"bobbs.jpg",
"bodystand.jpg",
"bom.jpg",
"boneee.jpg",
"borlil.jpg",
"born in.jpg",
"bostong.jpg",
"botehreayam.jpg",
"boyah.jpg",
"boysss.jpg",
"breakda.jpg",
"breif.jpg",
"brickby.jpg",
"brickof.jpg",
"brohem.jpg",
"brsk.jpg",
"bsfr.jpg",
"bu.jpg",
"bug.jpg",
"bugfear.jpg",
"buildship.jpg",
"burnana.jpeg",
"buss.jpg",
"bussin.jpg",
"bxno.jpg",
"by mouth.jpg",
"c1e5ac39f46554c705c6f455408ce344.jpg",
"c25c159715edab95854f7d5ec842dfe0.jpg",
"c596e66396073fef47f63f0beabb0d0e.jpg",
"c5a188f081ea677bca780faccf8f0d94.jpg",
"c67f32fe3da179db99abf330245b991b.jpg",
"c9b523ad18727a3f347bdfed000784bc.jpg",
"ca0ad37e0ba9f07ddf44859f9150af18.jpg",
"caffeine.jpg",
"cahra.jpg",
"cahtcpa.jpg",
"calalin.jpg",
"calories.jpg",
"camee.jpg",
"cannota.jpeg",
"cantes.jpg",
"capgan.jpg",
"car is this.jpg",
"cartna.jpg",
"caseclosed.jpeg",
"cashs.jpg",
"cat shark.jpg",
"catnip.jpg",
"catss.jpg",
"caved.jpg",
"cementshoes.jpg",
"ceooo of jackboys.jpeg",
"cervez.jpg",
"cesn.jpg",
"cg5.jpg",
"changie.jpg",
"charc.jpg",
"charger.jpg",
"chckenboy.jpg",
"cheapass.jpg",
"checa.jpg",
"chef man.jpg",
"chemical.jpg",
"chickenmnn.jpeg",
"chil.jpg",
"chloricc.jpg",
"cicken.jpg",
"clevis.jpg",
"clock.jpg",
"clockk.jpg",
"close the doors.jpg",
"codien.jpg",
"colabottles.jpg",
"comingtogether.jpg",
"contain.jpg",
"convergant.jpg",
"cool and.jpg",
"cooler.jpg",
"coredd.jpg",
"cornpit.jpg",
"could be.jpg",
"couldnt.jpg",
"covidnow.jpg",
"covs.jpg",
"cracked11.jpg",
"cracking.jpg",
"cray.jpg",
"crerer.jpg",
"croods.jpg",
"cumas.jpg",
"cupa.jpg",
"customer.jpg",
"d26ab5c134db416c8e79bdece2f564cc.jpg",
"d3d10afce975250cf8693454f19f208d.jpg",
"d533b1d988d28555d109e56c1d5d3c9a.jpg",
"d8c31c101ece9b5fa1222d0ee1401d7c.jpg",
"dadred.jpg",
"danceee.jpg",
"dap me.jpg",
"darkhum.jpg",
"datedave.jpg",
"day 4.jpg",
"day5.jpg",
"dayo.jpg",
"dcant.jpg",
"de00f850dd953639d495fcd348302ca8.jpg",
"delete.jpg",
"delicious.jpg",
"diamonds.jpg",
"diasva.jpg",
"did.jpg",
"didh.jpg",
"didnt even seven.jpg",
"differ.jpg",
"dihdd.jpg",
"dimensal.jpg",
"dinos.jpg",
"disccc.jpg",
"disguesed.jpg",
"dishwasher.jpg",
"dishwashihng.jpg",
"divorced.jpg",
"dkaar.jpg",
"dmmm.jpg",
"dmoke.jpg",
"do a crime.jpg",
"do not rain.jpg",
"do to hsim.jpeg",
"dog.png",
"dogalone.jpg",
"dogg of.jpg",
"dogg.jpg",
"doggmf.jpg",
"donkae.jpg",
"donotsay.jpg",
"dontfwn.jpg",
"dora.jpg",
"drag.jpg",
"drap.jpg",
"drdr.jpg",
"drpep.jpg",
"duama.jpg",
"dude.jpg",
"dudeee.jpg",
"dudes.jpg",
"e1dae19bba9adcd6e59ee0611fe17795.jpg",
"e3609c55633273a2885a85122183bc07.jpg",
"e40648d9824be4cd9909ad7ded10b82e.jpg",
"e6e655c1069f6aac59859c0deeb86124.jpg",
"e87e62463cb689b7cb1286e1a119f605.jpg",
"e954764001b7d5bfb2691f311da2f979.jpg",
"e9988cf84ef4196e73cfcae3cde378f1.jpg",
"eartth.jpg",
"eathis.jpg",
"eating good.jpg",
"eatmyhw.jpg",
"eatsss.jpg",
"eb4f38a90f19d03958dbef5ffe5f5091.jpg",
"ebe2e7fecd5e507aa93640d85c66622a.jpg",
"ecouple.jpg",
"edf0aeaa88cf91aa2f99109465b2f7f9.jpg",
"editro.jpg",
"eever.jpeg",
"ef7ac6039fd4c3f32f6a258d646baec8.jpg",
"eggg.jpg",
"ememe.jpg",
"epe.jpg",
"epicmusical.jpg",
"episodes.jpeg",
"erectus.jpg",
"essat.jpg",
"eterey.jpg",
"ever seen.jpg",
"ever taken.jpg",
"everrr.jpg",
"everything.jpg",
"everytim.jpeg",
"evil fortress.jpg",
"evilcorn.jpg",
"evilslumb.jpg",
"excusemee.jpg",
"exec.jpg",
"f14422e47cb5027563d0a1951485aee4.jpg",
"f5d5222c155e4e4ff27bcf2224280bb5.jpg",
"fac8e26ae7ca34427264718e69b7831e.jpg",
"falkne.jpg",
"family.jpg",
"fandom.jpg",
"fandomm.jpg",
"farapa.jpg",
"farted.jpg",
"fasst.jpg",
"fata.jpg",
"favorie.jpg",
"feaaa.jpg",
"fentanyl.jpg",
"fessly.jpg",
"ffreaky.jpg",
"ffur.jpg",
"fgatrae.jpg",
"fiery.jpg",
"fig.jpg",
"fighting.jpg",
"fillerfit.jpg",
"finish.jpg",
"finn.jpg",
"fire.jpg",
"firemage.jpeg",
"firss.jpg",
"first.jpg",
"fishse.jpg",
"fithard.jpg",
"floats.jpg",
"flortida.jpg",
"flynn.jpg",
"foodbro.jpg",
"foogd.jpg",
"fortnai.jpg",
"fortnig.jpg",
"foundd.jpg",
"fowl.jpg",
"fpsil.jpg",
"frame.jpg",
"frand.jpg",
"freakbobb.jpg",
"freinds.jpg",
"fresnch.jpg",
"friendship.jpeg",
"fsys.jpg",
"funersal.jpg",
"fursonsa.jpg",
"gallll.jpeg",
"galss.jpg",
"gamin.jpg",
"ganglea.jpg",
"garticss.jpg",
"garyslee.jpg",
"gasped.jpg",
"gaveme.jpg",
"gaybeam.jpg",
"gemano.jpeg",
"genz.jpg",
"getting.jpg",
"giant.jpg",
"girlll.jpg",
"give.jpg",
"glaggle.jpg",
"glowedup.jpg",
"gnose.jpg",
"go getter.jpg",
"goflsab.jpg",
"gog.jpg",
"gogllemeet.jpg",
"goinplace.jpg",
"goo.jpg",
"good.jpg",
"goodaf.jpeg",
"goodwil.jpg",
"googgamew.jpg",
"goth clowsn.jpg",
"gotta pay.jpg",
"goun.jpg",
"governt.jpg",
"grateed.jpg",
"grave.jpg",
"great.jpg",
"green.jpg",
"greensters.jpg",
"grilled cheeseee.jpg",
"grocer.jpg",
"grown up.jpg",
"grownassbaby.jpeg",
"guy your fat.jpg",
"guyhs.jpg",
"hair.jpg",
"halfbalck.jpg",
"hanging outtt.jpg",
"hanging.jpg",
"hasa.jpg",
"hashsbo.jpg",
"hattt.jpg",
"have one.jpg",
"hceeksack.jpg",
"headless.jpg",
"health bar.jpg",
"hellionte.jpg",
"helps.jpg",
"heress.jpg",
"heso.jpg",
"hi sponge.png",
"hiccup.jpg",
"hiddeen.jpg",
"himself.jpg",
"hisbuns.jpg",
"hoa.jpg",
"hoesat.jpg",
"hohoo.jpg",
"hold on im tryna.jpg",
"holdon.jpg",
"homeboys.jpg",
"homies bed.jpg",
"horeces.jpg",
"howdoi.jpg",
"howiss.jpg",
"howw.jpg",
"hrosee.jpg",
"hsuah.jpg",
"human.jpg",
"humanspi.jpg",
"hunso.jpg",
"hwow.jpg",
"i bet.jpg",
"i hate.jpg",
"iawna.jpg",
"ibpuromef.jpg",
"icon.jpg",
"iconcnc.jpg",
"idot.jpg",
"imprint.jpg",
"imr eally.jpg",
"incredibl.jpg",
"innovation.jpg",
"insanealber.jpg",
"inside.jpg",
"into the soou.jpg",
"ireneee.jpg",
"irona.jpg",
"is there.jpg",
"itheak.jpg",
"itktk.jpeg",
"iwas9.jpg",
"jaho.jpeg",
"jesus the christ.jpg",
"jfack.jpg",
"jfackbla.jpg",
"jigglee.jpg",
"jimpbob.jpg",
"joe ron.jpg",
"jokings.jpg",
"josin.jpg",
"jusbfe.jpg",
"just chil.jpeg",
"kaihorse.jpg",
"kepler.jpg",
"keybbb.jpg",
"kidan.jpg",
"kirrb.jpg",
"krypto.jpg",
"lastem.jpg",
"laughed.jpg",
"laughinplush.jpg",
"lchisl.jpg",
"lcock.jpg",
"leave thi.jpg",
"lebro.jpg",
"leggso.jpg",
"leteeth.jpg",
"letter g.jpg",
"lieking.jpg",
"lifeand.jpg",
"likmender.jpg",
"limiton.jpg",
"lipss.jpg",
"little dud.jpg",
"llvoe.jpg",
"lmap.jpg",
"lmfao.jpg",
"lmfaooo.jpg",
"lmoooo.jpg",
"loll.jpg",
"longas.jpg",
"lost.jpg",
"lotion.jpg",
"lous.jpg",
"lseecve.jpg",
"lsefw.jpeg",
"ltt.jpg",
"luckibruce.jpeg",
"machine.jpg",
"make it.jpg",
"mana.jpg",
"manner.jpg",
"mean by that.jpg",
"megetting.jpg",
"meh.jpg",
"mexican.jpg",
"middlea.jpg",
"miksus.jpg",
"mikus.jpg",
"minddd.jpg",
"mine today.jpg",
"minecar.jpg",
"mirror.jpg",
"miserable.jpg",
"mitchace.jpg",
"mitten.jpg",
"mnm.jpg",
"moeney.jpg",
"molestalliga.jpg",
"moll.jpg",
"mom.jpg",
"momspix.jpg",
"my life.jpg",
"mybody.jpg",
"mysa.jpg",
"nature.jpg",
"naturee.jpg",
"ncier.jpg",
"neapal.jpeg",
"nephew.jpg",
"netflix.jpg",
"neverrr.jpg",
"new animal.jpg",
"new place.jpg",
"nice day.jpg",
"nonchalant.jpg",
"nonh.jpg",
"nono.jpg",
"nonverbal.jpg",
"NOOO.jpeg",
"nope.jpg",
"noshi.jpg",
"not drawggin.jpg",
"not drawgin.jpg",
"notfin.jpg",
"notrip.jpg",
"nottalen.jpg",
"notthis.jpg",
"nowee.jpg",
"nowi.jpeg",
"nutell.jpg",
"nwow.jpg",
"oaoaoaoaoao.jpg",
"obese.jpg",
"ohhbis.jpg",
"omgs.jpg",
"on sceee.jpg",
"one of.jpg",
"onearth.jpg",
"oneata.jpg",
"oneeen.jpg",
"oneofmy.jpg",
"oohsi.jpg",
"oppen.jpg",
"oppps.jpg",
"opss.jpg",
"orchid.jpg",
"osa.jpg",
"osh.jpg",
"outa.jpg",
"overrr.jpg",
"oversil.jpg",
"overthe.jpg",
"parsnip.jpg",
"particle.jpg",
"partner.jpg",
"paswe.jpg",
"pay day.jpg",
"peacocks.jpg",
"peap.jpg",
"peasant.jpg",
"peein.jpeg",
"peniss.jpg",
"pennies.jpg",
"pepepe.jpg",
"per.jpg",
"perfeclogo.jpg",
"permit.jpg",
"pissed.jpg",
"pixarmom.jpeg",
"pizza rolls.jpeg",
"plant.jpg",
"planton.jpg",
"plasyso.jpg",
"play.jpg",
"playb.jpg",
"plss.jpg",
"plubar.jpg",
"plusgh.jpg",
"poepe.jpg",
"pointed.jpg",
"pokem.jpg",
"pompopm.jpg",
"popp.jpeg",
"pores.jpg",
"porr.jpg",
"pplfa.jpg",
"praaa.jpg",
"praiseee.jpg",
"praysas.jpg",
"prboy.jpg",
"preserved.jpg",
"presi.jpg",
"prison.jpg",
"prisongit.jpg",
"ps4.jpg",
"pua.jpg",
"publick.jpg",
"puddle.jpeg",
"puppie.jpg",
"pura.jpg",
"puss.jpg",
"qahu.jpg",
"qlap.jpg",
"quarantine.jpg",
"quite.jpg",
"raa.jpg",
"rafiki.jpg",
"random.jpg",
"ranked.jpg",
"ransdo.jpg",
"rattt.jpg",
"readyfor.jpg",
"real fabbi.jpg",
"realbart.jpg",
"reallll.jpeg",
"refuses.jpg",
"regree.jpg",
"reicha.jpg",
"revmo.jpg",
"rfofl.jpg",
"rightsb.jpg",
"rightt.jpg",
"risso.jpg",
"roblox.jpg",
"robloxxx.jpg",
"robo.jpg",
"romansandals.jpg",
"ruinsed.jpg",
"russain advice.jpg",
"saaahah.jpg",
"sacrifc.jpg",
"sad sun.jpg",
"salmobn.jpg",
"salmon.jpg",
"salyyy.jpg",
"sandworm.jpg",
"sant.jpg",
"savee.jpg",
"saw raccoon.jpg",
"scar.jpg",
"sdecon.jpg",
"seamless run.jpg",
"seethis.jpg",
"sendmessae.jpg",
"seriousbro.jpg",
"sesu.jpg",
"sfaf.jpg",
"sfs.jpg",
"sfss.jpg",
"shapedd.jpg",
"shield anti.jpeg",
"shiteea.jpg",
"shoebox.jpg",
"shorttt.jpg",
"shott.jpg",
"shtiss.jpg",
"shut.jpg",
"sick fuck.jpg",
"sick.jpg",
"sil.jpg",
"simpler time.jpg",
"sitcka.jpg",
"skydai.jpg",
"skyyy.jpg",
"slchoa.jpg",
"slife.jpg",
"slimm.jpg",
"slins.jpg",
"slowlyww.jpg",
"small snack.jpg",
"snail.jpg",
"snow.jpg",
"snw.jpg",
"so bad oom.jpg",
"so harddd.jpg",
"so me.jpg",
"soemte.jpg",
"someeg.jpg",
"something funny.jpg",
"songggg.jpg",
"sosoft.jpg",
"soss.jpg",
"sourceee.jpg",
"spagg.jpg",
"spareky.jpg",
"speaca.jpg",
"spid.jpg",
"spofa.jpg",
"spongbeob.jpg",
"sponge.jpg",
"spongebobb.jpg",
"spookybb.jpg",
"springbaby.jpg",
"spritecroc.jpeg",
"squidgames.jpg",
"squirrel.jpg",
"srko.jpg",
"ssohh.jpg",
"ssse.jpg",
"ssssss.jpg",
"stare.jpg",
"stem.jpg",
"stocks.jpg",
"stolyme.jpeg",
"stops.jpg",
"straightup.jpg",
"stroker.jpeg",
"strory.jpeg",
"stuckk.jpg",
"suckas.jpg",
"sudeenly.jpg",
"suit.jpg",
"summon.jpg",
"sumref.jpg",
"surcar.jpg",
"suspe.jpg",
"sw.jpg",
"swan.jpg",
"sweethrea.jpg",
"sybaau.jpg",
"syess.jpg",
"t3n34di.jpg",
"takeenn.jpg",
"talk about.jpg",
"talks.jpg",
"targets.jpg",
"tasty.jpg",
"teacherr.jpg",
"teacs.jpg",
"teneren.jpg",
"terminated.jpg",
"textingtv.jpg",
"tf is sti.jpg",
"tf is.jpg",
"tfsisw.jpg",
"thabnkss.jpg",
"thank g.jpg",
"thaseriksu.jpg",
"that gang.jpg",
"the story.jpg",
"theentity.jpg",
"theirfsho.jpg",
"thekids.jpg",
"them.jpg",
"therapygi.gif",
"therer.jpg",
"theybs.jpg",
"thisbox.jpg",
"thisgam.jpg",
"thma.jpg",
"thumbsup.jpeg",
"tier.jpg",
"tiktoktoday.jpg",
"timeee.jpg",
"tjtlk.jpg",
"to sleep.jpg",
"tobae.jpg",
"todohere.jpg",
"toghge.jpg",
"tojails.jpg",
"tomodachi.jpg",
"tomorrow.jpg",
"tooangry.jpg",
"tooka.jpg",
"toothcabs.jpg",
"touchaer.jpg",
"toufh3.jpg",
"tourest.jpg",
"tpose.jpg",
"trampo.jpg",
"trauma.jpg",
"treas.jpg",
"treasuree.jpg",
"treee.jpg",
"trevsi.jpg",
"truman show.jpg",
"trusl.jpg",
"tsss.jpg",
"turtl.jpg",
"tvcame.jpeg",
"tvss.jpg",
"twiain.jpg",
"twisnsn.jpg",
"twoo.jpg",
"typeshi.jpg",
"uluek.jpg",
"unemployable.jpeg",
"unlmt.jpg",
"usaggg.jpg",
"usagi.jpg",
"usedthes.jpg",
"useesa.jpg",
"uv.jpg",
"v.jpg",
"va.jpg",
"vamp.jpg",
"vangoh.jpeg",
"veazypfp.jpeg",
"veins.jpg",
"vsss.jpg",
"vv.jpg",
"w.jpg",
"waht is this.jpg",
"wahttt.jpg",
"wakeup.jpg",
"walmat.jpg",
"walterr.jpg",
"waohh.gif",
"wardd.jpg",
"warehouse.jpg",
"wasnt.jpg",
"watchanime.jpg",
"wbkins.jpg",
"wear.jpg",
"wel.jpeg",
"weme.jpg",
"werokd.jpg",
"wetss.jpg",
"whaha.gif",
"whaless.jpg",
"what is this.jpg",
"whatdog.jpg",
"whats.jpg",
"whatttt.jpg",
"whatv.jpg",
"wheneee.jpeg",
"wherebeach.jpg",
"wheretf.jpeg",
"whfatd.jpg",
"whipped.jpg",
"whiteee.jpg",
"who.jpg",
"whowe.jpg",
"whytf.jpeg",
"whythiscar.jpg",
"whywonwt.jpg",
"wiaara.jpg",
"wild.jpg",
"wint.jpg",
"wiped.jpg",
"with a brick.jpg",
"without.jpg",
"withw.jpg",
"wolfart.jpg",
"wonka.jpg",
"wontpopp.jpg",
"workbro.jpg",
"wrontt.jpg",
"wtfff.jpg",
"wth.jpg",
"wts.jpg",
"x090.jpg",
"x11.jpg",
"x111.jpg",
"x1111.jpg",
"x11111.jpg",
"x1111111.jpg",
"x11111111.jpg",
"x111111111.jpg",
"x111111s1.jpg",
"x111x1s.jpg",
"x11dde.jpg",
"x11eed.jpg",
"x11w131.jpg",
"x11x11e.jpg",
"x1qxqq.jpg",
"x1s1x11.jpg",
"x1ss1.jpg",
"x1x111\.jpg",
"x1x11x1.jpg",
"x1x1x1s1s1e.jpg",
"x222.jpg",
"x2d2.jpg",
"x324.jpg",
"xhe2.jpg",
"xhw.jpg",
"xhwy.jpg",
"xqqx111.jpg",
"xqqxqx11.jpg",
"xqxqxqqqqq.jpg",
"xwdwf.jpg",
"xwhwy.jpg",
"xwuw.jpg",
"xwx.jpg",
"xwy.jpg",
"xx.jpg",
"xx11111.jpg",
"xx111111.jpg",
"xx2.jpg",
"xx2x2.jpg",
"xx9.jpg",
"xx98.jpg",
"xx9y.jpg",
"xxixixxi.jpg",
"xxo.jpg",
"xxoxoxuu.jpg",
"xxwq.jpg",
"xxxixi.jpg",
"xxxooioiioioi.jpg",
"xxxuxhx.jpg",
"xxxxixixi.jpg",
"xxxxoxoxo.jpg",
"xxxxuux.jpg",
"xxxxxa.jpg",
"xxxxxuxuux.jpg",
"xxxxxxi.jpg",
"xxxxxxuu.jpg",
"ya mom.jpg",
"yaaayyy.jpg",
"yardghosts.jpg",
"yeet.jpg",
"yellow.jpg",
"yellowthings.jpg",
"yesbut.jpg",
"yess.jpg",
"yfdauc.jpg",
"ynssn.jpg",
"yogurt.jpg",
"yome.jpg",
"yorujob.jpg",
"young.jpg",
"yourmouth.jpg",
"z11h1b.jpg",
"z11l.jpg",
"z11lkl1j.jpg",
"z1i1ou.jpg",
"z1k1k.jpg",
"z1l1kl.jpg",
"z1u1h.jpg",
"zigg.jpg",
"zooble.jpg",
"zoomcall.jpg",
"zzizzzi.jpg",
"zzzzzzii.jpg"
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

// Slime Button - Save and Copy current content
document.getElementById('generate-btn').addEventListener('click', async () => {
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

        // Show/hide color customizer based on theme
        const colorCustomizer = document.querySelector('.color-customizer');
        if (newTheme === 'neon-fluid' || newTheme === 'aurora-wave') {
            colorCustomizer.style.display = 'block';
        } else {
            colorCustomizer.style.display = 'none';
        }

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

    // Type selector auto-generate
    document.getElementById('type-select').addEventListener('change', async function() {
        // Auto-generate a banger when type changes
        await generateBanger();
        copyCurrentBanger();
    });

    // Gallery button
    document.getElementById('gallery-btn').addEventListener('click', function() {
        displayImageGallery();
    });

    // Output card click handler
    document.getElementById('output').addEventListener('click', function(e) {
        // Only generate banger when clicking directly on the output area, not on gallery images or buttons
        if (e.target === this || e.target.closest('.gallery-image, button, .pagination-controls button')) {
            // Don't generate if clicking on gallery images or buttons
            if (!e.target.closest('.gallery-image, button, .pagination-controls button')) {
                generateBanger();
            }
        } else {
            generateBanger();
        }
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

        // Apply custom colors to CSS variables for customizable themes
        if (currentTheme === 'neon-fluid' || currentTheme === 'aurora-wave') {
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
                document.body.setAttribute('data-theme', currentTheme);
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
    const savedTheme = localStorage.getItem('currentTheme') || 'veazy';
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-select').value = savedTheme;
    updateStarfieldColors(savedTheme);

    // Show/hide color customizer based on initial theme
    const colorCustomizer = document.querySelector('.color-customizer');
    if (savedTheme === 'neon-fluid' || savedTheme === 'aurora-wave') {
        colorCustomizer.style.display = 'block';
    } else {
        colorCustomizer.style.display = 'none';
    }

    // Initialize color inputs
    applyColorCustomizations(currentCustomizations);
});

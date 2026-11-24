/**
 * ANITA BIRTHDAY PROJECT LOGIC
 * Re-polished 💖
 */

const config = {
    photos: [
        'foto/1.jpeg',
        'foto/2.jpeg',
        'foto/3.jpeg',
        'foto/4.jpeg',
        'foto/5.jpeg',
        'foto/6.jpeg',
        'foto/7.jpeg',
        'foto/8.jpeg',
        'foto/9.jpeg',
        'foto/10.jpeg'
    ],
    captions: [
        "Happy Birthday! 🎂",
        "Makasih udah selalu nemenin aku...",
        "Setiap momen bareng kamu itu berarti banget ✨",
        "Kamu bener-bener luar biasa,",
        "Stay happy, stay healthy, my love!",
        "Semoga semua impianmu tercapai ❤️",
        "Bersyukur banget bisa kenal sama kamu...",
        "Jangan pernah bosan sama aku ya? 🥺",
        "As long as you're smiling, I'm happy.",
        "Ini persembahan spesial buat kamu... "
    ]
};

// --- PRELOAD PHOTOS ---
config.photos.forEach(src => {
    const img = new Image();
    img.src = src;
});

// --- STAGE 1: MATRIX ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function initMatrix() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Soft Pink/Magenta Matrix
        ctx.fillStyle = '#F472B6'; 
        ctx.font = 'bold ' + fontSize + 'px Space Mono';

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    const matrixInterval = setInterval(draw, 40); // Slightly slower for readability
    return matrixInterval;
}

const matrixInt = initMatrix();

// Countdown Logic
const countdownEl = document.getElementById('countdown');
const introText = document.getElementById('intro-text');
let count = 3;

const countdownTimer = setInterval(() => {
    countdownEl.innerText = count;
    
    // Add a little pop effect on each tick
    gsap.fromTo(countdownEl, {scale: 0.8}, {scale: 1, duration: 0.5, ease: "back.out(1.5)"});

    if (count === 0) {
        clearInterval(countdownTimer);
        countdownEl.classList.add('hidden');
        introText.classList.remove('hidden');
        
        gsap.fromTo(introText, {opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 1});

        // After showing Title, move to Unlock stage
        setTimeout(() => {
            switchStage('stage-matrix', 'stage-unlock');
        }, 3000);
    }
    count--;
}, 1000);

// --- STAGE NAVIGATION ---
function switchStage(fromId, toId) {
    document.getElementById(fromId).classList.remove('active');
    setTimeout(() => {
        document.getElementById(toId).classList.add('active');
        if (toId === 'stage-gallery') initGallery();
        if (toId === 'stage-finale') initFinale();
    }, 1200);
}

// Attempt to play music continuously or at the earliest interaction
document.addEventListener('click', () => {
    const bgm = document.getElementById('bgm');
    if(bgm.paused) {
        bgm.play().catch(e => console.log("Audio play blocked"));
    }
}, {once: true});

// --- STAGE 2: UNLOCK ---
document.getElementById('unlockBtn').addEventListener('click', () => {
    // Animate envelope opening before switching
    gsap.to('#unlockBtn', {
        rotation: 720, 
        scale: 0, 
        opacity: 0, 
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => switchStage('stage-unlock', 'stage-gallery')
    });
});

// --- STAGE 3: GALLERY (BOOK FLIP) ---
let currentPhoto = 0;
function initGallery() {
    const slideContainer = document.getElementById('photo-slides');
    
    // Clear and build cards
    slideContainer.innerHTML = '';
    config.photos.forEach((src, index) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        // Stack them properly
        card.style.zIndex = config.photos.length - index;
        card.innerHTML = `<img src="${src}" alt="Anita ${index + 1}">`;
        slideContainer.appendChild(card);
        
        // Hide all but first, but now they are perfectly flat since it's a book
        if (index > 0) gsap.set(card, { opacity: 0, rotationY: 0 });
    });
    
    updateGallery();
}

function updateGallery() {
    const cards = document.querySelectorAll('.photo-card');
    const captionEl = document.getElementById('gallery-caption');
    
    // Animate current card in (if it was somehow offset, but normally it's already in place)
    gsap.to(cards[currentPhoto], { 
        duration: 0.8, 
        opacity: 1, 
        rotationY: 0,
        ease: "power2.out"
    });

    // Re-trigger caption pop-in animation
    captionEl.style.animation = 'none';
    captionEl.offsetHeight; /* trigger reflow */
    captionEl.style.animation = null; 
    
    captionEl.innerHTML = config.captions[currentPhoto];
}

document.getElementById('nextPhotoBtn').addEventListener('click', () => {
    const cards = document.querySelectorAll('.photo-card');
    
    if (currentPhoto < config.photos.length - 1) {
        // Book flip transition (flip left and fade slightly)
        gsap.to(cards[currentPhoto], {
            duration: 1.2,
            rotationY: -110, // Open like a left book page
            x: -20, // Slight shift left for realism
            opacity: 0, // Fade out as it turns
            ease: "power2.inOut",
            onComplete: () => {
                currentPhoto++;
                updateGallery();
            }
        });
    } else {
        // Final transition (flip last page then finale)
        gsap.to(cards[currentPhoto], {
            duration: 1.2,
            rotationY: -110,
            x: -20,
            opacity: 0,
            ease: "power2.inOut",
            onComplete: () => switchStage('stage-gallery', 'stage-finale')
        });
        gsap.to('.gallery-nav', {opacity: 0, duration: 0.5});
        gsap.to('.caption-container', {opacity: 0, duration: 0.5});
    }
});

// --- STAGE 4: FINALE ---
function initFinale() {
    createStars();
    createHeartMosaic();
    
    setTimeout(() => {
        gsap.to('.final-wish', { opacity: 1, y: 0, duration: 2, ease: "power4.out" });
    }, 5500); // Wait for heart to form
}

function createStars() {
    const starContainer = document.getElementById('stars-bg');
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starContainer.appendChild(star);
    }
}

function createHeartMosaic() {
    const container = document.getElementById('mosaic-container');
    const pointsCount = 45; // Increased for a denser heart contour
    const points = [];
    
    // Scale factor based on screen size so it looks good on mobile & desktop
    const scaleFactor = Math.min(window.innerWidth, window.innerHeight) / 35;

    // Heart Shape Mathematical Formula (Parametric)
    for (let i = 0; i < pointsCount; i++) {
        const t = (i / pointsCount) * 2 * Math.PI;
        // Standard parametric equation for a heart
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        
        points.push({ 
            x: x * scaleFactor, 
            y: y * scaleFactor 
        });
    }

    // Multiply the photos so we have enough pieces
    let allPieces = [];
    while(allPieces.length < pointsCount) {
        allPieces = allPieces.concat(config.photos);
    }
    allPieces = allPieces.slice(0, pointsCount);

    allPieces.forEach((src, i) => {
        const piece = document.createElement('img');
        piece.src = src;
        piece.className = 'mosaic-piece';
        
        // Start from completely random positions off-screen or far away
        const startX = (Math.random() - 0.5) * window.innerWidth * 2;
        const startY = (Math.random() - 0.5) * window.innerHeight * 2;

        gsap.set(piece, {
            x: startX,
            y: startY,
            rotation: Math.random() * 720 - 360,
            scale: Math.random() * 0.5 + 0.1,
            opacity: 0
        });
        
        container.appendChild(piece);

        // Animate to perfectly form the heart
        gsap.to(piece, {
            duration: 2.5 + Math.random(), // Staggered arrival
            delay: 0.5 + (i * 0.05), // Domino effect
            x: points[i].x,
            y: points[i].y,
            rotation: 0,
            scale: 1,
            opacity: 1,
            ease: "expo.out"
        });
    });
}

// Handle resizing (mostly for Matrix canvas)
window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});


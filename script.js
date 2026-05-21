/* ==========================================================================
   ROMANTIC WEBSITE INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize components
    initAnniversaryCounter();
    initParticleCanvas();
    initScrollObserver();
    initEnvelope();
    initInteractiveHug();
    initLofiPlayer();
    initDriftingEasterEggs();
    initScrollSparkles();
    
    // Handle Window Resize for responsive features
    window.addEventListener('resize', () => {
        adjustEnvelopeSize();
    });
});

/* ==========================================================================
   1. LIVE ANNIVERSARY COUNTER
   ========================================================================== */
function initAnniversaryCounter() {
    // Start date matching approximately 3000 days ago on May 21, 2026.
    // March 4, 2018 is exactly 3000 days prior to May 21, 2026!
    const anniversaryDate = new Date('2018-03-04T00:00:00');
    
    const dVal = document.getElementById('count-days');
    const hVal = document.getElementById('count-hours');
    const mVal = document.getElementById('count-minutes');
    const sVal = document.getElementById('count-seconds');
    
    if (!dVal || !hVal || !mVal || !sVal) return;

    function updateCounter() {
        const now = new Date();
        const difference = now.getTime() - anniversaryDate.getTime();
        
        if (difference < 0) {
            // Fallback if system clock is set before 2018
            dVal.textContent = '3000';
            hVal.textContent = '00';
            mVal.textContent = '00';
            sVal.textContent = '00';
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        // Pad with leading zeros
        dVal.textContent = days.toString().padStart(4, '0');
        hVal.textContent = hours.toString().padStart(2, '0');
        mVal.textContent = minutes.toString().padStart(2, '0');
        sVal.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Run immediately and then every second
    updateCounter();
    setInterval(updateCounter, 1000);
}

/* ==========================================================================
   2. STARRY & HEART PARTICLE CANVAS
   ========================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 100 };
    
    // Set Canvas Size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Track Mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Particle Class
    class Particle {
        constructor() {
            this.reset(true);
        }
        
        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            // Spawn at the bottom if not initial load, otherwise random height
            this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
            this.size = Math.random() * 6 + 4; // size diameter
            this.speedY = Math.random() * 0.4 + 0.2; // slow rising speed
            this.speedX = Math.random() * 0.3 - 0.15; // gentle side swaying
            this.alpha = Math.random() * 0.5 + 0.15; // initial opacity
            this.fadeSpeed = Math.random() * 0.002 + 0.0005;
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = Math.random() * 0.02 - 0.01;
            
            // 70% Stars, 30% Hearts
            this.type = Math.random() > 0.7 ? 'heart' : 'star';
            
            // Soft pastels
            if (this.type === 'heart') {
                this.color = `rgba(255, 179, 176, ${this.alpha})`; // Blush Pink
            } else {
                // Alternating soft gold and cream white stars
                this.color = Math.random() > 0.5 
                    ? `rgba(253, 245, 230, ${this.alpha})` // Cream
                    : `rgba(255, 223, 137, ${this.alpha})`; // Soft Gold
            }
        }
        
        update() {
            this.y -= this.speedY;
            this.x += this.speedX + Math.sin(this.angle) * 0.15;
            this.angle += this.angleSpeed;
            
            // Fade out as it rises near the top
            if (this.y < canvas.height * 0.2) {
                this.alpha -= 0.005;
            }
            
            // Repel from mouse cursor gently
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    // Push away
                    this.x += (dx / distance) * force * 1.5;
                    this.y += (dy / distance) * force * 1.5;
                }
            }
            
            // Reset if out of bounds or invisible
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10 || this.alpha <= 0) {
                this.reset(false);
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            
            if (this.type === 'heart') {
                // Draw delicate heart shape
                ctx.fillStyle = this.color;
                ctx.beginPath();
                const d = this.size * 0.9;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle * 0.1); // subtle rotation
                ctx.moveTo(0, -d / 4);
                ctx.bezierCurveTo(d / 2, -d, d, -d / 3, 0, d);
                ctx.bezierCurveTo(-d, -d / 3, -d / 2, -d, 0, -d / 4);
                ctx.closePath();
                ctx.fill();
            } else {
                // Draw 4-point glowing star
                ctx.fillStyle = this.color;
                ctx.beginPath();
                const cx = this.x;
                const cy = this.y;
                const spikes = 4;
                const outerRadius = this.size * 0.6;
                const innerRadius = this.size * 0.2;
                
                let rot = Math.PI / 2 * 3;
                let x = cx;
                let y = cy;
                const step = Math.PI / spikes;

                ctx.moveTo(cx, cy - outerRadius);
                for (let i = 0; i < spikes; i++) {
                    x = cx + Math.cos(rot) * outerRadius;
                    y = cy + Math.sin(rot) * outerRadius;
                    ctx.lineTo(x, y);
                    rot += step;

                    x = cx + Math.cos(rot) * innerRadius;
                    y = cy + Math.sin(rot) * innerRadius;
                    ctx.lineTo(x, y);
                    rot += step;
                }
                ctx.lineTo(cx, cy - outerRadius);
                ctx.closePath();
                ctx.fill();
            }
            
            ctx.restore();
        }
    }
    
    // Spawn initial particles
    const maxParticles = Math.min(65, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
    
    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   3. SCROLL REVEAL & THEME TOGGLE OBSERVER
   ========================================================================== */
function initScrollObserver() {
    const revealElements = document.querySelectorAll('.reveal-effect');
    
    const observerOptions = {
        root: null, // Viewport
        threshold: 0.12, // Trigger when 12% is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits screen bottom
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's the letter section, check if it's already open to start typing
                if (entry.target.id === 'letter-section') {
                    // We don't autostart typing unless envelope is clicked.
                }
                
                observer.unobserve(entry.target); // Stop observing once triggered
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Listen for scroll height to change header theme (light vs deep night gradient stops)
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollPosition / totalHeight;
        
        // At 55% scroll depth, page transitions into the deeper purple/night gradient
        if (scrollPercent > 0.52) {
            document.body.classList.add('scrolled-night');
            document.body.classList.remove('scrolled-light');
        } else {
            document.body.classList.add('scrolled-light');
            document.body.classList.remove('scrolled-night');
        }
    });
}

/* ==========================================================================
   4. 3D LOVE LETTER ENVELOPE & TYPEWRITER EFFECT
   ========================================================================== */
function initEnvelope() {
    const envelope = document.getElementById('envelope');
    const openBtn = document.getElementById('open-letter-btn');
    const letterTextEl = document.getElementById('typewriter-letter');
    
    if (!envelope || !openBtn || !letterTextEl) return;
    
    // Calculate sizing immediately
    adjustEnvelopeSize();
    
    const letterContent = `My Dearest,

No matter the miles between us, my heart is always right where you are. Distance is just a test of how far love can travel, and ours has crossed every horizon.

I miss the sound of your laugh, the peace I feel when we talk, and the simple comfort of holding your hand. Every memory we share is a treasure, and every dream I have is about our future together.

You feel like peace, my joy, and my very favorite thought. Thank you for being you, and for loving me. I love you endlessly, today, tomorrow, and for all the days that follow.

No matter where you are, you’ll always be my favorite place. ❤️`;

    let typingStarted = false;

    // Open envelope click handlers
    function openLetter() {
        if (envelope.classList.contains('open')) return;
        
        envelope.classList.add('open');
        openBtn.classList.add('hidden');
        
        // Wait for envelope sliding animation to finish (approx 800ms) before typing
        setTimeout(() => {
            if (!typingStarted) {
                startTypewriter(letterTextEl, letterContent);
                typingStarted = true;
            }
        }, 900);
    }
    
    openBtn.addEventListener('click', openLetter);
    envelope.addEventListener('click', openLetter);
}

// Adjust envelope folds size to be perfectly geometric on fluid mobile layout
function adjustEnvelopeSize() {
    const envelope = document.getElementById('envelope');
    if (!envelope) return;
    
    const width = envelope.clientWidth;
    const halfWidth = width / 2;
    const height = envelope.clientHeight;
    // Flap heights match fold proportions
    const flapHeight = height * 0.52;
    
    // Create/update a dynamic stylesheet injected in head
    let styleBlock = document.getElementById('envelope-dynamic-styles');
    if (!styleBlock) {
        styleBlock = document.createElement('style');
        styleBlock.id = 'envelope-dynamic-styles';
        document.head.appendChild(styleBlock);
    }
    
    styleBlock.innerHTML = `
        .envelope-flap {
            border-left-width: ${halfWidth}px !important;
            border-right-width: ${halfWidth}px !important;
            border-top-width: ${flapHeight}px !important;
        }
        .envelope::before {
            border-left-width: ${halfWidth}px !important;
            border-right-width: ${halfWidth}px !important;
            border-bottom-width: ${flapHeight}px !important;
        }
        .envelope::after {
            border-right-width: ${halfWidth}px !important;
            border-left-width: ${halfWidth}px !important;
            border-bottom-width: ${flapHeight}px !important;
        }
    `;
}

// Typewriter script with natural writing cadence (pauses at punctuation)
function startTypewriter(element, text) {
    element.innerHTML = '';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            const char = text.charAt(index);
            element.innerHTML += char;
            index++;
            
            // Autoscroll letter paper as typing progresses
            const paper = element.parentElement;
            paper.scrollTop = paper.scrollHeight;
            
            // Cadence delays: brief pause for commas/periods
            let delay = 35; // base typing speed in ms
            if (char === '.' || char === '!' || char === '?') {
                delay = 550; // pause at end of sentence
            } else if (char === ',') {
                delay = 250; // pause at commas
            } else if (char === '\n') {
                delay = 400; // pause at line break
            }
            
            setTimeout(type, delay);
        }
    }
    
    type();
}

/* ==========================================================================
   5. CUTE INTERACTIVE BUTTON (EXPLODING HEARTS)
   ========================================================================== */
function initInteractiveHug() {
    const hugBtn = document.getElementById('hug-btn');
    const hugResponse = document.getElementById('hug-response-msg');
    
    if (!hugBtn || !hugResponse) return;
    
    hugBtn.addEventListener('click', (e) => {
        // 1. Shaking vibration feedback
        hugBtn.classList.add('vibrate');
        setTimeout(() => {
            hugBtn.classList.remove('vibrate');
        }, 500);
        
        // 2. Reveal Hug Card Prompt
        hugResponse.classList.add('visible');
        
        // 3. Trigger explosive floating hearts
        createHeartShower(e);
        
        // Dynamic scroll adjustment to show response on small screen
        setTimeout(() => {
            hugResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
    });
}

function createHeartShower(event) {
    const heartCount = 35;
    const colors = ['❤️', '💖', '💝', '💕', '🌸', '✨'];
    
    // Click coordinates
    const startX = event.clientX;
    const startY = event.clientY;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('span');
        heart.className = 'exploding-heart';
        
        // Pick random heart emoji
        heart.textContent = colors[Math.floor(Math.random() * colors.length)];
        
        // Set coordinates
        heart.style.left = `${startX}px`;
        heart.style.top = `${startY}px`;
        
        // Random flight directions (angle and distance)
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 160 + 60; // distance of spread
        
        const tx = Math.cos(angle) * radius;
        const ty = Math.sin(angle) * radius - Math.random() * 50; // drift upward slightly
        
        // Custom animation variables passed to keyframes
        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);
        heart.style.setProperty('--scale', `${Math.random() * 1.2 + 0.6}`);
        heart.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
        
        // Random duration to stagger fade outs
        heart.style.animationDuration = `${Math.random() * 0.8 + 0.8}s`;
        
        document.body.appendChild(heart);
        
        // Garbage collect element
        setTimeout(() => {
            heart.remove();
        }, 1600);
    }
}

/* ==========================================================================
   6. LOFI MUSIC PLAYER CONTROLS
   ========================================================================== */
function initLofiPlayer() {
    const audio = document.getElementById('bg-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const vinyl = document.getElementById('vinyl-disc');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationTimeDisplay = document.getElementById('duration-time');
    const volumeSlider = document.getElementById('volume-slider');
    
    const miniTrigger = document.getElementById('mini-player-trigger');
    
    if (!audio || !playPauseBtn || !vinyl) return;
    
    // Play/Pause Action
    function togglePlay() {
        if (audio.paused) {
            audio.play()
                .then(() => {
                    playIcon.classList.add('hidden');
                    pauseIcon.classList.remove('hidden');
                    vinyl.classList.add('playing');
                    miniTrigger.classList.add('playing');
                })
                .catch(err => {
                    console.log("Audio play blocked by browser. Requires direct user tap.", err);
                });
        } else {
            audio.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            vinyl.classList.remove('playing');
            miniTrigger.classList.remove('playing');
        }
    }
    
    playPauseBtn.addEventListener('click', togglePlay);
    
    // Sync header mini indicator clicks to trigger music controls
    miniTrigger.addEventListener('click', (e) => {
        // Prevent scroll to music section if we just want to play/pause from header,
        // or keep scroll behavior and just play. Let's do both: play & scroll
        if (audio.paused) {
            togglePlay();
        }
    });
    
    // Time & Progress Updates
    audio.addEventListener('timeupdate', () => {
        const current = audio.currentTime;
        const duration = audio.duration || 150; // fallback duration if not loaded
        
        const pct = (current / duration) * 100;
        progressBar.style.width = `${pct}%`;
        
        currentTimeDisplay.textContent = formatTime(current);
        durationTimeDisplay.textContent = formatTime(duration);
    });
    
    audio.addEventListener('loadedmetadata', () => {
        durationTimeDisplay.textContent = formatTime(audio.duration);
    });
    
    // Click progress bar to seek
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration || 150;
        
        audio.currentTime = (clickX / width) * duration;
    });
    
    // Volume Control
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
    });
    
    // Format Seconds to M:SS
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }
}

/* ==========================================================================
   7. EASTER EGGS - RANDOM DRIFTING MESSAGES
   ========================================================================== */
function initDriftingEasterEggs() {
    const messages = [
        "I miss you... ❤️",
        "Thinking of you... ✨",
        "Wish you were here 🫂",
        "You are my favorite person 🌸",
        "Sending a big hug... 💫",
        "I love you endlessly...",
        "My heart belongs to you 💖",
        "Counting down the hours 🌙"
    ];
    
    function spawnDriftingText() {
        // Prevent massive queues if page sits idle
        const existing = document.querySelectorAll('.drifting-text');
        if (existing.length >= 3) return;
        
        const text = document.createElement('div');
        text.className = 'drifting-text';
        text.textContent = messages[Math.floor(Math.random() * messages.length)];
        
        // Random horizontal position (keep 10% safety margin away from edges)
        const leftPercent = Math.random() * 70 + 15;
        text.style.left = `${leftPercent}%`;
        
        // Randomize sway amount and animation speed
        const driftX = Math.random() * 100 - 50; // sway -50px to 50px
        text.style.setProperty('--drift-x', `${driftX}px`);
        
        const duration = Math.random() * 4 + 7; // 7s to 11s duration
        text.style.animationDuration = `${duration}s`;
        
        document.body.appendChild(text);
        
        // Garbage collect
        setTimeout(() => {
            text.remove();
        }, duration * 1000 + 200);
    }
    
    // Trigger first text drift after 8 seconds, then periodically
    setTimeout(() => {
        spawnDriftingText();
        setInterval(spawnDriftingText, 14000); // Spawn every 14 seconds
    }, 6000);
}

/* ==========================================================================
   8. SCROLL SPARKLES IN THINGS I MISS
   ========================================================================== */
function initScrollSparkles() {
    let lastScrollTime = 0;
    
    window.addEventListener('scroll', () => {
        const missSection = document.getElementById('miss-section');
        if (!missSection) return;
        
        const rect = missSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
            const now = Date.now();
            // Throttle sparkle creation (at most one every 150ms) to preserve performance
            if (now - lastScrollTime > 150) {
                spawnScrollSparkle(missSection);
                lastScrollTime = now;
            }
        }
    });

    function spawnScrollSparkle(container) {
        const sparkle = document.createElement('span');
        sparkle.className = 'scroll-sparkle';
        sparkle.textContent = Math.random() > 0.5 ? '✨' : '✦';
        
        const width = container.clientWidth;
        
        // Place near the vertical line (timeline center) +/- 140px
        const x = (width / 2) + (Math.random() * 280 - 140);
        
        // Calculate relative Y within the container based on visible scroll window
        const rect = container.getBoundingClientRect();
        const topOffset = Math.max(0, -rect.top);
        const bottomOffset = Math.min(rect.height, window.innerHeight - rect.top);
        
        // Place sparkle somewhere in the currently visible portion of the section
        const y = topOffset + Math.random() * (bottomOffset - topOffset);
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        container.appendChild(sparkle);
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            sparkle.remove();
        }, 900);
    }
}

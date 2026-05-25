/* ==========================================================================
   ROMANTIC WEBSITE INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Lock scroll initially for welcome screen
    document.body.style.overflow = 'hidden';

    // Initialize new personalized components
    initWelcomeScreen();
    initMiniPlayer();
    initMeaningCards();
    initRelationshipTimeline();
    initBirthdaySurprise();
    initEndingSection();
    initCursorSparkles();

    // Initialize existing components
    initAnniversaryCounter();
    initParticleCanvas();
    initScrollObserver();
    initEnvelope();
    initInteractiveHug();
    initDriftingEasterEggs();
    initScrollSparkles();
    initConfetti();
    initLightbox();

    // Handle Window Resize for responsive features
    window.addEventListener('resize', () => {
        adjustEnvelopeSize();
    });
});

/* ==========================================================================
   1. LIVE ANNIVERSARY COUNTER
   ========================================================================== */
function initAnniversaryCounter() {
    // Counter now displays ∞ (infinity) symbols statically in the HTML.
    // No dynamic counting needed — love is infinite! ❤️
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
        threshold: 0.01, // Trigger when 1% is visible (ensures tall stacked containers on mobile trigger reveal)
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
            if (char === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += char;
            }
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
   6. DYNAMIC WEB AUDIO API SYNTHESIZER & MINI PLAYER CONTROLS
   ========================================================================== */
let audioCtx = null;
let synthVolumeNode = null;
let delayNode = null;
let delayFeedback = null;
let isSynthPlaying = false;
let currentNoteTimeout = null;
let currentMelodyIndex = 0;
let elapsedBeats = 0;
const tempo = 90; // Slower, softer tempo (90 BPM) for a more dreamy, romantic waltz feel
const beatDuration = 60 / tempo; // 0.66s per beat

const NOTE_FREQS = {
    "C3": 130.81, "D3": 146.83, "E3": 164.81, "F3": 174.61, "G3": 196.00, "A3": 220.00, "Bb3": 233.08, "B3": 246.94,
    "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00, "A4": 440.00, "Bb4": 466.16, "B4": 493.88,
    "C5": 523.25, "D5": 587.33, "E5": 659.25, "F5": 698.46, "G5": 783.99, "A5": 880.00
};

const happyBirthdayNotes = [
    // Phrase 1: Happy Birthday to You
    { note: "C4", duration: 0.75, chord: ["C3", "E3", "G3"] },
    { note: "C4", duration: 0.25 },
    { note: "D4", duration: 1.0 },
    { note: "C4", duration: 1.0 },
    { note: "F4", duration: 1.0, chord: ["F3", "A3", "C4"] },
    { note: "E4", duration: 2.0 },
    { note: "REST", duration: 0.5 },

    // Phrase 2: Happy Birthday to You
    { note: "C4", duration: 0.75, chord: ["C3", "E3", "G3"] },
    { note: "C4", duration: 0.25 },
    { note: "D4", duration: 1.0 },
    { note: "C4", duration: 1.0 },
    { note: "G4", duration: 1.0, chord: ["G3", "B3", "D4"] },
    { note: "F4", duration: 2.0 },
    { note: "REST", duration: 0.5 },

    // Phrase 3: Happy Birthday Dear Aayushi
    { note: "C4", duration: 0.75, chord: ["C3", "E3", "G3"] },
    { note: "C4", duration: 0.25 },
    { note: "C5", duration: 1.0 },
    { note: "A4", duration: 1.0, chord: ["F3", "A3", "C4"] },
    { note: "F4", duration: 1.0 },
    { note: "E4", duration: 1.0 },
    { note: "D4", duration: 2.0, chord: ["G3", "B3", "D4"] },
    { note: "REST", duration: 0.5 },

    // Phrase 4: Happy Birthday to You
    { note: "Bb4", duration: 0.75, chord: ["Bb3", "D4", "F4"] },
    { note: "Bb4", duration: 0.25 },
    { note: "A4", duration: 1.0 },
    { note: "F4", duration: 1.0, chord: ["F3", "A3", "C4"] },
    { note: "G4", duration: 1.0, chord: ["G3", "B3", "D4"] },
    { note: "F4", duration: 2.0, chord: ["C3", "E3", "G3"] },
    { note: "REST", duration: 2.0 }
];

const totalBeats = happyBirthdayNotes.reduce((sum, n) => sum + n.duration, 0);

function playPadChord(chordNotes, duration) {
    if (!audioCtx || audioCtx.state === 'suspended' || !chordNotes) return;
    
    const now = audioCtx.currentTime;
    
    chordNotes.forEach(noteName => {
        const freq = NOTE_FREQS[noteName];
        if (!freq) return;
        
        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'triangle'; // Warm, soft waveform
        osc.frequency.setValueAtTime(freq, now);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now); // Low pass filter for warm analog feel
        
        // Very soft backing envelope with a slow attack swell
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.015, now + 0.8);
        gainNode.gain.setValueAtTime(0.015, now + duration - 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(synthVolumeNode);
        
        osc.start(now);
        osc.stop(now + duration);
    });
}

function initSynth() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioCtx = new AudioContextClass();
    
    synthVolumeNode = audioCtx.createGain();
    const volumeSlider = document.getElementById('mini-volume');
    const startVolume = volumeSlider ? parseInt(volumeSlider.value) / 100 : 0.7;
    synthVolumeNode.gain.setValueAtTime(startVolume, audioCtx.currentTime);
    synthVolumeNode.connect(audioCtx.destination);
    
    // Create feedback delay effect for dreamy cathedral music box echo
    delayNode = audioCtx.createDelay(1.5);
    delayNode.delayTime.setValueAtTime(0.35, audioCtx.currentTime); // 350ms delay
    
    delayFeedback = audioCtx.createGain();
    delayFeedback.gain.setValueAtTime(0.35, audioCtx.currentTime); // 35% feedback loop
    
    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    delayNode.connect(synthVolumeNode);
    
    // Inject custom CSS styling for dynamic floating note icons
    const style = document.createElement('style');
    style.textContent = `
        .dynamic-float-note {
            font-size: 16px;
            filter: drop-shadow(0 2px 4px rgba(255, 117, 151, 0.45));
            color: #ff7597;
            user-select: none;
        }
    `;
    document.head.appendChild(style);
}

function playMusicBoxNote(frequency, duration) {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    
    const now = audioCtx.currentTime;
    
    // 1. Fundamental
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, now);
    
    // 2. High Octave Overtones for metal comb chime resonance
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, now);
    
    const osc3 = audioCtx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(frequency * 3, now);
    
    // Gain Envelopes
    const gain1 = audioCtx.createGain();
    const gain2 = audioCtx.createGain();
    const gain3 = audioCtx.createGain();
    const voiceMix = audioCtx.createGain();
    
    // Fundamental pluck & decay
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.005);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.5);
    
    // Octave overtone
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.1, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);
    
    // 3rd harmonic
    gain3.gain.setValueAtTime(0, now);
    gain3.gain.linearRampToValueAtTime(0.04, now + 0.015);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.5);
    
    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);
    
    gain1.connect(voiceMix);
    gain2.connect(voiceMix);
    gain3.connect(voiceMix);
    
    // Split output to direct destination and the echo unit
    voiceMix.connect(delayNode);
    voiceMix.connect(synthVolumeNode);
    
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    
    osc1.stop(now + duration * 1.8);
    osc2.stop(now + duration * 1.8);
    osc3.stop(now + duration * 1.8);
}

function spawnFloatingNoteUI() {
    const miniPlayer = document.getElementById('mini-music-player');
    if (!miniPlayer || miniPlayer.classList.contains('hidden-player')) return;
    
    const floatingElement = document.createElement('span');
    floatingElement.className = 'dynamic-float-note';
    floatingElement.textContent = Math.random() > 0.55 ? '🎵' : '❤️';
    
    const vinylWrapper = document.getElementById('mini-vinyl-wrapper');
    if (vinylWrapper) {
        const rect = vinylWrapper.getBoundingClientRect();
        const x = rect.left + rect.width / 2 + (Math.random() * 20 - 10);
        const y = rect.top + rect.height / 2 + (Math.random() * 20 - 10);
        
        floatingElement.style.left = `${x}px`;
        floatingElement.style.top = `${y}px`;
        floatingElement.style.position = 'fixed';
        floatingElement.style.zIndex = '999999';
        floatingElement.style.pointerEvents = 'none';
        
        floatingElement.style.transition = 'all 1.6s cubic-bezier(0.215, 0.610, 0.355, 1)';
        document.body.appendChild(floatingElement);
        
        requestAnimationFrame(() => {
            floatingElement.style.transform = `translate(${(Math.random() * 60 - 30)}px, -130px) scale(${Math.random() * 0.4 + 0.8})`;
            floatingElement.style.opacity = '0';
        });
        
        setTimeout(() => {
            floatingElement.remove();
        }, 1600);
    }
}

function updateProgressBar(percent) {
    const progressBar = document.getElementById('progress-bar');
    const progressDot = document.querySelector('.progress-dot');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressDot) progressDot.style.left = `${percent}%`;
    
    if (currentTimeEl && durationTimeEl) {
        const totalDuration = totalBeats * beatDuration;
        const currentSeconds = elapsedBeats * beatDuration;
        
        const formatTime = (secs) => {
            const m = Math.floor(secs / 60);
            const s = Math.floor(secs % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        };
        
        currentTimeEl.textContent = formatTime(currentSeconds);
        durationTimeEl.textContent = formatTime(totalDuration);
    }
}

function playMelodyLoop() {
    if (!isSynthPlaying) return;
    
    const currentNote = happyBirthdayNotes[currentMelodyIndex];
    
    if (currentNote.note !== "REST") {
        const freq = NOTE_FREQS[currentNote.note];
        if (freq) {
            playMusicBoxNote(freq, currentNote.duration * beatDuration);
            spawnFloatingNoteUI();
        }
    }
    
    if (currentNote.chord) {
        // Play soft chord accompaniment floating warm background
        playPadChord(currentNote.chord, 2.5 * beatDuration);
    }
    
    const progressPercent = (elapsedBeats / totalBeats) * 100;
    updateProgressBar(progressPercent);
    
    elapsedBeats += currentNote.duration;
    if (elapsedBeats >= totalBeats) {
        elapsedBeats = 0;
    }
    
    const noteTime = currentNote.duration * beatDuration * 1000;
    currentMelodyIndex = (currentMelodyIndex + 1) % happyBirthdayNotes.length;
    currentNoteTimeout = setTimeout(playMelodyLoop, noteTime);
}

function startSynthMelody() {
    initSynth();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (isSynthPlaying) return;
    isSynthPlaying = true;
    playMelodyLoop();
}

function stopSynthMelody() {
    isSynthPlaying = false;
    if (currentNoteTimeout) {
        clearTimeout(currentNoteTimeout);
        currentNoteTimeout = null;
    }
}

function toggleMusic(forcePlay = null) {
    const shouldPlay = (forcePlay !== null) ? forcePlay : !isSynthPlaying;
    
    if (shouldPlay) {
        startSynthMelody();
        if (window.updateMiniPlayerUI) window.updateMiniPlayerUI(true);
    } else {
        stopSynthMelody();
        if (window.updateMiniPlayerUI) window.updateMiniPlayerUI(false);
    }
}

function initMiniPlayer() {
    const miniPlayer    = document.getElementById('mini-music-player');
    const playBtn       = document.getElementById('mini-play-btn');
    const playIcon      = document.getElementById('mini-play-icon');
    const pauseIcon     = document.getElementById('mini-pause-icon');
    const vinyl         = document.getElementById('mini-vinyl');
    const miniVolumeSlider  = document.getElementById('mini-volume');
    const mainVolumeSlider  = document.getElementById('volume-slider');
    const mainPlayBtn       = document.getElementById('play-pause-btn');
    const trackNameEl       = document.getElementById('mini-track-name');
    const mainTrackNameEl   = document.getElementById('track-name');
    const mainTrackArtistEl = document.querySelector('.track-details .track-artist');
    const miniTrackArtistEl = document.querySelector('.mini-track-details .mini-track-artist');

    if (!miniPlayer || !playBtn || !vinyl) return;

    // Change labels to Happy Birthday
    if (trackNameEl) trackNameEl.textContent = 'Happy Birthday';
    if (mainTrackNameEl) mainTrackNameEl.textContent = 'Happy Birthday';
    if (mainTrackArtistEl) mainTrackArtistEl.textContent = 'Instrumental';
    if (miniTrackArtistEl) miniTrackArtistEl.textContent = 'Instrumental';

    function updateUI(playing) {
        // Mini player controls
        if (playIcon) {
            if (playing) playIcon.classList.add('hidden');
            else playIcon.classList.remove('hidden');
        }
        if (pauseIcon) {
            if (playing) pauseIcon.classList.remove('hidden');
            else pauseIcon.classList.add('hidden');
        }
        if (vinyl) {
            if (playing) vinyl.classList.add('playing');
            else vinyl.classList.remove('playing');
        }

        // Main player controls
        const mainPlayIcon = document.getElementById('play-icon');
        const mainPauseIcon = document.getElementById('pause-icon');
        const mainVinyl = document.getElementById('vinyl-disc');
        
        if (mainPlayIcon) {
            if (playing) mainPlayIcon.classList.add('hidden');
            else mainPlayIcon.classList.remove('hidden');
        }
        if (mainPauseIcon) {
            if (playing) mainPauseIcon.classList.remove('hidden');
            else mainPauseIcon.classList.add('hidden');
        }
        if (mainVinyl) {
            if (playing) mainVinyl.classList.add('playing');
            else mainVinyl.classList.remove('playing');
        }
    }

    function syncVolume(value) {
        const vol = parseInt(value) / 100;
        if (!audioCtx) initSynth();
        if (synthVolumeNode) {
            synthVolumeNode.gain.setValueAtTime(vol, audioCtx.currentTime);
        }
        
        if (mainVolumeSlider) mainVolumeSlider.value = value;
        if (miniVolumeSlider) miniVolumeSlider.value = value;
    }

    // Attach controls
    playBtn.addEventListener('click', () => toggleMusic());
    if (mainPlayBtn) {
        mainPlayBtn.addEventListener('click', () => toggleMusic());
    }

    if (miniVolumeSlider) {
        miniVolumeSlider.addEventListener('input', (e) => syncVolume(e.target.value));
    }
    if (mainVolumeSlider) {
        mainVolumeSlider.addEventListener('input', (e) => syncVolume(e.target.value));
    }

    window.toggleMusic = toggleMusic;
    window.updateMiniPlayerUI = updateUI;
}

/* ==========================================================================
   7. EASTER EGGS - RANDOM DRIFTING MESSAGES (WHISPERS)
   ========================================================================== */
function initDriftingEasterEggs() {
    const messages = [
        "pretty girl ❤️",
        "my safe place 🫂",
        "I miss you... ✨",
        "so lucky to have you 💖",
        "happy birthday love 🌸",
        "my favorite thought 💫",
        "loving you endlessly 🌙",
        "thank you for existing ❤️"
    ];
    
    function spawnDriftingText() {
        const existing = document.querySelectorAll('.drifting-text');
        if (existing.length >= 4) return;
        
        const text = document.createElement('div');
        text.className = 'drifting-text';
        text.textContent = messages[Math.floor(Math.random() * messages.length)];
        
        const leftPercent = Math.random() * 70 + 15;
        text.style.left = `${leftPercent}%`;
        
        const driftX = Math.random() * 120 - 60;
        text.style.setProperty('--drift-x', `${driftX}px`);
        
        const duration = Math.random() * 5 + 9; // Slower, softer drift (9s to 14s)
        text.style.animationDuration = `${duration}s`;
        
        document.body.appendChild(text);
        
        setTimeout(() => {
            text.remove();
        }, duration * 1000 + 200);
    }
    
    setTimeout(() => {
        spawnDriftingText();
        setInterval(spawnDriftingText, 10000); // Spawn every 10 seconds
    }, 5000);
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

/* ==========================================================================
   CONFETTI BURST — Birthday celebration on page load
   ========================================================================== */
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const colors = ['#ff6ec7','#c77dff','#ffb347','#ff9fd2','#ffe066','#a8edea','#ffd6ec'];
    const TOTAL   = 120;
    let pieces    = [];
    let running   = true;

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function createPiece() {
        return {
            x:   randomBetween(0, canvas.width),
            y:   randomBetween(-20, -canvas.height * 0.3),
            r:   randomBetween(5, 10),
            d:   randomBetween(2, 5),
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: randomBetween(-10, 10),
            tiltAngle: 0,
            tiltSpeed: randomBetween(0.04, 0.12),
            opacity: 1,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        };
    }

    for (let i = 0; i < TOTAL; i++) {
        pieces.push(createPiece());
    }

    let frame = 0;
    function draw() {
        if (!running) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;

        pieces.forEach(p => {
            p.tiltAngle += p.tiltSpeed;
            p.y  += p.d;
            p.tilt = Math.sin(p.tiltAngle) * 14;

            // Fade out near bottom
            if (p.y > canvas.height * 0.85) {
                p.opacity = Math.max(0, p.opacity - 0.015);
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle   = p.color;
            ctx.translate(p.x + p.r, p.y + p.r);
            ctx.rotate((Math.PI / 180) * p.tilt);

            if (p.shape === 'rect') {
                ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // Reset piece when off-screen or fully faded
            if (p.y > canvas.height || p.opacity <= 0) {
                if (frame < 300) {
                    Object.assign(p, createPiece());
                } else {
                    p.opacity = 0; // leave it dead
                }
            }
        });

        // Stop after ~10 seconds
        if (frame > 500) {
            running = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        requestAnimationFrame(draw);
    }

    // Delay slightly so page renders first
    setTimeout(() => draw(), 300);
}

/* ==========================================================================
   PHOTO LIGHTBOX / FULL-SCREEN VIEW (WITH TRANSITIONS)
   ========================================================================== */
function initLightbox() {
    const lightbox = document.getElementById('photo-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (!lightbox) return;
    
    // Inject inline transitions for smooth cross-fading
    lightboxImg.style.transition = 'opacity 0.25s ease';
    lightboxCaption.style.transition = 'opacity 0.25s ease';
    
    const cells = Array.from(document.querySelectorAll('.collage-cell'));
    let currentIndex = 0;
    
    function showImage(index) {
        if (index < 0 || index >= cells.length) return;
        currentIndex = index;
        const cell = cells[index];
        const img = cell.querySelector('img');
        const caption = cell.querySelector('.collage-caption');
        
        if (lightbox.classList.contains('active')) {
            // Smooth transition for changing images
            lightboxImg.style.opacity = '0';
            lightboxCaption.style.opacity = '0';
            
            setTimeout(() => {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = caption.textContent;
                lightboxImg.style.opacity = '1';
                lightboxCaption.style.opacity = '1';
            }, 250);
        } else {
            lightboxImg.src = img.src;
            lightboxCaption.textContent = caption.textContent;
            lightboxImg.style.opacity = '1';
            lightboxCaption.style.opacity = '1';
            lightbox.classList.add('active');
        }
        
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        // Retain scroll lock if welcome overlay is still active
        const welcome = document.getElementById('welcome-overlay');
        if (!welcome || welcome.classList.contains('fade-out')) {
            document.body.style.overflow = '';
        }
    }
    
    cells.forEach((cell, idx) => {
        cell.addEventListener('click', () => {
            showImage(idx);
        });
    });
    
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let prevIdx = currentIndex - 1;
        if (prevIdx < 0) prevIdx = cells.length - 1;
        showImage(prevIdx);
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let nextIdx = currentIndex + 1;
        if (nextIdx >= cells.length) nextIdx = 0;
        showImage(nextIdx);
    });
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            let prevIdx = currentIndex - 1;
            if (prevIdx < 0) prevIdx = cells.length - 1;
            showImage(prevIdx);
        }
        if (e.key === 'ArrowRight') {
            let nextIdx = currentIndex + 1;
            if (nextIdx >= cells.length) nextIdx = 0;
            showImage(nextIdx);
        }
    });
}

/* ==========================================================================
   NEW EXCLUSIVE COMPONENTS & INTERACTION SCRIPTS
   ========================================================================== */

// 1. Welcome Screen
function initWelcomeScreen() {
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const welcomeLoader = document.getElementById('welcome-loader');
    const welcomeReveal = document.getElementById('welcome-reveal');
    const enterBtn = document.getElementById('enter-btn');
    const soundCheckbox = document.getElementById('welcome-sound-checkbox');
    const miniPlayer = document.getElementById('mini-music-player');
    
    if (!welcomeOverlay || !welcomeLoader || !welcomeReveal || !enterBtn) return;
    
    // Initially hide mini player during welcome
    if (miniPlayer) miniPlayer.classList.add('hidden-player');
    
    setTimeout(() => {
        welcomeLoader.style.opacity = '0';
        setTimeout(() => {
            welcomeLoader.classList.add('hidden');
            welcomeReveal.classList.remove('hidden');
        }, 500);
    }, 2500);
    
    enterBtn.addEventListener('click', () => {
        // Start melody if sound enabled
        if (soundCheckbox.checked) {
            toggleMusic(true);
        }
        
        // Fade out welcome screen
        welcomeOverlay.classList.add('fade-out');
        
        // Reveal mini player
        if (miniPlayer) {
            setTimeout(() => {
                miniPlayer.classList.remove('hidden-player');
            }, 800);
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Celebrate!
        initConfetti();
    });
}

// 2. What You Mean To Me glow cards mouse tracker
function initMeaningCards() {
    const cards = document.querySelectorAll('.meaning-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

// 3. Cute Relationship Timeline Star Follower
function initRelationshipTimeline() {
    const section = document.getElementById('timeline-section');
    const path = document.getElementById('timeline-star-path');
    const pathActive = document.getElementById('timeline-star-path-active');
    const follower = document.getElementById('timeline-star-follower');
    
    if (!section || !path || !pathActive || !follower) return;
    
    const pathLength = path.getTotalLength();
    pathActive.style.strokeDasharray = pathLength;
    pathActive.style.strokeDashoffset = pathLength;
    
    function updateTimelineFollower() {
        const rect = section.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        const startScroll = rect.top - viewportHeight;
        const endScroll = rect.bottom - viewportHeight;
        
        let progress = -startScroll / (sectionHeight + viewportHeight);
        progress = Math.max(0, Math.min(1, progress));
        
        const drawLength = pathLength * progress;
        pathActive.style.strokeDashoffset = pathLength - drawLength;
        
        try {
            const point = path.getPointAtLength(drawLength);
            const container = document.querySelector('.story-timeline-container');
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            
            const xPixel = (point.x / 100) * containerWidth;
            const yPixel = (point.y / 100) * containerHeight;
            
            follower.style.left = `${xPixel}px`;
            follower.style.top = `${yPixel}px`;
            follower.style.display = 'block';
        } catch (e) {
            follower.style.display = 'none';
        }
    }
    
    window.addEventListener('scroll', updateTimelineFollower);
    window.addEventListener('resize', updateTimelineFollower);
    setTimeout(updateTimelineFollower, 300);
}

// 4. Birthday Surprise Gift Box Click Event
function initBirthdaySurprise() {
    const giftContainer = document.querySelector('.gift-container');
    const msgBox = document.getElementById('surprise-message-box');
    const txtEl = document.getElementById('surprise-text');
    
    if (!giftContainer || !msgBox || !txtEl) return;
    
    const message = `Bas itna sa wish hai ki yeh saal tumhe har woh happiness de jo tum truly deserve karti ho — the kind that shows in your smile, your eyes, and those little happy moments you quietly cherish. ❤️\n\nAur sach bolu… jab bhi I think about us, my mind instantly goes back to Indore — our hugs, our coffee dates, holding your hand, those random selfies, and every little moment that somehow became my favorite memory. Meeting you there felt so unreal and special, like life finally gave me something it knew I'd protect forever. 🌸\n\nAnd now I just want more of us — more memories, more laughs, more late-night calls, more trips, more hugs, and many more birthdays where I get to stand beside you and celebrate the most beautiful person in my life. ❤️`;
    let opened = false;
    
    giftContainer.addEventListener('click', (e) => {
        if (opened) return;
        opened = true;
        
        giftContainer.classList.add('open');
        
        initConfetti();
        createHeartShower(e);
        
        setTimeout(() => {
            msgBox.classList.remove('hidden');
            msgBox.classList.add('visible');
            startTypewriter(txtEl, message);
            
            setTimeout(() => {
                msgBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }, 800);
    });
}

// 5. Cinematic Final Ending
function initEndingSection() {
    const finalBtn = document.getElementById('final-btn');
    const revealMsg = document.getElementById('final-reveal-msg');
    
    if (!finalBtn || !revealMsg) return;
    
    finalBtn.addEventListener('click', (e) => {
        finalBtn.classList.add('hidden');
        revealMsg.classList.remove('hidden');
        
        createHeartShower(e);
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                initConfetti();
            }, i * 400);
        }
    });
}

// 6. Desktop Cursor Sparkle Trail
function initCursorSparkles() {
    if (window.innerWidth < 1024) return;
    
    let lastSparkleTime = 0;
    
    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkleTime > 80) {
            spawnSparkle(e.clientX, e.clientY);
            lastSparkleTime = now;
        }
    });
    
    function spawnSparkle(x, y) {
        const sparkle = document.createElement('span');
        sparkle.className = 'cursor-sparkle';
        sparkle.textContent = Math.random() > 0.5 ? '✨' : '✦';
        
        const offsetX = Math.random() * 16 - 8;
        const offsetY = Math.random() * 16 - 8;
        
        sparkle.style.left = `${x + offsetX}px`;
        sparkle.style.top = `${y + offsetY}px`;
        sparkle.style.transform = `translate(-50%, -50%) scale(${Math.random() * 0.6 + 0.6})`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 800);
    }
}

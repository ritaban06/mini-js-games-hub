class StarryNightGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.selectedStars = [];
        this.constellations = [];
        this.achievements = [];
        this.particles = [];
        this.sessionStartTime = Date.now();
        this.starsConnected = 0;
        this.currentTheme = 'default';
        this.breathingActive = false;
        this.musicPlaying = false;
        this.hintTimeout = null;

        // Real constellation patterns
        this.constellationPatterns = {
            'Orion': [
                { name: 'Betelgeuse', connections: [1, 2, 3] },
                { name: 'Rigel', connections: [0, 4] },
                { name: 'Bellatrix', connections: [0] },
                { name: 'Mintaka', connections: [0, 4] },
                { name: 'Saiph', connections: [1, 3] }
            ],
            'Ursa Major': [
                { name: 'Dubhe', connections: [1] },
                { name: 'Merak', connections: [0, 2] },
                { name: 'Phecda', connections: [1, 3] },
                { name: 'Megrez', connections: [2, 4] },
                { name: 'Alioth', connections: [3, 5] },
                { name: 'Mizar', connections: [4, 6] },
                { name: 'Alkaid', connections: [5] }
            ],
            'Cassiopeia': [
                { name: 'Shedir', connections: [1] },
                { name: 'Caph', connections: [0, 2] },
                { name: 'Gamma Cas', connections: [1, 3] },
                { name: 'Ruchbah', connections: [2, 4] },
                { name: 'Segin', connections: [3] }
            ],
            'Ursa Minor': [
                { name: 'Polaris', connections: [1] },
                { name: 'Kochab', connections: [0, 2] },
                { name: 'Pherkad', connections: [1] }
            ],
            'Draco': [
                { name: 'Thuban', connections: [1] },
                { name: 'Rastaban', connections: [0, 2] },
                { name: 'Eltanin', connections: [1, 3] },
                { name: 'Aldhibah', connections: [2] }
            ],
            'Cygnus': [
                { name: 'Deneb', connections: [1] },
                { name: 'Sadr', connections: [0, 2] },
                { name: 'Gienah', connections: [1, 3] },
                { name: 'Albireo', connections: [2] }
            ],
            'Lyra': [
                { name: 'Vega', connections: [1] },
                { name: 'Sheliak', connections: [0, 2] },
                { name: 'Sulafat', connections: [1] }
            ],
            'Aquila': [
                { name: 'Altair', connections: [1] },
                { name: 'Alshain', connections: [0, 2] },
                { name: 'Tarazed', connections: [1] }
            ],
            'Pegasus': [
                { name: 'Markab', connections: [1, 3] },
                { name: 'Scheat', connections: [0, 2] },
                { name: 'Alpheratz', connections: [1] },
                { name: 'Enif', connections: [0] }
            ],
            'Andromeda': [
                { name: 'Alpheratz', connections: [1] },
                { name: 'Mirach', connections: [0, 2] },
                { name: 'Almash', connections: [1] }
            ],
            'Triangulum': [
                { name: 'Beta Tri', connections: [1, 2] },
                { name: 'Gamma Tri', connections: [0] },
                { name: 'Alpha Tri', connections: [0] }
            ],
            'Perseus': [
                { name: 'Mirfak', connections: [1] },
                { name: 'Algol', connections: [0, 2] },
                { name: 'Gorgonea Tertia', connections: [1] }
            ]
        };

        this.audio = document.getElementById('ambient-music');
        this.init();
        this.bindEvents();
        this.startAnimationLoop();
        this.updateSessionTimer();
    }

    init() {
        this.generateStars();
        this.draw();
        this.updateUI();
        this.createNebulaBackground();
    }

    generateStars() {
        this.stars = [];
        const numStars = 60 + Math.random() * 40; // 60-100 stars

        for (let i = 0; i < numStars; i++) {
            const star = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 0.5,
                brightness: Math.random() * 0.8 + 0.2,
                id: i,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: this.getThemeColor()
            };
            this.stars.push(star);
        }
    }

    getThemeColor() {
        const themes = {
            default: '#ffffff',
            nebula: '#4ecdc4',
            galaxy: '#667eea',
            aurora: '#38ef7d'
        };
        return themes[this.currentTheme] || '#ffffff';
    }

    createNebulaBackground() {
        const nebula = document.createElement('div');
        nebula.className = 'nebula-bg';
        nebula.style.background = `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
                                   radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                                   radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)`;
        this.canvas.parentElement.appendChild(nebula);
    }

    draw() {
        // Clear canvas with theme-based gradient
        const gradients = {
            default: ['#1a1a2e', '#0c0c0c'],
            nebula: ['#2d1b69', '#0c0c0c'],
            galaxy: ['#667eea', '#0c0c0c'],
            aurora: ['#11998e', '#0c0c0c']
        };
        const [color1, color2] = gradients[this.currentTheme] || gradients.default;

        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw stars with enhanced effects
        this.stars.forEach(star => {
            const twinkle = Math.sin(Date.now() * 0.003 + star.twinkleOffset) * 0.3 + 0.7;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.hexToRgb(star.color)}, ${star.brightness * twinkle})`;
            this.ctx.fill();

            // Add glow effect
            this.ctx.shadowColor = star.color;
            this.ctx.shadowBlur = star.size * 2;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        // Draw particles
        this.particles.forEach((particle, index) => {
            particle.life -= 0.02;
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                return;
            }

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${particle.color}, ${particle.life})`;
            this.ctx.fill();
        });

        // Draw selected stars
        this.selectedStars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size + 3, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffd700';
            this.ctx.strokeStyle = '#ffa500';
            this.ctx.lineWidth = 3;
            this.ctx.fill();
            this.ctx.stroke();
        });

        // Draw constellation lines
        if (this.selectedStars.length > 1) {
            this.ctx.strokeStyle = this.getThemeColor();
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);

            for (let i = 0; i < this.selectedStars.length - 1; i++) {
                const star1 = this.selectedStars[i];
                const star2 = this.selectedStars[i + 1];
                this.ctx.beginPath();
                this.ctx.moveTo(star1.x, star1.y);
                this.ctx.lineTo(star2.x, star2.y);
                this.ctx.stroke();
            }

            // Connect last to first if it's a closed shape
            if (this.selectedStars.length > 2) {
                const first = this.selectedStars[0];
                const last = this.selectedStars[this.selectedStars.length - 1];
                this.ctx.beginPath();
                this.ctx.moveTo(last.x, last.y);
                this.ctx.lineTo(first.x, first.y);
                this.ctx.stroke();
            }
        }

        // Draw completed constellations
        this.constellations.forEach(constellation => {
            this.ctx.strokeStyle = '#ff6b6b';
            this.ctx.lineWidth = 4;
            this.ctx.setLineDash([]);
            this.ctx.shadowColor = '#ff6b6b';
            this.ctx.shadowBlur = 10;

            for (let i = 0; i < constellation.length - 1; i++) {
                const star1 = constellation[i];
                const star2 = constellation[i + 1];
                this.ctx.beginPath();
                this.ctx.moveTo(star1.x, star1.y);
                this.ctx.lineTo(star2.x, star2.y);
                this.ctx.stroke();
            }

            // Close the constellation
            const first = constellation[0];
            const last = constellation[constellation.length - 1];
            this.ctx.beginPath();
            this.ctx.moveTo(last.x, last.y);
            this.ctx.lineTo(first.x, first.y);
            this.ctx.stroke();

            this.ctx.shadowBlur = 0;
        });
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
    }

    startAnimationLoop() {
        const animate = () => {
            this.draw();
            requestAnimationFrame(animate);
        };
        animate();

        // Occasional shooting star
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every 5 seconds
                this.createShootingStar();
            }
        }, 5000);
    }

    createShootingStar() {
        const startX = Math.random() * this.canvas.width;
        const startY = 0;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = this.canvas.height;

        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.cssText = `
            position: absolute;
            left: ${startX}px;
            top: ${startY}px;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            animation: shootingStar 1s linear;
            pointer-events: none;
            z-index: 5;
        `;

        this.canvas.parentElement.appendChild(star);

        setTimeout(() => {
            this.canvas.parentElement.removeChild(star);
        }, 1000);
    }

    createParticles(x, y, color = '255, 255, 255') {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                size: Math.random() * 3 + 1,
                life: 1,
                color: color
            });
        }
    }

    bindEvents() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.handleClick(x, y);
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetSelection();
        });

        document.getElementById('new-stars-btn').addEventListener('click', () => {
            this.generateStars();
            this.resetSelection();
            this.createNebulaBackground();
        });

        document.getElementById('music-toggle').addEventListener('click', () => {
            this.toggleMusic();
        });

        document.getElementById('breathing-toggle').addEventListener('click', () => {
            this.toggleBreathing();
        });

        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.changeTheme();
        });

        document.getElementById('close-gallery').addEventListener('click', () => {
            document.getElementById('achievement-gallery').style.display = 'none';
        });

        // Achievement gallery trigger
        document.getElementById('achievements').addEventListener('click', (e) => {
            if (e.target.classList.contains('achievement')) {
                this.showAchievementGallery();
            }
        });
    }

    handleClick(x, y) {
        // Find clicked star
        const clickedStar = this.stars.find(star => {
            const distance = Math.sqrt((star.x - x) ** 2 + (star.y - y) ** 2);
            return distance < star.size + 10; // Click tolerance
        });

        if (clickedStar) {
            // Toggle selection
            const index = this.selectedStars.findIndex(star => star.id === clickedStar.id);
            if (index > -1) {
                this.selectedStars.splice(index, 1);
            } else {
                this.selectedStars.push(clickedStar);
                this.starsConnected++;
                this.createParticles(clickedStar.x, clickedStar.y);
            }

            // Check for constellation
            if (this.selectedStars.length >= 3) {
                this.checkConstellation();
            }

            this.updateUI();
        }
    }

    checkConstellation() {
        // Check against real constellation patterns
        for (const [name, pattern] of Object.entries(this.constellationPatterns)) {
            if (this.selectedStars.length === pattern.length && !this.achievements.includes(name)) {
                // Simple pattern matching (in a real implementation, you'd do more sophisticated matching)
                if (this.selectedStars.length >= 3) {
                    this.achievements.push(name);
                    this.constellations.push([...this.selectedStars]);
                    this.showAchievement(name);
                    this.resetSelection();
                    break;
                }
            }
        }
    }

    resetSelection() {
        this.selectedStars = [];
        this.updateUI();
    }

    toggleMusic() {
        if (this.musicPlaying) {
            this.audio.pause();
            this.musicPlaying = false;
            document.getElementById('music-toggle').classList.remove('active');
        } else {
            // Since we don't have actual music, we'll create a simple tone
            this.playAmbientTone();
            this.musicPlaying = true;
            document.getElementById('music-toggle').classList.add('active');
        }
    }

    playAmbientTone() {
        // Create a simple ambient tone using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 2);
        } catch (e) {
            console.log('Web Audio not supported');
        }
    }

    toggleBreathing() {
        const guide = document.getElementById('breathing-guide');
        this.breathingActive = !this.breathingActive;

        if (this.breathingActive) {
            guide.style.display = 'block';
            document.getElementById('breathing-toggle').classList.add('active');
        } else {
            guide.style.display = 'none';
            document.getElementById('breathing-toggle').classList.remove('active');
        }
    }

    changeTheme() {
        const themes = ['default', 'nebula', 'galaxy', 'aurora'];
        const currentIndex = themes.indexOf(this.currentTheme);
        this.currentTheme = themes[(currentIndex + 1) % themes.length];

        document.body.className = `${this.currentTheme}-theme`;

        // Update star colors
        this.stars.forEach(star => {
            star.color = this.getThemeColor();
        });

        document.getElementById('theme-toggle').textContent = `🎨 ${this.currentTheme.charAt(0).toUpperCase() + this.currentTheme.slice(1)}`;
    }

    showAchievement(name) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `✨ <strong>${name}</strong> constellation discovered!`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
            color: #333;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 1000;
            animation: slideDown 0.5s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);

        // Show hint for next constellation
        this.showNextHint();
    }

    showNextHint() {
        const undiscovered = Object.keys(this.constellationPatterns).filter(c => !this.achievements.includes(c));
        if (undiscovered.length > 0) {
            const next = undiscovered[Math.floor(Math.random() * undiscovered.length)];
            const hint = document.getElementById('constellation-hint');
            hint.textContent = `💡 Try finding: ${next}`;
            hint.classList.add('show');

            if (this.hintTimeout) clearTimeout(this.hintTimeout);
            this.hintTimeout = setTimeout(() => {
                hint.classList.remove('show');
            }, 5000);
        }
    }

    showAchievementGallery() {
        const gallery = document.getElementById('achievement-gallery');
        const content = document.getElementById('gallery-content');

        content.innerHTML = '';

        Object.keys(this.constellationPatterns).forEach(name => {
            const item = document.createElement('div');
            item.className = `gallery-item ${this.achievements.includes(name) ? 'discovered' : 'undiscovered'}`;
            item.innerHTML = `
                <h4>${name}</h4>
                <p>${this.achievements.includes(name) ? '⭐ Discovered' : '🔍 Undiscovered'}</p>
                <small>${this.constellationPatterns[name].length} stars</small>
            `;
            content.appendChild(item);
        });

        gallery.style.display = 'flex';
    }

    updateSessionTimer() {
        setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('session-time').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    updateUI() {
        const totalConstellations = Object.keys(this.constellationPatterns).length;
        const progress = (this.achievements.length / totalConstellations) * 100;

        document.getElementById('constellation-count').textContent = this.achievements.length;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `${this.achievements.length}/${totalConstellations}`;
        document.getElementById('stars-connected').textContent = this.starsConnected;

        const achievementsDiv = document.getElementById('achievements');
        achievementsDiv.innerHTML = '';
        this.achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'achievement';
            badge.textContent = achievement;
            achievementsDiv.appendChild(badge);
        });
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
    @keyframes shootingStar {
        0% { transform: translateX(0) translateY(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateX(200px) translateY(200px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new StarryNightGame('starry-canvas');
});
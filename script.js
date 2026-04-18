(() => {
    'use strict';

    // --- Loader ---
    window.addEventListener('DOMContentLoaded', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.4s ease';
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            document.getElementById('loader').classList.add('hidden');
        });
    });

    // --- Particles (Canvas Optimizado) ---
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 0.4 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.life = Math.random() * 1000;
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.life++;
            if (this.y < -10 || this.life > 1200) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(124, 92, 252, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        if (prefersReducedMotion) return;
        const count = Math.min(window.innerWidth < 600 ? 30 : 50, 50);
        particles = Array.from({ length: count }, () => new Particle());
    }

    function animateParticles() {
        if (prefersReducedMotion) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // --- Reveal on Scroll ---
    const sections = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

    sections.forEach((sec, i) => {
        setTimeout(() => observer.observe(sec), i * 120);
    });

    // --- Mouse Glow Effect (Cards) ---
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--pointer-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--pointer-y', `${e.clientY - rect.top}px`);
            card.querySelector('::before')?.style && (card.style.opacity = '1');
        });
        card.addEventListener('mouseleave', () => {
            card.style.opacity = '';
        });
    });

    // --- Copy to Clipboard (Discord) ---
    const discordCard = document.querySelector('.social-card.discord[data-copy]');
    const toast = document.getElementById('toast');

    function showToast(msg = '¡Copiado!') {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    if (discordCard) {
        discordCard.addEventListener('click', (e) => {
            e.preventDefault();
            const text = discordCard.dataset.copy;
            navigator.clipboard.writeText(text).then(() => showToast(`Discord: ${text} copiado`)).catch(() => showToast('No se pudo copiar'));
        });
    }

    // --- Parallax Orbs (Mobile Optimized) ---
    if (!prefersReducedMotion) {
        let ticking = false;
        document.addEventListener('touchmove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const y = e.touches[0].clientY;
                    document.querySelector('.orb-1').style.transform = `translate(0, ${y * 0.03}px)`;
                    document.querySelector('.orb-2').style.transform = `translate(0, ${y * -0.02}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
})();
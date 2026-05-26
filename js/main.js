'use strict';

/* ══════════════════════════════════════════════════════
   PORTFOLIO — Tristan Pilat
   Effects: Particles · Typing · Scroll Reveal · 3D Tilt
            Magnetic Buttons · Custom Cursor · Counters
══════════════════════════════════════════════════════ */

/* ── 1. LOADING SCREEN ─────────────────────────────── */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) { initPostLoad(); return; }
    const fill = loader.querySelector('.loader-fill');
    if (fill) fill.style.width = '100%';
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('is-loading');
        initPostLoad();
    }, 900);
});

function initPostLoad() {
    initScrollReveal();
    initCounters();
    initCardTilt();
    initMagneticBtns();
}

/* ── 2. DOM READY ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTyping();
    initCursor();
    initNavScroll();
    initHeroEntrance();
});

/* ── 3. PARTICLE CANVAS ────────────────────────────── */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const mouse = { x: -999, y: -999 };

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();

    function spawn() {
        return {
            x:  Math.random() * canvas.width,
            y:  Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            r:  Math.random() * 1.6 + 0.4,
            o:  Math.random() * 0.45 + 0.12,
        };
    }

    function populate() {
        const n = Math.min(Math.floor(canvas.width / 13), 90);
        particles = Array.from({ length: n }, spawn);
    }
    populate();

    window.addEventListener('resize', () => { resize(); populate(); }, { passive: true });
    canvas.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const d  = Math.hypot(dx, dy);
            if (d < 110) { p.x -= dx * 0.045; p.y -= dy * 0.045; }

            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(253,186,116,${p.o})`;
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (d < 135) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(249,115,22,${0.13 * (1 - d / 135)})`;
                    ctx.lineWidth = 0.7;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

/* ── 4. TYPING EFFECT ──────────────────────────────── */
function initTyping() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const phrases = [
        'programmeur.',
        'probleemoplosser.',
        'lifelong learner.',
        'bouwer van software.',
        'beginnend developer.',
        'creatief denker.',
    ];
    let pi = 0, ci = 0, del = false;

    function tick() {
        const phrase = phrases[pi];
        if (del) {
            el.textContent = phrase.slice(0, --ci);
            if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 500); return; }
            setTimeout(tick, 38 + Math.random() * 20);
        } else {
            el.textContent = phrase.slice(0, ++ci);
            if (ci === phrase.length) { setTimeout(() => { del = true; tick(); }, 2400); return; }
            setTimeout(tick, 75 + Math.random() * 45);
        }
    }
    setTimeout(tick, 1200);
}

/* ── 5. SCROLL REVEAL ──────────────────────────────── */
function initScrollReveal() {
    const selectors = [
        '.card', '.project-card', '.hobby-card', '.info-card',
        '.doc-link-card', '.week-card', '.scratch-card',
        '.contact-item', '.stat-item', '.learned-item',
        '.section-header', '.page-hero-inner',
    ];
    const targets = document.querySelectorAll(selectors.join(','));

    targets.forEach((el, i) => {
        Object.assign(el.style, {
            opacity: '0',
            transform: 'translateY(36px)',
            transition: `opacity 0.7s ease ${(i % 6) * 0.07}s,
                         transform 0.7s cubic-bezier(0.16,1,0.3,1) ${(i % 6) * 0.07}s`,
        });
    });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            Object.assign(e.target.style, { opacity: '1', transform: 'translateY(0)' });
            obs.unobserve(e.target);
        });
    }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => obs.observe(el));
}

/* ── 6. ANIMATED COUNTERS ──────────────────────────── */
function initCounters() {
    const nodes = document.querySelectorAll('.stat-number[data-count]');
    if (!nodes.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            obs.unobserve(e.target);
            const el     = e.target;
            const target = +el.dataset.count;
            const suffix = el.dataset.suffix || '';
            const dur    = 1800;
            const fps    = 16;
            const steps  = dur / fps;
            let cur = 0, frame = 0;
            const t = setInterval(() => {
                frame++;
                const progress = frame / steps;
                const ease = 1 - Math.pow(1 - progress, 3);
                cur = target * ease;
                el.textContent = Math.floor(cur) + suffix;
                if (frame >= steps) { el.textContent = target + suffix; clearInterval(t); }
            }, fps);
        });
    }, { threshold: 0.5 });

    nodes.forEach(n => obs.observe(n));
}

/* ── 7. 3D CARD TILT ───────────────────────────────── */
function initCardTilt() {
    const cards = document.querySelectorAll('.card, .project-card, .hobby-card, .info-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-6px) scale(1.02)';
            card.style.transition = 'transform 0.2s cubic-bezier(0.16,1,0.3,1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s ease, border-color 0.3s ease, opacity 0.7s ease';
        });
    });
}

/* ── 8. MAGNETIC BUTTONS ───────────────────────────── */
function initMagneticBtns() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r  = btn.getBoundingClientRect();
            const x  = (e.clientX - r.left - r.width  / 2) * 0.4;
            const y  = (e.clientY - r.top  - r.height / 2) * 0.4;
            btn.style.transform = `translate(${x}px,${y}px)`;
            btn.style.transition = 'transform 0.15s ease';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, background 0.3s ease';
        });
    });
}

/* ── 9. CUSTOM CURSOR ──────────────────────────────── */
function initCursor() {
    if (window.matchMedia('(hover: none), (max-width: 768px)').matches) return;

    const ring = Object.assign(document.createElement('div'), { id: 'cursor-ring' });
    const dot  = Object.assign(document.createElement('div'), { id: 'cursor-dot' });
    document.body.append(ring, dot);

    let mx = -200, my = -200, rx = -200, ry = -200;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.cssText = `left:${mx}px;top:${my}px;`;
    });

    (function loop() {
        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        ring.style.cssText = `left:${rx}px;top:${ry}px;`;
        requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a,button,.card,.project-card,.hobby-card,.btn').forEach(el => {
        el.addEventListener('mouseenter', () => { ring.classList.add('is-hovered'); dot.classList.add('is-hovered'); });
        el.addEventListener('mouseleave', () => { ring.classList.remove('is-hovered'); dot.classList.remove('is-hovered'); });
    });
}

/* ── 10. HERO ENTRANCE ANIMATIONS ─────────────────── */
function initHeroEntrance() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const items = hero.querySelectorAll('.hero-eyebrow, .hero-name, .hero-typing, .hero-sub, .hero-cta, .hero-stack, .scroll-hint');
    items.forEach((el, i) => {
        el.style.cssText = `opacity:0;transform:translateY(28px);
            transition:opacity 0.8s ease ${0.2 + i * 0.12}s,
                       transform 0.8s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.12}s;`;
    });

    requestAnimationFrame(() => {
        items.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    });
}

/* ── 11. NAV SCROLL STATE ──────────────────────────── */
function initNavScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    const update = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', update, { passive: true });
    update();
}

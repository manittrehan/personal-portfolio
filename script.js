/* ==========================================
   MANIT TREHAN — PORTFOLIO INTERACTIONS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHeroCanvas();
    initTypewriter();
    initScrollReveal();
    initCountUp();
    initMobileMenu();
    initContactForm();
    initSmoothScroll();
    initActiveNavHighlight();
});

/* ===== NAVBAR SCROLL EFFECT ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });
}

/* ===== HERO CANVAS — FLOATING GEOMETRIC SHAPES ===== */
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const colors = [
        'rgba(255, 107, 53, 0.12)',   // warm orange
        'rgba(247, 147, 30, 0.10)',    // golden
        'rgba(232, 67, 147, 0.08)',    // pink
        'rgba(108, 92, 231, 0.08)',    // purple
        'rgba(0, 184, 148, 0.08)',     // mint
        'rgba(255, 165, 2, 0.10)',     // amber
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 60 + 20;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.005;
            this.shape = Math.floor(Math.random() * 3); // 0: circle, 1: rounded rect, 2: ring
            this.opacity = Math.random() * 0.5 + 0.3;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.01 + 0.005;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.pulsePhase += this.pulseSpeed;

            // Wrap around
            if (this.x < -this.size) this.x = canvas.width + this.size;
            if (this.x > canvas.width + this.size) this.x = -this.size;
            if (this.y < -this.size) this.y = canvas.height + this.size;
            if (this.y > canvas.height + this.size) this.y = -this.size;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity * (0.6 + 0.4 * Math.sin(this.pulsePhase));

            if (this.shape === 0) {
                // Soft circle
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            } else if (this.shape === 1) {
                // Rounded rect
                const s = this.size;
                const r = s * 0.2;
                ctx.beginPath();
                ctx.roundRect(-s / 2, -s / 2, s, s, r);
                ctx.fillStyle = this.color;
                ctx.fill();
            } else {
                // Ring
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    // Create particles
    const particleCount = Math.min(Math.floor(canvas.width / 80), 18);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* ===== TYPEWRITER EFFECT ===== */
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const phrases = [
        'build intelligent AI systems.',
        'fine-tune large language models.',
        'engineer data pipelines.',
        'create neural network architectures.',
        'deploy ML models at scale.',
        'love solving real-world problems.',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 60;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 60;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2200; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Pause before next phrase
        }

        setTimeout(type, typingSpeed);
    }

    // Start after hero animation
    setTimeout(type, 1500);
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for sibling reveals
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let delay = 0;
                siblings.forEach((el, i) => {
                    if (el === entry.target) delay = i * 100;
                });

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ===== COUNT UP ANIMATION ===== */
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCount(el, 0, target, 1500);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

function animateCount(el, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * eased);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ===== CONTACT FORM — Web3Forms Integration ===== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        const originalHTML = btn.innerHTML;

        // Show sending state
        btn.innerHTML = `
            <span>Sending...</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin-icon">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
        `;
        btn.disabled = true;
        btn.style.opacity = '0.7';

        try {
            const formData = new FormData(form);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                btn.innerHTML = `<span>Message Sent! ✓</span>`;
                btn.style.background = 'linear-gradient(135deg, #00b894, #55efc4)';
                form.reset();
            } else {
                btn.innerHTML = `<span>Failed to send. Try again.</span>`;
                btn.style.background = 'linear-gradient(135deg, #e17055, #d63031)';
            }
        } catch (error) {
            btn.innerHTML = `<span>Network error. Try again.</span>`;
            btn.style.background = 'linear-gradient(135deg, #e17055, #d63031)';
        }

        // Reset button after 3 seconds
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.background = '';
        }, 3000);
    });

    // Add CSS for spin animation
    const style = document.createElement('style');
    style.textContent = `
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
}

/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===== ACTIVE NAV HIGHLIGHT ===== */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

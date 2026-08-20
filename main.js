/* =====================================================
   MCCA LAW FIRM — ADVANCED INTERACTIVITY ENGINE
   Mutandiro, Chitsanga & Chitima Attorneys
   Cross-Device & Touch Optimized
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    // Initialize animations immediately
    initHeroAnimations();

    // ===================================================
    // 2. PARTICLE SYSTEM (Canvas)
    // ===================================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = -9999;
        let mouseY = -9999;
        let canvasWidth = 0;
        let canvasHeight = 0;
        let animFrameId = null;

        function resizeCanvas() {
            if (!canvas.parentElement) return;
            canvasWidth = canvas.parentElement.offsetWidth;
            canvasHeight = canvas.parentElement.offsetHeight;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });
        window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 200));

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * (canvasWidth || window.innerWidth);
                this.y = Math.random() * (canvasHeight || window.innerHeight);
                this.size = Math.random() * 1.8 + 0.6;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.45 + 0.15;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction
                if (mouseX > 0 && mouseY > 0) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120 && dist > 0) {
                        const force = (120 - dist) / 120;
                        this.x -= (dx / dist) * force * 1.5;
                        this.y -= (dy / dist) * force * 1.5;
                    }
                }

                // Wrap around edges
                if (this.x < 0) this.x = canvasWidth;
                if (this.x > canvasWidth) this.x = 0;
                if (this.y < 0) this.y = canvasHeight;
                if (this.y > canvasHeight) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 107, 0, ${this.opacity})`;
                ctx.fill();
            }
        }

        const particleCount = isTouchDevice ? 40 : Math.min(Math.floor(((canvasWidth || 1200) * (canvasHeight || 800)) / 10000), 90);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        if (!isTouchDevice && canvas.parentElement) {
            canvas.parentElement.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouseX = e.clientX - rect.left;
                mouseY = e.clientY - rect.top;
            }, { passive: true });

            canvas.parentElement.addEventListener('mouseleave', () => {
                mouseX = -9999;
                mouseY = -9999;
            });
        }

        function drawLines() {
            const maxDist = isTouchDevice ? 80 : 100;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const opacity = (1 - dist / maxDist) * 0.14;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 107, 0, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            drawLines();
            animFrameId = requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // ===================================================
    // 3. HERO TEXT ANIMATION (Strict Whole Words)
    // ===================================================
    function initHeroAnimations() {
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
            let charIndex = 0;

            const processNode = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    if (!text.trim()) {
                        return document.createTextNode(text);
                    }
                    const tokens = text.split(/(\s+)/);
                    const frag = document.createDocumentFragment();

                    tokens.forEach(token => {
                        if (/^\s+$/.test(token)) {
                            frag.appendChild(document.createTextNode(token));
                        } else if (token.length > 0) {
                            const wordSpan = document.createElement('span');
                            wordSpan.className = 'word';

                            for (let i = 0; i < token.length; i++) {
                                const charSpan = document.createElement('span');
                                charSpan.className = 'char';
                                charSpan.textContent = token[i];
                                charSpan.style.animationDelay = `${0.2 + charIndex * 0.02}s`;
                                charIndex++;
                                wordSpan.appendChild(charSpan);
                            }
                            frag.appendChild(wordSpan);
                        }
                    });
                    return frag;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const clone = node.cloneNode(false);
                    Array.from(node.childNodes).forEach(child => {
                        const processed = processNode(child);
                        if (processed) clone.appendChild(processed);
                    });
                    return clone;
                }
                return node.cloneNode(true);
            };

            const fragment = document.createDocumentFragment();
            Array.from(heroTitle.childNodes).forEach(child => {
                const processed = processNode(child);
                if (processed) fragment.appendChild(processed);
            });
            heroTitle.innerHTML = '';
            heroTitle.appendChild(fragment);
        }

        startTypingEffect();
    }

    // ===================================================
    // 4. TYPING EFFECT
    // ===================================================
    function startTypingEffect() {
        const typingEl = document.getElementById('hero-typing');
        if (!typingEl) return;

        const phrases = [
            'Redefining legal excellence with technological innovation.',
            'Protecting what matters most — your legacy, your rights.',
            'Strategic counsel for complex corporate and civil challenges.',
            'Where tradition meets cutting-edge legal precision.'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 45;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 20;
            } else {
                typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 40;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 350;
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 1400);
    }

    // ===================================================
    // 5. SCROLL REVEAL ANIMATIONS
    // ===================================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }

    // ===================================================
    // 6. NAVBAR SCROLL EFFECT
    // ===================================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ===================================================
    // 7. ACTIVE NAV HIGHLIGHTING
    // ===================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('[data-nav]');

    if ('IntersectionObserver' in window && sections.length > 0) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, {
            threshold: 0.25,
            rootMargin: '-60px 0px -50% 0px'
        });

        sections.forEach(section => navObserver.observe(section));
    }

    // ===================================================
    // 8. MOBILE MENU
    // ===================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('[data-mobile-link]');

    function toggleMobileMenu(open) {
        if (!mobileToggle || !mobileMenu) return;
        const isOpen = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('open');
        mobileToggle.classList.toggle('active', isOpen);
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu(false);
            });
        });
    }

    // ===================================================
    // 9. SMOOTH SCROLL NAVIGATION
    // ===================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================================
    // 10. SCROLL PROGRESS BAR
    // ===================================================
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        if (scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = scrollPercent + '%';
        }
    }, { passive: true });

    // ===================================================
    // 11. BACK TO TOP BUTTON
    // ===================================================
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (backToTop) {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===================================================
    // 12. ANIMATED COUNTERS
    // ===================================================
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;

    const statsSection = document.querySelector('.stats');
    if (statsSection && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        counterObserver.observe(statsSection);
    } else {
        animateCounters();
    }

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            const duration = 1600;
            const start = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ===================================================
    // 13. 3D TILT EFFECT FOR CARDS (Desktop Only)
    // ===================================================
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll('[data-tilt]');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });

        // Magnetic buttons
        const magneticElements = document.querySelectorAll('.magnetic');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            }, { passive: true });

            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                el.style.transform = 'translate(0px, 0px)';
                setTimeout(() => {
                    el.style.transition = '';
                }, 400);
            });
        });
    }

    // ===================================================
    // 14. CASE STUDIES NAVIGATION
    // ===================================================
    const casesScroll = document.getElementById('cases-scroll');
    const casesPrev = document.getElementById('cases-prev');
    const casesNext = document.getElementById('cases-next');

    if (casesScroll && casesPrev && casesNext) {
        casesNext.addEventListener('click', () => {
            const cardWidth = casesScroll.querySelector('.case-card')?.offsetWidth || 320;
            casesScroll.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
        });

        casesPrev.addEventListener('click', () => {
            const cardWidth = casesScroll.querySelector('.case-card')?.offsetWidth || 320;
            casesScroll.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
        });
    }

    // ===================================================
    // 15. FORM VALIDATION & SUBMISSION
    // ===================================================
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');

    if (contactForm) {
        const fields = {
            name: {
                element: document.getElementById('name'),
                error: document.getElementById('name-error'),
                validate: (val) => val.trim().length >= 2
            },
            email: {
                element: document.getElementById('email'),
                error: document.getElementById('email-error'),
                validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
            },
            message: {
                element: document.getElementById('message'),
                error: document.getElementById('message-error'),
                validate: (val) => val.trim().length >= 8
            }
        };

        function validateField(field) {
            if (!field.element) return true;
            const value = field.element.value;
            if (value.length === 0) {
                field.element.classList.remove('valid', 'error');
                if (field.error) field.error.classList.remove('show');
                return false;
            }

            if (field.validate(value)) {
                field.element.classList.remove('error');
                field.element.classList.add('valid');
                if (field.error) field.error.classList.remove('show');
                return true;
            } else {
                field.element.classList.remove('valid');
                field.element.classList.add('error');
                if (field.error) field.error.classList.add('show');
                return false;
            }
        }

        Object.keys(fields).forEach(key => {
            const field = fields[key];
            if (field.element) {
                field.element.addEventListener('input', () => validateField(field));
                field.element.addEventListener('blur', () => validateField(field));
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            Object.keys(fields).forEach(key => {
                const valid = validateField(fields[key]);
                if (!valid) {
                    isValid = false;
                    if (fields[key].element) fields[key].element.classList.add('error');
                    if (fields[key].error) fields[key].error.classList.add('show');
                }
            });

            if (isValid && successModal) {
                successModal.classList.add('open');
                contactForm.reset();
                Object.keys(fields).forEach(key => {
                    if (fields[key].element) fields[key].element.classList.remove('valid', 'error');
                });
            }
        });
    }

    if (modalClose && successModal) {
        modalClose.addEventListener('click', () => {
            successModal.classList.remove('open');
        });

        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('open');
            }
        });
    }

    // ===================================================
    // 16. NEWSLETTER FORM
    // ===================================================
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input && input.value.trim()) {
                const btn = newsletterForm.querySelector('button');
                btn.textContent = 'Subscribed ✓';
                btn.style.background = '#4CAF50';
                input.value = '';
                setTimeout(() => {
                    btn.textContent = 'Subscribe';
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    // ===================================================
    // 17. KEYBOARD ACCESSIBILITY
    // ===================================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleMobileMenu(false);
            if (successModal && successModal.classList.contains('open')) {
                successModal.classList.remove('open');
            }
        }
    });

});

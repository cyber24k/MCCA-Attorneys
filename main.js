document.addEventListener('DOMContentLoaded', () => {
    // 1. Cursor Orb Tracking
    const orb = document.getElementById('cursor-orb');
    let mouseX = 0;
    let mouseY = 0;
    let orbX = 0;
    let orbY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateOrb = () => {
        // Smooth lagging effect
        orbX += (mouseX - orbX - 200) * 0.1;
        orbY += (mouseY - orbY - 200) * 0.1;
        
        orb.style.transform = `translate(${orbX}px, ${orbY}px)`;
        requestAnimationFrame(animateOrb);
    };
    animateOrb();

    // 2. Magnetic Interaction
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
        });
    });

    // 3. Scroll Reveal Logic
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));

    // 4. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 5. Parallax Effect for About Image
    const parallaxImg = document.querySelector('.parallax-img');
    window.addEventListener('scroll', () => {
        if (!parallaxImg) return;
        const rect = parallaxImg.parentElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const shift = (window.innerHeight - rect.top) * 0.1;
            parallaxImg.style.transform = `scale(1.2) translateY(${shift}px)`;
        }
    });

    // 6. Smooth Section Transitions (Liquid-like Simulation)
    // Note: True liquid masking usually requires Canvas/WebGL, 
    // but we can simulate it with CSS clip-paths on transition.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Add a "liquid" overlay before scrolling
                const overlay = document.createElement('div');
                overlay.className = 'liquid-overlay';
                document.body.appendChild(overlay);
                
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        overlay.classList.add('fade-out');
                        setTimeout(() => overlay.remove(), 800);
                    }, 800);
                }, 100);
            }
        });
    });
});

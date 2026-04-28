
const debounce = (func, wait = 50) => { // Reduced from default wait times
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit = 8) => { // Much faster throttling - 8ms instead of 16ms
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const isInViewport = (element, offset = 0) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -offset &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

const randomBetween = (min, max) => Math.random() * (max - min) + min;

// ===================================
// MAIN APPLICATION CLASS (FASTER)
// ===================================

class FarmQuestApp {
    constructor() {
        this.isLoaded = false;
        this.scrollPosition = 0;
        this.header = null;
        this.mobileMenu = null;
        this.mobileToggle = null;
        this.floatingCards = [];
        this.backgroundCircles = [];
        
        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('🌱 Farm Quest App Initializing... (FAST MODE)');
        
        this.cacheDOMElements();
        this.initializeHeader();
        this.initializeMobileMenu();
        this.initializeAnimations();
        this.initializeScrollEffects();
        this.initializeInteractions();
        this.initializeFloatingElements();
        this.initializeParallax();
        this.initializeTypingEffect();
        this.initializeCounters();
        this.setupEventListeners();
        
        this.isLoaded = true;
        console.log('✅ Farm Quest App Initialized Successfully! (FAST MODE)');
    }

    cacheDOMElements() {
        this.header = document.querySelector('.modern-header');
        this.mobileMenu = document.querySelector('.mobile-nav-menu');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.floatingCards = document.querySelectorAll('.floating-card');
        this.backgroundCircles = document.querySelectorAll('.bg-circle');
        this.heroTitle = document.querySelector('.hero-title');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.farmerImage = document.querySelector('.main-farmer-image');
    }

    // ===================================
    // FASTER HEADER FUNCTIONALITY
    // ===================================

    initializeHeader() {
        if (!this.header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            const scrollDifference = Math.abs(currentScrollY - lastScrollY);

            // Add scrolled class for styling (faster threshold)
            if (currentScrollY > 50) { // Reduced from 100
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            // Hide/show header based on scroll direction (faster response)
            if (scrollDifference > 5) { // Reduced from 10
                if (currentScrollY > lastScrollY && currentScrollY > 150) { // Reduced from 300
                    this.header.style.transform = 'translateY(-100%)';
                    this.header.style.transition = 'transform 0.2s ease-out'; // Faster transition
                    this.header.setAttribute('data-hidden', 'true');
                } else {
                    this.header.style.transform = 'translateY(0)';
                    this.header.style.transition = 'transform 0.15s ease-out'; // Even faster
                    this.header.removeAttribute('data-hidden');
                }
                lastScrollY = currentScrollY;
            }

            ticking = false;
        };

        // Faster scroll listener
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        // Faster header glow effect
        this.header.addEventListener('mousemove', (e) => {
            const rect = this.header.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            this.header.style.setProperty('--mouse-x', `${x}%`);
            this.header.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    // ===================================
    // FASTER MOBILE MENU
    // ===================================

    initializeMobileMenu() {
        if (!this.mobileToggle || !this.mobileMenu) return;

        this.mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        document.addEventListener('click', (e) => {
            if (!this.mobileMenu.contains(e.target) && 
                !this.mobileToggle.contains(e.target) && 
                this.mobileMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        const mobileNavLinks = this.mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const isActive = this.mobileMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileToggle.classList.add('active');
        this.mobileMenu.classList.add('active');
        document.body.classList.add('menu-open');
        
        // Super fast menu item animations
        const menuItems = this.mobileMenu.querySelectorAll('.mobile-nav-link');
        menuItems.forEach((item, index) => {
            item.style.animation = `slideInLeft 0.15s ease-out ${index * 0.03}s both`; // Much faster
        });
    }

    closeMobileMenu() {
        this.mobileToggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // ===================================
    // FASTER SCROLL EFFECTS
    // ===================================

    initializeScrollEffects() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = this.header ? this.header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    this.smoothScrollTo(targetPosition);
                    this.closeMobileMenu();
                }
            });
        });

        this.updateActiveNavLink();
        window.addEventListener('scroll', throttle(() => this.updateActiveNavLink(), 50)); // Faster updates
    }

    smoothScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 400; // Much faster - reduced from 800ms
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const headerHeight = this.header ? this.header.offsetHeight : 0;
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && 
                window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ===================================
    // MUCH FASTER ANIMATIONS
    // ===================================

    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Faster special handling
                    if (entry.target.classList.contains('feature-card')) {
                        this.animateFeatureCard(entry.target);
                    }
                    
                    if (entry.target.classList.contains('step-item')) {
                        this.animateStepItem(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        const animatedElements = document.querySelectorAll(
            '.feature-card, .step-item, .testimonial-card, .hero-badge, .hero-stats, .section-header'
        );
        
        animatedElements.forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.setProperty('--animation-delay', `${index * 0.05}s`); // Much faster stagger
            observer.observe(el);
        });

        this.addAnimationStyles();
    }

    animateFeatureCard(card) {
        const icon = card.querySelector('.feature-icon');
        const title = card.querySelector('.feature-title');
        const description = card.querySelector('.feature-description');
        const link = card.querySelector('.feature-link');
        
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'scale(1.1) rotate(360deg)';
                icon.style.transition = 'transform 0.3s ease-out'; // Faster
            }, 50); // Much faster
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 350); // Faster recovery
        }
        
        [title, description, link].forEach((el, index) => {
            if (el) {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    el.style.transition = 'all 0.2s ease-out'; // Much faster
                }, 100 + (index * 30)); // Faster stagger
            }
        });
    }

    animateStepItem(step) {
        const number = step.querySelector('.step-number');
        const icon = step.querySelector('.step-icon');
        
        if (number) {
            setTimeout(() => {
                number.style.transform = 'scale(1.2)';
                number.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                number.style.transition = 'all 0.15s ease-out'; // Much faster
            }, 50);
            
            setTimeout(() => {
                number.style.transform = 'scale(1)';
            }, 200); // Faster
        }
        
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'translateY(-10px)';
                icon.style.borderColor = '#22c55e';
                icon.style.transition = 'all 0.2s ease-out'; // Faster
            }, 150); // Faster
        }
    }

    addAnimationStyles() {
        if (document.querySelector('#animation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Much faster */
                transition-delay: var(--animation-delay, 0s);
            }
            
            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .feature-card .feature-title,
            .feature-card .feature-description,
            .feature-card .feature-link {
                opacity: 0;
                transform: translateY(15px);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); /* Faster */
            }
            
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-20px); /* Reduced distance */
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes pulse-glow {
                0%, 100% {
                    box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
                }
                50% {
                    box-shadow: 0 0 15px rgba(34, 197, 94, 0.6); /* Faster pulse */
                }
            }
            
            .floating-card {
                transition: all 0.15s ease-out !important; /* Much faster */
            }
            
            .floating-card:hover {
                animation: pulse-glow 0.5s ease-in-out; /* Faster pulse */
            }
            
            body.menu-open {
                overflow: hidden;
            }
            
            /* Faster floating animations */
            .floating-card {
                animation-duration: 2s !important; /* Faster float - reduced from 4s */
            }
            
            .bg-circle {
                animation-duration: 10s !important; /* Faster rotation - reduced from 20s */
            }
        `;
        document.head.appendChild(style);
    }

    // ===================================
    // FASTER INTERACTIONS
    // ===================================

    initializeInteractions() {
        this.initializeButtons();
        this.initializeCardEffects();
        this.initializeLogoEffects();
        this.initializeCursorEffects();
    }

    initializeButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .signup-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.createRippleEffect(e, button));
            
            // Faster loading state
            button.addEventListener('click', function(e) {
                if (this.classList.contains('loading')) return;
                
                const originalText = this.innerHTML;
                this.classList.add('loading');
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = originalText;
                }, 800); // Much faster - reduced from 1500ms
            });
            
            // Faster hover effects
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
                button.style.transition = 'all 0.1s ease-out'; // Much faster
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
                button.style.transition = 'all 0.1s ease-out';
            });
        });
    }

    createRippleEffect(e, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.classList.add('ripple');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-effect 0.3s ease-out; /* Much faster ripple */
            pointer-events: none;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 300); // Faster cleanup
    }

    initializeCardEffects() {
        const cards = document.querySelectorAll('.feature-card, .testimonial-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
                card.style.transition = 'all 0.15s ease-out'; // Much faster
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
                card.style.transition = 'all 0.15s ease-out';
            });
        });
    }

    initializeLogoEffects() {
        const logo = document.querySelector('.logo-container');
        if (!logo) return;
        
        let clickCount = 0;
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            clickCount++;
            
            if (clickCount >= 5) {
                this.triggerEasterEgg();
                clickCount = 0;
            }
        });
    }

    triggerEasterEgg() {
        const logo = document.querySelector('.logo-icon');
        if (!logo) return;
        
        logo.style.animation = 'spin 0.5s linear, pulse-glow 1s ease-in-out'; // Faster easter egg
        
        this.showNotification('🌱 You found the easter egg! Keep farming! 🚜', 'success');
        
        setTimeout(() => {
            logo.style.animation = '';
        }, 1000); // Faster reset
    }

    initializeCursorEffects() {
        const interactiveElements = document.querySelectorAll('button, .nav-link, .feature-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.style.cursor = 'pointer';
            });
            
            element.addEventListener('mouseleave', () => {
                document.body.style.cursor = '';
            });
        });
    }

    // ===================================
    // FASTER FLOATING ELEMENTS
    // ===================================

    initializeFloatingElements() {
        if (!this.farmerImage || this.floatingCards.length === 0) return;
        
        this.farmerImage.addEventListener('mouseenter', () => {
            this.floatingCards.forEach(card => {
                card.style.animationPlayState = 'paused';
            });
        });
        
        this.farmerImage.addEventListener('mouseleave', () => {
            this.floatingCards.forEach(card => {
                card.style.animationPlayState = 'running';
            });
        });
        
        this.floatingCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.1)';
                card.style.zIndex = '10';
                card.style.transition = 'all 0.1s ease-out'; // Much faster
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.zIndex = '';
                card.style.transition = 'all 0.1s ease-out';
            });
            
            card.addEventListener('click', () => {
                this.showCardDetails(card, index);
            });
        });
    }

    showCardDetails(card, index) {
        const cardData = [
            {
                title: '🏆 Achievement System',
                description: 'Unlock achievements as you complete farming challenges and adopt sustainable practices.'
            },
            {
                title: '⭐ Level Progression',
                description: 'Advance through farmer levels from Rookie to Expert as you gain experience and knowledge.'
            },
            {
                title: '💎 Reward Points',
                description: 'Earn points for every sustainable practice you implement and challenge you complete.'
            },
            {
                title: '🌱 Progress Tracking',
                description: 'Monitor your sustainability journey and see your positive impact on the environment.'
            }
        ];
        
        const data = cardData[index] || cardData[0];
        this.showNotification(data.description, 'info', data.title);
    }

    // ===================================
    // FASTER PARALLAX EFFECTS
    // ===================================

    initializeParallax() {
        if (this.backgroundCircles.length === 0) return;
        
        const updateParallax = throttle(() => {
            const scrolled = window.pageYOffset;
            
            this.backgroundCircles.forEach((circle, index) => {
                const rate = scrolled * -0.5 * (index + 1); // Faster parallax
                const rotation = scrolled * 0.2 * (index + 1); // Faster rotation
                
                circle.style.transform = `translateY(${rate}px) rotate(${rotation}deg)`;
            });
            
            const heroElements = document.querySelectorAll('.hero-badge, .hero-stats');
            heroElements.forEach((element, index) => {
                const rate = scrolled * -0.3 * (index + 0.5); // Faster parallax
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 8); // Much faster updates
        
        window.addEventListener('scroll', updateParallax, { passive: true });
    }

    // ===================================
    // FASTER TYPING EFFECT
    // ===================================

    initializeTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        const highlightText = heroTitle.querySelector('.highlight');
        if (!highlightText) return;
        
        const highlightFullText = highlightText.textContent;
        let currentText = '';
        let isTyping = true;
        let charIndex = 0;
        
        const typeText = () => {
            if (isTyping) {
                if (charIndex < highlightFullText.length) {
                    currentText += highlightFullText.charAt(charIndex);
                    highlightText.textContent = currentText + '|';
                    charIndex++;
                    setTimeout(typeText, 50); // Much faster typing
                } else {
                    isTyping = false;
                    setTimeout(() => {
                        highlightText.textContent = currentText;
                    }, 200); // Faster cursor removal
                }
            }
        };
        
        setTimeout(typeText, 300); // Faster start
    }

    // ===================================
    // FASTER COUNTERS
    // ===================================

    initializeCounters() {
        if (this.statNumbers.length === 0) return;
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.statNumbers.forEach(number => {
            observer.observe(number);
        });
    }

    animateCounter(element) {
        const target = element.textContent;
        const numericValue = parseInt(target.replace(/[^\d]/g, ''));
        const suffix = target.replace(/[\d,]/g, '');
        
        let current = 0;
        const increment = numericValue / 30; // Faster counting
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 30); // Faster updates
    }

    // ===================================
    // FASTER EVENT LISTENERS
    // ===================================

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu?.classList.contains('active')) {
                this.closeMobileMenu();
            }
            
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
                        break;
                    case '2':
                        e.preventDefault();
                        document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
                        break;
                }
            }
        });
        
        window.addEventListener('resize', debounce(() => {
            this.handleResize();
        }, 100)); // Faster resize handling
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.floatingCards.forEach(card => {
                    card.style.animationPlayState = 'paused';
                });
            } else {
                this.floatingCards.forEach(card => {
                    card.style.animationPlayState = 'running';
                });
            }
        });
        
        this.addRippleStyles();
    }

    handleResize() {
        if (window.innerWidth > 768 && this.mobileMenu?.classList.contains('active')) {
            this.closeMobileMenu();
        }
        
        if (this.backgroundCircles.length > 0) {
            this.backgroundCircles.forEach(circle => {
                circle.style.transform = '';
            });
        }
    }

    addRippleStyles() {
        if (document.querySelector('#ripple-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple-effect {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            .btn-primary, .btn-secondary, .signup-btn {
                position: relative;
                overflow: hidden;
                transition: all 0.1s ease-out !important; /* Much faster button transitions */
            }
            
            /* Faster hover effects for all interactive elements */
            .nav-link {
                transition: all 0.1s ease-out !important;
            }
            
            .feature-card, .testimonial-card {
                transition: all 0.15s ease-out !important;
            }
            
            .floating-card {
                transition: all 0.1s ease-out !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===================================
    // FASTER UTILITY METHODS
    // ===================================

    showNotification(message, type = 'info', title = null) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        notification.innerHTML = `
            ${title ? `<div class="notification-title">${title}</div>` : ''}
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        `;
        
        notification.style.animation = 'slideInRight 0.2s ease-out'; // Faster notification
        
        this.addNotificationStyles();
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.2s ease-out';
            setTimeout(() => notification.remove(), 200);
        }, 3000); // Faster auto-close
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.2s ease-out';
            setTimeout(() => notification.remove(), 200);
        });
    }

    addNotificationStyles() {
        if (document.querySelector('#notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                padding: 16px 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                max-width: 350px;
                border-left: 4px solid #22c55e;
                transition: all 0.2s ease-out; /* Faster notification transitions */
            }
            
            .notification-success { border-left-color: #22c55e; }
            .notification-info { border-left-color: #3b82f6; }
            .notification-warning { border-left-color: #f59e0b; }
            .notification-error { border-left-color: #ef4444; }
            
            .notification-title {
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 4px;
                color: #111827;
            }
            
            .notification-message {
                font-size: 13px;
                color: #6b7280;
                line-height: 1.4;
            }
            
            .notification-close {
                position: absolute;
                top: 8px;
                right: 12px;
                background: none;
                border: none;
                font-size: 20px;
                color: #9ca3af;
                cursor: pointer;
                line-height: 1;
                transition: color 0.1s ease-out;
            }
            
            .notification-close:hover {
                color: #374151;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    showDemo() {
        this.showNotification(
            'Demo functionality would be implemented here with video modal or interactive tour.',
            'info',
            '🎬 Demo Feature'
        );
    }

    getMetrics() {
        return {
            scrollPosition: window.scrollY,
            viewportHeight: window.innerHeight,
            isHeaderVisible: !this.header?.hasAttribute('data-hidden'),
            activeSection: this.getCurrentSection(),
            sessionTime: Date.now() - this.sessionStart
        };
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        let current = 'home';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                current = section.id;
            }
        });
        
        return current;
    }
}

// ===================================
// GLOBAL FUNCTIONS (FASTER)
// ===================================

window.watchDemo = function() {
    if (window.farmQuest) {
        window.farmQuest.showDemo();
    } else {
        alert('🎬 Demo video would play here!');
    }
};

window.getFarmQuestMetrics = function() {
    return window.farmQuest ? window.farmQuest.getMetrics() : null;
};

// ===================================
// FASTER INITIALIZATION
// ===================================

window.farmQuest = new FarmQuestApp();

console.log(`
🌱 ===================================
   Farm Quest Interactive Web App
   ⚡ FAST MODE ENABLED ⚡
🌱 ===================================
🚀 Status: Fully Loaded (FAST)
🎯 Features: All Systems Operational
📊 Performance: MAXIMUM SPEED
🌍 Environment: ${window.location.hostname}
💚 Made with love for farmers
🌱 ===================================
`);

if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`⚡ Page Load Time: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms (OPTIMIZED)`);
        }, 0);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FarmQuestApp;
}

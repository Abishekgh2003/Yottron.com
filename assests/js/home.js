// ============================================
// GLOBAL UTILITY FUNCTIONS
// ============================================

function globalThrottle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func.apply(this, args);
    };
}

function globalDebounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ============================================
// GLOBAL SCROLL PERFORMANCE OPTIMIZATION
// ============================================

let globalScrollTimeout;
let globalScrollTicking = false;

window.addEventListener('scroll', () => {
    if (!globalScrollTicking) {
        window.requestAnimationFrame(() => {
            document.body.classList.add('is-scrolling');
            globalScrollTicking = false;
        });
        globalScrollTicking = true;
    }
    
    clearTimeout(globalScrollTimeout);
    globalScrollTimeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
    }, 150);
}, { passive: true });

// ============================================
// CAROUSEL ONE (MAIN HERO SLIDER)
// ============================================

class HeroCarouselController {
    constructor() {
        this.heroCurrentSlide = 0;
        this.heroTotalSlides = 4;
        this.heroWrapper = document.getElementById('CarouselOneWrapper');
        this.heroContainer = document.querySelector('.CarouselOne-container');
        this.heroIndicators = document.querySelectorAll('.indicator');
        this.heroSlides = document.querySelectorAll('.Sculpting');
        this.heroAutoSlideInterval = null;
        this.heroIsTransitioning = false;
        this.heroSlideDirection = 'next';
        this.heroIsReversing = false;
        
        this.heroInit();
    }
    
    heroInit() {
        if (!this.heroWrapper || !this.heroContainer) return;
        
        // Set first slide as active
        this.heroSlides[0].classList.add('active');
        
        // Setup event listeners
        this.heroSetupEventListeners();
        
        // Start auto-slide
        this.heroStartAutoSlide();
    }
    
    heroUpdateCarousel(animate = true) {
        if (animate) {
            this.heroWrapper.classList.add('transitioning');
            this.heroWrapper.classList.add(this.heroSlideDirection === 'next' ? 'slide-left' : 'slide-right');
        } else {
            this.heroWrapper.classList.remove('transitioning', 'slide-left', 'slide-right');
        }
        
        // Update transform
        this.heroWrapper.style.transform = `translateX(-${this.heroCurrentSlide * 100}%)`;
        
        // Batch DOM updates using requestAnimationFrame
        requestAnimationFrame(() => {
            // Update indicators
            this.heroIndicators.forEach((indicator, index) => {
                const isActive = index === this.heroCurrentSlide;
                indicator.classList.toggle('active', isActive);
                
                if (isActive) {
                    indicator.classList.add('clicked');
                    setTimeout(() => indicator.classList.remove('clicked'), 600);
                }
            });
            
            // Update slides
            this.heroSlides.forEach((slide, index) => {
                slide.classList.toggle('active', index === this.heroCurrentSlide);
            });
        });
        
        // Cleanup transition classes
        if (animate) {
            setTimeout(() => {
                this.heroWrapper.classList.remove('slide-left', 'slide-right');
            }, 900);
        }
    }
    
    heroAutoAdvanceSlide() {
        if (this.heroIsTransitioning) return;
        
        this.heroIsTransitioning = true;
        
        if (!this.heroIsReversing) {
            this.heroSlideDirection = 'next';
            if (this.heroCurrentSlide < this.heroTotalSlides - 1) {
                this.heroCurrentSlide++;
            } else {
                this.heroIsReversing = true;
                this.heroCurrentSlide--;
            }
        } else {
            this.heroSlideDirection = 'prev';
            if (this.heroCurrentSlide > 0) {
                this.heroCurrentSlide--;
            } else {
                this.heroIsReversing = false;
                this.heroCurrentSlide++;
            }
        }
        
        this.heroUpdateCarousel(true);
        
        setTimeout(() => {
            this.heroIsTransitioning = false;
        }, 900);
    }
    
    heroNavigateNext() {
        if (this.heroIsTransitioning) return;
        
        this.heroIsTransitioning = true;
        this.heroSlideDirection = 'next';
        
        if (this.heroCurrentSlide < this.heroTotalSlides - 1) {
            this.heroCurrentSlide++;
            this.heroIsReversing = false;
        } else {
            this.heroCurrentSlide = 0;
            this.heroIsReversing = false;
        }
        
        this.heroUpdateCarousel(true);
        
        setTimeout(() => {
            this.heroIsTransitioning = false;
        }, 900);
        
        this.heroResetAutoSlide();
    }
    
    heroNavigatePrev() {
        if (this.heroIsTransitioning) return;
        
        this.heroIsTransitioning = true;
        this.heroSlideDirection = 'prev';
        
        if (this.heroCurrentSlide > 0) {
            this.heroCurrentSlide--;
        } else {
            this.heroCurrentSlide = this.heroTotalSlides - 1;
        }
        
        this.heroIsReversing = true;
        this.heroUpdateCarousel(true);
        
        setTimeout(() => {
            this.heroIsTransitioning = false;
        }, 900);
        
        this.heroResetAutoSlide();
    }
    
    heroNavigateToSlide(index) {
        if (this.heroIsTransitioning || index === this.heroCurrentSlide) return;
        
        this.heroIsTransitioning = true;
        this.heroSlideDirection = index > this.heroCurrentSlide ? 'next' : 'prev';
        this.heroCurrentSlide = index;
        this.heroIsReversing = false;
        
        this.heroUpdateCarousel(true);
        
        setTimeout(() => {
            this.heroIsTransitioning = false;
        }, 900);
        
        this.heroResetAutoSlide();
    }
    
    heroStartAutoSlide() {
        this.heroStopAutoSlide();
        this.heroAutoSlideInterval = setInterval(() => this.heroAutoAdvanceSlide(), 5000);
    }
    
    heroStopAutoSlide() {
        if (this.heroAutoSlideInterval) {
            clearInterval(this.heroAutoSlideInterval);
            this.heroAutoSlideInterval = null;
        }
    }
    
    heroResetAutoSlide() {
        this.heroStopAutoSlide();
        this.heroStartAutoSlide();
    }
    
    heroSetupEventListeners() {
        // Navigation buttons
        const heroNextBtn = document.querySelector('.CarouselOne-nav.next');
        const heroPrevBtn = document.querySelector('.CarouselOne-nav.prev');
        
        if (heroNextBtn) heroNextBtn.addEventListener('click', () => this.heroNavigateNext());
        if (heroPrevBtn) heroPrevBtn.addEventListener('click', () => this.heroNavigatePrev());
        
        // Indicators
        this.heroIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.heroNavigateToSlide(index));
        });
        
        // Pause on hover
        this.heroContainer.addEventListener('mouseenter', () => this.heroStopAutoSlide(), { passive: true });
        this.heroContainer.addEventListener('mouseleave', () => this.heroStartAutoSlide(), { passive: true });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.heroNavigatePrev();
            else if (e.key === 'ArrowRight') this.heroNavigateNext();
        });
        
        // Touch support
        let heroTouchStartX = 0;
        let heroTouchEndX = 0;
        
        this.heroContainer.addEventListener('touchstart', (e) => {
            heroTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.heroContainer.addEventListener('touchend', (e) => {
            heroTouchEndX = e.changedTouches[0].screenX;
            const heroTouchDistance = Math.abs(heroTouchStartX - heroTouchEndX);
            
            if (heroTouchDistance > 50) {
                if (heroTouchStartX - heroTouchEndX > 50) this.heroNavigateNext();
                else if (heroTouchEndX - heroTouchStartX > 50) this.heroNavigatePrev();
            }
        }, { passive: true });
        
        // Parallax effect (throttled and only on desktop)
        if (window.innerWidth > 768) {
            const heroThrottledParallax = globalThrottle((e) => {
                const heroActiveSlide = this.heroSlides[this.heroCurrentSlide];
                if (!heroActiveSlide) return;
                
                const heroRect = this.heroContainer.getBoundingClientRect();
                const heroX = (e.clientX - heroRect.left) / heroRect.width - 0.5;
                const heroY = (e.clientY - heroRect.top) / heroRect.height - 0.5;
                
                const heroTitle = heroActiveSlide.querySelector('.Sculpting-title');
                
                if (heroTitle) {
                    requestAnimationFrame(() => {
                        heroTitle.style.transform = `translateX(${heroX * 20}px) translateY(${heroY * 20}px)`;
                    });
                }
            }, 100);
            
            this.heroContainer.addEventListener('mousemove', heroThrottledParallax);
            
            this.heroContainer.addEventListener('mouseleave', () => {
                const heroActiveSlide = this.heroSlides[this.heroCurrentSlide];
                if (!heroActiveSlide) return;
                
                const heroTitle = heroActiveSlide.querySelector('.Sculpting-title');
                if (heroTitle) {
                    requestAnimationFrame(() => {
                        heroTitle.style.transform = '';
                    });
                }
            });
        }
        
        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.heroStopAutoSlide();
            } else {
                this.heroStartAutoSlide();
            }
        });
    }
}

// Global functions for HTML onclick attributes
window.nextSlide = function() {
    if (window.heroCarouselInstance) window.heroCarouselInstance.heroNavigateNext();
};

window.prevSlide = function() {
    if (window.heroCarouselInstance) window.heroCarouselInstance.heroNavigatePrev();
};

window.goToSlide = function(index) {
    if (window.heroCarouselInstance) window.heroCarouselInstance.heroNavigateToSlide(index);
};



// ============================================
// TRUST SECTION CAROUSEL
// ============================================

const trustCarouselDataset = [
    {
        title: 'AI Solutions',
        content: 'Advanced AI technologies that automate workflows, enhance intelligence, and drive smarter business outcomes through innovation.',
        image: '../assests/images/Home/t2.jpg',
        leftTitle: 'AI-Powered Innovation.',
        leftDescription: 'Transform your business with artificial intelligence solutions. From predictive analytics to natural language processing, we develop AI systems that automate processes, enhance decision-making, and new opportunities for innovation.',
        buttonLink: '/machinelearning-artificialintelligence'
    },
    {
        title: 'Cloud Services',
        content: 'Enterprise-grade cloud infrastructure engineered for scalability, security, and seamless high-performance operations.',
        image: '../assests/images/Home/t3.jpg',
        leftTitle: 'Cloud Excellence.',
        leftDescription: 'Migrate, optimize, and scale with our robust cloud solutions. We design and manage secure infrastructures on AWS, Azure, and Google Cloud to ensure maximum uptime, flexibility, and efficiency across all cross platforms.',
        buttonLink: '/cloudmigrations-cloudsolutions'
    },
    {
        title: 'IoT Integration',
        content: 'Smart connectivity that unites devices, data, and intelligence to enable real-time business insights and automation.',
        image: '../assests/images/Home/t4.jpg',
        leftTitle: 'Connected Intelligence.',
        leftDescription: 'Bridge the physical and digital worlds with our IoT integration expertise. We connect devices, sensors, and systems to create intelligent and that deliver real-time data, automate workflows, and power informed business decisions.',
        buttonLink: '/embeddedsoftware-IoT'
    },
    {
        title: 'Mobile Development',
        content: 'High-performing native and cross-platform mobile apps designed for seamless user engagement and experience.',
        image: '../assests/images/Home/t5.jpg',
        leftTitle: 'Mobile-First Solutions.',
        leftDescription: 'Engage your audience anywhere with feature-rich mobile applications. Our expert developers build native iOS and Android apps, as well as cross-platform solutions using React Native and Flutter, ensuring speed, style, and scalability.',
        buttonLink: '/mobileappdevelopment'
    },
    {
        title: 'Cybersecurity',
        content: 'Robust digital protection strategies ensuring complete data privacy, threat resilience, and comprehensive security.',
        image: '../assests/images/Home/bg9.jpg',
        leftTitle: 'Security First.',
        leftDescription: 'Safeguard your business with enterprise-grade cybersecurity services. We deliver proactive defense through penetration testing, threat detection, compliance audits, and incident response to ensure your data stay secure.',
        buttonLink: '/cybersecurityservice'
    },
    {
        title: 'Data Analytics',
        content: 'Powerful analytics solutions that turn raw data into actionable business intelligence and strategic insights.',
        image: '../assests/images/Home/t6.jpg',
        leftTitle: 'Data-Driven Decisions.',
        leftDescription: 'Unlock full potential of data with our advanced analytics solutions. We design intelligent dashboards and predictive models that help organizations identify trends, measure performance, and make data-backed business decisions.',
        buttonLink: '/datavisualization'
    },
    {
        title: 'Web Development',
        content: 'Modern, responsive, and performance-driven websites that elevate your digital presence and user engagement.',
        image: '../assests/images/Home/t7.jpg',
        leftTitle: 'Digital Experiences.',
        leftDescription: 'Build stunning and technically sound web experiences with our expertise. We use frameworks like React, Vue, and Angular to craft responsive, fast-loading, and conversion-focused websites that drive measurable business results.',
        buttonLink: '/softwaredevelopment'
    },
    {
        title: 'DevOps Services',
        content: 'Streamlined development and deployment pipelines that enhance speed, quality, reliability, and team collaboration.',
        image: '../assests/images/Home/t8.jpg',
        leftTitle: 'Accelerate Delivery.',
        leftDescription: 'Accelerate your software lifecycle with our DevOps expertise. We implement CI/CD pipelines, containerization, infrastructure, and automated monitoring to improve collaboration, reduce downtime, and enable rapid delivery.',
        buttonLink: '/bigdata'
    }
];

class TrustSectionCarousel {
    constructor() {
        this.trustMaxVisibility = 3;
        this.trustActiveIndex = 2;
        this.trustIsTransitioning = false;
        this.trustAutoInterval = null;
        this.trustIsPaused = false;
        
        this.trustCarouselElement = document.getElementById('carousel');
        this.trustNavLeft = document.getElementById('navLeft');
        this.trustNavRight = document.getElementById('navRight');
        this.trustPauseBtn = document.getElementById('pauseBtn');
        this.trustLeftTitle = document.getElementById('leftTitle');
        this.trustLeftDescription = document.getElementById('leftDescription');
        this.trustViewAllBtn = document.getElementById('viewAllBtn');
        
        this.trustInit();
    }
    
    trustInit() {
        if (!this.trustCarouselElement) return;
        
        this.trustCreateCards();
        this.trustUpdateCarousel();
        this.trustSetupEventListeners();
        this.trustStartAuto();
    }
    
    trustCreateCards() {
        trustCarouselDataset.forEach((data, index) => {
            const trustCardContainer = document.createElement('div');
            trustCardContainer.className = 'card-container';
            trustCardContainer.setAttribute('data-trust-card', 'true'); // Mark as trust card
            trustCardContainer.innerHTML = `
                <div class="card">
                    <img src="${data.image}" alt="${data.title}">
                    <h2>${data.title}</h2>
                    <p>${data.content}</p>
                </div>
            `;
            this.trustCarouselElement.insertBefore(trustCardContainer, this.trustNavLeft);
        });
    }
    
    trustUpdateCarousel() {
        // Only select trust cards within the carousel
        const trustCards = this.trustCarouselElement.querySelectorAll('.card-container[data-trust-card="true"]');
        
        if (trustCards.length === 0) {
            console.error('Trust Carousel: No cards found');
            return;
        }
        
        // Update left content with fade animation
        if (this.trustLeftTitle && this.trustLeftDescription) {
            this.trustLeftTitle.classList.add('fade-out');
            this.trustLeftDescription.classList.add('fade-out');
            
            if (this.trustViewAllBtn) {
                this.trustViewAllBtn.classList.add('eloiacs-btn-animate');
            }
            
            setTimeout(() => {
                const trustActiveData = trustCarouselDataset[this.trustActiveIndex];
                this.trustLeftTitle.textContent = trustActiveData.leftTitle;
                this.trustLeftDescription.textContent = trustActiveData.leftDescription;
                
                if (this.trustViewAllBtn) {
                    this.trustViewAllBtn.href = trustActiveData.buttonLink;
                    setTimeout(() => {
                        this.trustViewAllBtn.classList.remove('eloiacs-btn-animate');
                    }, 500);
                }
                
                this.trustLeftTitle.classList.remove('fade-out');
                this.trustLeftDescription.classList.remove('fade-out');
                this.trustLeftTitle.classList.add('fade-in');
                this.trustLeftDescription.classList.add('fade-in');
                
                setTimeout(() => {
                    this.trustLeftTitle.classList.remove('fade-in');
                    this.trustLeftDescription.classList.remove('fade-in');
                }, 300);
            }, 150);
        }
        
        // Update card positions
        trustCards.forEach((card, i) => {
            const trustOffset = (this.trustActiveIndex - i) / 3;
            const trustDirection = Math.sign(this.trustActiveIndex - i);
            const trustAbsOffset = Math.abs(this.trustActiveIndex - i) / 3;
            const trustIsActive = i === this.trustActiveIndex ? 1 : 0;

            card.style.setProperty('--active', trustIsActive);
            card.style.setProperty('--offset', trustOffset);
            card.style.setProperty('--direction', trustDirection);
            card.style.setProperty('--abs-offset', trustAbsOffset);
            card.style.opacity = Math.abs(this.trustActiveIndex - i) >= this.trustMaxVisibility ? '0' : '1';
            card.style.display = Math.abs(this.trustActiveIndex - i) > this.trustMaxVisibility ? 'none' : 'block';
            
            card.classList.toggle('active', i === this.trustActiveIndex);
        });
    }
    
    trustNavigateNext() {
        this.trustActiveIndex = (this.trustActiveIndex + 1) % trustCarouselDataset.length;
        this.trustUpdateCarousel();
    }
    
    trustNavigatePrev() {
        this.trustActiveIndex = (this.trustActiveIndex - 1 + trustCarouselDataset.length) % trustCarouselDataset.length;
        this.trustUpdateCarousel();
    }
    
    trustStartAuto() {
        this.trustStopAuto();
        if (!this.trustIsPaused) {
            this.trustAutoInterval = setInterval(() => this.trustNavigateNext(), 3000);
        }
    }
    
    trustStopAuto() {
        if (this.trustAutoInterval) {
            clearInterval(this.trustAutoInterval);
            this.trustAutoInterval = null;
        }
    }
    
    trustResetAuto() {
        this.trustStopAuto();
        if (!this.trustIsPaused) {
            this.trustStartAuto();
        }
    }
    
    trustTogglePause() {
        this.trustIsPaused = !this.trustIsPaused;
        const trustPauseIcon = this.trustPauseBtn.querySelector('i');
        
        if (this.trustIsPaused) {
            this.trustStopAuto();
            trustPauseIcon.classList.remove('fa-pause');
            trustPauseIcon.classList.add('fa-play');
        } else {
            trustPauseIcon.classList.remove('fa-play');
            trustPauseIcon.classList.add('fa-pause');
            this.trustStartAuto();
        }
    }
    
    trustSetupEventListeners() {
        if (this.trustNavLeft) {
            this.trustNavLeft.addEventListener('click', () => {
                this.trustNavigatePrev();
                this.trustResetAuto();
            });
        }
        
        if (this.trustNavRight) {
            this.trustNavRight.addEventListener('click', () => {
                this.trustNavigateNext();
                this.trustResetAuto();
            });
        }
        
        if (this.trustPauseBtn) {
            this.trustPauseBtn.addEventListener('click', () => this.trustTogglePause());
        }
        
        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trustStopAuto();
            } else if (!this.trustIsPaused) {
                this.trustStartAuto();
            }
        });
    }
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================

function statsAnimateCounter(element) {
    const statsTarget = parseInt(element.getAttribute('data-target'));
    const statsDuration = 1500;
    const statsIncrement = statsTarget / (statsDuration / 16);
    let statsCurrent = 0;

    function statsUpdateCounter() {
        statsCurrent += statsIncrement;
        if (statsCurrent >= statsTarget) {
            element.textContent = statsTarget + '+';
            return;
        }
        element.textContent = Math.floor(statsCurrent);
        requestAnimationFrame(statsUpdateCounter);
    }
    
    requestAnimationFrame(statsUpdateCounter);
}

// ============================================
// INTERSECTION OBSERVERS
// ============================================

const statsIntersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statsCounters = entry.target.querySelectorAll('.stat-number');
            statsCounters.forEach(counter => {
                if (counter.textContent === '0') {
                    statsAnimateCounter(counter);
                }
            });
            statsIntersectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const featureCardIntersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            featureCardIntersectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Home Page Components...');
    
    // Initialize main hero carousel
    try {
        window.heroCarouselInstance = new HeroCarouselController();
        console.log('✅ Hero Carousel initialized');
    } catch (error) {
        console.error('❌ Hero Carousel initialization failed:', error);
    }
    
    // Initialize services horizontal slider (OPTIONAL - can be removed)
    try {
        const servicesSection = document.querySelector('.services-cards-container');
        if (servicesSection) {
            window.servicesSliderInstance = new ServicesHorizontalSlider();
            console.log('✅ Services Slider initialized');
        } else {
            console.log('⚠️ Services section not found - skipping initialization');
        }
    } catch (error) {
        console.error('❌ Services Slider initialization failed:', error);
    }
    
    // Initialize trust section carousel (INDEPENDENT)
    try {
        const trustCarousel = document.getElementById('carousel');
        if (trustCarousel) {
            window.trustCarouselInstance = new TrustSectionCarousel();
            console.log('✅ Trust Carousel initialized');
        } else {
            console.error('❌ Trust Carousel element #carousel not found in DOM');
        }
    } catch (error) {
        console.error('❌ Trust Carousel initialization failed:', error);
    }
    
    // Setup stats observer (INDEPENDENT)
    try {
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            statsIntersectionObserver.observe(statsSection);
            console.log('✅ Stats Observer initialized');
        } else {
            console.log('⚠️ Stats section not found - skipping initialization');
        }
    } catch (error) {
        console.error('❌ Stats Observer initialization failed:', error);
    }
    
    // Setup feature cards animation (INDEPENDENT)
    try {
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length > 0) {
            featureCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease';
                featureCardIntersectionObserver.observe(card);
            });
            console.log(`✅ Feature Cards animation initialized (${featureCards.length} cards)`);
        } else {
            console.log('⚠️ No feature cards found - skipping animation');
        }
    } catch (error) {
        console.error('❌ Feature Cards initialization failed:', error);
    }
    
    console.log('✨ All components initialization complete');
});
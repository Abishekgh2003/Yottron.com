// ============================================
// UTILITY FUNCTIONS FOR PERFORMANCE
// ============================================

function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func.apply(this, args);
    };
}

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ============================================
// SCROLL PERFORMANCE OPTIMIZATION
// ============================================

let scrollTimeout;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            document.body.classList.add('is-scrolling');
            ticking = false;
        });
        ticking = true;
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
    }, 150);
}, { passive: true });

// ============================================
// CAROUSEL ONE (MAIN SLIDER)
// ============================================

class CarouselOne {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.wrapper = document.getElementById('CarouselOneWrapper');
        this.container = document.querySelector('.CarouselOne-container');
        this.indicators = document.querySelectorAll('.indicator');
        this.slides = document.querySelectorAll('.Sculpting');
        this.autoSlideInterval = null;
        this.isTransitioning = false;
        this.slideDirection = 'next';
        this.isReversing = false;
        
        this.init();
    }
    
    init() {
        if (!this.wrapper || !this.container) return;
        
        // Set first slide as active
        this.slides[0].classList.add('active');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start auto-slide
        this.startAutoSlide();
    }
    
    updateCarousel(animate = true) {
        if (animate) {
            this.wrapper.classList.add('transitioning');
            this.wrapper.classList.add(this.slideDirection === 'next' ? 'slide-left' : 'slide-right');
        } else {
            this.wrapper.classList.remove('transitioning', 'slide-left', 'slide-right');
        }
        
        // Update transform
        this.wrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Batch DOM updates using requestAnimationFrame
        requestAnimationFrame(() => {
            // Update indicators
            this.indicators.forEach((indicator, index) => {
                const isActive = index === this.currentSlide;
                indicator.classList.toggle('active', isActive);
                
                if (isActive) {
                    indicator.classList.add('clicked');
                    setTimeout(() => indicator.classList.remove('clicked'), 600);
                }
            });
            
            // Update slides
            this.slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === this.currentSlide);
            });
        });
        
        // Cleanup transition classes
        if (animate) {
            setTimeout(() => {
                this.wrapper.classList.remove('slide-left', 'slide-right');
            }, 900);
        }
    }
    
    autoAdvanceSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        if (!this.isReversing) {
            this.slideDirection = 'next';
            if (this.currentSlide < this.totalSlides - 1) {
                this.currentSlide++;
            } else {
                this.isReversing = true;
                this.currentSlide--;
            }
        } else {
            this.slideDirection = 'prev';
            if (this.currentSlide > 0) {
                this.currentSlide--;
            } else {
                this.isReversing = false;
                this.currentSlide++;
            }
        }
        
        this.updateCarousel(true);
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 900);
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.slideDirection = 'next';
        
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.isReversing = false;
        } else {
            this.currentSlide = 0;
            this.isReversing = false;
        }
        
        this.updateCarousel(true);
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 900);
        
        this.resetAutoSlide();
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.slideDirection = 'prev';
        
        if (this.currentSlide > 0) {
            this.currentSlide--;
        } else {
            this.currentSlide = this.totalSlides - 1;
        }
        
        this.isReversing = true;
        this.updateCarousel(true);
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 900);
        
        this.resetAutoSlide();
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.isTransitioning = true;
        this.slideDirection = index > this.currentSlide ? 'next' : 'prev';
        this.currentSlide = index;
        this.isReversing = false;
        
        this.updateCarousel(true);
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 900);
        
        this.resetAutoSlide();
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => this.autoAdvanceSlide(), 5000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
    
    setupEventListeners() {
        // Navigation buttons
        const nextBtn = document.querySelector('.CarouselOne-nav.next');
        const prevBtn = document.querySelector('.CarouselOne-nav.prev');
        
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoSlide(), { passive: true });
        this.container.addEventListener('mouseleave', () => this.startAutoSlide(), { passive: true });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            else if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const touchDistance = Math.abs(touchStartX - touchEndX);
            
            if (touchDistance > 50) {
                if (touchStartX - touchEndX > 50) this.nextSlide();
                else if (touchEndX - touchStartX > 50) this.prevSlide();
            }
        }, { passive: true });
        
        // Parallax effect (throttled and only on desktop)
        if (window.innerWidth > 768) {
            const throttledParallax = throttle((e) => {
                const activeSlide = this.slides[this.currentSlide];
                if (!activeSlide) return;
                
                const rect = this.container.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                const title = activeSlide.querySelector('.Sculpting-title');
                
                if (title) {
                    requestAnimationFrame(() => {
                        title.style.transform = `translateX(${x * 20}px) translateY(${y * 20}px)`;
                    });
                }
            }, 100);
            
            this.container.addEventListener('mousemove', throttledParallax);
            
            this.container.addEventListener('mouseleave', () => {
                const activeSlide = this.slides[this.currentSlide];
                if (!activeSlide) return;
                
                const title = activeSlide.querySelector('.Sculpting-title');
                if (title) {
                    requestAnimationFrame(() => {
                        title.style.transform = '';
                    });
                }
            });
        }
        
        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoSlide();
            } else {
                this.startAutoSlide();
            }
        });
    }
}

// Make functions global for HTML onclick attributes
window.nextSlide = function() {
    if (window.carousel) window.carousel.nextSlide();
};

window.prevSlide = function() {
    if (window.carousel) window.carousel.prevSlide();
};

window.goToSlide = function(index) {
    if (window.carousel) window.carousel.goToSlide(index);
};

// ============================================
// SERVICES SECTION (HORIZONTAL SCROLL)
// ============================================

class ServicesSlider {
    constructor() {
        this.slider = document.querySelector('.services-cards-container');
        this.isDown = false;
        this.startX = 0;
        this.scrollLeft = 0;
        
        this.init();
    }
    
    init() {
        if (!this.slider) return;
        
        this.slider.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.slider.addEventListener('mouseleave', () => this.handleMouseLeave(), { passive: true });
        this.slider.addEventListener('mouseup', () => this.handleMouseUp(), { passive: true });
        this.slider.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    handleMouseDown(e) {
        this.isDown = true;
        this.slider.classList.add('active');
        this.startX = e.pageX - this.slider.offsetLeft;
        this.scrollLeft = this.slider.scrollLeft;
        this.slider.style.cursor = 'grabbing';
    }
    
    handleMouseLeave() {
        this.isDown = false;
        this.slider.classList.remove('active');
        this.slider.style.cursor = 'grab';
    }
    
    handleMouseUp() {
        this.isDown = false;
        this.slider.classList.remove('active');
        this.slider.style.cursor = 'grab';
    }
    
    handleMouseMove(e) {
        if (!this.isDown) return;
        e.preventDefault();
        const x = e.pageX - this.slider.offsetLeft;
        const walk = (x - this.startX) * 2;
        this.slider.scrollLeft = this.scrollLeft - walk;
    }
}

// ============================================
// TRUST SECTION CAROUSEL
// ============================================

const carouselData = [
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

class TrustCarousel {
    constructor() {
        this.MAX_VISIBILITY = 3;
        this.active = 2;
        this.isTransitioning = false;
        this.autoInterval = null;
        this.isPaused = false;
        
        this.carousel = document.getElementById('carousel');
        this.navLeft = document.getElementById('navLeft');
        this.navRight = document.getElementById('navRight');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.leftTitle = document.getElementById('leftTitle');
        this.leftDescription = document.getElementById('leftDescription');
        this.viewAllBtn = document.getElementById('viewAllBtn');
        
        this.init();
    }
    
    init() {
        if (!this.carousel) return;
        
        this.createCards();
        this.updateCarousel();
        this.setupEventListeners();
        this.startAuto();
    }
    
    createCards() {
        carouselData.forEach((data, index) => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            cardContainer.innerHTML = `
                <div class="card">
                    <img src="${data.image}" alt="${data.title}">
                    <h2>${data.title}</h2>
                    <p>${data.content}</p>
                </div>
            `;
            this.carousel.insertBefore(cardContainer, this.navLeft);
        });
    }
    
    updateCarousel() {
        const cards = document.querySelectorAll('.card-container');
        
        // Update left content with fade animation
        if (this.leftTitle && this.leftDescription) {
            this.leftTitle.classList.add('fade-out');
            this.leftDescription.classList.add('fade-out');
            
            if (this.viewAllBtn) {
                this.viewAllBtn.classList.add('eloiacs-btn-animate');
            }
            
            setTimeout(() => {
                const activeData = carouselData[this.active];
                this.leftTitle.textContent = activeData.leftTitle;
                this.leftDescription.textContent = activeData.leftDescription;
                
                if (this.viewAllBtn) {
                    this.viewAllBtn.href = activeData.buttonLink;
                    setTimeout(() => {
                        this.viewAllBtn.classList.remove('eloiacs-btn-animate');
                    }, 500);
                }
                
                this.leftTitle.classList.remove('fade-out');
                this.leftDescription.classList.remove('fade-out');
                this.leftTitle.classList.add('fade-in');
                this.leftDescription.classList.add('fade-in');
                
                setTimeout(() => {
                    this.leftTitle.classList.remove('fade-in');
                    this.leftDescription.classList.remove('fade-in');
                }, 300);
            }, 150);
        }
        
        // Update card positions
        cards.forEach((card, i) => {
            const offset = (this.active - i) / 3;
            const direction = Math.sign(this.active - i);
            const absOffset = Math.abs(this.active - i) / 3;
            const isActive = i === this.active ? 1 : 0;

            card.style.setProperty('--active', isActive);
            card.style.setProperty('--offset', offset);
            card.style.setProperty('--direction', direction);
            card.style.setProperty('--abs-offset', absOffset);
            card.style.opacity = Math.abs(this.active - i) >= this.MAX_VISIBILITY ? '0' : '1';
            card.style.display = Math.abs(this.active - i) > this.MAX_VISIBILITY ? 'none' : 'block';
            
            card.classList.toggle('active', i === this.active);
        });
    }
    
    next() {
        this.active = (this.active + 1) % carouselData.length;
        this.updateCarousel();
    }
    
    prev() {
        this.active = (this.active - 1 + carouselData.length) % carouselData.length;
        this.updateCarousel();
    }
    
    startAuto() {
        this.stopAuto();
        if (!this.isPaused) {
            this.autoInterval = setInterval(() => this.next(), 3000);
        }
    }
    
    stopAuto() {
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
    }
    
    resetAuto() {
        this.stopAuto();
        if (!this.isPaused) {
            this.startAuto();
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseIcon = this.pauseBtn.querySelector('i');
        
        if (this.isPaused) {
            this.stopAuto();
            pauseIcon.classList.remove('fa-pause');
            pauseIcon.classList.add('fa-play');
        } else {
            pauseIcon.classList.remove('fa-play');
            pauseIcon.classList.add('fa-pause');
            this.startAuto();
        }
    }
    
    setupEventListeners() {
        if (this.navLeft) {
            this.navLeft.addEventListener('click', () => {
                this.prev();
                this.resetAuto();
            });
        }
        
        if (this.navRight) {
            this.navRight.addEventListener('click', () => {
                this.next();
                this.resetAuto();
            });
        }
        
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.togglePause());
        }
        
        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAuto();
            } else if (!this.isPaused) {
                this.startAuto();
            }
        });
    }
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 1500;
    const increment = target / (duration / 16);
    let current = 0;

    function updateCounter() {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            return;
        }
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
    }
    
    requestAnimationFrame(updateCounter);
}

// ============================================
// INTERSECTION OBSERVERS
// ============================================

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                if (counter.textContent === '0') {
                    animateCounter(counter);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize main carousel
    window.carousel = new CarouselOne();
    
    // Initialize services slider
    new ServicesSlider();
    
    // Initialize trust carousel
    new TrustCarousel();
    
    // Setup stats observer
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Setup feature cards animation
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        cardObserver.observe(card);
    });
});
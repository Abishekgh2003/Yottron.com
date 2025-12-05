// CarouselOne - Optimized
let currentSlide = 0;
const totalSlides = 4;
const wrapper = document.getElementById('CarouselOneWrapper');
const carouselContainer = document.querySelector('.CarouselOne-container');
const indicators = document.querySelectorAll('.indicator');
const slides = document.querySelectorAll('.Sculpting');
let autoSlideInterval, isTransitioning = false, isReversing = false, isHovering = false;

slides[0].classList.add('active');

function updateCarouselOne(animate = true) {
    wrapper.classList.toggle('transitioning', animate);
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === currentSlide);
        if (i === currentSlide) {
            ind.classList.add('clicked');
            setTimeout(() => ind.classList.remove('clicked'), 600);
        }
    });
    
    slides.forEach(s => s.classList.remove('active'));
    setTimeout(() => slides[currentSlide].classList.add('active'), 100);
}

function autoAdvanceSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    if (!isReversing) {
        currentSlide < totalSlides - 1 ? currentSlide++ : (isReversing = true, currentSlide--);
    } else {
        currentSlide > 0 ? currentSlide-- : (isReversing = false, currentSlide++);
    }
    
    updateCarouselOne(true);
    setTimeout(() => isTransitioning = false, 1200);
}

function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
    isReversing = false;
    updateCarouselOne(true);
    setTimeout(() => isTransitioning = false, 1200);
    resetAutoSlide();
}

function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
    isReversing = true;
    updateCarouselOne(true);
    setTimeout(() => isTransitioning = false, 1200);
    resetAutoSlide();
}

function goToSlide(index) {
    if (isTransitioning || index === currentSlide) return;
    isTransitioning = true;
    currentSlide = index;
    isReversing = false;
    updateCarouselOne(true);
    setTimeout(() => isTransitioning = false, 1200);
    resetAutoSlide();
}

function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    if (!isHovering) autoSlideInterval = setInterval(autoAdvanceSlide, 5000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

startAutoSlide();

carouselContainer.addEventListener('mouseenter', () => {
    isHovering = true;
    stopAutoSlide();
});

carouselContainer.addEventListener('mouseleave', () => {
    isHovering = false;
    startAutoSlide();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
});

let touchStartX = 0, touchEndX = 0;
carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const dist = Math.abs(touchStartX - touchEndX);
    if (dist > 50) touchStartX - touchEndX > 50 ? nextSlide() : prevSlide();
}, { passive: true });

let parallaxFrame, lastParallaxTime = 0;
carouselContainer.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastParallaxTime < 16) return;
    if (parallaxFrame) cancelAnimationFrame(parallaxFrame);
    
    parallaxFrame = requestAnimationFrame(() => {
        const activeSlide = slides[currentSlide];
        if (!activeSlide) return;
        const rect = carouselContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const title = activeSlide.querySelector('.Sculpting-title');
        if (title) title.style.transform = `translate3d(${x * 20}px, ${y * 20}px, 0)`;
        lastParallaxTime = now;
    });
});

carouselContainer.addEventListener('mouseleave', () => {
    if (parallaxFrame) cancelAnimationFrame(parallaxFrame);
    const activeSlide = slides[currentSlide];
    if (activeSlide) {
        const title = activeSlide.querySelector('.Sculpting-title');
        if (title) title.style.transform = '';
    }
});

// Services Drag Scroll
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.services-cards-container');
    if (!slider) return;
    let isDown = false, startX, scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = 'grabbing';
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        slider.scrollLeft = scrollLeft - (x - startX) * 2;
    });
});


// services section start

    // Drag to scroll functionality for service cards
    document.addEventListener('DOMContentLoaded', function() {
        const slider = document.querySelector('.services-cards-container');
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.cursor = 'grabbing';
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            slider.scrollLeft = scrollLeft - walk;
        });
    });

// services section ends


// trust-section start
const carouselData = [
    {
        title: 'AI Solutions',
        content: 'Advanced AI technologies that automate workflows, enhance intelligence, and drive smarter business outcomes through innovation.',
        image: '../assests/images/Home/t2.jpg',
        leftTitle: 'AI-Powered Innovation.',
        leftDescription: 'Transform your business with cutting-edge artificial intelligence solutions. From predictive analytics to natural language processing, we develop AI systems that automate processes, enhance decision-making, and unlock new opportunities for growth and innovation.',
        buttonLink: '/machinelearning-artificialintelligence'
    },
    {
        title: 'Cloud Services',
        content: 'Enterprise-grade cloud infrastructure engineered for scalability, security, and seamless high-performance operations.',
        image: '../assests/images/Home/t3.jpg',
        leftTitle: 'Cloud Excellence.',
        leftDescription: 'Migrate, optimize, and scale with confidence using our robust cloud solutions. We design and manage secure infrastructures on AWS, Azure, and Google Cloud to ensure maximum uptime, flexibility, and operational efficiency across all platforms.',
        buttonLink: '/cloudmigrations-cloudsolutions'
    },
    {
        title: 'IoT Integration',
        content: 'Smart connectivity that unites devices, data, and intelligence to enable real-time business insights and automation.',
        image: '../assests/images/Home/t4.jpg',
        leftTitle: 'Connected Intelligence.',
        leftDescription: 'Bridge the physical and digital worlds with our IoT integration expertise. We connect devices, sensors, and systems to create intelligent ecosystems that deliver real-time data, automate workflows, and power informed business decisions.',
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
        leftDescription: 'Safeguard your business with enterprise-grade cybersecurity services. We deliver proactive defense through penetration testing, threat detection, compliance audits, and incident response to ensure your data and systems stay completely secure.',
        buttonLink: '/cybersecurityservice'
    },
    {
        title: 'Data Analytics',
        content: 'Powerful analytics solutions that turn raw data into actionable business intelligence and strategic insights.',
        image: '../assests/images/Home/t6.jpg',
        leftTitle: 'Data-Driven Decisions.',
        leftDescription: 'Unlock the full potential of your data with our advanced analytics solutions. We design intelligent dashboards and predictive models that help organizations identify trends, measure performance, and make data-backed strategic business decisions.',
        buttonLink: '/datavisualization'
    },
    {
        title: 'Web Development',
        content: 'Modern, responsive, and performance-driven websites that elevate your digital presence and user engagement.',
        image: '../assests/images/Home/t7.jpg',
        leftTitle: 'Digital Experiences.',
        leftDescription: 'Build visually stunning and technically sound web experiences with our full-stack expertise. We use frameworks like React, Vue, and Angular to craft responsive, fast-loading, and conversion-focused websites that drive measurable business results.',
        buttonLink: '/softwaredevelopment'
    },
    {
        title: 'DevOps Services',
        content: 'Streamlined development and deployment pipelines that enhance speed, quality, reliability, and team collaboration.',
        image: '../assests/images/Home/t8.jpg',
        leftTitle: 'Accelerate Delivery.',
        leftDescription: 'Accelerate your software lifecycle with our DevOps expertise. We implement CI/CD pipelines, containerization, infrastructure as code, and automated monitoring to improve collaboration, reduce downtime, and enable continuous rapid delivery.',
        buttonLink: '/bigdata'
    }
];

const MAX_VISIBILITY = 3;
let active = 2;
let isCarouselTransitioning = false;
let autoCarouselInterval;
let isPaused = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('carousel');
    const navLeft = document.getElementById('navLeft');
    const navRight = document.getElementById('navRight');
    const pauseBtn = document.getElementById('pauseBtn');
    const carouselWrapper = document.querySelector('.carousel-wrapper');

    // Check if required elements exist
    if (!carousel || !navLeft || !navRight || !pauseBtn || !carouselWrapper) {
        console.error('Required carousel elements not found');
        return;
    }

    function createCards() {
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
            carousel.insertBefore(cardContainer, navLeft);
        });
    }

    function updateCarousel() {
        const cards = document.querySelectorAll('.card-container');
        const leftTitle = document.getElementById('leftTitle');
        const leftDescription = document.getElementById('leftDescription');
        const viewAllBtn = document.getElementById('viewAllBtn');
        
        // Check if text elements exist
        if (!leftTitle || !leftDescription) {
            return;
        }
        
        // Add fade-out animation
        leftTitle.classList.add('fade-out');
        leftDescription.classList.add('fade-out');
        
        // Animate button if it exists
        if (viewAllBtn) {
            viewAllBtn.classList.add('eloiacs-btn-animate');
        }
        
        // Update content after shorter fade-out
        setTimeout(() => {
            const activeData = carouselData[active];
            leftTitle.textContent = activeData.leftTitle;
            leftDescription.textContent = activeData.leftDescription;
            
            // Update button link
            if (viewAllBtn) {
                viewAllBtn.href = activeData.buttonLink;
                // Remove animation class after it completes
                setTimeout(() => {
                    viewAllBtn.classList.remove('eloiacs-btn-animate');
                }, 500);
            }
            
            // Remove fade-out and add fade-in
            leftTitle.classList.remove('fade-out');
            leftDescription.classList.remove('fade-out');
            leftTitle.classList.add('fade-in');
            leftDescription.classList.add('fade-in');
            
            // Remove fade-in class after animation completes
            setTimeout(() => {
                leftTitle.classList.remove('fade-in');
                leftDescription.classList.remove('fade-in');
            }, 300);
        }, 150);
        
        cards.forEach((card, i) => {
            const offset = (active - i) / 3;
            const direction = Math.sign(active - i);
            const absOffset = Math.abs(active - i) / 3;
            const isActive = i === active ? 1 : 0;

            card.style.setProperty('--active', isActive);
            card.style.setProperty('--offset', offset);
            card.style.setProperty('--direction', direction);
            card.style.setProperty('--abs-offset', absOffset);
            card.style.opacity = Math.abs(active - i) >= MAX_VISIBILITY ? '0' : '1';
            card.style.display = Math.abs(active - i) > MAX_VISIBILITY ? 'none' : 'block';
            
            if (i === active) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Always show navigation buttons for looping
        navLeft.style.display = 'flex';
        navRight.style.display = 'flex';
    }

    function nextCarouselSlide() {
        // Loop back to start
        active = (active + 1) % carouselData.length;
        updateCarousel();
    }

    function prevCarouselSlide() {
        // Loop to end if at start
        active = (active - 1 + carouselData.length) % carouselData.length;
        updateCarousel();
    }

    function startAutoCarousel() {
        stopAutoCarousel(); // Always clear first
        if (!isPaused) {
            autoCarouselInterval = setInterval(nextCarouselSlide, 3000);
        }
    }

    function stopAutoCarousel() {
        if (autoCarouselInterval) {
            clearInterval(autoCarouselInterval);
            autoCarouselInterval = null;
        }
    }

    function resetAutoCarousel() {
        stopAutoCarousel();
        if (!isPaused) {
            autoCarouselInterval = setInterval(nextCarouselSlide, 3000);
        }
    }

    function togglePause() {
        isPaused = !isPaused;
        const pauseIcon = pauseBtn.querySelector('i');
        
        if (isPaused) {
            // Stop the carousel
            stopAutoCarousel();
            pauseIcon.classList.remove('fa-pause');
            pauseIcon.classList.add('fa-play');
        } else {
            // Resume the carousel
            pauseIcon.classList.remove('fa-play');
            pauseIcon.classList.add('fa-pause');
            startAutoCarousel();
        }
    }

    pauseBtn.addEventListener('click', togglePause);

    navLeft.addEventListener('click', () => {
        prevCarouselSlide();
        if (!isPaused) {
            resetAutoCarousel();
        }
    });

    navRight.addEventListener('click', () => {
        nextCarouselSlide();
        if (!isPaused) {
            resetAutoCarousel();
        }
    });

    // Initialize
    createCards();
    updateCarousel();
    startAutoCarousel();
});

// trust-section end



// why-choose-section start
        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    element.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        }

        // Intersection Observer for counter animation
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = document.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        if (counter.textContent === '0') {
                            animateCounter(counter);
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }

        // Add scroll animation to feature cards
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

        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            cardObserver.observe(card);
        });


// why-choose-section end

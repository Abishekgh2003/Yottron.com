// CarouselOne-container start

    let currentSlide = 0;
    const totalSlides = 4;
    const wrapper = document.getElementById('CarouselOneWrapper');
    const carouselContainer = document.querySelector('.CarouselOne-container');
    const indicators = document.querySelectorAll('.indicator');
    const slides = document.querySelectorAll('.Sculpting');
    let autoSlideInterval;
    let isTransitioning = false;
    let slideDirection = 'next'; // 'next' = right to left (1->4), 'prev' = left to right (4->1)
    let isReversing = false; // Track if we're in reverse mode (4->1)

    // Initialize first slide as active
    slides[0].classList.add('active');

    function updateCarouselOne(animate = true) {
        if (animate) {
            wrapper.classList.add('transitioning');
            // Add direction class for animations
            wrapper.classList.add(slideDirection === 'next' ? 'slide-left' : 'slide-right');
        } else {
            wrapper.classList.remove('transitioning');
            wrapper.classList.remove('slide-left', 'slide-right');
        }
        
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
            if (index === currentSlide) {
                indicator.classList.add('clicked');
                setTimeout(() => indicator.classList.remove('clicked'), 600);
            }
        });
        
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        setTimeout(() => {
            slides[currentSlide].classList.add('active');
        }, 100);
        
        // Remove direction classes after animation
        if (animate) {
            setTimeout(() => {
                wrapper.classList.remove('slide-left', 'slide-right');
            }, 800);
        }
    }

    function autoAdvanceSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        if (!isReversing) {
            // Moving forward (1->2->3->4)
            slideDirection = 'next';
            
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
            } else {
                // Reached slide 4, switch to reverse mode
                isReversing = true;
                currentSlide--;
            }
        } else {
            // Moving backward (4->3->2->1)
            slideDirection = 'prev';
            
            if (currentSlide > 0) {
                currentSlide--;
            } else {
                // Reached slide 1, switch to forward mode
                isReversing = false;
                currentSlide++;
            }
        }
        
        updateCarouselOne(true);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 1200);
    }

    function nextSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        slideDirection = 'next';
        
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            isReversing = false;
        } else {
            currentSlide = 0;
            isReversing = false;
        }
        
        updateCarouselOne(true);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 1200);
        
        resetAutoSlide();
    }

    function prevSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        slideDirection = 'prev';
        
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = totalSlides - 1;
        }
        
        isReversing = true;
        updateCarouselOne(true);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 1200);
        
        resetAutoSlide();
    }

    function goToSlide(index) {
        if (isTransitioning || index === currentSlide) return;
        
        isTransitioning = true;
        slideDirection = index > currentSlide ? 'next' : 'prev';
        currentSlide = index;
        
        // Determine if we should be in reverse mode based on manual selection
        isReversing = false;
        
        updateCarouselOne(true);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 1200);
        
        resetAutoSlide();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(autoAdvanceSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Start auto-sliding on page load
    startAutoSlide();

    // Pause on hover
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            flashNav('prev');
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            flashNav('next');
        }
    });

    function flashNav(direction) {
        const nav = document.querySelector(`.CarouselOne-nav.${direction}`);
        if (nav) {
            nav.style.transform = 'translateY(-50%) scale(1.2)';
            setTimeout(() => {
                nav.style.transform = '';
            }, 200);
        }
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartTime = Date.now();
    });

    carouselContainer.addEventListener('touchmove', (e) => {
        touchEndX = e.changedTouches[0].screenX;
    });

    carouselContainer.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        const touchDistance = Math.abs(touchStartX - touchEndX);
        
        if (touchDistance > 50) {
            if (touchStartX - touchEndX > 50) {
                nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                prevSlide();
            }
        }
    });

    // Parallax effect on mouse move
    carouselContainer.addEventListener('mousemove', (e) => {
        const activeSlide = slides[currentSlide];
        if (!activeSlide) return;
        
        const rect = carouselContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        const title = activeSlide.querySelector('.Sculpting-title');
        // const description = activeSlide.querySelector('.Sculpting-description');
        
        if (title) {
            title.style.transform = `translateX(${x * 20}px) translateY(${y * 20}px)`;
        }
        // if (description) {
        //     description.style.transform = `translateX(${x * 15}px) translateY(${y * 15}px)`;
        // }
    });

    // Reset parallax when mouse leaves
    carouselContainer.addEventListener('mouseleave', () => {
        const activeSlide = slides[currentSlide];
        if (!activeSlide) return;
        
        const title = activeSlide.querySelector('.Sculpting-title');
        const description = activeSlide.querySelector('.Sculpting-description');
        
        if (title) {
            title.style.transform = '';
        }
        if (description) {
            description.style.transform = '';
        }
    });

// CarouselOne-container end



// trust-section start
        const carouselData = [
            {
                title: 'AI Solutions',
                content: 'Advanced AI technologies that automate workflows, enhance intelligence, and drive smarter business outcomes.',
                image: '../assests/images/Home/t2.jpg',
                leftTitle: 'AI-Powered Innovation.',
                leftDescription: 'Transform your business with cutting-edge artificial intelligence solutions. From predictive analytics to natural language processing, we develop AI systems that automate processes, enhance decision-making, and unlock new opportunities for growth.'
            },
            {
                title: 'Cloud Services',
                content: 'Enterprise-grade cloud infrastructure engineered for scalability, security, and seamless performance.',
                image: '../assests/images/Home/t3.jpg',
                leftTitle: 'Cloud Excellence.',
                leftDescription: 'Migrate, optimize, and scale with confidence using our robust cloud solutions. We design and manage secure infrastructures on AWS, Azure, and Google Cloud to ensure maximum uptime, flexibility, and operational efficiency.'
            },
            {
                title: 'IoT Integration',
                content: 'Smart connectivity that unites devices, data, and intelligence to enable real-time business insights.',
                image: '../assests/images/Home/t4.jpg',
                leftTitle: 'Connected Intelligence.',
                leftDescription: 'Bridge the physical and digital worlds with our IoT integration expertise. We connect devices, sensors, and systems to create intelligent ecosystems that deliver real-time data, automate workflows, and power informed decisions.'
            },
            {
                title: 'Mobile Development',
                content: 'High-performing native and cross-platform mobile apps designed for seamless user engagement.',
                image: '../assests/images/Home/t5.jpg',
                leftTitle: 'Mobile-First Solutions.',
                leftDescription: 'Engage your audience anywhere with feature-rich mobile applications. Our expert developers build native iOS and Android apps, as well as cross-platform solutions using React Native and Flutter, ensuring speed, style, and scalability.'
            },
            {
                title: 'Cybersecurity',
                content: 'Robust digital protection strategies ensuring complete data privacy and threat resilience.',
                image: '../assests/images/Home/bg9.jpg',
                leftTitle: 'Security First.',
                leftDescription: 'Safeguard your business with enterprise-grade cybersecurity services. We deliver proactive defense through penetration testing, threat detection, compliance audits, and incident response, ensuring your data and systems stay secure.'
            },
            {
                title: 'Data Analytics',
                content: 'Powerful analytics solutions that turn raw data into actionable business intelligence.',
                image: '../assests/images/Home/t6.jpg',
                leftTitle: 'Data-Driven Decisions.',
                leftDescription: 'Unlock the full potential of your data with our advanced analytics solutions. We design intelligent dashboards and predictive models that help organizations identify trends, measure performance, and make data-backed strategic decisions.'
            },
            {
                title: 'Web Development',
                content: 'Modern, responsive, and performance-driven websites that elevate your digital presence.',
                image: '../assests/images/Home/t7.jpg',
                leftTitle: 'Digital Experiences.',
                leftDescription: 'Build visually stunning and technically sound web experiences with our full-stack expertise. We use frameworks like React, Vue, and Angular to craft responsive, fast-loading, and conversion-focused websites that drive measurable results.'
            },
            {
                title: 'DevOps Services',
                content: 'Streamlined development and deployment pipelines that enhance speed, quality, and reliability.',
                image: '../assests/images/Home/t8.jpg',
                leftTitle: 'Accelerate Delivery.',
                leftDescription: 'Accelerate your software lifecycle with our DevOps expertise. We implement CI/CD pipelines, containerization, infrastructure as code, and automated monitoring to improve collaboration, reduce downtime, and enable continuous delivery.'
            }
        ];

        const MAX_VISIBILITY = 3;
        let active = 2;
        const carousel = document.getElementById('carousel');
        const navLeft = document.getElementById('navLeft');
        const navRight = document.getElementById('navRight');
        let isCarouselTransitioning = false;
        let autoCarouselInterval;

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
            if (isCarouselTransitioning) return;
            
            isCarouselTransitioning = true;
            
            const cards = document.querySelectorAll('.card-container');
            const leftTitle = document.getElementById('leftTitle');
            const leftDescription = document.getElementById('leftDescription');
            const viewAllBtn = document.getElementById('viewAllBtn');
            
            // Add fade-out animation
            leftTitle.classList.add('fade-out');
            leftDescription.classList.add('fade-out');
            
            // Animate button
            viewAllBtn.classList.add('eloiacs-btn-animate');
            setTimeout(() => {
                viewAllBtn.classList.remove('eloiacs-btn-animate');
            }, 800);
            
            // Update content after fade-out
            setTimeout(() => {
                const activeData = carouselData[active];
                leftTitle.textContent = activeData.leftTitle;
                leftDescription.textContent = activeData.leftDescription;
                
                // Remove fade-out and add fade-in
                leftTitle.classList.remove('fade-out');
                leftDescription.classList.remove('fade-out');
                leftTitle.classList.add('fade-in');
                leftDescription.classList.add('fade-in');
                
                // Remove fade-in class after animation completes
                setTimeout(() => {
                    leftTitle.classList.remove('fade-in');
                    leftDescription.classList.remove('fade-in');
                    isCarouselTransitioning = false;
                }, 600);
            }, 300);
            
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

            navLeft.style.display = active > 0 ? 'flex' : 'none';
            navRight.style.display = active < carouselData.length - 1 ? 'flex' : 'none';
        }

        function nextCarouselSlide() {
            if (isCarouselTransitioning) return;
            
            // Loop back to start
            if (active >= carouselData.length - 1) {
                active = 0;
            } else {
                active++;
            }
            updateCarousel();
        }

        function startAutoCarousel() {
            autoCarouselInterval = setInterval(nextCarouselSlide, 3000); // Auto-slide every 4 seconds
        }

        function resetAutoCarousel() {
            clearInterval(autoCarouselInterval);
            startAutoCarousel();
        }

        navLeft.addEventListener('click', () => {
            if (active > 0 && !isCarouselTransitioning) {
                active--;
                updateCarousel();
                resetAutoCarousel();
            }
        });

        navRight.addEventListener('click', () => {
            if (active < carouselData.length - 1 && !isCarouselTransitioning) {
                active++;
                updateCarousel();
                resetAutoCarousel();
            }
        });

        // Pause on hover
        const carouselWrapper = document.querySelector('.carousel-wrapper');
        carouselWrapper.addEventListener('mouseenter', () => {
            clearInterval(autoCarouselInterval);
        });

        carouselWrapper.addEventListener('mouseleave', () => {
            startAutoCarousel();
        });

        // Pause on touch for mobile devices
        carouselWrapper.addEventListener('touchstart', () => {
            clearInterval(autoCarouselInterval);
        });

        carouselWrapper.addEventListener('touchend', () => {
            resetAutoCarousel();
        });

        // Initialize
        createCards();
        updateCarousel();
        startAutoCarousel(); // Start auto-sliding on page load

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

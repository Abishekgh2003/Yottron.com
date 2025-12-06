       document.addEventListener('DOMContentLoaded', function() {
            // Carousel functionality
            const carouselSlides = document.getElementById('carousel-slides');
            const slides = document.querySelectorAll('.carousel-slide');
            const dots = document.querySelectorAll('.carousel-dot');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            
            let currentIndex = 0;
            const totalSlides = slides.length;

            function updateCarousel() {
                const translateX = -(currentIndex * (100 / totalSlides));
                carouselSlides.style.transform = `translateX(${translateX}%)`;
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
                
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex === totalSlides - 1;
            }

            // Previous button
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });

            // Next button
            nextBtn.addEventListener('click', () => {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            });

            // Dot navigation
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
            });

            // Initialize
            updateCarousel();

            // Auto-advance every 8 seconds
            setInterval(() => {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // Loop back to first slide
                }
                updateCarousel();
            }, 8000);

// Initialize Owl Carousel for Best Practices
$(document).ready(function(){
    $('.practices-carousel').owlCarousel({
        loop: true,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        navText: ['<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>'],
        responsive: {
            0: {
                items: 1,
                margin: 5
            },
            768: {
                items: 2,
                margin: 30
            },
            1024: {
                items: 4,
                margin: 20
            }
        }
    });
});

            // Smooth scrolling and scroll animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe elements for animation
            document.querySelectorAll('.process-step, .tech-category, .feature-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
                observer.observe(el);
            });
            });

         document.addEventListener('DOMContentLoaded', function() {
            const activeReview = document.getElementById('activeReview');
            const prevButton = document.getElementById('prevReview');
            const nextButton = document.getElementById('nextReview');
            const reviewsData = document.querySelectorAll('#reviewsData .review-item');
            
            let currentReview = 0;
            const totalReviews = reviewsData.length;

            function updateReview() {
                const review = reviewsData[currentReview];
                const quote = review.querySelector('.quote').textContent;
                const text = review.querySelector('.text').textContent;
                const name = review.querySelector('.name').textContent;
                const position = review.querySelector('.position').textContent;

                // Add fade effect
                activeReview.style.opacity = '0';
                activeReview.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    activeReview.innerHTML = `
                        <p class="review-quote-large">${quote}</p>
                        <p class="review-text-large">${text}</p>
                        <div class="reviewer-info-main">
                            <h4 class="reviewer-name-main">${name}</h4>
                            <p class="reviewer-position-main">${position}</p>
                        </div>
                    `;
                    
                    activeReview.style.opacity = '1';
                    activeReview.style.transform = 'translateY(0)';
                }, 200);
            }

            prevButton.addEventListener('click', () => {
                currentReview = currentReview > 0 ? currentReview - 1 : totalReviews - 1;
                updateReview();
            });

            nextButton.addEventListener('click', () => {
                currentReview = currentReview < totalReviews - 1 ? currentReview + 1 : 0;
                updateReview();
            });

            // Auto-advance reviews every 7 seconds
            setInterval(() => {
                currentReview = currentReview < totalReviews - 1 ? currentReview + 1 : 0;
                updateReview();
            }, 7000);

            // Touch/swipe support for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            activeReview.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            });

            activeReview.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });

            function handleSwipe() {
                const swipeThreshold = 60;
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe left - next review
                        currentReview = currentReview < totalReviews - 1 ? currentReview + 1 : 0;
                    } else {
                        // Swipe right - previous review
                        currentReview = currentReview > 0 ? currentReview - 1 : totalReviews - 1;
                    }
                    updateReview();
                }
            }

            // Add smooth transitions
            activeReview.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });

        
        
document.addEventListener('DOMContentLoaded', function() {
    const readMoreWrapper = document.querySelector('.read-more-wrapper');
    const featuresExpanded = document.getElementById('featuresExpanded');
    const logoContainer = document.querySelector('.logo-container');
    
    let isExpanded = false;
    
    // Read More/Less Toggle Functionality
    if (readMoreWrapper && featuresExpanded) {
        readMoreWrapper.addEventListener('click', function() {
            isExpanded = !isExpanded;
            const icon = this.querySelector('.read-more-icon');
            const text = this.querySelector('.read-more-text');
            
            if (isExpanded) {
                featuresExpanded.classList.add('expanded');
                icon.style.transform = 'rotate(180deg)';
                text.textContent = 'Read less';
                
                // Animate feature columns
                setTimeout(() => {
                    const featureColumns = document.querySelectorAll('.feature-column');
                    featureColumns.forEach((column, index) => {
                        setTimeout(() => {
                            column.style.opacity = '1';
                            column.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }, 300);
                
            } else {
                featuresExpanded.classList.remove('expanded');
                icon.style.transform = 'rotate(0deg)';
                text.textContent = 'Read more';
            }
        });
    }

    // Enhanced logo hover effect for image
    if (logoContainer) {
        logoContainer.addEventListener('mouseenter', function() {
            const logo = this.querySelector('.company-logo');
            if (logo) {
                logo.style.transform = 'scale(1.1)';
            }
        });
        
        logoContainer.addEventListener('mouseleave', function() {
            const logo = this.querySelector('.company-logo');
            if (logo) {
                logo.style.transform = 'scale(1)';
            }
        });
    }

    // Set initial states for feature columns
    const featureColumns = document.querySelectorAll('.feature-column');
    featureColumns.forEach(column => {
        column.style.opacity = '0';
        column.style.transform = 'translateY(20px)';
        column.style.transition = 'all 0.4s ease';
    });

    // Intersection Observer for section animation
    const whyChooseSection = document.querySelector('.why-choose-section');
    const whyChooseObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const content = entry.target.querySelector('.why-choose-content');
                const visual = entry.target.querySelector('.why-choose-visual');
                
                if (content) {
                    content.style.opacity = '1';
                    content.style.transform = 'translateX(0)';
                }
                
                if (visual) {
                    setTimeout(() => {
                        visual.style.opacity = '1';
                        visual.style.transform = 'translateX(0)';
                    }, 200);
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    // Set initial animation states
    if (whyChooseSection) {
        const content = whyChooseSection.querySelector('.why-choose-content');
        const visual = whyChooseSection.querySelector('.why-choose-visual');
        
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateX(-50px)';
            content.style.transition = 'all 0.8s ease';
        }
        
        if (visual) {
            visual.style.opacity = '0';
            visual.style.transform = 'translateX(50px)';
            visual.style.transition = 'all 0.8s ease';
        }
        
        whyChooseObserver.observe(whyChooseSection);
    }
});
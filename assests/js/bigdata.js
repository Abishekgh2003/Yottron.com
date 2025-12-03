$(document).ready(function(){
            $('.bigdata-carousel').owlCarousel({
                loop: true,
                margin: 15,
                nav: true,
                dots: false,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 2
                    },
                    992: {
                        items: 3
                    },
                    1207: {
                        items: 4
                    }
                }
            });
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
document.addEventListener("DOMContentLoaded", () => {

    // ========== SERVICE CARDS ACCORDION ==========
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach(card => {
        card.addEventListener("click", () => {
            const isActive = card.classList.contains("active");

            // Close all cards
            serviceCards.forEach(c => c.classList.remove("active"));

            // Toggle clicked card
            if (!isActive) {
                card.classList.add("active");
            }
        });
    });

    // ========== FADE IN ANIMATIONS ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach(el => fadeObserver.observe(el));

    // ========== STATS COUNTER ANIMATION ==========
    const counters = document.querySelectorAll(".stat-number");
    const speed = 200;

    const animateCounter = (counter) => {
        const targetText = counter.textContent;
        const isPercentage = targetText.includes("%");
        const targetValue = parseInt(targetText.replace(/\D/g, ""));
        let current = 0;
        const increment = targetValue / speed;

        const updateCounter = () => {
            current += increment;
            if (current < targetValue) {
                counter.textContent = Math.ceil(current) + (isPercentage ? "%" : "+");
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = targetText;
            }
        };
        updateCounter();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => statsObserver.observe(counter));

    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // ========== MISSION CARDS CAROUSEL ==========
    const cardSets = [
        {
            cards: [
                {
                    title: "How does Yottron achieve its goal?",
                    content: "We have created DaVinci, a platform dedicated to improving Yottron's processes across the entire organization. This comprehensive system integrates project management, quality assurance, and continuous improvement methodologies to ensure consistent delivery of high-quality software solutions."
                },
                {
                    title: "How will a mature industry benefit its clients?",
                    content: "A mature software industry delivers reliable, affordable custom software faster for businesses. Clients benefit from predictable timelines, transparent pricing, and consistent quality standards that reduce risk and maximize return on investment in technology solutions."
                }
            ]
        },
        {
            cards: [
                {
                    title: "Our Development Philosophy",
                    content: "We embrace agile methodologies to ensure rapid delivery without compromising quality. Our iterative approach allows for continuous client feedback and adaptation, ensuring the final product perfectly aligns with business objectives and user needs."
                },
                {
                    title: "Technology Excellence",
                    content: "We stay at the forefront of technology trends, continuously upgrading our skills and tools to provide cutting-edge solutions. Our team members regularly participate in training, certifications, and industry conferences to maintain expertise in the latest frameworks and best practices."
                }
            ]
        },
        {
            cards: [
                {
                    title: "Client Partnership Approach",
                    content: "We believe in building long-term partnerships with our clients through collaboration and trust. By understanding your business deeply and aligning our success with yours, we become true technology partners invested in your growth and competitive advantage."
                },
                {
                    title: "Quality Assurance Standards",
                    content: "Quality is embedded in every step through comprehensive testing, rigorous code reviews, and continuous integration practices. Our multi-layered quality assurance process ensures bugs are caught early, performance is optimized, and security is maintained throughout the development lifecycle."
                }
            ]
        }
    ];

    let currentSlide = 0;
    const cardsContainer = document.querySelector(".cards-container");
    const dotsContainer = document.getElementById("dotsContainer");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // Update cards display
    function updateCards() {
        if (!cardsContainer) return;
        
        cardsContainer.style.opacity = "0";
        
        setTimeout(() => {
            cardsContainer.innerHTML = "";

            const { cards } = cardSets[currentSlide];
            cards.forEach(card => {
                const cardElement = document.createElement("div");
                cardElement.className = "info-card";
                cardElement.innerHTML = `
                    <div class="card-title">${card.title}</div>
                    <div class="card-content">${card.content}</div>
                `;
                cardsContainer.appendChild(cardElement);
            });

            cardsContainer.style.opacity = "1";
        }, 150);
    }

    // Create navigation dots
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = "";

        cardSets.forEach((_, i) => {
            const dot = document.createElement("div");
            dot.className = "dot" + (i === currentSlide ? " active" : "");
            dot.addEventListener("click", () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    // Update active dot
    function updateDots() {
        document.querySelectorAll(".dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
        });
    }

    // Navigate to specific slide
    function goToSlide(i) {
        currentSlide = i;
        updateCards();
        updateDots();
    }

    // Next and previous slide functions
    const nextSlide = () => goToSlide((currentSlide + 1) % cardSets.length);
    const prevSlide = () => goToSlide((currentSlide - 1 + cardSets.length) % cardSets.length);

    // Event listeners for navigation buttons
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    // Initialize carousel
    updateCards();
    createDots();

    // Auto-advance carousel (optional)
    let autoPlayInterval;
    
    const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoPlay = () => {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    };

    // Start auto-play
    startAutoPlay();

    // Pause auto-play on user interaction
    if (cardsContainer) {
        cardsContainer.addEventListener("mouseenter", stopAutoPlay);
        cardsContainer.addEventListener("mouseleave", startAutoPlay);
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        });
    }

    // ========== KEYBOARD NAVIGATION ==========
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        } else if (e.key === "ArrowRight") {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        }
    });

});
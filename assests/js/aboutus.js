document.addEventListener("DOMContentLoaded", () => {

    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach(card => {
        card.addEventListener("click", () => {
            const isActive = card.classList.contains("active");

            serviceCards.forEach(c => c.classList.remove("active"));

            if (!isActive) {
                card.classList.add("active");
            }
        });
    });


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


    const cardSets = [
        {
            cards: [
                {
                    title: "How does Yottron achieve its goal?",
                    content: "We have created DaVinci, a platform dedicated to improving Yottron's processes across the entire organization..."
                },
                {
                    title: "How will a mature industry benefit its clients?",
                    content: "A mature software industry delivers reliable, affordable custom software faster for businesses..."
                }
            ]
        },
        {
            cards: [
                {
                    title: "Our Development Philosophy",
                    content: "We embrace agile methodologies to ensure rapid delivery without compromising quality..."
                },
                {
                    title: "Technology Excellence",
                    content: "We stay at the forefront of technology trends, continuously upgrading our skills and tools..."
                }
            ]
        },
        {
            cards: [
                {
                    title: "Client Partnership Approach",
                    content: "We believe in building long-term partnerships with our clients through collaboration and trust..."
                },
                {
                    title: "Quality Assurance Standards",
                    content: "Quality is embedded in every step through testing, code reviews, and continuous integration..."
                }
            ]
        }
    ];

    let currentSlide = 0;
    const cardsContainer = document.querySelector(".mission-wrapper .cards-container");
    const dotsContainer = document.getElementById("dotsContainer");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    function updateCards() {
        if (!cardsContainer) return;
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

        // Fade-in transition
        cardsContainer.style.opacity = "0";
        setTimeout(() => (cardsContainer.style.opacity = "1"), 100);
    }

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

    function updateDots() {
        document.querySelectorAll(".dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
        });
    }

    function goToSlide(i) {
        currentSlide = i;
        updateCards();
        updateDots();
    }

    const nextSlide = () => goToSlide((currentSlide + 1) % cardSets.length);
    const prevSlide = () => goToSlide((currentSlide - 1 + cardSets.length) % cardSets.length);

    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    updateCards();
    createDots();


    const industriesTrack = document.getElementById("industriesTrack");
    const industriesPrev = document.getElementById("industriesPrev");
    const industriesNext = document.getElementById("industriesNext");
    const scrollStep = 300;
    let autoScrollInterval;

    const scrollIndustries = (direction) => {
        if (!industriesTrack) return;
        industriesTrack.scrollBy({ left: direction * scrollStep, behavior: "smooth" });
    };

    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollInterval = setInterval(() => {
            const maxScroll = industriesTrack.scrollWidth - industriesTrack.clientWidth;
            if (industriesTrack.scrollLeft >= maxScroll) {
                industriesTrack.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                scrollIndustries(1);
            }
        }, 3000);
    };

    const stopAutoScroll = () => {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
    };

    if (industriesPrev) industriesPrev.addEventListener("click", () => {
        scrollIndustries(-1);
        stopAutoScroll();
        setTimeout(startAutoScroll, 2000);
    });

    if (industriesNext) industriesNext.addEventListener("click", () => {
        scrollIndustries(1);
        stopAutoScroll();
        setTimeout(startAutoScroll, 2000);
    });

    if (industriesTrack) {
        industriesTrack.addEventListener("mouseenter", stopAutoScroll);
        industriesTrack.addEventListener("mouseleave", startAutoScroll);
        startAutoScroll();
    }
});


let ticking = false;
const shapes = document.querySelectorAll('.hero-visual [class^="shape-"]');

function updateParallax() {
    const scrolled = window.pageYOffset;
    shapes.forEach((shape, i) => {
        const speed = 0.15 + (i * 0.05);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
    ticking = false;
}

window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});
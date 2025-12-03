document.addEventListener("DOMContentLoaded", function() {
    const urls = [
        "../commons/header.html",
        "../commons/footer.html",
        "../commons/getintouch.html",
        "../commons/expertise.html"
    ];

    Promise.all(urls.map(url => fetch(url).then(response => response.text())))
        .then(htmls => {
            const selectors = [
                ".nav-container",
                ".footer-section",
                ".common-contactus",
                ".expertise"
            ];
            selectors.forEach((selector, index) => {
                const container = document.querySelector(selector);
                if (container) {
                    container.innerHTML = htmls[index];
                } 
            });

            // Initialize header functionality AFTER content is loaded
            initializeHeader();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});

function initializeHeader() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const categoryToggles = document.querySelectorAll('.category-toggle');

    // Mobile dropdown toggle functionality (Solutions/Industries)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = this.closest('.dropdown');
                const isOpen = dropdown.classList.contains('show');
                
                // Close all dropdowns
                document.querySelectorAll('.dropdown').forEach(dd => {
                    dd.classList.remove('show');
                });
                
                // Toggle current dropdown
                if (!isOpen) {
                    dropdown.classList.add('show');
                }
            }
        });
    });

    // Category toggle functionality (H3 tags - mobile only)
    categoryToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                e.stopPropagation();
                
                const categoryItems = this.nextElementSibling;
                const isOpen = categoryItems.classList.contains('show');
                
                // Close all other categories in the same mega menu
                const megaMenu = this.closest('.mega-menu');
                megaMenu.querySelectorAll('.category-items').forEach(items => {
                    items.classList.remove('show');
                });
                megaMenu.querySelectorAll('.category-toggle').forEach(t => {
                    t.classList.remove('active');
                });
                
                // Toggle current category
                if (!isOpen) {
                    categoryItems.classList.add('show');
                    this.classList.add('active');
                }
            }
        });
    });

    // Navbar toggler animation
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            setTimeout(() => {
                this.classList.toggle('active');
            }, 10);
        });

        // Bootstrap collapse events
        if (navbarCollapse) {
            navbarCollapse.addEventListener('hidden.bs.collapse', function() {
                navbarToggler.classList.remove('active');
                // Close all dropdowns and categories when navbar collapses
                document.querySelectorAll('.dropdown').forEach(dd => {
                    dd.classList.remove('show');
                });
                document.querySelectorAll('.category-items').forEach(items => {
                    items.classList.remove('show');
                });
                document.querySelectorAll('.category-toggle').forEach(toggle => {
                    toggle.classList.remove('active');
                });
            });

            navbarCollapse.addEventListener('shown.bs.collapse', function() {
                navbarToggler.classList.add('active');
            });
        }
    }

    // Close dropdowns when clicking outside (mobile only)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 991) {
            if (!e.target.closest('.dropdown') && !e.target.closest('.category-toggle')) {
                document.querySelectorAll('.dropdown').forEach(dd => {
                    dd.classList.remove('show');
                });
            }
        }
    });

    // Handle window resize - reset states
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            document.querySelectorAll('.dropdown').forEach(dd => {
                dd.classList.remove('show');
            });
            document.querySelectorAll('.category-items').forEach(items => {
                items.classList.remove('show');
            });
            document.querySelectorAll('.category-toggle').forEach(toggle => {
                toggle.classList.remove('active');
            });
        }
    });
}
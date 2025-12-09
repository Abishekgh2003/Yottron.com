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

            // Wait for next tick to ensure DOM is ready
            return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
            // Initialize header functionality AFTER content is loaded
            initializeHeader();
            setActiveNavLink();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});

function setActiveNavLink() {
    // Get current page path
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    // Remove active class from all nav links and menu items
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelectorAll('.mega-menu-item, .industry-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.category-toggle').forEach(toggle => {
        toggle.classList.remove('active');
    });
    
    // Check if current page is a Solutions page
    let foundActive = false;
    document.querySelectorAll('.mega-menu-item').forEach(item => {
        const itemHref = item.getAttribute('href');
        if (itemHref) {
            // Extract page name from href (handles both ../page and /page formats)
            const pageName = itemHref.split('/').pop();
            
            // Check if current page matches this menu item
            if (currentPage === pageName || currentPath.includes('/' + pageName)) {
                item.classList.add('active');
                
                // Find and activate the parent category toggle (h3)
                const categoryToggle = item.closest('.mega-menu-category').querySelector('.category-toggle');
                if (categoryToggle) {
                    categoryToggle.classList.add('active');
                }
                
                // Also activate the Solutions nav link
                const solutionsLink = document.querySelector('.nav-item.dropdown:first-child .nav-link');
                if (solutionsLink) {
                    solutionsLink.classList.add('active');
                }
                foundActive = true;
            }
        }
    });
    
    // If not found in solutions, check Industries pages
    if (!foundActive) {
        document.querySelectorAll('.industry-item').forEach(item => {
            const itemHref = item.getAttribute('href');
            if (itemHref) {
                // Extract page name from href
                const pageName = itemHref.split('/').pop();
                
                // Check if current page matches this menu item
                if (currentPage === pageName || currentPath.includes('/' + pageName)) {
                    item.classList.add('active');
                    // Also activate the Industries nav link
                    const industriesLink = document.querySelector('.nav-item.dropdown:nth-child(2) .nav-link');
                    if (industriesLink) {
                        industriesLink.classList.add('active');
                    }
                    foundActive = true;
                }
            }
        });
    }
    
    // Check for Careers page
    if (!foundActive && (currentPage === 'careers' || currentPath.includes('/careers'))) {
        const careersLink = document.querySelector('a.nav-link[href*="careers"]');
        if (careersLink) {
            careersLink.classList.add('active');
        }
        foundActive = true;
    }
    
    // Check for About page
    if (!foundActive && (currentPage === 'about' || currentPath.includes('/about'))) {
        const aboutLink = document.querySelector('a.nav-link[href*="about"]');
        if (aboutLink) {
            aboutLink.classList.add('active');
        }
        foundActive = true;
    }
    
    // Check for Contact page
    if (!foundActive && (currentPage === 'contactus' || currentPage === 'contact' || currentPath.includes('/contactus'))) {
        const contactLink = document.querySelector('a.nav-link[href*="contactus"]');
        if (contactLink) {
            contactLink.classList.add('active');
        }
        foundActive = true;
    }
    
    // Home page - do nothing, leave all inactive
    // No default active state
}

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
                const toggleIcon = this.querySelector('.toggle-icon');
                const isOpen = categoryItems.classList.contains('show');
                
                // Don't remove the 'active' class if it's from page selection
                // Only toggle the 'show' state for opening/closing
                
                // Close all other categories in the same mega menu
                const megaMenu = this.closest('.mega-menu');
                megaMenu.querySelectorAll('.category-items').forEach(items => {
                    if (items !== categoryItems) {
                        items.classList.remove('show');
                    }
                });
                // Reset all toggle icons in this mega menu
                megaMenu.querySelectorAll('.toggle-icon').forEach(icon => {
                    if (icon !== toggleIcon) {
                        icon.classList.remove('rotated');
                    }
                });
                
                // Toggle current category
                if (!isOpen) {
                    categoryItems.classList.add('show');
                    if (toggleIcon) {
                        toggleIcon.classList.add('rotated');
                    }
                } else {
                    categoryItems.classList.remove('show');
                    if (toggleIcon) {
                        toggleIcon.classList.remove('rotated');
                    }
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
                // Reset all toggle icons rotation
                document.querySelectorAll('.toggle-icon').forEach(icon => {
                    icon.classList.remove('rotated');
                });
                // Enable body scroll when menu closes
                document.body.style.overflow = '';
                // Don't remove 'active' class from category-toggle as it indicates page selection
            });

            navbarCollapse.addEventListener('shown.bs.collapse', function() {
                navbarToggler.classList.add('active');
                // Disable body scroll when menu opens
                document.body.style.overflow = 'hidden';
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
            // Reset all toggle icons rotation
            document.querySelectorAll('.toggle-icon').forEach(icon => {
                icon.classList.remove('rotated');
            });
            // Enable body scroll
            document.body.style.overflow = '';
            // Don't remove 'active' class from category-toggle as it indicates page selection
        }
    });
}
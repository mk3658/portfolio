// Multi-page navigation system
class MultiPageNavigator {
    constructor() {
        this.pages = ['hero', 'about', 'research', 'publications', 'contact'];
        this.currentPageIndex = 0;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.setupPageStructure();
        this.setupNavigation();
        this.setupPageIndicators();
        this.setupPageNavButtons();
        this.showPage('hero');
    }

    setupPageStructure() {
        // Wrap each section in a page container
        this.pages.forEach(pageId => {
            const section = document.getElementById(pageId);
            if (section) {
                const pageWrapper = document.createElement('div');
                pageWrapper.className = 'page';
                pageWrapper.id = `page-${pageId}`;
                
                const pageContent = document.createElement('div');
                pageContent.className = 'page-content';
                
                // Clone the section content
                const sectionClone = section.cloneNode(true);
                pageContent.appendChild(sectionClone);
                pageWrapper.appendChild(pageContent);
                
                // Insert the page wrapper after the original section
                section.parentNode.insertBefore(pageWrapper, section.nextSibling);
                
                // Hide the original section
                section.style.display = 'none';
            }
        });
    }

    setupNavigation() {
        // Update navigation links to work with pages
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const pageId = href.substring(1);
                if (this.pages.includes(pageId)) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.navigateToPage(pageId);
                    });
                }
            }
        });

        // Logo click goes to home
        const logos = document.querySelectorAll('.nav-logo, .footer-logo');
        logos.forEach(logo => {
            logo.addEventListener('click', () => {
                this.navigateToPage('hero');
            });
        });

        // Footer links
        const footerLinks = document.querySelectorAll('.footer-section a[href^="#"]');
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const pageId = href.substring(1);
                if (this.pages.includes(pageId)) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.navigateToPage(pageId);
                    });
                }
            }
        });

        // Hero section buttons
        const heroButtons = document.querySelectorAll('.hero-actions .btn[href^="#"]');
        heroButtons.forEach(button => {
            const href = button.getAttribute('href');
            if (href && href.startsWith('#')) {
                const pageId = href.substring(1);
                if (this.pages.includes(pageId)) {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.navigateToPage(pageId);
                    });
                }
            }
        });
    }

    setupPageIndicators() {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'page-indicators';
        
        this.pages.forEach((pageId, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'page-indicator';
            indicator.setAttribute('data-page', pageId);
            indicator.setAttribute('title', this.getPageTitle(pageId));
            
            indicator.addEventListener('click', () => {
                this.navigateToPage(pageId);
            });
            
            indicatorsContainer.appendChild(indicator);
        });
        
        document.body.appendChild(indicatorsContainer);
    }

    setupPageNavButtons() {
        const navContainer = document.createElement('div');
        navContainer.className = 'page-nav';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-nav-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.id = 'prevPageBtn';
        prevBtn.addEventListener('click', () => this.previousPage());
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-nav-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.id = 'nextPageBtn';
        nextBtn.addEventListener('click', () => this.nextPage());
        
        navContainer.appendChild(prevBtn);
        navContainer.appendChild(nextBtn);
        document.body.appendChild(navContainer);
    }

    navigateToPage(pageId) {
        if (this.isTransitioning) return;
        
        const pageIndex = this.pages.indexOf(pageId);
        if (pageIndex === -1) return;
        
        this.showPage(pageId);
        this.currentPageIndex = pageIndex;
        this.updateNavigation();
        this.updatePageButtons();
        this.updatePageIndicators();
    }

    showPage(pageId) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Hide current page
        const currentPage = document.querySelector('.page.active');
        if (currentPage) {
            currentPage.classList.add('fade-out');
            setTimeout(() => {
                currentPage.classList.remove('active', 'fade-out');
                currentPage.style.display = 'none';
            }, 400);
        }
        
        // Show new page
        setTimeout(() => {
            const newPage = document.getElementById(`page-${pageId}`);
            if (newPage) {
                newPage.style.display = 'block';
                newPage.classList.add('active', 'fade-in');
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                setTimeout(() => {
                    newPage.classList.remove('fade-in');
                    this.isTransitioning = false;
                    
                    // Trigger any page-specific animations
                    this.triggerPageAnimations(pageId);
                }, 600);
            } else {
                this.isTransitioning = false;
            }
        }, currentPage ? 200 : 0);
    }

    triggerPageAnimations(pageId) {
        switch(pageId) {
            case 'hero':
                this.animateStats();
                break;
            case 'research':
                this.animateResearchCards();
                break;
            case 'publications':
                this.animatePublications();
                break;
        }
    }

    nextPage() {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.navigateToPage(this.pages[this.currentPageIndex + 1]);
        }
    }

    previousPage() {
        if (this.currentPageIndex > 0) {
            this.navigateToPage(this.pages[this.currentPageIndex - 1]);
        }
    }

    updateNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${this.pages[this.currentPageIndex]}`) {
                link.classList.add('active');
            }
        });
    }

    updatePageButtons() {
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPageIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPageIndex === this.pages.length - 1;
        }
    }

    updatePageIndicators() {
        const indicators = document.querySelectorAll('.page-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentPageIndex);
        });
    }

    getPageTitle(pageId) {
        const titles = {
            'hero': 'Home',
            'about': 'About Me',
            'research': 'Research',
            'publications': 'Publications',
            'contact': 'Contact'
        };
        return titles[pageId] || pageId;
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('#page-hero .stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const isPercentage = finalValue.includes('%');
            const isPlus = finalValue.includes('+');
            const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
            
            let current = 0;
            const increment = numericValue / 30;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current).toString();
                if (isPercentage) displayValue += '%';
                if (isPlus) displayValue += '+';
                
                stat.textContent = displayValue;
            }, 50);
        });
    }

    animateResearchCards() {
        const cards = document.querySelectorAll('#page-research .research-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animatePublications() {
        const items = document.querySelectorAll('#page-publications .publication-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
}

// Keyboard navigation
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (window.multiPageNav && !window.multiPageNav.isTransitioning) {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    window.multiPageNav.nextPage();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    window.multiPageNav.previousPage();
                    break;
                case 'Home':
                    e.preventDefault();
                    window.multiPageNav.navigateToPage('hero');
                    break;
                case 'End':
                    e.preventDefault();
                    window.multiPageNav.navigateToPage('contact');
                    break;
                case 'Escape':
                    // Close modal if open
                    const modal = document.getElementById('pdfModal');
                    if (modal && modal.style.display === 'block') {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                    break;
            }
        }
    });
}

// Mobile navigation toggle
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--primary-blue)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Enhanced card interactions
function initCardInteractions() {
    const cards = document.querySelectorAll('.research-card, .contact-method');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = 'var(--shadow-xl)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });
    });
}

// Add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .research-card, .contact-method, .page-nav-btn, .page-indicator');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                pointer-events: none;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                z-index: 1;
            `;
            
            if (getComputedStyle(this).position === 'static') {
                this.style.position = 'relative';
            }
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced floating elements animation
function initFloatingElements() {
    const floatingIcons = document.querySelectorAll('.float-icon');
    
    floatingIcons.forEach((icon, index) => {
        const randomDelay = Math.random() * 2;
        icon.style.animationDelay = `${randomDelay}s`;
        
        icon.addEventListener('mouseenter', () => {
            icon.style.animationPlayState = 'paused';
            icon.style.transform = 'scale(1.2)';
            icon.style.opacity = '0.3';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.animationPlayState = 'running';
            icon.style.transform = 'scale(1)';
            icon.style.opacity = '0.1';
        });
    });
}

// Publication links interaction
function initPublicationLinks() {
    const pubLinks = document.querySelectorAll('.pub-link');
    
    pubLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const linkText = this.querySelector('i').classList.contains('fa-external-link-alt') 
                ? 'Opening paper...' 
                : 'Copying citation...';
            
            const originalText = this.innerHTML;
            this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${linkText}`;
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
                
                if (linkText.includes('citation')) {
                    showNotification('Citation copied to clipboard!', 'success');
                } else {
                    showNotification('Paper link opened in new tab!', 'success');
                }
            }, 1500);
        });
    });
}

// Enhanced contact form interactions
function initContactInteractions() {
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('click', function(e) {
            e.preventDefault();
            
            const methodType = this.querySelector('.method-label').textContent;
            
            this.style.transform = 'translateY(-4px) scale(0.98)';
            
            setTimeout(() => {
                this.style.transform = 'translateY(-2px) scale(1)';
                
                if (methodType === 'Email') {
                    showNotification('Opening email client...', 'info');
                    setTimeout(() => {
                        window.location.href = this.getAttribute('href');
                    }, 1000);
                } else {
                    showNotification(`Opening ${methodType}...`, 'info');
                    setTimeout(() => {
                        window.open(this.getAttribute('href'), '_blank');
                    }, 1000);
                }
            }, 150);
        });
    });
}

// Research card detailed interactions
function initResearchCardDetails() {
    const researchCards = document.querySelectorAll('.research-card');
    
    researchCards.forEach(card => {
        const tags = card.querySelectorAll('.tag');
        
        tags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.background = 'var(--primary-blue)';
                tag.style.color = 'var(--white)';
                tag.style.transform = 'scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.background = 'var(--gray-100)';
                tag.style.color = 'var(--gray-700)';
                tag.style.transform = 'scale(1)';
            });
        });
    });
}

// PDF viewer functionality
function initPDFViewer() {
    const modal = document.getElementById('pdfModal');
    const resumeButtons = document.querySelectorAll('#resumeBtn, #heroResumeBtn, #contactResumeBtn');
    const closeButton = document.querySelector('#pdfModal .modal-close');
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfFallback = document.querySelector('.pdf-fallback');
    const pdfPath = '../assets/resume.pdf';
    
    resumeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openPDFModal();
        });
    });
    
    function openPDFModal() {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            if (pdfViewer) {
                pdfViewer.src = pdfPath + '#toolbar=1&navpanes=1&scrollbar=1&view=FitH';
                
                pdfViewer.onerror = function() {
                    if (pdfFallback) {
                        pdfViewer.style.display = 'none';
                        pdfFallback.style.display = 'flex';
                    }
                    showNotification('PDF viewer not supported. Use download button.', 'warning');
                };
            }
        }
    }
    
    function closePDFModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            if (pdfViewer) {
                pdfViewer.src = '';
                pdfViewer.style.display = 'block';
            }
            if (pdfFallback) {
                pdfFallback.style.display = 'none';
            }
        }
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', closePDFModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePDFModal();
            }
        });
    }
}

// Touch/swipe support for mobile
function initTouchNavigation() {
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = startX - endX;
        const deltaY = startY - endY;
        
        // Only trigger if horizontal swipe is more significant than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (window.multiPageNav && !window.multiPageNav.isTransitioning) {
                if (deltaX > 0) {
                    // Swipe left - next page
                    window.multiPageNav.nextPage();
                } else {
                    // Swipe right - previous page
                    window.multiPageNav.previousPage();
                }
            }
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Core multi-page functionality
    window.multiPageNav = new MultiPageNavigator();
    
    // Initialize other features
    initMobileNav();
    initPDFViewer();
    initKeyboardNav();
    initTouchNavigation();
    
    // Visual enhancements
    addRippleEffect();
    initCardInteractions();
    initFloatingElements();
    
    // Content interactions
    // initPublicationLinks();
    initContactInteractions();
    initResearchCardDetails();
    
    // Set initial animations for research cards and publications
    const researchCards = document.querySelectorAll('.research-card');
    const publicationItems = document.querySelectorAll('.publication-item');
    
    researchCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
    });
    
    publicationItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.5s ease';
    });
    
    // Add error handling for missing elements
    const essentialElements = [
        '.main-nav',
        '#pdfModal'
    ];
    
    essentialElements.forEach(selector => {
        if (!document.querySelector(selector)) {
            console.warn(`Essential element missing: ${selector}`);
        }
    });
});

// Disable right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Disable common developer shortcuts
document.addEventListener('keydown', function(e) {
    // Disable F12 (Developer Tools)
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    
    // Disable Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    
    // Disable Ctrl+Shift+C (Inspect Element)  
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
    }
    
    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
    
    // Disable Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
    }
});

// Disable drag and drop
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});
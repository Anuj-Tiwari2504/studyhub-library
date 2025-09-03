/**
 * StudyHub Library - Mobile Enhancement Script
 * Optimized for Android, iOS, and Tablet devices
 * Author: AI Assistant
 * Version: 1.0
 */

(function() {
    'use strict';

    // ===== DEVICE DETECTION =====
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);

    // ===== MOBILE INITIALIZATION =====
    document.addEventListener('DOMContentLoaded', function() {
        if (isMobile) {
            initMobileEnhancements();
        }
    });

    function initMobileEnhancements() {
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        if (isIOS) {
            document.body.classList.add('ios-device');
        }
        
        if (isAndroid) {
            document.body.classList.add('android-device');
        }
        
        if (isTablet) {
            document.body.classList.add('tablet-device');
        }

        // Initialize mobile features
        initTouchEnhancements();
        initViewportFixes();
        initIOSFixes();
        initAndroidFixes();
        initAccessibilityEnhancements();
        initPerformanceOptimizations();
    }

    // ===== TOUCH ENHANCEMENTS =====
    function initTouchEnhancements() {
        // Add touch feedback to buttons
        const touchElements = document.querySelectorAll('.btn, button, .nav-link, .card, .clickable');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
            
            element.addEventListener('touchcancel', function() {
                this.classList.remove('touch-active');
            });
        });

        // Prevent double-tap zoom on buttons
        const buttons = document.querySelectorAll('button, .btn, input[type="submit"]');
        buttons.forEach(button => {
            button.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.click();
            });
        });

        // Swipe gestures for modals
        initSwipeGestures();
    }

    // ===== SWIPE GESTURES =====
    function initSwipeGestures() {
        let startY = 0;
        let startX = 0;

        document.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchmove', function(e) {
            if (!startY || !startX) return;

            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const diffY = startY - currentY;
            const diffX = startX - currentX;

            // Swipe down to close modal
            if (Math.abs(diffY) > Math.abs(diffX) && diffY < -100) {
                const modal = document.querySelector('.modal[style*="display: block"], .modal.show');
                if (modal) {
                    closeModal(modal);
                }
            }
        });

        document.addEventListener('touchend', function() {
            startY = 0;
            startX = 0;
        });
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }

    // ===== VIEWPORT FIXES =====
    function initViewportFixes() {
        // Fix viewport height on mobile browsers
        function setVH() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', function() {
            setTimeout(setVH, 100);
        });

        // Prevent zoom on input focus (iOS)
        if (isIOS) {
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    if (this.style.fontSize !== '16px') {
                        this.style.fontSize = '16px';
                    }
                });
            });
        }
    }

    // ===== iOS SPECIFIC FIXES =====
    function initIOSFixes() {
        if (!isIOS) return;

        // Fix iOS Safari bounce scroll
        document.addEventListener('touchmove', function(e) {
            if (e.target.closest('.modal-content, .chat-messages')) {
                return; // Allow scrolling in these elements
            }
            
            const scrollable = e.target.closest('[data-scrollable]');
            if (!scrollable) {
                e.preventDefault();
            }
        }, { passive: false });

        // Fix iOS input zoom
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
            );
        }

        // Handle safe area insets
        if (CSS.supports('padding: env(safe-area-inset-top)')) {
            document.body.classList.add('has-safe-area');
        }

        // Fix iOS keyboard issues
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });

            input.addEventListener('blur', function() {
                window.scrollTo(0, 0);
            });
        });
    }

    // ===== ANDROID SPECIFIC FIXES =====
    function initAndroidFixes() {
        if (!isAndroid) return;

        // Fix Android keyboard resize issues
        let initialViewportHeight = window.innerHeight;
        
        window.addEventListener('resize', function() {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            if (heightDifference > 150) {
                // Keyboard is likely open
                document.body.classList.add('keyboard-open');
            } else {
                // Keyboard is likely closed
                document.body.classList.remove('keyboard-open');
            }
        });

        // Fix Android Chrome address bar
        function updateViewportHeight() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateViewportHeight, 100);
        });
    }

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    function initAccessibilityEnhancements() {
        // Add keyboard navigation for mobile
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const activeElement = document.activeElement;
                if (activeElement.classList.contains('btn') || 
                    activeElement.classList.contains('nav-link')) {
                    e.preventDefault();
                    activeElement.click();
                }
            }
        });

        // Improve focus visibility
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('keyboard-focus');
            });

            element.addEventListener('blur', function() {
                this.classList.remove('keyboard-focus');
            });
        });

        // Add touch feedback for screen readers
        const interactiveElements = document.querySelectorAll('.btn, button, .nav-link');
        interactiveElements.forEach(element => {
            if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
                element.setAttribute('aria-label', 'Interactive element');
            }
        });
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    function initPerformanceOptimizations() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }

        // Debounce scroll events
        let scrollTimer;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
                // Handle scroll events here
                updateScrollPosition();
            }, 10);
        }, { passive: true });

        // Optimize animations for mobile
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduced-motion');
        }
    }

    function updateScrollPosition() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        
        if (header) {
            if (scrolled > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    // ===== MOBILE NAVIGATION =====
    function initMobileNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Close menu on link click
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    // ===== FORM ENHANCEMENTS =====
    function initFormEnhancements() {
        // Auto-format phone numbers
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function() {
                let value = this.value.replace(/\D/g, '');
                if (value.length >= 10) {
                    value = value.substring(0, 10);
                    this.value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                }
            });
        });

        // Improve input experience
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Add floating labels effect
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            // Auto-resize textareas
            if (input.tagName === 'TEXTAREA') {
                input.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = this.scrollHeight + 'px';
                });
            }
        });
    }

    // ===== NOTIFICATION SYSTEM =====
    function showMobileNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `mobile-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                   type === 'error' ? 'exclamation-circle' : 
                                   'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);

        return notification;
    }

    // ===== UTILITY FUNCTIONS =====
    function vibrate(pattern = [100]) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    function isOnline() {
        return navigator.onLine;
    }

    function getDeviceInfo() {
        return {
            isMobile,
            isIOS,
            isAndroid,
            isTablet,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            pixelRatio: window.devicePixelRatio || 1,
            orientation: screen.orientation ? screen.orientation.angle : window.orientation
        };
    }

    // ===== EXPORT FUNCTIONS =====
    window.MobileEnhancements = {
        showNotification: showMobileNotification,
        vibrate: vibrate,
        isOnline: isOnline,
        getDeviceInfo: getDeviceInfo,
        initMobileNavigation: initMobileNavigation,
        initFormEnhancements: initFormEnhancements
    };

    // Auto-initialize common features
    if (isMobile) {
        document.addEventListener('DOMContentLoaded', function() {
            initMobileNavigation();
            initFormEnhancements();
        });
    }

    // ===== CSS ADDITIONS =====
    const mobileStyles = `
        <style>
        .touch-active {
            transform: scale(0.95);
            opacity: 0.8;
            transition: all 0.1s ease;
        }
        
        .keyboard-focus {
            outline: 2px solid #2563eb;
            outline-offset: 2px;
        }
        
        .mobile-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            z-index: 10000;
            transition: transform 0.3s ease;
            max-width: 90%;
        }
        
        .mobile-notification.show {
            transform: translateX(-50%) translateY(0);
        }
        
        .mobile-notification.success {
            border-left: 4px solid #10b981;
        }
        
        .mobile-notification.error {
            border-left: 4px solid #ef4444;
        }
        
        .mobile-notification.info {
            border-left: 4px solid #3b82f6;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .keyboard-open .chat-container {
            height: 50vh !important;
        }
        
        .has-safe-area {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
        }
        
        .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        @media (max-width: 768px) {
            .mobile-notification {
                left: 10px;
                right: 10px;
                transform: translateY(-100px);
                max-width: none;
            }
            
            .mobile-notification.show {
                transform: translateY(0);
            }
        }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', mobileStyles);

})();
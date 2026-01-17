/**
 * Pipebeslagspesialisten AS - Main JavaScript
 * =============================================
 */

(function() {
    'use strict';

    // ==========================================================================
    // DOM Ready
    // ==========================================================================
    document.addEventListener('DOMContentLoaded', function() {
        initMobileNav();
        initSmoothScroll();
        initContactForm();
        initHeaderScroll();
        initLazyImages();
    });

    // ==========================================================================
    // Mobile Navigation
    // ==========================================================================
    function initMobileNav() {
        const navToggle = document.querySelector('.nav__toggle');
        const navList = document.querySelector('.nav__list');
        const navOverlay = document.querySelector('.nav__overlay');
        const navLinks = document.querySelectorAll('.nav__link');

        if (!navToggle || !navList) return;

        // Toggle menu
        navToggle.addEventListener('click', function() {
            toggleMenu();
        });

        // Close on overlay click
        if (navOverlay) {
            navOverlay.addEventListener('click', function() {
                closeMenu();
            });
        }

        // Close on link click
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navList.classList.contains('active')) {
                closeMenu();
            }
        });

        function toggleMenu() {
            navToggle.classList.toggle('active');
            navList.classList.toggle('active');
            if (navOverlay) {
                navOverlay.classList.toggle('active');
            }
            document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
        }

        function closeMenu() {
            navToggle.classList.remove('active');
            navList.classList.remove('active');
            if (navOverlay) {
                navOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    }

    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==========================================================================
    // Contact Form Handling
    // ==========================================================================
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const formSuccess = document.getElementById('form-success');

        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Clear previous errors
            clearErrors();

            // Validate form
            if (!validateForm()) {
                return;
            }

            // Get form data
            const formData = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                address: form.address.value.trim(),
                postalCode: form.postalCode.value.trim(),
                inquiryType: form.inquiryType.value,
                pipeType: form.pipeType.value,
                description: form.description.value.trim(),
                timing: form.timing.value
            };

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const spinner = submitBtn.querySelector('.spinner');

            submitBtn.classList.add('btn--loading');
            btnText.style.display = 'none';
            spinner.style.display = 'inline-block';

            try {
                // Simulate API call (replace with actual Resend API integration)
                await simulateFormSubmission(formData);

                // Show success message
                form.style.display = 'none';
                formSuccess.classList.add('show');

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Form submission error:', error);
                alert('Det oppstod en feil ved sending av skjemaet. Vennligst prøv igjen eller ring oss direkte.');
            } finally {
                // Reset loading state
                submitBtn.classList.remove('btn--loading');
                btnText.style.display = 'inline';
                spinner.style.display = 'none';
            }
        });

        function validateForm() {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    showError(field, 'Dette feltet er påkrevd');
                    isValid = false;
                } else if (field.type === 'email' && !isValidEmail(field.value)) {
                    showError(field, 'Vennligst oppgi en gyldig e-postadresse');
                    isValid = false;
                } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                    showError(field, 'Vennligst oppgi et gyldig telefonnummer');
                    isValid = false;
                }
            });

            return isValid;
        }

        function showError(field, message) {
            field.classList.add('error');
            const errorSpan = field.parentElement.querySelector('.form-error');
            if (errorSpan) {
                errorSpan.textContent = message;
            }
        }

        function clearErrors() {
            const errorFields = form.querySelectorAll('.error');
            const errorSpans = form.querySelectorAll('.form-error');

            errorFields.forEach(function(field) {
                field.classList.remove('error');
            });

            errorSpans.forEach(function(span) {
                span.textContent = '';
            });
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function isValidPhone(phone) {
            // Norwegian phone numbers: 8 digits, optionally with +47 prefix
            const phoneRegex = /^(\+47)?[0-9\s]{8,}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        }

        async function simulateFormSubmission(data) {
            // Simulate network delay
            return new Promise(function(resolve) {
                setTimeout(function() {
                    console.log('Form data submitted:', data);
                    resolve({ success: true });
                }, 1500);
            });

            // TODO: Replace with actual Resend API integration
            // Example:
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data)
            // });
            // return response.json();
        }

        // Real-time validation
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(function(field) {
            field.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    showError(this, 'Dette feltet er påkrevd');
                } else if (this.type === 'email' && !isValidEmail(this.value)) {
                    showError(this, 'Vennligst oppgi en gyldig e-postadresse');
                } else if (this.type === 'tel' && !isValidPhone(this.value)) {
                    showError(this, 'Vennligst oppgi et gyldig telefonnummer');
                } else {
                    this.classList.remove('error');
                    const errorSpan = this.parentElement.querySelector('.form-error');
                    if (errorSpan) {
                        errorSpan.textContent = '';
                    }
                }
            });

            field.addEventListener('input', function() {
                if (this.classList.contains('error') && this.value.trim()) {
                    this.classList.remove('error');
                    const errorSpan = this.parentElement.querySelector('.form-error');
                    if (errorSpan) {
                        errorSpan.textContent = '';
                    }
                }
            });
        });
    }

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    function initHeaderScroll() {
        const header = document.querySelector('.header');

        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;

            if (scrollY > 100) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // ==========================================================================
    // Lazy Load Images
    // ==========================================================================
    function initLazyImages() {
        // Check for native lazy loading support
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(function(img) {
                img.src = img.src;
            });
        } else {
            // Fallback for older browsers
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');

            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            const image = entry.target;
                            image.src = image.src;
                            image.removeAttribute('loading');
                            imageObserver.unobserve(image);
                        }
                    });
                });

                lazyImages.forEach(function(img) {
                    imageObserver.observe(img);
                });
            } else {
                // Very old browser fallback - just load all images
                lazyImages.forEach(function(img) {
                    img.src = img.src;
                });
            }
        }
    }

    // ==========================================================================
    // Utility Functions
    // ==========================================================================

    // Debounce function for performance
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

})();

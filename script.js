document.addEventListener("DOMContentLoaded", function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navMenu = document.getElementById("navMenu");
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", function() {
            navMenu.classList.toggle("active");
            
            // Change the icon based on menu state
            const icon = mobileMenuBtn.querySelector("i");
            if (navMenu.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-times");
            } else {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener("click", function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnMenuBtn && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            
            const icon = mobileMenuBtn.querySelector("i");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu after clicking a link
            if (navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                
                const icon = mobileMenuBtn.querySelector("i");
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission and validation
    const contactForm = document.getElementById("contactForm");
    const notification = document.getElementById("notification");
    
    if (contactForm) {
        // Generate CSRF token
        const csrfToken = generateRandomToken();
        document.getElementById("csrf_token").value = csrfToken;
        
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // In a real scenario, you'd send the form data to the server
                // For now, we'll just simulate a successful submission
                
                // Disable the submit button to prevent multiple submissions
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
                
                // Simulate server request with a timeout
                setTimeout(function() {
                    showNotification("Your message has been sent successfully! We'll get back to you soon.", "success");
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = "Send Message";
                }, 1500);
            }
        });
    }
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        // Reset previous validation states
        requiredFields.forEach(field => {
            field.classList.remove('error');
            const existingErrorMsg = field.parentElement.querySelector('.error-message');
            if (existingErrorMsg) {
                existingErrorMsg.remove();
            }
        });
        
        // Check each required field
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Add error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                errorMsg.style.color = 'red';
                errorMsg.style.fontSize = '14px';
                errorMsg.style.marginTop = '5px';
                field.parentElement.appendChild(errorMsg);
            }
        });
        
        // Validate email format if email exists and is not empty
        const emailField = contactForm.querySelector('#email');
        if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
            isValid = false;
            emailField.classList.add('error');
            
            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter a valid email address';
            errorMsg.style.color = 'red';
            errorMsg.style.fontSize = '14px';
            errorMsg.style.marginTop = '5px';
            emailField.parentElement.appendChild(errorMsg);
        }
        
        return isValid;
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show notification helper
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Force a reflow to ensure the transition works
        notification.offsetHeight;
        
        // Show the notification
        notification.classList.remove('hidden');
        
        // Hide the notification after 5 seconds
        setTimeout(function() {
            notification.classList.add('hidden');
        }, 5000);
    }
    
    // Generate random CSRF token
    function generateRandomToken() {
        return Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    // Add input field animation and validation
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    formInputs.forEach(input => {
        // Add focus styles
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            
            // Validate on blur
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
            } else if (this.id === 'email' && this.value.trim() && !isValidEmail(this.value)) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
                const existingErrorMsg = this.parentElement.querySelector('.error-message');
                if (existingErrorMsg) {
                    existingErrorMsg.remove();
                }
            }
        });
    });
    
    // Add scroll-based animations
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Change header background on scroll
        const header = document.querySelector('header');
        if (scrollPosition > 100) {
            header.style.padding = '1rem 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '2rem 0';
            header.style.boxShadow = 'none';
        }
        
        // Add animations to elements as they come into view
        animateOnScroll('.professional-card', 'fadeInUp');
        animateOnScroll('.service-card', 'fadeInUp');
    });
    
    // Helper function for scroll animations
    function animateOnScroll(selector, animationClass) {
        const elements = document.querySelectorAll(selector);
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialize animations
    function initAnimations() {
        // Set initial state for animation elements
        const animationElements = document.querySelectorAll('.professional-card, .service-card');
        
        animationElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        // Trigger initial animation check
        setTimeout(function() {
            window.dispatchEvent(new Event('scroll'));
        }, 100);
    }
    
    // Initialize star ratings
    function initStarRatings() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            const skillStars = item.querySelector('.skill-stars');
            if (skillStars) {
                // Random rating between 3 and 5 stars for demo purposes
                // In a real scenario, you would get this data from your backend
                const rating = Math.floor(Math.random() * 3) + 3;
                
                for (let i = 0; i < 5; i++) {
                    const star = document.createElement('i');
                    star.className = i < rating ? 'fas fa-star' : 'far fa-star';
                    skillStars.appendChild(star);
                }
            }
        });
    }
    
    // Initialize all features
    initAnimations();
    initStarRatings();
    
    // Check for dark mode preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Add active navigation highlighting
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a');
        
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Add active class to navigation
    window.addEventListener('scroll', updateActiveNavigation);
    updateActiveNavigation();
});

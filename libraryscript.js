// Library Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Registration form handling
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
    
    // Plan selection and total calculation
    const planSelect = document.getElementById('selectedPlan');
    const studentDiscount = document.getElementById('studentDiscount');
    const totalAmount = document.getElementById('totalAmount');
    
    console.log('Form elements found:', {
        planSelect: !!planSelect,
        studentDiscount: !!studentDiscount,
        totalAmount: !!totalAmount
    });
    
    if (planSelect) {
        planSelect.addEventListener('change', function() {
            console.log('Plan changed to:', this.value);
            calculateTotal();
        });
        
        // Set initial value if none selected
        if (!planSelect.value) {
            planSelect.value = 'monthly'; // Default to monthly
        }
        calculateTotal(); // Calculate initial total
    }
    
    if (studentDiscount) {
        studentDiscount.addEventListener('change', function() {
            console.log('Student discount changed to:', this.checked);
            calculateTotal();
        });
    }
    
    // Initialize total calculation
    setTimeout(calculateTotal, 100);
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize testimonials slider
    initializeTestimonials();
    
    // Setup form validation
    setupFormValidation();
    
    // Debug: Log form elements
    console.log('Registration form elements:', {
        form: !!document.getElementById('registrationForm'),
        fullName: !!document.getElementById('fullName'),
        phone: !!document.getElementById('phone'),
        planSelect: !!document.getElementById('selectedPlan'),
        totalAmount: !!document.getElementById('totalAmount'),
        studentDiscount: !!document.getElementById('studentDiscount')
    });
});

// Plan Selection Functions
const planPrices = {
    daily: 50,
    weekly: 300,
    monthly: 500,
    quarterly: 1400,
    yearly: 5000
};

function selectPlan(planType, price) {
    console.log('Selecting plan:', planType, 'Price:', price);
    
    const planSelect = document.getElementById('selectedPlan');
    if (planSelect) {
        planSelect.value = planType;
        calculateTotal();
        
        // Scroll to registration form
        const registerSection = document.getElementById('register');
        if (registerSection) {
            registerSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Highlight the form
        const form = document.querySelector('.register-form');
        if (form) {
            form.style.transition = 'all 0.3s ease';
            form.style.transform = 'scale(1.02)';
            form.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.2)';
            setTimeout(() => {
                form.style.transform = 'scale(1)';
                form.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }, 1000);
        }
        
        // Show notification
        showNotification(`${planType.charAt(0).toUpperCase() + planType.slice(1)} plan selected! Complete registration below.`, 'success');
    } else {
        console.error('Plan select element not found');
    }
}

function calculateTotal() {
    const planSelect = document.getElementById('selectedPlan');
    const studentDiscount = document.getElementById('studentDiscount');
    const totalAmount = document.getElementById('totalAmount');
    
    if (!planSelect || !totalAmount) {
        console.log('Plan select or total amount element not found');
        return;
    }
    
    const selectedPlan = planSelect.value;
    let amount = planPrices[selectedPlan] || 0;
    
    console.log('Selected plan:', selectedPlan, 'Amount:', amount);
    
    // Apply student discount
    if (studentDiscount && studentDiscount.checked) {
        amount = amount * 0.9; // 10% discount
        console.log('Student discount applied. New amount:', amount);
    }
    
    const finalAmount = Math.round(amount);
    totalAmount.textContent = finalAmount;
    console.log('Final amount set:', finalAmount);
}

function showStudentDiscount() {
    alert('Student Discount Details:\n\n• 10% discount on all plans\n• Valid student ID required\n• Additional study materials included\n• Priority booking for events\n• Extended library hours access');
}

// Registration Form Handler
function handleRegistration(e) {
    e.preventDefault();
    
    // Get form elements
    const fullName = document.getElementById('fullName');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const age = document.getElementById('age');
    const address = document.getElementById('address');
    const emergencyContact = document.getElementById('emergencyContact');
    const selectedPlan = document.getElementById('selectedPlan');
    const studentDiscount = document.getElementById('studentDiscount');
    const terms = document.getElementById('terms');
    const totalAmount = document.getElementById('totalAmount');
    const photo = document.getElementById('photo');
    const idProof = document.getElementById('idProof');
    
    // Check if elements exist
    if (!fullName || !phone || !selectedPlan || !terms || !totalAmount) {
        alert('Form elements not found. Please refresh the page.');
        return;
    }
    
    const registrationData = {
        fullName: fullName.value.trim(),
        phone: phone.value.trim(),
        email: email ? email.value.trim() : '',
        age: age ? age.value : '',
        address: address ? address.value.trim() : '',
        emergencyContact: emergencyContact ? emergencyContact.value.trim() : '',
        selectedPlan: selectedPlan.value,
        studentDiscount: studentDiscount ? studentDiscount.checked : false,
        totalAmount: totalAmount.textContent,
        photo: null,
        idProof: null
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (!submitBtn) {
        alert('Submit button not found');
        return;
    }
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
    submitBtn.disabled = true;
    
    // Handle photo upload
    if (photo && photo.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            registrationData.photo = e.target.result;
            processRegistration(registrationData, submitBtn, originalText);
        };
        reader.readAsDataURL(photo.files[0]);
    } else {
        processRegistration(registrationData, submitBtn, originalText);
    }
    
    // Validate required fields
    if (!registrationData.fullName) {
        showNotification('Please enter your full name', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        fullName.focus();
        return;
    }
    
    if (!registrationData.phone) {
        showNotification('Please enter your phone number', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        phone.focus();
        return;
    }
    
    if (!registrationData.selectedPlan) {
        showNotification('Please select a membership plan', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        selectedPlan.focus();
        return;
    }
    
    if (!terms.checked) {
        showNotification('Please agree to Terms & Conditions', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        terms.focus();
        return;
    }
    
    // Validate phone number (Indian format)
    if (!/^[6-9]\d{9}$/.test(registrationData.phone)) {
        showNotification('Please enter a valid 10-digit Indian phone number', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        phone.focus();
        return;
    }
    
    // Validate email if provided
    if (registrationData.email && !validateEmail(registrationData.email)) {
        showNotification('Please enter a valid email address', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        email.focus();
        return;
    }
}

function showSuccessModal(data) {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Registration Successful!</h2>
            <p>Thank you ${data.fullName} for joining StudyHub Library!</p>
            <div class="registration-details">
                <p><strong>Registration ID:</strong> ${data.id}</p>
                <p><strong>Plan:</strong> ${data.selectedPlan.charAt(0).toUpperCase() + data.selectedPlan.slice(1)} Pass</p>
                <p><strong>Amount:</strong> ₹${data.totalAmount}</p>
            </div>
            <div class="next-steps">
                <h3>Next Steps:</h3>
                <ul>
                    <li>Visit our library with a valid ID</li>
                    <li>Complete the payment process</li>
                    <li>Get your membership card</li>
                    <li>Start studying immediately!</li>
                </ul>
            </div>
            <div class="contact-info">
                <p><strong>Contact us:</strong></p>
                <p><i class="fas fa-phone"></i> +91 98765 43210</p>
                <p><i class="fab fa-whatsapp"></i> WhatsApp Support</p>
            </div>
            <button class="btn btn-primary" onclick="closeSuccessModal()">Got It!</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .success-modal-content {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }
        
        .success-icon {
            font-size: 4rem;
            color: #10b981;
            margin-bottom: 1rem;
        }
        
        .success-modal-content h2 {
            color: #1f2937;
            margin-bottom: 1rem;
        }
        
        .registration-details {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 10px;
            margin: 1.5rem 0;
            text-align: left;
        }
        
        .next-steps {
            text-align: left;
            margin: 1.5rem 0;
        }
        
        .next-steps ul {
            padding-left: 1.5rem;
        }
        
        .next-steps li {
            margin-bottom: 0.5rem;
            color: #6b7280;
        }
        
        .contact-info {
            background: #eff6ff;
            padding: 1rem;
            border-radius: 10px;
            margin: 1.5rem 0;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
}

function processRegistration(registrationData, submitBtn, originalText) {
    // Simulate registration process
    setTimeout(() => {
        try {
            // Store registration data
            const registrations = JSON.parse(localStorage.getItem('library_registrations') || '[]');
            registrationData.id = 'REG' + Date.now();
            registrationData.registrationDate = new Date().toISOString();
            registrationData.status = 'registered';
            registrations.push(registrationData);
            localStorage.setItem('library_registrations', JSON.stringify(registrations));
            
            // Store member data for dashboard
            const memberData = {
                name: registrationData.fullName,
                phone: registrationData.phone,
                email: registrationData.email,
                plan: registrationData.selectedPlan,
                amount: registrationData.totalAmount,
                photo: registrationData.photo,
                joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                cardNumber: '2024' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
                validUntil: new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                points: 0,
                referrals: 0,
                referralEarnings: 0
            };
            localStorage.setItem('memberData', JSON.stringify(memberData));
            
            showNotification('Registration successful! Redirecting to payment...', 'success');
            
            // Redirect to payment page
            setTimeout(() => {
                window.location.href = 'payment.html';
            }, 1500);
            
        } catch (error) {
            console.error('Registration error:', error);
            showNotification('Registration failed. Please try again.', 'error');
        }
        
        // Reset button
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
        
    }, 2000);
}

// Enhanced Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add inline styles to avoid conflicts
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        border-left: 4px solid ${type === 'success' ? '#10b981' : '#ef4444'};
        color: ${type === 'success' ? '#065f46' : '#991b1b'};
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: auto;
            color: #6b7280;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Add animation styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.facility-card, .plan-card, .testimonial-card, .gallery-item').forEach(el => {
        observer.observe(el);
    });
}

// Testimonials Slider (Simple)
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    if (testimonials.length > 0) {
        // Auto-rotate testimonials every 5 seconds
        setInterval(() => {
            testimonials[currentTestimonial].style.opacity = '0.7';
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].style.opacity = '1';
            testimonials[currentTestimonial].style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                testimonials[currentTestimonial].style.transform = 'scale(1)';
            }, 500);
        }, 5000);
    }
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
});

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.textContent; // Reset to original
            }
        };
        
        updateCounter();
    });
}

// Initialize counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
});

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Gallery lightbox effect
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${img.src}" alt="${img.alt}">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            
            .lightbox img {
                width: 100%;
                height: auto;
                border-radius: 10px;
            }
            
            .lightbox-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        
        // Close lightbox
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                lightbox.remove();
            }
        });
    });
});

// Enhanced Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

function validatePhone(phone) {
    // Remove any spaces, dashes, or other characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's a valid Indian mobile number
    const re = /^[6-9]\d{9}$/;
    return re.test(cleanPhone);
}

function validateName(name) {
    // Name should be at least 2 characters and contain only letters and spaces
    const re = /^[a-zA-Z\s]{2,50}$/;
    return re.test(name.trim());
}

function validateAge(age) {
    const ageNum = parseInt(age);
    return ageNum >= 16 && ageNum <= 60;
}

// Real-time form validation
function setupFormValidation() {
    const fullName = document.getElementById('fullName');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const age = document.getElementById('age');
    
    if (fullName) {
        fullName.addEventListener('blur', function() {
            if (this.value && !validateName(this.value)) {
                this.style.borderColor = '#ef4444';
                showFieldError(this, 'Please enter a valid name (2-50 characters, letters only)');
            } else {
                this.style.borderColor = '#10b981';
                clearFieldError(this);
            }
        });
    }
    
    if (phone) {
        phone.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.style.borderColor = '#ef4444';
                showFieldError(this, 'Please enter a valid 10-digit Indian mobile number');
            } else if (this.value) {
                this.style.borderColor = '#10b981';
                clearFieldError(this);
            }
        });
        
        // Format phone number as user types
        phone.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            this.value = value;
        });
    }
    
    if (email) {
        email.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#ef4444';
                showFieldError(this, 'Please enter a valid email address');
            } else if (this.value) {
                this.style.borderColor = '#10b981';
                clearFieldError(this);
            }
        });
    }
    
    if (age) {
        age.addEventListener('blur', function() {
            if (this.value && !validateAge(this.value)) {
                this.style.borderColor = '#ef4444';
                showFieldError(this, 'Age must be between 16 and 60 years');
            } else if (this.value) {
                this.style.borderColor = '#10b981';
                clearFieldError(this);
            }
        });
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
    `;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '#e5e7eb';
}

// Local storage helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
    // Here you would integrate with Google Analytics or other tracking services
}

// Track form submissions
document.addEventListener('submit', function(e) {
    if (e.target.id === 'registrationForm') {
        trackEvent('registration_attempt', {
            plan: document.getElementById('selectedPlan').value,
            student_discount: document.getElementById('studentDiscount').checked
        });
    }
});

// Track plan selections
function trackPlanSelection(planType) {
    trackEvent('plan_selected', { plan: planType });
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('admin-modal')) {
        closeAdminModal();
    }
});

// Update selectPlan function to include tracking
const originalSelectPlan = selectPlan;
selectPlan = function(planType, price) {
    trackPlanSelection(planType);
    originalSelectPlan(planType, price);
};

// Admin Login Functions
function openAdminModal() {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="admin-modal-content">
            <div class="admin-modal-header">
                <h2><i class="fas fa-user-shield"></i> Admin Login</h2>
                <button class="close-btn" onclick="closeAdminModal()">&times;</button>
            </div>
            <form id="adminLoginForm">
                <div class="form-group">
                    <label for="adminUsername">Username</label>
                    <input type="text" id="adminUsername" required>
                </div>
                <div class="form-group">
                    <label for="adminPassword">Password</label>
                    <input type="password" id="adminPassword" required>
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
                <div class="admin-links">
                    <a href="#" onclick="openForgetPasswordModal()">Forgot Password?</a>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    addAdminModalStyles();
    
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
}

function openForgetPasswordModal() {
    closeAdminModal();
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="admin-modal-content">
            <div class="admin-modal-header">
                <h2><i class="fas fa-key"></i> Reset Password</h2>
                <button class="close-btn" onclick="closeAdminModal()">&times;</button>
            </div>
            <form id="forgetPasswordForm">
                <div class="form-group">
                    <label for="resetUsername">Username</label>
                    <input type="text" id="resetUsername" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <input type="password" id="newPassword" required>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" required>
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Change Password
                </button>
                <div class="admin-links">
                    <a href="#" onclick="openAdminModal()">Back to Login</a>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('forgetPasswordForm').addEventListener('submit', handlePasswordReset);
}

function closeAdminModal() {
    const modal = document.querySelector('.admin-modal');
    if (modal) {
        modal.remove();
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    const adminCredentials = JSON.parse(localStorage.getItem('admin_credentials') || '{"username":"admin","password":"admin123"}');
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        showNotification('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'admin-panel.html';
        }, 1500);
    } else {
        showNotification('Invalid username or password', 'error');
    }
}

function handlePasswordReset(e) {
    e.preventDefault();
    const username = document.getElementById('resetUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    const adminCredentials = { username: username, password: newPassword };
    localStorage.setItem('admin_credentials', JSON.stringify(adminCredentials));
    
    showNotification('Password changed successfully!', 'success');
    setTimeout(() => {
        closeAdminModal();
        openAdminModal();
    }, 1500);
}

function addAdminModalStyles() {
    if (!document.getElementById('admin-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'admin-modal-styles';
        style.textContent = `
            .admin-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .admin-modal-content {
                background: white;
                padding: 2rem;
                border-radius: 15px;
                width: 90%;
                max-width: 400px;
                animation: slideUp 0.3s ease;
            }
            
            .admin-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .admin-modal-header h2 {
                margin: 0;
                color: #1f2937;
                font-size: 1.5rem;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s;
            }
            
            .close-btn:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .admin-modal .form-group {
                margin-bottom: 1rem;
            }
            
            .admin-modal label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: #374151;
            }
            
            .admin-modal input {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.2s;
            }
            
            .admin-modal input:focus {
                outline: none;
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
            
            .admin-modal .btn {
                width: 100%;
                padding: 0.75rem;
                background: #2563eb;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                transition: background 0.2s;
                margin-top: 1rem;
            }
            
            .admin-modal .btn:hover {
                background: #1d4ed8;
            }
            
            .admin-links {
                text-align: center;
                margin-top: 1rem;
            }
            
            .admin-links a {
                color: #2563eb;
                text-decoration: none;
                font-size: 0.9rem;
            }
            
            .admin-links a:hover {
                text-decoration: underline;
            }
        `;
        document.head.appendChild(style);
    }
}

// SEO and performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const criticalImages = [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
});
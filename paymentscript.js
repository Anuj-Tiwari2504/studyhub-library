// Payment Page JavaScript
let registrationData = {};
let paymentData = {};

document.addEventListener('DOMContentLoaded', function() {
    loadRegistrationData();
    setupPaymentHandlers();
    setupFormValidation();
});

// Load registration data from localStorage
function loadRegistrationData() {
    const urlParams = new URLSearchParams(window.location.search);
    const regId = urlParams.get('regId');
    
    if (regId) {
        const registrations = JSON.parse(localStorage.getItem('library_registrations') || '[]');
        registrationData = registrations.find(r => r.id === regId);
    }
    
    if (!registrationData || !registrationData.id) {
        // Fallback to latest registration
        const registrations = JSON.parse(localStorage.getItem('library_registrations') || '[]');
        registrationData = registrations[registrations.length - 1] || {};
    }
    
    if (registrationData.id) {
        displayRegistrationData();
    } else {
        alert('Registration data not found. Please register first.');
        window.location.href = 'library-website.html#register';
    }
}

// Display registration data
function displayRegistrationData() {
    const planPrices = {
        daily: { amount: 50, duration: '1 Day' },
        weekly: { amount: 300, duration: '1 Week' },
        monthly: { amount: 500, duration: '1 Month' },
        quarterly: { amount: 1400, duration: '3 Months' },
        yearly: { amount: 5000, duration: '1 Year' }
    };
    
    // Update student info
    document.getElementById('studentName').textContent = registrationData.fullName || 'N/A';
    document.getElementById('studentPhone').textContent = registrationData.phone || 'N/A';
    document.getElementById('studentEmail').textContent = registrationData.email || 'N/A';
    
    // Update plan details
    const planInfo = planPrices[registrationData.selectedPlan] || { amount: 0, duration: 'N/A' };
    const originalAmount = planInfo.amount;
    const discountAmount = registrationData.studentDiscount ? Math.round(originalAmount * 0.1) : 0;
    const totalAmount = originalAmount - discountAmount;
    
    document.getElementById('selectedPlan').textContent = 
        registrationData.selectedPlan ? 
        registrationData.selectedPlan.charAt(0).toUpperCase() + registrationData.selectedPlan.slice(1) + ' Pass' : 
        'N/A';
    document.getElementById('planDuration').textContent = planInfo.duration;
    document.getElementById('originalAmount').textContent = `₹${originalAmount}`;
    document.getElementById('totalAmount').textContent = `₹${totalAmount}`;
    
    // Show discount if applicable
    if (registrationData.studentDiscount) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discountAmount').textContent = `-₹${discountAmount}`;
    }
    
    // Update cash amount
    document.getElementById('cashAmount').textContent = totalAmount;
    
    // Store for later use
    paymentData = {
        registrationId: registrationData.id,
        studentName: registrationData.fullName,
        amount: totalAmount,
        originalAmount: originalAmount,
        discount: discountAmount,
        plan: registrationData.selectedPlan
    };
}

// Setup payment method handlers
function setupPaymentHandlers() {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            openPaymentModal(method);
        });
    });
    
    // Card form handler
    const cardForm = document.getElementById('cardForm');
    if (cardForm) {
        cardForm.addEventListener('submit', handleCardPayment);
    }
}

// Open payment modal
function openPaymentModal(method) {
    closeAllModals();
    
    const modalId = method + 'Modal';
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.classList.add('active');
        
        // Initialize specific payment method
        switch(method) {
            case 'upi':
                initializeUPIPayment();
                break;
            case 'card':
                initializeCardPayment();
                break;
            case 'netbanking':
                initializeNetBanking();
                break;
            case 'cash':
                initializeCashPayment();
                break;
        }
    }
}

// Close payment modal
function closePaymentModal() {
    document.querySelectorAll('.payment-modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function closeAllModals() {
    closePaymentModal();
}

// UPI Payment
function initializeUPIPayment() {
    // Update QR code with actual amount
    const qrImg = document.querySelector('#upiModal .qr-code img');
    if (qrImg) {
        const upiString = `upi://pay?pa=studyhub@paytm&pn=StudyHub Library&am=${paymentData.amount}&cu=INR&tn=Library Membership`;
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    }
    
    // Simulate payment checking
    setTimeout(() => {
        checkUPIPaymentStatus();
    }, 5000);
}

function payWithUPI(app) {
    const upiString = `upi://pay?pa=studyhub@paytm&pn=StudyHub Library&am=${paymentData.amount}&cu=INR&tn=Library Membership`;
    
    // Try to open UPI app
    const appUrls = {
        gpay: `tez://upi/pay?${upiString.split('?')[1]}`,
        phonepe: `phonepe://pay?${upiString.split('?')[1]}`,
        paytm: `paytmmp://pay?${upiString.split('?')[1]}`
    };
    
    try {
        window.location.href = appUrls[app] || upiString;
        
        // Show payment status
        document.getElementById('upiStatus').innerHTML = `
            <p>Redirecting to ${app.charAt(0).toUpperCase() + app.slice(1)}...</p>
            <div class="loading-spinner"></div>
        `;
        
        // Simulate payment completion
        setTimeout(() => {
            processPayment('UPI', app);
        }, 3000);
        
    } catch (error) {
        console.error('Error opening UPI app:', error);
        showNotification('Please scan the QR code with your UPI app', 'info');
    }
}

function checkUPIPaymentStatus() {
    // Simulate payment status check
    const statusDiv = document.getElementById('upiStatus');
    statusDiv.innerHTML = `
        <p>Checking payment status...</p>
        <div class="loading-spinner"></div>
    `;
    
    // Simulate successful payment after 3 seconds
    setTimeout(() => {
        processPayment('UPI', 'QR Code');
    }, 3000);
}

// Card Payment
function initializeCardPayment() {
    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            this.value = value;
        });
    }
    
    // Format expiry date
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }
    
    // Format CVV
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 3);
        });
    }
}

function handleCardPayment(e) {
    e.preventDefault();
    
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardholderName = document.getElementById('cardholderName').value;
    
    // Validate card details
    if (!cardNumber || cardNumber.length < 16) {
        showNotification('Please enter a valid card number', 'error');
        return;
    }
    
    if (!expiryDate || expiryDate.length < 5) {
        showNotification('Please enter a valid expiry date', 'error');
        return;
    }
    
    if (!cvv || cvv.length < 3) {
        showNotification('Please enter a valid CVV', 'error');
        return;
    }
    
    if (!cardholderName.trim()) {
        showNotification('Please enter cardholder name', 'error');
        return;
    }
    
    // Show processing
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        processPayment('Card', `****${cardNumber.slice(-4)}`);
    }, 3000);
}

// Net Banking
function initializeNetBanking() {
    // Bank selection is handled by payWithBank function
}

function payWithBank(bankCode) {
    const bankNames = {
        sbi: 'State Bank of India',
        hdfc: 'HDFC Bank',
        icici: 'ICICI Bank',
        axis: 'Axis Bank',
        pnb: 'Punjab National Bank',
        other: 'Other Bank'
    };
    
    const bankName = bankNames[bankCode] || 'Selected Bank';
    
    // Show processing
    const modal = document.getElementById('netbankingModal');
    modal.querySelector('.modal-body').innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
            <p>Redirecting to ${bankName}...</p>
            <p style="color: #6b7280; font-size: 0.9rem;">Please complete the payment on your bank's website</p>
        </div>
    `;
    
    // Simulate bank redirect and payment
    setTimeout(() => {
        processPayment('Net Banking', bankName);
    }, 4000);
}

// Cash Payment
function initializeCashPayment() {
    // Cash payment is handled by confirmCashPayment function
}

function confirmCashPayment() {
    // Process cash payment (pending status)
    processPayment('Cash', 'Pay at Library', 'pending');
}

// Process Payment
function processPayment(method, details, status = 'completed') {
    const paymentRecord = {
        id: 'PAY' + Date.now(),
        registrationId: paymentData.registrationId,
        studentId: generateStudentId(),
        studentName: paymentData.studentName,
        amount: paymentData.amount,
        originalAmount: paymentData.originalAmount,
        discount: paymentData.discount,
        plan: paymentData.plan,
        method: method,
        details: details,
        status: status,
        date: new Date().toISOString(),
        nextDue: calculateNextDueDate()
    };
    
    // Save payment record
    const payments = JSON.parse(localStorage.getItem('library_payments') || '[]');
    payments.push(paymentRecord);
    localStorage.setItem('library_payments', JSON.stringify(payments));
    
    // Update registration status
    const registrations = JSON.parse(localStorage.getItem('library_registrations') || '[]');
    const regIndex = registrations.findIndex(r => r.id === paymentData.registrationId);
    if (regIndex !== -1) {
        registrations[regIndex].status = status;
        registrations[regIndex].paymentId = paymentRecord.id;
        registrations[regIndex].studentId = paymentRecord.studentId;
        localStorage.setItem('library_registrations', JSON.stringify(registrations));
    }
    
    // Add to admin system (students array)
    const students = JSON.parse(localStorage.getItem('library_students') || '[]');
    const newStudent = {
        id: paymentRecord.studentId,
        name: paymentData.studentName,
        phone: registrationData.phone,
        email: registrationData.email || '',
        joinDate: new Date().toISOString().split('T')[0],
        dueDate: paymentRecord.nextDue,
        amount: paymentData.amount,
        status: status === 'completed' ? 'active' : 'pending'
    };
    students.push(newStudent);
    localStorage.setItem('library_students', JSON.stringify(students));
    
    // Close all modals and show success
    closeAllModals();
    
    if (status === 'completed') {
        showSuccessModal(paymentRecord);
    } else {
        showPendingModal(paymentRecord);
    }
}

// Generate Student ID
function generateStudentId() {
    const prefix = 'LIB';
    const timestamp = Date.now().toString().slice(-5);
    return prefix + timestamp;
}

// Calculate Next Due Date
function calculateNextDueDate() {
    const today = new Date();
    const planDurations = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        quarterly: 90,
        yearly: 365
    };
    
    const days = planDurations[paymentData.plan] || 30;
    const nextDue = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    return nextDue.toISOString().split('T')[0];
}

// Show Success Modal
function showSuccessModal(paymentRecord) {
    const modal = document.getElementById('successModal');
    
    // Update membership card
    document.getElementById('membershipId').textContent = paymentRecord.studentId;
    document.getElementById('memberName').textContent = paymentRecord.studentName;
    document.getElementById('memberPlan').textContent = 
        paymentRecord.plan.charAt(0).toUpperCase() + paymentRecord.plan.slice(1) + ' Pass';
    
    const validTill = new Date(paymentRecord.nextDue);
    document.getElementById('validTill').textContent = validTill.toLocaleDateString('en-IN');
    
    // Update member photo if available
    const memberPhoto = document.getElementById('memberPhoto');
    if (memberPhoto && registrationData.photo) {
        memberPhoto.src = registrationData.photo;
    }
    
    modal.classList.add('active');
    
    // Show notification
    showNotification('Payment successful! Welcome to StudyHub Library!', 'success');
}

// Show Pending Modal (for cash payments)
function showPendingModal(paymentRecord) {
    const modal = document.createElement('div');
    modal.className = 'payment-modal active';
    modal.innerHTML = `
        <div class="modal-content success">
            <div class="success-icon" style="color: #f59e0b;">
                <i class="fas fa-clock"></i>
            </div>
            <h2>Registration Confirmed!</h2>
            <p>Please visit our library to complete payment</p>
            <div class="pending-info" style="background: #fef3c7; padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0;">
                <h4>Next Steps:</h4>
                <ul style="text-align: left; margin-top: 1rem;">
                    <li>Visit StudyHub Library</li>
                    <li>Show this confirmation: <strong>${paymentRecord.id}</strong></li>
                    <li>Pay ₹${paymentRecord.amount} in cash</li>
                    <li>Get your membership card</li>
                </ul>
            </div>
            <div class="success-actions">
                <button class="btn btn-primary" onclick="window.location.href='library-website.html'">
                    <i class="fas fa-home"></i> Back to Home
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    showNotification('Registration confirmed! Please visit library to pay.', 'success');
}

// Enhanced Membership Card Download
function downloadMembershipCard() {
    const cardData = {
        id: document.getElementById('membershipId').textContent,
        name: document.getElementById('memberName').textContent,
        plan: document.getElementById('memberPlan').textContent,
        validTill: document.getElementById('validTill').textContent,
        issueDate: new Date().toLocaleDateString('en-IN'),
        photo: registrationData.photo || 'https://via.placeholder.com/60x60/667eea/ffffff?text=' + cardData.name.charAt(0)
    };
    
    // Create HTML membership card
    const cardHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>StudyHub Library - Membership Card</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .membership-card {
            width: 350px;
            height: 220px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            color: white;
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: bold;
            font-size: 16px;
        }
        .member-id {
            font-weight: bold;
            font-size: 14px;
            background: rgba(255,255,255,0.2);
            padding: 4px 8px;
            border-radius: 4px;
        }
        .card-body {
            padding: 15px 20px;
            display: flex;
            gap: 15px;
            align-items: center;
        }
        .member-photo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid white;
            object-fit: cover;
        }
        .member-details h3 {
            margin: 0 0 5px 0;
            font-size: 18px;
        }
        .member-details p {
            margin: 2px 0;
            font-size: 12px;
            opacity: 0.9;
        }
        .card-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.2);
            padding: 8px 20px;
            font-size: 10px;
            text-align: center;
        }
        .qr-code {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            color: #333;
        }
        @media print {
            body { background: white; }
            .membership-card { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="membership-card">
        <div class="qr-code">QR</div>
        <div class="card-header">
            <div class="logo">
                📚 StudyHub Library
            </div>
            <div class="member-id">${cardData.id}</div>
        </div>
        <div class="card-body">
            <img src="${cardData.photo}" alt="Member Photo" class="member-photo" onerror="this.src='https://via.placeholder.com/60x60/667eea/ffffff?text=${cardData.name.charAt(0)}'">
            <div class="member-details">
                <h3>${cardData.name}</h3>
                <p><strong>Plan:</strong> ${cardData.plan}</p>
                <p><strong>Valid Till:</strong> ${cardData.validTill}</p>
                <p><strong>Issue Date:</strong> ${cardData.issueDate}</p>
            </div>
        </div>
        <div class="card-footer">
            Haldoni, Greater Noida (UP) | +91 98765 43210 | info@studyhublibrary.com
        </div>
    </div>
    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        }
    </script>
</body>
</html>`;
    
    // Create and download HTML file
    const blob = new Blob([cardHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyHub_MembershipCard_${cardData.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Also create a printable version
    const printWindow = window.open('', '_blank', 'width=400,height=300');
    printWindow.document.write(cardHTML);
    printWindow.document.close();
    
    showNotification('Membership card downloaded! Print window opened.', 'success');
}

// Go to Student Portal
function goToStudentPortal() {
    // For now, redirect to main website
    // In future, create a separate student portal
    window.location.href = 'library-website.html';
}

// Form Validation
function setupFormValidation() {
    // Card number validation
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('blur', function() {
            const value = this.value.replace(/\s/g, '');
            if (value && (value.length < 16 || !/^\d+$/.test(value))) {
                this.style.borderColor = '#dc2626';
            } else if (value) {
                this.style.borderColor = '#10b981';
            }
        });
    }
    
    // Expiry date validation
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('blur', function() {
            const value = this.value;
            if (value && !/^\d{2}\/\d{2}$/.test(value)) {
                this.style.borderColor = '#dc2626';
            } else if (value) {
                const [month, year] = value.split('/');
                const currentYear = new Date().getFullYear() % 100;
                const currentMonth = new Date().getMonth() + 1;
                
                if (parseInt(month) < 1 || parseInt(month) > 12 || 
                    parseInt(year) < currentYear || 
                    (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                    this.style.borderColor = '#dc2626';
                } else {
                    this.style.borderColor = '#10b981';
                }
            }
        });
    }
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add inline styles
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
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#dc2626' : '#2563eb'};
        color: ${type === 'success' ? '#065f46' : type === 'error' ? '#991b1b' : '#1e40af'};
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
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('payment-modal')) {
        closePaymentModal();
    }
});

// Handle browser back button
window.addEventListener('beforeunload', function(e) {
    // Save current state if needed
    if (paymentData.registrationId) {
        localStorage.setItem('current_payment_session', JSON.stringify(paymentData));
    }
});
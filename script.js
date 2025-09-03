// LibraryPro - Smart Management System
let students = [];
let payments = [];
let settings = {};

// Helper functions
const getTodayString = () => new Date().toISOString().split('T')[0];

// Data persistence
function saveData() {
    localStorage.setItem('library_students', JSON.stringify(students));
    localStorage.setItem('library_payments', JSON.stringify(payments));
    localStorage.setItem('library_settings', JSON.stringify(settings));
    
    // Sync with main library system
    syncWithMainLibrary();
}

function syncWithMainLibrary() {
    // Store data for main library system access
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('payments', JSON.stringify(payments));
    
    // Create summary for main library dashboard
    const summary = {
        totalStudents: students.length,
        activeStudents: students.filter(s => s.status === 'active').length,
        totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('library1_summary', JSON.stringify(summary));
}

function notifyMainLibrary(payment, student, type = 'payment') {
    try {
        // Get existing main library data
        const mainStudents = JSON.parse(localStorage.getItem('main_library_students') || '[]');
        const mainPayments = JSON.parse(localStorage.getItem('main_library_payments') || '[]');
        
        if (type === 'payment' && payment && student) {
            // Add payment to main library system
            const mainPayment = {
                id: 'LP' + payment.id,
                studentId: student.id,
                studentName: student.name,
                amount: payment.amount,
                date: payment.date,
                period: payment.period,
                nextDue: payment.nextDue,
                method: payment.method,
                source: 'LibraryPro',
                timestamp: new Date().toISOString()
            };
            mainPayments.push(mainPayment);
            localStorage.setItem('main_library_payments', JSON.stringify(mainPayments));
            
            // Update student in main library if exists
            const existingStudentIndex = mainStudents.findIndex(s => s.id === student.id);
            if (existingStudentIndex !== -1) {
                mainStudents[existingStudentIndex] = {
                    ...mainStudents[existingStudentIndex],
                    lastPayment: payment.date,
                    nextDue: payment.nextDue,
                    status: 'active'
                };
            } else {
                // Add student to main library
                mainStudents.push({
                    ...student,
                    source: 'LibraryPro',
                    addedDate: new Date().toISOString()
                });
            }
            localStorage.setItem('main_library_students', JSON.stringify(mainStudents));
        }
        
        if (type === 'new_student' && student) {
            // Add new student to main library
            const existingStudent = mainStudents.find(s => s.id === student.id);
            if (!existingStudent) {
                mainStudents.push({
                    ...student,
                    source: 'LibraryPro',
                    addedDate: new Date().toISOString()
                });
                localStorage.setItem('main_library_students', JSON.stringify(mainStudents));
            }
        }
        
        // Update sync status
        const syncStatus = {
            lastSync: new Date().toISOString(),
            totalSynced: mainStudents.filter(s => s.source === 'LibraryPro').length,
            status: 'success'
        };
        localStorage.setItem('library1_sync_status', JSON.stringify(syncStatus));
        
    } catch (error) {
        console.error('Sync error:', error);
        const syncStatus = {
            lastSync: new Date().toISOString(),
            status: 'error',
            error: error.message
        };
        localStorage.setItem('library1_sync_status', JSON.stringify(syncStatus));
    }
}

function loadData() {
    const storedStudents = localStorage.getItem('library_students');
    const storedPayments = localStorage.getItem('library_payments');
    const storedSettings = localStorage.getItem('library_settings');

    const defaultSettings = {
        libraryName: "LibraryPro",
        membershipFee: 500,
        dueDay: 5,
        notificationDays: 3,
        aiMode: "online"
    };

    if (!storedStudents) {
        students = [
            { id: 'LIB001', name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@example.com', joinDate: '2023-01-15', dueDate: '2024-12-05', amount: 500, status: 'active' },
            { id: 'LIB002', name: 'Priya Patel', phone: '8765432109', email: 'priya@example.com', joinDate: '2023-02-20', dueDate: '2024-11-25', amount: 500, status: 'active' },
            { id: 'LIB003', name: 'Amit Singh', phone: '7654321098', email: 'amit@example.com', joinDate: '2023-03-10', dueDate: getTodayString(), amount: 500, status: 'active' }
        ];
        payments = [
            { id: 'PAY001', studentId: 'LIB001', amount: 500, date: '2024-11-05', period: 'November 2024', nextDue: '2024-12-05', method: 'Cash' }
        ];
        settings = defaultSettings;
        saveData();
    } else {
        students = JSON.parse(storedStudents);
        payments = JSON.parse(storedPayments);
        settings = JSON.parse(storedSettings || JSON.stringify(defaultSettings));
    }
}

// DOM elements
const elements = {
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mainNav: document.getElementById('mainNav'),
    totalStudents: document.getElementById('totalStudents'),
    dueToday: document.getElementById('dueToday'),
    overdue: document.getElementById('overdue'),
    monthlyRevenue: document.getElementById('monthlyRevenue'),
    todayAlerts: document.getElementById('todayAlerts'),
    recentPayments: document.getElementById('recentPayments'),
    studentsTable: document.getElementById('studentsTable'),
    paymentsTable: document.getElementById('paymentsTable'),
    addStudentBtn: document.getElementById('addStudentBtn'),
    studentModal: document.getElementById('studentModal'),
    paymentModal: document.getElementById('paymentModal'),
    detailModal: document.getElementById('detailModal'),
    notification: document.getElementById('notification'),
    chatMessages: document.getElementById('chatMessages'),
    chatInput: document.getElementById('chatInput'),
    sendChatBtn: document.getElementById('sendChatBtn')
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    loadSettings();
    updateAllViews();
    setupEventListeners();
});

function updateAllViews() {
    updateDashboard();
    renderStudentsTable();
    renderPaymentsTable();
    saveData();
}

function setupEventListeners() {
    // Mobile menu
    if (elements.mobileMenuBtn && elements.mainNav) {
        elements.mobileMenuBtn.addEventListener('click', () => {
            elements.mainNav.classList.toggle('show');
        });
    }

    // Tab navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.querySelectorAll('nav a').forEach(tab => tab.classList.remove('active'));
            
            const tabId = e.currentTarget.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            
            if (targetContent) {
                targetContent.classList.add('active');
                e.currentTarget.classList.add('active');
            }
            
            elements.mainNav.classList.remove('show');
        });
    });

    // Modal close events
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn') || e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Form submissions
    const studentForm = document.getElementById('studentForm');
    const paymentForm = document.getElementById('paymentForm');
    const settingsForm = document.getElementById('settingsForm');

    if (studentForm) studentForm.addEventListener('submit', handleStudentSubmit);
    if (paymentForm) paymentForm.addEventListener('submit', handlePaymentSubmit);
    if (settingsForm) settingsForm.addEventListener('submit', handleSettingsSubmit);

    // Add student button
    if (elements.addStudentBtn) {
        elements.addStudentBtn.addEventListener('click', openAddStudentModal);
    }

    // Event delegation for dynamic buttons
    document.addEventListener('click', handleButtonClicks);

    // Chat functionality
    if (elements.sendChatBtn) elements.sendChatBtn.addEventListener('click', sendChatMessage);
    if (elements.chatInput) {
        elements.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }
}

function handleButtonClicks(e) {
    // Pay buttons
    if (e.target.closest('.pay-btn')) {
        e.preventDefault();
        const studentId = e.target.closest('.pay-btn').getAttribute('data-student-id');
        if (studentId) openPaymentModal(studentId);
    }

    // Edit buttons
    if (e.target.closest('.edit-btn')) {
        e.preventDefault();
        const studentId = e.target.closest('.edit-btn').getAttribute('data-student-id');
        if (studentId) openEditStudentModal(studentId);
    }

    // Delete buttons
    if (e.target.closest('.delete-btn')) {
        e.preventDefault();
        const studentId = e.target.closest('.delete-btn').getAttribute('data-student-id');
        if (studentId) deleteStudent(studentId);
    }

    // Print buttons
    if (e.target.closest('.print-btn')) {
        e.preventDefault();
        const paymentId = e.target.closest('.print-btn').getAttribute('data-payment-id');
        if (paymentId) printReceipt(paymentId);
    }

    // Delete payment buttons
    if (e.target.closest('.delete-payment-btn')) {
        e.preventDefault();
        const paymentId = e.target.closest('.delete-payment-btn').getAttribute('data-payment-id');
        if (paymentId) deletePayment(paymentId);
    }

    // Clickable stat cards
    if (e.target.closest('.clickable-card')) {
        const cardType = e.target.closest('.clickable-card').getAttribute('data-type');
        if (cardType) showDetailModal(cardType);
    }

    // AI Feature cards - check for button clicks inside cards
    if (e.target.closest('.ai-feature-card')) {
        e.preventDefault();
        const featureCard = e.target.closest('.ai-feature-card');
        const feature = featureCard.getAttribute('data-feature');
        
        // Add loading state
        const button = featureCard.querySelector('button');
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            button.disabled = true;
            
            setTimeout(() => {
                if (feature) executeAIFeature(feature);
                button.innerHTML = originalText;
                button.disabled = false;
            }, 1000);
        }
    }

    // Quick questions
    if (e.target.closest('.quick-question')) {
        const question = e.target.closest('.quick-question').getAttribute('data-question');
        if (question && elements.chatInput) {
            elements.chatInput.value = question;
            sendChatMessage();
        }
    }

    // Cancel buttons
    if (e.target.id === 'cancelStudentForm' || e.target.id === 'cancelPayment') {
        closeAllModals();
    }
}

// Helper functions
function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-IN', options);
}

function getCurrentMonthYear() {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
}

function calculateNextDueDate(currentDueDateStr) {
    const currentDueDate = new Date(currentDueDateStr + 'T00:00:00');
    currentDueDate.setMonth(currentDueDate.getMonth() + 1);
    currentDueDate.setDate(settings.dueDay);
    return currentDueDate.toISOString().split('T')[0];
}

function showNotification(message, type = 'success') {
    if (!elements.notification) return;
    
    const notificationMessage = document.getElementById('notificationMessage');
    if (notificationMessage) notificationMessage.textContent = message;
    
    elements.notification.className = `notification ${type === 'success' ? 'notification-success' : 'notification-error'}`;
    const icon = elements.notification.querySelector('i');
    if (icon) {
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    }
    elements.notification.classList.add('show');
    setTimeout(() => elements.notification.classList.remove('show'), 5000);
}

function closeAllModals() {
    if (elements.studentModal) elements.studentModal.style.display = 'none';
    if (elements.paymentModal) elements.paymentModal.style.display = 'none';
    if (elements.detailModal) elements.detailModal.style.display = 'none';
}

// Dashboard functions
function updateDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    let dueTodayCount = 0;
    let overdueCount = 0;
    const alerts = [];

    students.forEach(student => {
        if (student.status !== 'active') return;
        const dueDate = new Date(student.dueDate + 'T00:00:00');
        
        if (dueDate < today) {
            if (dueDate <= threeDaysAgo) {
                overdueCount++;
            }
            alerts.push(student);
        } else if (dueDate.getTime() === today.getTime()) {
            dueTodayCount++;
            alerts.push(student);
        }
    });

    if (elements.totalStudents) elements.totalStudents.textContent = students.length;
    if (elements.dueToday) elements.dueToday.textContent = dueTodayCount;
    if (elements.overdue) elements.overdue.textContent = overdueCount;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = payments.reduce((sum, p) => {
        const paymentDate = new Date(p.date + 'T00:00:00');
        if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
            return sum + p.amount;
        }
        return sum;
    }, 0);
    if (elements.monthlyRevenue) elements.monthlyRevenue.textContent = `₹${monthlyRevenue.toLocaleString('en-IN')}`;
    
    // Update alerts table
    if (elements.todayAlerts) {
        elements.todayAlerts.innerHTML = '';
        if (alerts.length === 0) {
            elements.todayAlerts.innerHTML = '<tr><td colspan="6" style="text-align: center;">No alerts for today</td></tr>';
        } else {
            alerts.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).forEach(student => {
                const status = new Date(student.dueDate + 'T00:00:00') < today ? 'Overdue' : 'Due Today';
                const statusClass = status === 'Overdue' ? 'badge-danger' : 'badge-warning';
                const row = `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${formatDate(student.dueDate)}</td>
                        <td>₹${student.amount.toLocaleString('en-IN')}</td>
                        <td><span class="badge ${statusClass}">${status}</span></td>
                        <td>
                            <button class="btn btn-primary btn-sm pay-btn" data-student-id="${student.id}">
                                <i class="fas fa-rupee-sign"></i> Pay Now
                            </button>
                        </td>
                    </tr>
                `;
                elements.todayAlerts.innerHTML += row;
            });
        }
    }
    
    // Update recent payments
    if (elements.recentPayments) {
        elements.recentPayments.innerHTML = '';
        const recent = [...payments].reverse().slice(0, 5);
        if (recent.length === 0) {
            elements.recentPayments.innerHTML = '<tr><td colspan="6" style="text-align: center;">No recent payments</td></tr>';
        } else {
            recent.forEach(p => {
                const student = students.find(s => s.id === p.studentId);
                const row = `
                    <tr>
                        <td>${p.id}</td>
                        <td>${student ? student.name : 'N/A'}</td>
                        <td>₹${p.amount.toLocaleString('en-IN')}</td>
                        <td>${formatDate(p.date)}</td>
                        <td>${formatDate(p.nextDue)}</td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-payment-btn" data-payment-id="${p.id}" title="Delete Payment">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                elements.recentPayments.innerHTML += row;
            });
        }
    }
}

function renderStudentsTable() {
    if (!elements.studentsTable) return;
    
    elements.studentsTable.innerHTML = '';
    if (students.length === 0) {
        elements.studentsTable.innerHTML = '<tr><td colspan="8" style="text-align: center;">No students found</td></tr>';
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    students.forEach(student => {
        let status, statusClass;
        const dueDate = new Date(student.dueDate + 'T00:00:00');
        if (student.status === 'inactive') {
            status = 'Inactive';
            statusClass = 'badge-info';
        } else if (dueDate < today) {
            status = 'Overdue';
            statusClass = 'badge-danger';
        } else if (dueDate.getTime() === today.getTime()) {
            status = 'Due Today';
            statusClass = 'badge-warning';
        } else {
            status = 'Active';
            statusClass = 'badge-success';
        }
        
        const row = `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.phone}<br><small>${student.email || 'No email'}</small></td>
                <td>${formatDate(student.joinDate)}</td>
                <td>${formatDate(student.dueDate)}</td>
                <td>₹${student.amount.toLocaleString('en-IN')}</td>
                <td><span class="badge ${statusClass}">${status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm pay-btn" data-student-id="${student.id}" title="Record Payment">
                            <i class="fas fa-rupee-sign"></i> Pay
                        </button>
                        <button class="btn btn-warning btn-sm edit-btn" data-student-id="${student.id}" title="Edit Student">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-btn" data-student-id="${student.id}" title="Delete Student">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
        elements.studentsTable.innerHTML += row;
    });
}

function renderPaymentsTable() {
    if (!elements.paymentsTable) return;
    
    elements.paymentsTable.innerHTML = '';
    if (payments.length === 0) {
        elements.paymentsTable.innerHTML = '<tr><td colspan="8" style="text-align: center;">No payment records found</td></tr>';
        return;
    }

    [...payments].reverse().forEach(p => {
        const student = students.find(s => s.id === p.studentId);
        const row = `
            <tr>
                <td>${p.id}</td>
                <td>${formatDate(p.date)}</td>
                <td>${student ? student.name : 'Deleted Student'} <br><small>(${p.studentId})</small></td>
                <td>₹${p.amount.toLocaleString('en-IN')}</td>
                <td>${p.period}</td>
                <td>${formatDate(p.nextDue)}</td>
                <td>
                    <button class="btn btn-primary btn-sm print-btn" data-payment-id="${p.id}" title="Print Receipt">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button class="btn btn-danger btn-sm delete-payment-btn" data-payment-id="${p.id}" title="Delete Payment">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        elements.paymentsTable.innerHTML += row;
    });
}

// Student management functions
function openAddStudentModal() {
    const studentForm = document.getElementById('studentForm');
    if (!studentForm || !elements.studentModal) return;
    
    studentForm.reset();
    const studentIdToEdit = document.getElementById('studentIdToEdit');
    if (studentIdToEdit) studentIdToEdit.value = '';
    
    const studentModalTitle = document.getElementById('studentModalTitle');
    const saveStudentBtn = document.getElementById('saveStudentBtn');
    
    if (studentModalTitle) studentModalTitle.innerHTML = '<i class="fas fa-user-plus"></i> Add New Student';
    if (saveStudentBtn) saveStudentBtn.innerHTML = 'Save Student';
    
    const joinDate = document.getElementById('joinDate');
    const firstDueDate = document.getElementById('firstDueDate');
    const initialAmount = document.getElementById('initialAmount');
    
    if (joinDate) joinDate.value = getTodayString();
    if (firstDueDate) firstDueDate.value = getTodayString();
    if (initialAmount) initialAmount.value = settings.membershipFee;
    
    elements.studentModal.style.display = 'flex';
    const studentName = document.getElementById('studentName');
    if (studentName) studentName.focus();
}

function openEditStudentModal(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student || !elements.studentModal) return;

    const studentForm = document.getElementById('studentForm');
    if (studentForm) studentForm.reset();
    
    const studentModalTitle = document.getElementById('studentModalTitle');
    const saveStudentBtn = document.getElementById('saveStudentBtn');
    
    if (studentModalTitle) studentModalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Student';
    if (saveStudentBtn) saveStudentBtn.innerHTML = 'Update Student';
    
    const elements = {
        studentIdToEdit: document.getElementById('studentIdToEdit'),
        studentName: document.getElementById('studentName'),
        studentPhone: document.getElementById('studentPhone'),
        studentEmail: document.getElementById('studentEmail'),
        joinDate: document.getElementById('joinDate'),
        firstDueDate: document.getElementById('firstDueDate'),
        initialAmount: document.getElementById('initialAmount')
    };
    
    if (elements.studentIdToEdit) elements.studentIdToEdit.value = student.id;
    if (elements.studentName) elements.studentName.value = student.name;
    if (elements.studentPhone) elements.studentPhone.value = student.phone;
    if (elements.studentEmail) elements.studentEmail.value = student.email || '';
    if (elements.joinDate) elements.joinDate.value = student.joinDate;
    if (elements.firstDueDate) elements.firstDueDate.value = student.dueDate;
    if (elements.initialAmount) elements.initialAmount.value = student.amount;

    elements.studentModal.style.display = 'flex';
}

function handleStudentSubmit(e) {
    e.preventDefault();
    const studentId = document.getElementById('studentIdToEdit').value;
    if (studentId) {
        updateStudent(studentId);
    } else {
        addNewStudent();
    }
}

function addNewStudent() {
    const formElements = {
        name: document.getElementById('studentName'),
        phone: document.getElementById('studentPhone'),
        email: document.getElementById('studentEmail'),
        joinDate: document.getElementById('joinDate'),
        dueDate: document.getElementById('firstDueDate'),
        amount: document.getElementById('initialAmount')
    };
    
    if (!formElements.name || !formElements.phone || !formElements.joinDate || !formElements.dueDate || !formElements.amount) {
        showNotification('Form elements not found!', 'error');
        return;
    }
    
    const newId = 'LIB' + String(Date.now()).slice(-5);
    const newStudent = {
        id: newId,
        name: formElements.name.value,
        phone: formElements.phone.value,
        email: formElements.email ? formElements.email.value : '',
        joinDate: formElements.joinDate.value,
        dueDate: formElements.dueDate.value,
        amount: parseInt(formElements.amount.value),
        status: 'active'
    };
    
    students.push(newStudent);
    
    // Notify main library system about new student
    notifyMainLibrary(null, newStudent, 'new_student');
    
    showNotification(`Student ${newStudent.name} added successfully!`);
    closeAllModals();
    updateAllViews();
}

function updateStudent(studentId) {
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;

    const formElements = {
        name: document.getElementById('studentName'),
        phone: document.getElementById('studentPhone'),
        email: document.getElementById('studentEmail'),
        joinDate: document.getElementById('joinDate'),
        dueDate: document.getElementById('firstDueDate'),
        amount: document.getElementById('initialAmount')
    };
    
    if (!formElements.name || !formElements.phone || !formElements.joinDate || !formElements.dueDate || !formElements.amount) {
        showNotification('Form elements not found!', 'error');
        return;
    }

    students[studentIndex] = {
        ...students[studentIndex],
        name: formElements.name.value,
        phone: formElements.phone.value,
        email: formElements.email ? formElements.email.value : '',
        joinDate: formElements.joinDate.value,
        dueDate: formElements.dueDate.value,
        amount: parseInt(formElements.amount.value)
    };
    
    showNotification(`Student ${students[studentIndex].name} updated successfully!`);
    closeAllModals();
    updateAllViews();
}

function deleteStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) {
        showNotification('Student not found!', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${student.name}? This cannot be undone.`)) {
        students = students.filter(s => s.id !== studentId);
        showNotification(`Student ${student.name} deleted successfully.`);
        updateAllViews();
    }
}

function deletePayment(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) {
        showNotification('Payment not found!', 'error');
        return;
    }
    
    const student = students.find(s => s.id === payment.studentId);
    const studentName = student ? student.name : 'Unknown Student';
    
    if (confirm(`Are you sure you want to delete payment ${payment.id} for ${studentName}? This cannot be undone.`)) {
        payments = payments.filter(p => p.id !== paymentId);
        showNotification(`Payment ${payment.id} deleted successfully.`);
        updateAllViews();
    }
}

// Payment functions
function openPaymentModal(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) {
        showNotification('Student not found!', 'error');
        return;
    }
    
    if (!elements.paymentModal) {
        showNotification('Payment form not available!', 'error');
        return;
    }
    
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) paymentForm.reset();
    
    const paymentStudentId = document.getElementById('paymentStudentId');
    const paymentStudentName = document.getElementById('paymentStudentName');
    const paymentAmount = document.getElementById('paymentAmount');
    const paymentDate = document.getElementById('paymentDate');
    const paymentPeriod = document.getElementById('paymentPeriod');
    
    if (paymentStudentId) paymentStudentId.value = studentId;
    if (paymentStudentName) paymentStudentName.textContent = student.name;
    if (paymentAmount) paymentAmount.value = student.amount;
    if (paymentDate) paymentDate.value = getTodayString();
    if (paymentPeriod) paymentPeriod.value = getCurrentMonthYear();
    
    elements.paymentModal.style.display = 'flex';
}

function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const paymentStudentId = document.getElementById('paymentStudentId');
    const paymentAmount = document.getElementById('paymentAmount');
    const paymentDate = document.getElementById('paymentDate');
    const paymentPeriod = document.getElementById('paymentPeriod');
    const paymentMethod = document.getElementById('paymentMethod');
    
    if (!paymentStudentId || !paymentAmount || !paymentDate || !paymentPeriod || !paymentMethod) {
        showNotification('Payment form elements not found!', 'error');
        return;
    }
    
    const studentId = paymentStudentId.value;
    const student = students.find(s => s.id === studentId);
    if (!student) {
        showNotification('Student not found!', 'error');
        return;
    }
    
    const nextDueDate = calculateNextDueDate(student.dueDate);
    
    const newPayment = {
        id: 'PAY' + String(Date.now()).slice(-5),
        studentId: studentId,
        amount: parseInt(paymentAmount.value),
        date: paymentDate.value,
        period: paymentPeriod.value,
        nextDue: nextDueDate,
        method: paymentMethod.value
    };
    
    payments.push(newPayment);
    student.dueDate = nextDueDate;
    student.amount = parseInt(paymentAmount.value);
    
    // Notify main library system about new payment
    notifyMainLibrary(newPayment, student);
    
    showNotification(`Payment for ${student.name} recorded successfully! Next due: ${formatDate(nextDueDate)}`);
    closeAllModals();
    updateAllViews();
}

function printReceipt(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) {
        showNotification('Payment record not found!', 'error');
        return;
    }
    
    const student = students.find(s => s.id === payment.studentId);
    const currentDate = new Date().toLocaleDateString('en-IN');
    
    const receiptContent = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Payment Receipt - ${payment.id}</title>
                <style>
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        margin: 0; 
                        padding: 20px;
                        background: #f8f9fa;
                    }
                    .receipt-container {
                        max-width: 400px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 10px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        overflow: hidden;
                    }
                    .receipt-header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 20px;
                        text-align: center;
                    }
                    .receipt-body {
                        padding: 25px;
                    }
                    h1 { 
                        margin: 0;
                        font-size: 1.5rem;
                        font-weight: 700;
                    }
                    .subtitle {
                        margin: 5px 0 0 0;
                        opacity: 0.9;
                        font-size: 0.9rem;
                    }
                    .receipt-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 12px 0;
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .receipt-row:last-child {
                        border-bottom: none;
                    }
                    .label {
                        font-weight: 600;
                        color: #333;
                    }
                    .value {
                        color: #666;
                        text-align: right;
                    }
                    .amount {
                        font-size: 1.2rem;
                        font-weight: 700;
                        color: #2563eb;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        padding-top: 15px;
                        border-top: 2px solid #eee;
                        color: #666;
                        font-size: 0.85rem;
                    }
                    @media print {
                        body { background: white; }
                        .receipt-container { box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <div class="receipt-header">
                        <h1>${settings.libraryName}</h1>
                        <p class="subtitle">Payment Receipt</p>
                    </div>
                    <div class="receipt-body">
                        <div class="receipt-row">
                            <span class="label">Receipt ID:</span>
                            <span class="value">${payment.id}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Date:</span>
                            <span class="value">${formatDate(payment.date)}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Student:</span>
                            <span class="value">${student ? student.name : 'N/A'}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Student ID:</span>
                            <span class="value">${payment.studentId}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Amount Paid:</span>
                            <span class="value amount">₹${payment.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Period:</span>
                            <span class="value">${payment.period}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Payment Method:</span>
                            <span class="value">${payment.method}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Next Due Date:</span>
                            <span class="value">${formatDate(payment.nextDue)}</span>
                        </div>
                        <div class="footer">
                            <p>Thank you for your payment!</p>
                            <p>Generated on: ${currentDate}</p>
                        </div>
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
        </html>
    `;
    
    try {
        const printWindow = window.open('', '_blank', 'width=600,height=800');
        if (printWindow) {
            printWindow.document.write(receiptContent);
            printWindow.document.close();
            printWindow.focus();
            showNotification('Receipt opened in new window');
        } else {
            showNotification('Please allow popups to print receipt', 'error');
        }
    } catch (error) {
        showNotification('Error printing receipt', 'error');
    }
}

// Settings functions
function loadSettings() {
    const headerLibraryName = document.getElementById('headerLibraryName');
    const libraryNameInput = document.getElementById('libraryName');
    const membershipFeeInput = document.getElementById('membershipFee');
    const dueDayInput = document.getElementById('dueDay');
    const notificationDaysInput = document.getElementById('notificationDays');
    const aiModeInput = document.getElementById('aiMode');
    
    if (headerLibraryName) headerLibraryName.textContent = settings.libraryName;
    if (libraryNameInput) libraryNameInput.value = settings.libraryName;
    if (membershipFeeInput) membershipFeeInput.value = settings.membershipFee;
    if (dueDayInput) dueDayInput.value = settings.dueDay;
    if (notificationDaysInput) notificationDaysInput.value = settings.notificationDays;
    if (aiModeInput) aiModeInput.value = settings.aiMode || 'online';
}

function handleSettingsSubmit(e) {
    e.preventDefault();
    
    const libraryNameInput = document.getElementById('libraryName');
    const membershipFeeInput = document.getElementById('membershipFee');
    const dueDayInput = document.getElementById('dueDay');
    const notificationDaysInput = document.getElementById('notificationDays');
    const aiModeInput = document.getElementById('aiMode');
    const headerLibraryName = document.getElementById('headerLibraryName');
    
    if (libraryNameInput) settings.libraryName = libraryNameInput.value;
    if (membershipFeeInput) settings.membershipFee = parseInt(membershipFeeInput.value);
    if (dueDayInput) settings.dueDay = parseInt(dueDayInput.value);
    if (notificationDaysInput) settings.notificationDays = parseInt(notificationDaysInput.value);
    if (aiModeInput) settings.aiMode = aiModeInput.value;
    
    if (headerLibraryName) headerLibraryName.textContent = settings.libraryName;
    showNotification(`Settings saved! AI mode: ${settings.aiMode === 'online' ? 'General Knowledge' : 'Library Only'}`);
    saveData();
}

// Detail modal functions
function showDetailModal(type) {
    if (!elements.detailModal) return;
    
    const detailModalTitle = document.getElementById('detailModalTitle');
    const detailContent = document.getElementById('detailContent');
    
    if (!detailModalTitle || !detailContent) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    
    let title = '';
    let content = '';
    
    switch(type) {
        case 'total-students':
            title = `All Students (${students.length})`;
            content = generateStudentsList(students);
            break;
            
        case 'due-today':
            const dueToday = students.filter(s => {
                if (s.status !== 'active') return false;
                const dueDate = new Date(s.dueDate + 'T00:00:00');
                return dueDate.getTime() === today.getTime();
            });
            title = `Due Today (${dueToday.length})`;
            content = dueToday.length > 0 ? generateStudentsList(dueToday) : '<p style="text-align: center; padding: 20px;">No students due today</p>';
            break;
            
        case 'overdue':
            const overdue = students.filter(s => {
                if (s.status !== 'active') return false;
                const dueDate = new Date(s.dueDate + 'T00:00:00');
                return dueDate <= threeDaysAgo;
            });
            title = `Overdue 3+ Days (${overdue.length})`;
            content = overdue.length > 0 ? generateStudentsList(overdue) : '<p style="text-align: center; padding: 20px;">No overdue students</p>';
            break;
            
        case 'monthly-revenue':
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const monthlyPayments = payments.filter(p => {
                const paymentDate = new Date(p.date + 'T00:00:00');
                return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
            });
            const totalRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
            title = `This Month Payments (₹${totalRevenue.toLocaleString('en-IN')})`;
            content = monthlyPayments.length > 0 ? generatePaymentsList(monthlyPayments) : '<p style="text-align: center; padding: 20px;">No payments this month</p>';
            break;
    }
    
    detailModalTitle.innerHTML = title;
    detailContent.innerHTML = content;
    elements.detailModal.style.display = 'flex';
}

function generateStudentsList(studentsList) {
    return `
        <div style="overflow-x: auto;">
            <table style="width: 100%; margin: 0;">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${studentsList.map(student => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const dueDate = new Date(student.dueDate + 'T00:00:00');
                        
                        let status, statusClass;
                        if (dueDate < today) {
                            const daysDiff = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                            status = `${daysDiff} days overdue`;
                            statusClass = 'badge-danger';
                        } else if (dueDate.getTime() === today.getTime()) {
                            status = 'Due Today';
                            statusClass = 'badge-warning';
                        } else {
                            status = 'Active';
                            statusClass = 'badge-success';
                        }
                        
                        return `
                            <tr>
                                <td>${student.id}</td>
                                <td>${student.name}</td>
                                <td>${student.phone}</td>
                                <td>${formatDate(student.dueDate)}</td>
                                <td>₹${student.amount.toLocaleString('en-IN')}</td>
                                <td><span class="badge ${statusClass}">${status}</span></td>
                                <td>
                                    <button class="btn btn-primary btn-sm pay-btn" data-student-id="${student.id}">
                                        <i class="fas fa-rupee-sign"></i> Pay
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generatePaymentsList(paymentsList) {
    return `
        <div style="overflow-x: auto;">
            <table style="width: 100%; margin: 0;">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Student</th>
                        <th>Amount</th>
                        <th>Period</th>
                        <th>Method</th>
                        <th>Receipt</th>
                    </tr>
                </thead>
                <tbody>
                    ${paymentsList.map(payment => {
                        const student = students.find(s => s.id === payment.studentId);
                        return `
                            <tr>
                                <td>${formatDate(payment.date)}</td>
                                <td>${student ? student.name : 'N/A'}<br><small>${payment.studentId}</small></td>
                                <td>₹${payment.amount.toLocaleString('en-IN')}</td>
                                <td>${payment.period}</td>
                                <td>${payment.method}</td>
                                <td>
                                    <button class="btn btn-primary btn-sm print-btn" data-payment-id="${payment.id}">
                                        <i class="fas fa-print"></i> Print
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// AI Functions
function executeAIFeature(feature) {
    // Show notification that AI is working
    showNotification('AI is analyzing your data...', 'success');
    
    // Scroll to chat section to show results
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
        chatContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    switch(feature) {
        case 'smart-insights':
            generateSmartInsights();
            break;
        case 'payment-predictions':
            generatePaymentPredictions();
            break;
        case 'auto-reminders':
            generateSmartReminders();
            break;
        case 'revenue-forecast':
            generateRevenueForecast();
            break;
        default:
            addAIMessage('AI Assistant', 'Feature not implemented yet. Please try another option.');
    }
}

function generateSmartInsights() {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const overdueStudents = students.filter(s => {
        const dueDate = new Date(s.dueDate + 'T00:00:00');
        return dueDate < today && s.status === 'active';
    }).length;
    
    const monthlyPayments = payments.filter(p => {
        const paymentDate = new Date(p.date + 'T00:00:00');
        return paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear;
    });
    
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
    const avgPayment = monthlyPayments.length > 0 ? monthlyRevenue / monthlyPayments.length : 0;
    const collectionRate = totalStudents > 0 ? ((totalStudents - overdueStudents) / totalStudents * 100).toFixed(1) : 0;
    
    const insights = [
        `📊 Collection Rate: ${collectionRate}% (${totalStudents - overdueStudents}/${totalStudents} students paid on time)`,
        `💰 Average Payment: ₹${avgPayment.toLocaleString('en-IN')} per transaction`,
        `📈 Monthly Performance: ${monthlyPayments.length} payments totaling ₹${monthlyRevenue.toLocaleString('en-IN')}`,
        `⚠️ Risk Analysis: ${overdueStudents} students need immediate attention`,
        `🎯 Recommendation: ${overdueStudents > 0 ? 'Focus on overdue collections to improve cash flow' : 'Excellent payment discipline! Consider expanding membership'}`
    ];
    
    const response = `🧠 **Smart Insights Analysis Complete!**\n\n📊 **Performance Metrics:**\n• Collection Rate: ${collectionRate}% (${totalStudents - overdueStudents}/${totalStudents} students)\n• Average Payment: ₹${Math.round(avgPayment).toLocaleString('en-IN')} per transaction\n• Monthly Performance: ${monthlyPayments.length} payments = ₹${monthlyRevenue.toLocaleString('en-IN')}\n\n⚠️ **Risk Analysis:**\n• ${overdueStudents} students need immediate attention\n• ${activeStudents} active students out of ${totalStudents} total\n\n🎯 **AI Recommendation:**\n${overdueStudents > 0 ? '• Focus on overdue collections to improve cash flow\n• Send personalized reminders to late payers\n• Consider payment plan options' : '• Excellent payment discipline!\n• Consider expanding membership\n• Implement referral programs'}`;
    
    addAIMessage('Smart Insights', response);
}

function generatePaymentPredictions() {
    const today = new Date();
    const predictions = [];
    
    students.forEach(student => {
        if (student.status !== 'active') return;
        
        const dueDate = new Date(student.dueDate + 'T00:00:00');
        const daysDiff = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
        
        let riskLevel = 'low';
        let riskText = 'Low Risk';
        
        if (daysDiff <= 0) {
            riskLevel = 'high';
            riskText = 'High Risk - Overdue';
        } else if (daysDiff <= 3) {
            riskLevel = 'medium';
            riskText = 'Medium Risk - Due Soon';
        }
        
        predictions.push({
            student: student.name,
            dueDate: formatDate(student.dueDate),
            riskLevel,
            riskText,
            recommendation: riskLevel === 'high' ? 'Send immediate reminder' : 
                          riskLevel === 'medium' ? 'Send gentle reminder' : 'Monitor normally'
        });
    });
    
    predictions.sort((a, b) => {
        const riskOrder = { high: 3, medium: 2, low: 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    });
    
    const predictionHTML = predictions.slice(0, 10).map(pred => 
        `<div class="insight-item prediction-${pred.riskLevel}">
            <strong>${pred.student}</strong> - ${pred.riskText}<br>
            <small>Due: ${pred.dueDate} | Action: ${pred.recommendation}</small>
        </div>`
    ).join('');
    
    const highRisk = predictions.filter(p => p.riskLevel === 'high');
    const mediumRisk = predictions.filter(p => p.riskLevel === 'medium');
    const lowRisk = predictions.filter(p => p.riskLevel === 'low');
    
    let response = `🔮 **Payment Prediction Analysis Complete!**\n\n📊 **Risk Summary:**\n• 🔴 High Risk: ${highRisk.length} students\n• 🟡 Medium Risk: ${mediumRisk.length} students\n• 🟢 Low Risk: ${lowRisk.length} students\n\n`;
    
    if (highRisk.length > 0) {
        response += `⚠️ **Immediate Attention Required:**\n`;
        highRisk.slice(0, 5).forEach(pred => {
            const daysDiff = Math.floor((new Date(pred.dueDate) - today) / (1000 * 60 * 60 * 24));
            response += `• ${pred.student} - Due ${formatDate(pred.dueDate)} (${Math.abs(daysDiff)} days ${daysDiff < 0 ? 'overdue' : 'remaining'})\n`;
        });
        response += `\n`;
    }
    
    response += `🎯 **AI Recommendations:**\n• Send immediate reminders to overdue students\n• Schedule follow-up calls for high-risk cases\n• Implement automated reminder system\n• Consider payment plan options for struggling students`;
    
    addAIMessage('Payment Predictions', response);
}

function generateSmartReminders() {
    const today = new Date();
    const reminders = [];
    
    students.forEach(student => {
        if (student.status !== 'active') return;
        
        const dueDate = new Date(student.dueDate + 'T00:00:00');
        const daysDiff = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 3 && daysDiff >= -7) {
            let message = '';
            if (daysDiff < 0) {
                message = `Dear ${student.name}, your library membership payment is ${Math.abs(daysDiff)} days overdue. Please pay ₹${student.amount} at your earliest convenience to avoid service interruption.`;
            } else if (daysDiff === 0) {
                message = `Hi ${student.name}! Your library membership payment of ₹${student.amount} is due today. Please make the payment to continue enjoying our services.`;
            } else {
                message = `Hello ${student.name}, this is a friendly reminder that your library membership payment of ₹${student.amount} is due in ${daysDiff} days on ${formatDate(student.dueDate)}.`;
            }
            
            reminders.push({
                student: student.name,
                phone: student.phone,
                message,
                urgency: daysDiff < 0 ? 'high' : daysDiff === 0 ? 'medium' : 'low'
            });
        }
    });
    
    const reminderHTML = reminders.map(reminder => 
        `<div class="insight-item prediction-${reminder.urgency}">
            <strong>${reminder.student}</strong> (${reminder.phone})<br>
            <em>"${reminder.message}"</em>
        </div>`
    ).join('');
    
    if (reminders.length === 0) {
        addAIMessage('Smart Reminders', '🎉 **Great News!** No reminders needed at this time. All students are up to date with their payments!');
        return;
    }
    
    let response = `📱 **Smart Reminder Messages Generated!**\n\n📊 **Summary:**\n• Total reminders: ${reminders.length}\n• High priority: ${reminders.filter(r => r.urgency === 'high').length}\n• Medium priority: ${reminders.filter(r => r.urgency === 'medium').length}\n• Low priority: ${reminders.filter(r => r.urgency === 'low').length}\n\n💬 **Ready-to-Send Messages:**\n\n`;
    
    reminders.slice(0, 5).forEach((reminder, index) => {
        const priorityEmoji = reminder.urgency === 'high' ? '🔴' : reminder.urgency === 'medium' ? '🟡' : '🟢';
        response += `${priorityEmoji} **${reminder.student}** (${reminder.phone})\n"${reminder.message}"\n\n---\n\n`;
    });
    
    response += `🎯 **Next Steps:**\n• Copy messages and send via WhatsApp/SMS\n• Track responses and follow up\n• Update payment status after collection`;
    
    addAIMessage('Smart Reminders', response);
}

function generateRevenueForecast() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const last3Months = [];
    for (let i = 2; i >= 0; i--) {
        const month = new Date(currentYear, currentMonth - i, 1);
        const monthPayments = payments.filter(p => {
            const paymentDate = new Date(p.date + 'T00:00:00');
            return paymentDate.getMonth() === month.getMonth() && paymentDate.getFullYear() === month.getFullYear();
        });
        const revenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
        last3Months.push({ month: month.toLocaleString('default', { month: 'long' }), revenue });
    }
    
    const avgRevenue = last3Months.reduce((sum, m) => sum + m.revenue, 0) / last3Months.length;
    const trend = last3Months.length > 1 ? (last3Months[2].revenue - last3Months[0].revenue) / 2 : 0;
    
    const nextMonthForecast = Math.max(0, avgRevenue + trend);
    const next3MonthsForecast = Math.max(0, nextMonthForecast * 3 + (trend * 3));
    
    const forecastHTML = `
        <div class="insight-item">
            <strong>Historical Performance:</strong><br>
            ${last3Months.map(m => `${m.month}: ₹${m.revenue.toLocaleString('en-IN')}`).join('<br>')}
        </div>
        <div class="insight-item">
            <strong>Next Month Forecast:</strong> ₹${nextMonthForecast.toLocaleString('en-IN')}<br>
            <small>Based on ${trend >= 0 ? 'positive' : 'negative'} trend of ₹${Math.abs(trend).toLocaleString('en-IN')}/month</small>
        </div>
        <div class="insight-item">
            <strong>Next 3 Months Forecast:</strong> ₹${next3MonthsForecast.toLocaleString('en-IN')}<br>
            <small>Projected total revenue for the quarter</small>
        </div>
        <div class="insight-item">
            <strong>Recommendation:</strong> ${trend >= 0 ? 
                'Revenue is trending upward. Consider marketing to new students.' : 
                'Revenue is declining. Focus on retention and overdue collections.'}
        </div>
    `;
    
    const trendDirection = trend > 0 ? '📈 Growing' : trend < 0 ? '📉 Declining' : '➡️ Stable';
    
    let response = `📊 **Revenue Forecast Analysis Complete!**\n\n📈 **Historical Performance:**\n`;
    
    last3Months.forEach(m => {
        response += `• ${m.month}: ₹${m.revenue.toLocaleString('en-IN')}\n`;
    });
    
    response += `\n📊 **Key Metrics:**\n• Average Monthly: ₹${Math.round(avgRevenue).toLocaleString('en-IN')}\n• Current Trend: ${trendDirection}\n• Active Students: ${students.filter(s => s.status === 'active').length}\n\n🔮 **AI Predictions:**\n• Next Month: ₹${Math.round(nextMonthForecast).toLocaleString('en-IN')}\n• Next 3 Months: ₹${Math.round(next3MonthsForecast).toLocaleString('en-IN')}\n\n🎯 **Strategic Recommendations:**\n`;
    
    if (trend > 0) {
        response += `• 🚀 Revenue growing! Consider expanding marketing\n• Add premium services\n• Implement referral programs`;
    } else if (trend < 0) {
        response += `• ⚠️ Revenue declining. Focus on retention\n• Collect overdue payments\n• Review pricing strategy`;
    } else {
        response += `• ➡️ Stable revenue. Explore new opportunities\n• Diversify services\n• Optimize operations`;
    }
    
    addAIMessage('Revenue Forecast', response);
}

// Chat functions
function sendChatMessage() {
    if (!elements.chatInput || !elements.chatMessages) return;
    
    const message = elements.chatInput.value.trim();
    if (!message) return;
    
    addUserMessage(message);
    elements.chatInput.value = '';
    
    // Show typing indicator
    addTypingIndicator();
    
    if (settings.aiMode === 'online') {
        getOnlineAIResponse(message);
    } else {
        setTimeout(() => {
            removeTypingIndicator();
            const response = generateAIResponse(message);
            addAIMessage('AI Assistant', response);
        }, 1000);
    }
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Extract month and year from message
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                       'july', 'august', 'september', 'october', 'november', 'december',
                       'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    // Check for specific month queries
    let targetMonth = currentMonth;
    let targetYear = currentYear;
    
    // Extract year from message
    const yearMatch = message.match(/20\d{2}/);
    if (yearMatch) {
        targetYear = parseInt(yearMatch[0]);
    }
    
    // Extract month from message
    monthNames.forEach((month, index) => {
        const monthIndex = index >= 12 ? index - 12 : index;
        if (lowerMessage.includes(month)) {
            targetMonth = monthIndex;
        }
    });
    
    // Hindi/Hinglish support
    const hindiKeywords = {
        'kitna': 'how much',
        'kya': 'what',
        'kaun': 'who',
        'kab': 'when',
        'kaise': 'how',
        'revenue': 'revenue',
        'paisa': 'money',
        'student': 'student',
        'bachche': 'students',
        'fees': 'fees',
        'payment': 'payment'
    };
    
    // Multi-language support
    if (lowerMessage.includes('revenue') || lowerMessage.includes('kitna') || 
        lowerMessage.includes('nov') || lowerMessage.includes('november') ||
        lowerMessage.includes('income') || lowerMessage.includes('paisa') ||
        lowerMessage.includes('earning') || lowerMessage.includes('collection')) {
        
        const monthlyPayments = payments.filter(p => {
            const paymentDate = new Date(p.date + 'T00:00:00');
            return paymentDate.getMonth() === targetMonth && paymentDate.getFullYear() === targetYear;
        });
        
        const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
        const monthName = new Date(targetYear, targetMonth).toLocaleString('default', { month: 'long' });
        
        if (monthlyRevenue === 0) {
            return `${monthName} ${targetYear} में कोई revenue नहीं था। No payments were recorded for ${monthName} ${targetYear}. यह हो सकता है कि:\n\n• Students ने अभी तक payment नहीं की हो\n• Data entry pending हो\n• Students inactive हों\n\nCurrent status:\n• Total Students: ${students.length}\n• Active Students: ${students.filter(s => s.status === 'active').length}\n\nRecommendation: Check with students और payment records verify करें।`;
        }
        
        return `${monthName} ${targetYear} का revenue था ₹${monthlyRevenue.toLocaleString('en-IN')}\n\nDetails:\n• Total Payments: ${monthlyPayments.length}\n• Average Payment: ₹${Math.round(monthlyRevenue/monthlyPayments.length).toLocaleString('en-IN')}\n• Collection Rate: ${((monthlyPayments.length/students.length)*100).toFixed(1)}%\n\n${monthlyRevenue > 10000 ? 'Excellent performance! 🎉' : 'Good collection, can be improved 📈'}`;
    }
    
    // Overdue queries
    if (lowerMessage.includes('overdue') || lowerMessage.includes('late') || 
        lowerMessage.includes('pending') || lowerMessage.includes('due') ||
        lowerMessage.includes('बकाया') || lowerMessage.includes('देर')) {
        
        const today = new Date();
        const overdueStudents = students.filter(s => {
            const dueDate = new Date(s.dueDate + 'T00:00:00');
            return dueDate < today && s.status === 'active';
        });
        
        if (overdueStudents.length === 0) {
            return `Great news! 🎉 कोई भी student overdue नहीं है।\n\nAll students are up to date with their payments. Keep up the excellent work!`;
        }
        
        const overdueAmount = overdueStudents.reduce((sum, s) => sum + s.amount, 0);
        const studentNames = overdueStudents.slice(0, 3).map(s => s.name).join(', ');
        
        return `Currently ${overdueStudents.length} students हैं overdue:\n\n• Total Overdue Amount: ₹${overdueAmount.toLocaleString('en-IN')}\n• Students: ${studentNames}${overdueStudents.length > 3 ? ` और ${overdueStudents.length - 3} more...` : ''}\n\nRecommendation: Send reminders immediately to improve cash flow। 📞`;
    }
    
    // Student queries
    if (lowerMessage.includes('student') || lowerMessage.includes('member') ||
        lowerMessage.includes('bachche') || lowerMessage.includes('छात्र')) {
        
        const totalStudents = students.length;
        const activeStudents = students.filter(s => s.status === 'active').length;
        const newThisMonth = students.filter(s => {
            const joinDate = new Date(s.joinDate + 'T00:00:00');
            return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
        }).length;
        
        return `Student Statistics 📊:\n\n• Total Students: ${totalStudents}\n• Active Students: ${activeStudents}\n• New This Month: ${newThisMonth}\n• Inactive: ${totalStudents - activeStudents}\n\n${totalStudents > 50 ? 'Your library is quite popular! 🌟' : 'Consider marketing to attract more members 📢'}\n\nGrowth Rate: ${newThisMonth > 0 ? `+${newThisMonth} this month 📈` : 'No new additions this month'}`;
    }
    
    // Payment method queries
    if (lowerMessage.includes('payment method') || lowerMessage.includes('upi') ||
        lowerMessage.includes('cash') || lowerMessage.includes('card')) {
        
        const paymentMethods = {};
        payments.forEach(p => {
            paymentMethods[p.method] = (paymentMethods[p.method] || 0) + 1;
        });
        
        const methodStats = Object.entries(paymentMethods)
            .map(([method, count]) => `• ${method}: ${count} payments`)
            .join('\n');
        
        return `Payment Method Analysis 💳:\n\n${methodStats}\n\nMost Popular: ${Object.keys(paymentMethods).reduce((a, b) => paymentMethods[a] > paymentMethods[b] ? a : b)}\n\nRecommendation: Encourage digital payments for better tracking! 📱`;
    }
    
    // Marketing and growth queries
    if (lowerMessage.includes('marketing') || lowerMessage.includes('growth') ||
        lowerMessage.includes('expand') || lowerMessage.includes('promote')) {
        
        const monthlyGrowth = students.filter(s => {
            const joinDate = new Date(s.joinDate + 'T00:00:00');
            return joinDate.getMonth() === currentMonth;
        }).length;
        
        const suggestions = [
            '📢 Social media campaigns targeting students',
            '🎓 Partner with local schools and colleges',
            '💰 Offer referral bonuses to existing members',
            '📚 Organize reading events and workshops',
            '🏷️ Create seasonal discount offers',
            '📱 Develop a mobile app for easy access'
        ];
        
        return `Marketing Insights 🚀:\n\nCurrent Growth: ${monthlyGrowth} new students this month\n\nMarketing Suggestions:\n${suggestions.join('\n')}\n\nFocus Area: ${students.length < 50 ? 'Student acquisition' : 'Retention and premium services'}`;
    }
    
    // Trend analysis
    if (lowerMessage.includes('trend') || lowerMessage.includes('analysis') ||
        lowerMessage.includes('performance') || lowerMessage.includes('report')) {
        
        const last3Months = [];
        for (let i = 2; i >= 0; i--) {
            const month = new Date(currentYear, currentMonth - i, 1);
            const monthPayments = payments.filter(p => {
                const paymentDate = new Date(p.date + 'T00:00:00');
                return paymentDate.getMonth() === month.getMonth();
            });
            const revenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
            last3Months.push({
                month: month.toLocaleString('default', { month: 'short' }),
                revenue,
                payments: monthPayments.length
            });
        }
        
        const trendData = last3Months.map(m => `${m.month}: ₹${m.revenue.toLocaleString('en-IN')} (${m.payments} payments)`).join('\n');
        const avgRevenue = last3Months.reduce((sum, m) => sum + m.revenue, 0) / 3;
        
        return `Performance Trend 📈:\n\n${trendData}\n\nAverage Monthly Revenue: ₹${avgRevenue.toLocaleString('en-IN')}\n\nTrend: ${last3Months[2].revenue > last3Months[0].revenue ? 'Growing 📈' : 'Declining 📉'}\n\nRecommendation: ${avgRevenue > 15000 ? 'Excellent performance! Consider expansion.' : 'Focus on retention and new acquisitions.'}`;
    }
    
    // General help and greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') ||
        lowerMessage.includes('namaste') || lowerMessage.includes('help')) {
        return `Hello! 👋 मैं आपका AI Library Assistant हूं।\n\nI can help you with:\n• Revenue analysis (किसी भी month का)\n• Student statistics\n• Payment trends\n• Marketing suggestions\n• Performance reports\n\nJust ask me anything like:\n"Nov 2024 में kitna revenue था?"\n"How many students are overdue?"\n"Marketing tips दो"`;
    }
    
    // Default intelligent responses
    const smartResponses = [
        `I understand you're asking about library management. Could you be more specific? 🤔\n\nTry asking:\n• "November 2024 revenue kitna tha?"\n• "Overdue students kaun hain?"\n• "Marketing tips chahiye"`,
        `मैं आपकी library के बारे में सब कुछ जानता हूं! 📚\n\nCurrent Status:\n• Students: ${students.length}\n• This Month Revenue: ₹${payments.filter(p => new Date(p.date).getMonth() === currentMonth).reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}\n\nWhat would you like to know more about?`,
        `I'm here to help with your library data analysis! 📊\n\nPopular queries:\n• Revenue by month\n• Student performance\n• Payment trends\n• Growth strategies\n\nAsk me anything in Hindi or English!`
    ];
    
    return smartResponses[Math.floor(Math.random() * smartResponses.length)];
}

function addUserMessage(message) {
    if (!elements.chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function addAIMessage(title, content) {
    if (!elements.chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="ai-result">
                <h4><i class="fas fa-brain"></i> ${title}</h4>
                ${content}
            </div>
        </div>
    `;
    
    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// Online AI Functions
function addTypingIndicator() {
    if (!elements.chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    
    elements.chatMessages.appendChild(typingDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function getOnlineAIResponse(message) {
    try {
        // First check if it's a library-specific question
        if (isLibraryQuestion(message)) {
            removeTypingIndicator();
            const localResponse = generateAIResponse(message);
            addAIMessage('AI Assistant', localResponse);
            return;
        }
        
        // Use advanced AI response system
        const response = generateAdvancedAIResponse(message);
        
        removeTypingIndicator();
        addAIMessage('AI Assistant', response);
        
    } catch (error) {
        removeTypingIndicator();
        const fallbackResponse = generateAdvancedAIResponse(message);
        addAIMessage('AI Assistant', fallbackResponse);
    }
}

function isLibraryQuestion(message) {
    const libraryKeywords = [
        'revenue', 'student', 'payment', 'overdue', 'library', 'fees', 'collection',
        'kitna', 'kaun', 'bachche', 'paisa', 'november', 'october', 'december',
        'marketing', 'trend', 'analysis', 'performance'
    ];
    
    return libraryKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
    );
}

function generateGeneralResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
        lowerMessage.includes('hey') || lowerMessage.includes('namaste')) {
        return `Hello! 👋 I'm your AI assistant. I can help you with:\n\n• Library management questions\n• General knowledge queries\n• Data analysis and insights\n• Marketing and business advice\n\nWhat would you like to know?`;
    }
    
    if (lowerMessage.includes('how are you') || lowerMessage.includes('kaise ho')) {
        return `I'm doing great! 😊 I'm here and ready to help you with anything you need.\n\nI can assist with:\n• Your library data analysis\n• General questions\n• Business insights\n• Technical help\n\nWhat can I help you with today?`;
    }
    
    if (lowerMessage.includes('who are you') || lowerMessage.includes('kaun ho')) {
        return `I'm your AI Assistant! 🤖\n\nI'm designed to help with:\n• Library management insights\n• Data analysis and reporting\n• General knowledge questions\n• Business and marketing advice\n\nI can understand both English and Hindi, so feel free to ask me anything!`;
    }
    
    if (lowerMessage.includes('owner') || lowerMessage.includes('creator') || 
        lowerMessage.includes('who made') || lowerMessage.includes('developer')) {
        return `This LibraryPro system was created as a smart library management solution! 🏗️\n\nFeatures:\n• Student management\n• Payment tracking\n• AI-powered insights\n• Revenue analysis\n• Marketing tools\n\nI'm here to help you manage your library efficiently. What would you like to know about the system?`;
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('date') ||
        lowerMessage.includes('today') || lowerMessage.includes('samay')) {
        const now = new Date();
        return `Current date and time: 📅\n\n• Date: ${now.toLocaleDateString('en-IN')}\n• Time: ${now.toLocaleTimeString('en-IN')}\n• Day: ${now.toLocaleDateString('en-IN', { weekday: 'long' })}\n\nIs there anything specific about dates or scheduling you'd like help with?`;
    }
    
    const responses = [
        `That's an interesting question! 🤔 I'm here to help with:\n\n• Library management\n• Data analysis\n• General knowledge\n• Business advice\n\nWhat would you like to know more about?`,
        
        `I'm here to assist! 🚀 Whether it's about:\n\n• Your library operations\n• Student management\n• Revenue analysis\n• General questions\n\nFeel free to ask me anything!`,
        
        `Great question! 💡 I can help with:\n\n• Library insights\n• Business analysis\n• General knowledge\n• Technical support\n\nWhat specific area interests you?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}
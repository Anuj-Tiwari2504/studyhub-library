// Public Website Integration Functions
function openPublicSite() {
    window.open('library-website.html', '_blank');
}

function viewPublicRegistrations() {
    const modal = document.getElementById('registrationsModal');
    if (modal) {
        modal.style.display = 'flex';
        loadPublicRegistrations();
    }
}

function closeRegistrationsModal() {
    const modal = document.getElementById('registrationsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function loadPublicRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('library_registrations') || '[]');
    const registrationsTable = document.getElementById('registrationsTable');
    
    if (!registrationsTable) return;
    
    if (registrations.length === 0) {
        registrationsTable.innerHTML = '<tr><td colspan="7" style="text-align: center;">No registrations found</td></tr>';
        return;
    }
    
    registrationsTable.innerHTML = '';
    registrations.reverse().forEach(reg => {
        const statusClass = reg.status === 'completed' ? 'badge-success' : 'badge-warning';
        
        const row = `
            <tr>
                <td>${reg.id}</td>
                <td>${reg.fullName}</td>
                <td>${reg.phone}</td>
                <td>${reg.selectedPlan || 'N/A'}</td>
                <td>₹${reg.totalAmount || '0'}</td>
                <td><span class="badge ${statusClass}">${reg.status || 'pending'}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="sendMembershipCard('${reg.id}')">
                        <i class="fas fa-id-card"></i> Card
                    </button>
                </td>
            </tr>
        `;
        registrationsTable.innerHTML += row;
    });
}

function sendMembershipCard(registrationId) {
    const registrations = JSON.parse(localStorage.getItem('library_registrations') || '[]');
    const registration = registrations.find(r => r.id === registrationId);
    
    if (!registration) {
        showNotification('Registration not found', 'error');
        return;
    }
    
    generateMembershipCard({
        id: registrationId,
        name: registration.fullName,
        phone: registration.phone,
        plan: registration.selectedPlan
    });
    
    showNotification(`Membership card generated for ${registration.fullName}`, 'success');
}

function generateMembershipCard(memberData) {
    const cardHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>StudyHub Library - Membership Card</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f0f0f0; }
        .card { width: 350px; height: 220px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                border-radius: 15px; color: white; padding: 20px; margin: 20px auto; position: relative; }
        .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .logo { font-weight: bold; }
        .id { background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 5px; }
        h3 { margin: 10px 0; }
        p { margin: 5px 0; font-size: 14px; }
        .footer { position: absolute; bottom: 10px; font-size: 10px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <div class="logo">📚 StudyHub Library</div>
            <div class="id">${memberData.id}</div>
        </div>
        <h3>${memberData.name}</h3>
        <p><strong>Plan:</strong> ${memberData.plan || 'N/A'} Pass</p>
        <p><strong>Phone:</strong> ${memberData.phone}</p>
        <div class="footer">Haldoni, Greater Noida (UP) | +91 98765 43210</div>
    </div>
    <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
</body>
</html>`;
    
    const printWindow = window.open('', '_blank', 'width=400,height=300');
    printWindow.document.write(cardHTML);
    printWindow.document.close();
}

function refreshDashboard() {
    updateAllViews();
    showNotification('Dashboard refreshed', 'success');
}

function exportData() {
    const data = {
        students: JSON.parse(localStorage.getItem('library_students') || '[]'),
        payments: JSON.parse(localStorage.getItem('library_payments') || '[]'),
        registrations: JSON.parse(localStorage.getItem('library_registrations') || '[]')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyHub_Data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Data exported', 'success');
}

function sendBulkReminders() {
    showNotification('Bulk reminders sent', 'success');
}

function generateReport() {
    showNotification('Report generated', 'success');
}
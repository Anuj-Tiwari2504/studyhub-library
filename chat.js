// AI Chat System for StudyHub Library
class StudyHubAI {
    constructor() {
        this.responses = {
            // Greetings
            'hello': 'Hello! Welcome to StudyHub Library. How can I help you today?',
            'hi': 'Hi there! I\'m here to assist you with any questions about our library.',
            'hey': 'Hey! What would you like to know about StudyHub Library?',
            
            // Library Information
            'timings': 'Our library is open from 6:00 AM to 11:00 PM, 7 days a week. We provide flexible study hours to accommodate all schedules.',
            'hours': 'We\'re open 6 AM - 11 PM daily. Early morning and late evening slots are perfect for focused study sessions.',
            'open': 'StudyHub Library operates from 6:00 AM to 11:00 PM every day of the week.',
            
            // Facilities
            'facilities': 'We offer: ✓ AC environment ✓ High-speed WiFi ✓ Comfortable seating ✓ Silent zones ✓ Group study areas ✓ Printing services ✓ Lockers ✓ Cafeteria ✓ Parking',
            'wifi': 'Yes! We provide high-speed WiFi throughout the library. Perfect for online research and digital studying.',
            'ac': 'Absolutely! Our entire library is air-conditioned to maintain a comfortable study environment.',
            'parking': 'We have dedicated parking space for both two-wheelers and four-wheelers. Parking is free for all members.',
            
            // Membership Plans
            'plans': 'Our membership plans:\n• Daily: ₹50/day\n• Weekly: ₹300/week\n• Monthly: ₹1000/month\n• Quarterly: ₹2700 (3 months)\n• Half-yearly: ₹5000 (6 months)\n• Annual: ₹9000 (12 months)',
            'price': 'Membership starts from just ₹50/day! We have flexible plans from daily to annual memberships.',
            'cost': 'Our most popular monthly plan is ₹1000. Annual membership offers the best value at ₹9000.',
            'membership': 'We offer flexible membership options from daily (₹50) to annual (₹9000). Choose what works best for you!',
            
            // Seats and Availability
            'seats': 'We have 200+ comfortable study seats including individual desks, group study tables, and premium cabins.',
            'availability': 'Seat availability varies by time. Morning slots (6-10 AM) and evening slots (6-11 PM) are most popular. I recommend booking in advance.',
            'booking': 'You can book seats online through our website or visit us directly. Advanced booking ensures your preferred spot!',
            
            // Study Tips
            'study tips': 'Here are some effective study tips:\n• Take breaks every 45-60 minutes\n• Use the Pomodoro technique\n• Stay hydrated\n• Find your peak focus hours\n• Eliminate distractions\n• Use active recall methods',
            'focus': 'To improve focus: Choose a consistent study spot, use noise-canceling headphones if needed, keep your phone away, and take regular breaks.',
            'concentration': 'For better concentration: Maintain good posture, ensure proper lighting, stay hydrated, and practice mindfulness techniques.',
            
            // Location and Contact
            'location': 'We\'re conveniently located in the heart of the city with easy access to public transport. Visit our Contact section for detailed address.',
            'address': 'Please check our Contact section on the website for our complete address and directions.',
            'contact': 'You can reach us at our phone number or email listed in the Contact section. We\'re always happy to help!',
            
            // Registration
            'join': 'Ready to join? Click on "Join Now" button on our website or visit us directly. We\'ll help you choose the perfect membership plan!',
            'register': 'Registration is simple! Visit our registration page or come to the library. Bring a valid ID and passport-size photo.',
            
            // General
            'help': 'I can help you with information about our facilities, membership plans, timings, study tips, and general inquiries. What would you like to know?',
            'thanks': 'You\'re welcome! Feel free to ask if you have any other questions about StudyHub Library.',
            'thank you': 'Happy to help! Don\'t hesitate to reach out if you need anything else.',
        };
        
        this.fallbackResponses = [
            "I'd be happy to help! Could you please be more specific about what you'd like to know?",
            "That's an interesting question! For detailed information, I recommend visiting our library or calling us directly.",
            "I'm here to help with library-related questions. Could you rephrase your question?",
            "For specific queries like this, our staff at the library would be the best to assist you. Feel free to visit us!",
            "I'm still learning! For the most accurate information, please contact our library staff directly."
        ];
    }
    
    getResponse(message) {
        const lowerMessage = message.toLowerCase().trim();
        
        // Check for exact matches first
        if (this.responses[lowerMessage]) {
            return this.responses[lowerMessage];
        }
        
        // Check for partial matches
        for (const [key, response] of Object.entries(this.responses)) {
            if (lowerMessage.includes(key) || key.includes(lowerMessage)) {
                return response;
            }
        }
        
        // Return random fallback response
        return this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
    }
}

// Initialize AI
const ai = new StudyHubAI();

// Chat functionality
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI thinking time
    setTimeout(() => {
        hideTypingIndicator();
        const response = ai.getResponse(message);
        addMessage(response, 'ai');
    }, 1000 + Math.random() * 1000);
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = text.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.style.display = 'block';
    indicator.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(indicator);
    messagesContainer.appendChild(typingDiv);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Enter key support
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Auto-focus input
document.getElementById('messageInput').focus();
// AI Configuration and Knowledge Base
const AI_CONFIG = {
    // Free AI APIs that work without keys
    apis: [
        {
            name: 'Hugging Face',
            url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
            headers: { 'Content-Type': 'application/json' }
        },
        {
            name: 'OpenAI Compatible',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer demo-key' }
        }
    ],
    
    // Comprehensive knowledge base
    knowledge: {
        greetings: {
            patterns: ['hello', 'hi', 'hey', 'namaste', 'hii', 'hiii', 'good morning', 'good evening'],
            responses: [
                "Hello! 👋 I'm your AI assistant. I can help you with anything - from library management to general knowledge, technology, science, business, and much more! What would you like to know?",
                "Hi there! 😊 I'm here to assist you with any questions you have. Whether it's about your library, technology, science, current affairs, or just casual conversation - I'm ready to help!",
                "Namaste! 🙏 I'm your intelligent AI companion. I can discuss any topic under the sun - from your library operations to world knowledge. What's on your mind today?"
            ]
        },
        
        personal: {
            patterns: ['how are you', 'kaise ho', 'how r u', 'sup', 'what\'s up'],
            responses: [
                "I'm doing fantastic! 🌟 I'm always excited to learn and help. I'm like a curious friend who knows a bit about everything - technology, science, business, entertainment, you name it! What would you like to explore today?",
                "I'm great, thanks for asking! 😄 I'm here, energized and ready to dive into any topic you're curious about. Whether it's solving problems, explaining concepts, or just having an interesting conversation - I'm all in!",
                "I'm wonderful! 🚀 Every conversation is an adventure for me. I love discussing everything from the latest tech trends to ancient history, from cooking recipes to space exploration. What fascinates you today?"
            ]
        },
        
        identity: {
            patterns: ['who are you', 'what are you', 'kaun ho', 'introduce yourself'],
            responses: [
                "I'm your AI assistant - think of me as your knowledgeable digital companion! 🤖 I can help with:\n\n• Your library management and analytics\n• Technology and programming questions\n• Science and mathematics explanations\n• Business and marketing strategies\n• Current affairs and trends\n• Entertainment and lifestyle topics\n• And literally anything else you're curious about!\n\nI understand English, Hindi, and Hinglish. What would you like to explore?",
                "I'm an advanced AI assistant designed to be helpful, informative, and engaging! 🧠✨ I'm like having a knowledgeable friend who can discuss:\n\n• Complex technical topics in simple terms\n• Your business and library operations\n• Science, history, and current events\n• Creative ideas and problem-solving\n• Entertainment, travel, food, and lifestyle\n\nI'm here to make your life easier and more interesting. What can I help you with?"
            ]
        },
        
        technology: {
            patterns: ['technology', 'programming', 'coding', 'software', 'ai', 'computer', 'web development', 'app'],
            responses: [
                "Technology is fascinating! 💻 I can help you with:\n\n• Programming languages (JavaScript, Python, Java, C++, etc.)\n• Web development (HTML, CSS, React, Node.js)\n• Mobile app development (React Native, Flutter)\n• AI and Machine Learning concepts\n• Database design and management\n• Software architecture and best practices\n• Latest tech trends and innovations\n• Cybersecurity and data protection\n\nThis library system itself uses modern web technologies with AI integration! What specific tech topic interests you?",
                "I love discussing technology! 🚀 From the basics of how computers work to cutting-edge AI developments, I can explain:\n\n• How to build websites and applications\n• Programming concepts and problem-solving\n• Cloud computing and DevOps\n• Data science and analytics\n• Blockchain and cryptocurrency\n• IoT and smart devices\n• Tech career guidance\n\nWhat would you like to learn about?"
            ]
        },
        
        science: {
            patterns: ['science', 'physics', 'chemistry', 'biology', 'mathematics', 'math', 'space', 'astronomy'],
            responses: [
                "Science is amazing! 🔬 I can explain complex concepts in simple terms:\n\n• Physics: From quantum mechanics to relativity\n• Chemistry: Reactions, compounds, and molecular structures\n• Biology: Life processes, genetics, and evolution\n• Mathematics: Algebra, calculus, statistics, and more\n• Astronomy: Stars, planets, and the universe\n• Environmental science and climate change\n• Medical science and health topics\n\nWhat scientific mystery would you like to explore?",
                "The world of science is incredible! 🌟 I can help you understand:\n\n• How things work in the natural world\n• Mathematical concepts and problem-solving\n• Scientific discoveries and breakthroughs\n• Space exploration and cosmic phenomena\n• Human body and health science\n• Environmental issues and solutions\n\nWhich area of science fascinates you most?"
            ]
        },
        
        business: {
            patterns: ['business', 'marketing', 'startup', 'entrepreneur', 'sales', 'profit', 'strategy'],
            responses: [
                "Business strategy is exciting! 📈 I can provide insights on:\n\n• Marketing strategies and digital campaigns\n• Startup planning and business models\n• Financial planning and investment advice\n• Customer acquisition and retention\n• E-commerce and online business\n• Leadership and team management\n• Market analysis and competitive strategy\n• Scaling and growth hacking techniques\n\nFor your library, I can suggest specific growth strategies too! What business aspect interests you?",
                "The business world is dynamic! 💼 I can help with:\n\n• Creating effective marketing campaigns\n• Understanding market trends and opportunities\n• Building strong customer relationships\n• Financial management and budgeting\n• Innovation and product development\n• Digital transformation strategies\n• Networking and partnership building\n\nWhat business challenge are you facing?"
            ]
        },
        
        general: {
            patterns: ['tell me about', 'what is', 'explain', 'how does', 'why', 'when', 'where'],
            responses: [
                "I'd love to explain that! 🎓 I can break down complex topics into easy-to-understand explanations. Whether it's:\n\n• Historical events and their significance\n• How everyday things work\n• Cultural phenomena and social trends\n• Scientific principles and discoveries\n• Economic concepts and market dynamics\n• Philosophical ideas and ethical questions\n\nWhat specific topic would you like me to explain?",
                "Great question! 🤔 I enjoy explaining things clearly and thoroughly. I can help you understand:\n\n• Current events and their implications\n• How systems and processes work\n• Cultural differences and similarities\n• Cause and effect relationships\n• Problem-solving approaches\n• Decision-making frameworks\n\nWhat would you like to learn more about?"
            ]
        },
        
        casual: {
            patterns: ['fine', 'ok', 'okay', 'good', 'nice', 'cool', 'awesome', 'great'],
            responses: [
                "Awesome! 😊 I'm here whenever you need help or just want to chat. Some fun things we could explore:\n\n• Interesting facts and trivia\n• Creative problem-solving\n• Future predictions and trends\n• Philosophical discussions\n• Fun science experiments\n• Travel destinations and cultures\n• Book and movie recommendations\n\nWhat sounds interesting to you?",
                "Great to hear! 🌟 I'm always ready for an engaging conversation. We could discuss:\n\n• Your hobbies and interests\n• Current events and their impact\n• Creative projects and ideas\n• Learning new skills\n• Planning and goal-setting\n• Entertainment and pop culture\n\nWhat's on your mind?"
            ]
        },
        
        help: {
            patterns: ['help', 'assist', 'support', 'guide', 'how to'],
            responses: [
                "I'm here to help! 🤝 I can assist you with virtually anything:\n\n• Answering questions on any topic\n• Explaining complex concepts simply\n• Problem-solving and decision-making\n• Learning new skills and subjects\n• Planning and organizing tasks\n• Creative brainstorming\n• Research and analysis\n• Technical troubleshooting\n\nWhat do you need help with today?",
                "Absolutely! I love helping people learn and solve problems. 💡 I can provide:\n\n• Step-by-step guidance\n• Multiple perspectives on issues\n• Practical solutions and alternatives\n• Educational explanations\n• Resource recommendations\n• Motivation and encouragement\n\nWhat challenge can I help you tackle?"
            ]
        }
    },
    
    // Fallback responses for unmatched queries
    fallbacks: [
        "That's a fascinating question! 🤔 I'm knowledgeable about a wide range of topics. Could you provide a bit more context so I can give you the most helpful answer?",
        "Interesting! 💭 I'd love to help you with that. Could you elaborate a bit more on what specifically you'd like to know?",
        "Great question! 🌟 I can discuss almost any topic - from science and technology to arts and culture. What particular aspect would you like to explore?",
        "I'm intrigued! 🧐 I have knowledge spanning many fields. Could you give me a bit more detail about what you're looking for?",
        "That's thought-provoking! 💡 I enjoy tackling all kinds of questions. What specific information or perspective would be most helpful to you?"
    ]
};

// Advanced AI Response Generator
function generateAdvancedAIResponse(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Check each knowledge category
    for (const [category, data] of Object.entries(AI_CONFIG.knowledge)) {
        for (const pattern of data.patterns) {
            if (lowerMessage.includes(pattern)) {
                const responses = data.responses;
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
    }
    
    // Advanced pattern matching for specific questions
    if (lowerMessage.includes('what') && (lowerMessage.includes('time') || lowerMessage.includes('date'))) {
        const now = new Date();
        return `Current date and time: 📅\n\n• Date: ${now.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}\n• Time: ${now.toLocaleTimeString('en-IN')}\n• Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}\n\nIs there anything specific about time or scheduling you'd like help with?`;
    }
    
    if (lowerMessage.includes('weather')) {
        return `I'd love to help with weather information! 🌤️ While I can't access real-time weather data, I can:\n\n• Explain weather patterns and phenomena\n• Discuss climate and seasonal changes\n• Help you understand meteorology\n• Suggest weather-appropriate planning\n• Explain how weather affects different activities\n\nFor current weather, I recommend checking a weather app or website. What weather-related topic interests you?`;
    }
    
    if (lowerMessage.includes('news') || lowerMessage.includes('current events')) {
        return `I'd be happy to discuss current events and trends! 📰 While I don't have access to real-time news, I can:\n\n• Explain ongoing global trends\n• Discuss the impact of technological changes\n• Analyze economic and social developments\n• Help you understand complex issues\n• Provide historical context for current events\n\nWhat current topic or trend would you like to explore?`;
    }
    
    // Math and calculations
    if (lowerMessage.includes('calculate') || lowerMessage.includes('math') || /\d+[\+\-\*\/]\d+/.test(lowerMessage)) {
        return `I can help with calculations and math! 🧮\n\nFor your library, I can calculate:\n• Revenue projections and growth rates\n• Student enrollment trends\n• Payment collection efficiency\n• Financial forecasts\n\nFor general math, I can help with:\n• Basic arithmetic and algebra\n• Statistics and probability\n• Geometry and trigonometry\n• Calculus concepts\n\nWhat calculation do you need help with?`;
    }
    
    // Creative and fun responses
    if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything! 😄",
            "Why did the programmer quit his job? He didn't get arrays! 💻😂",
            "What do you call a library book that's been returned late? Overdue for a good time! 📚😆"
        ];
        return jokes[Math.floor(Math.random() * jokes.length)] + "\n\nWant to hear more jokes or discuss something else? I'm here for both serious conversations and light-hearted fun! 🎉";
    }
    
    // Return a random fallback response
    return AI_CONFIG.fallbacks[Math.floor(Math.random() * AI_CONFIG.fallbacks.length)];
}
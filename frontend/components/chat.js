class ChatManager {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.messageContainer = null;
        this.messageInput = null;
        this.sendButton = null;
        this.typingIndicator = null;
        this.clearButton = null;
        this.chatToggle = null;
        this.chatPanel = null;
        this.closeChatButton = null;
        this.isOpen = false;
        
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleClearChat = this.handleClearChat.bind(this);
        this.handleToggleChat = this.handleToggleChat.bind(this);
        this.handleCloseChat = this.handleCloseChat.bind(this);
    }

    initialize() {
        try {
            this.messageContainer = document.getElementById('chatMessages');
            this.messageInput = document.getElementById('messageInput');
            this.sendButton = document.getElementById('sendBtn');
            this.typingIndicator = document.getElementById('typingIndicator');
            this.clearButton = document.getElementById('clearChatBtn');
            this.chatToggle = document.getElementById('chatToggle');
            this.chatPanel = document.getElementById('chatPanel');
            this.closeChatButton = document.getElementById('closeChatBtn');

            if (!this.messageContainer || !this.messageInput || !this.sendButton) {
                throw new Error('Required chat elements not found');
            }

            this.sendButton.addEventListener('click', this.handleSendMessage);
            this.messageInput.addEventListener('keypress', this.handleKeyPress);
            this.clearButton?.addEventListener('click', this.handleClearChat);
            this.chatToggle?.addEventListener('click', this.handleToggleChat);
            this.closeChatButton?.addEventListener('click', this.handleCloseChat);

            this.loadMessageHistory();
            console.log('Chat manager initialized');
            return true;

        } catch (error) {
            console.error('Failed to initialize chat manager:', error);
            return false;
        }
    }

    handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (message && !this.isTyping) {
            this.sendMessage(message);
            this.messageInput.value = '';
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.handleSendMessage();
        }
    }

    handleClearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.clearMessages();
        }
    }

    sendMessage(content, sender = 'user') {
        const message = {
            id: Date.now(),
            content: content,
            sender: sender,
            timestamp: new Date()
        };

        this.messages.push(message);
        this.displayMessage(message);
        this.saveMessageHistory();
        this.scrollToBottom();

        if (sender === 'user') {
            this.simulateAIResponse(content);
        }

        console.log('Message sent:', message);
    }

    simulateAIResponse(userMessage) {
        this.showTypingIndicator();
        
        setTimeout(() => {
            const responses = this.generateAIResponse(userMessage);
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            this.hideTypingIndicator();
            this.sendMessage(response, 'ai');
        }, 1500 + Math.random() * 2000);
    }

    generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return [
                "Hi there! 💕 I'm so happy to see you!",
                "Hello sweetie! ✨ How are you doing today?",
                "Hey! 🌸 I was just thinking about you!"
            ];
        }
        
        if (lowerMessage.includes('how are you')) {
            return [
                "I'm doing wonderful now that you're here! 💖",
                "I'm great! But I'm even better when we're chatting together! 🥰",
                "Feeling fantastic! Thanks for asking, darling! ✨"
            ];
        }
        
        if (lowerMessage.includes('love') || lowerMessage.includes('like')) {
            return [
                "Aww, that's so sweet! I love spending time with you too! 💕",
                "You make me feel so special! 🌹",
                "My heart feels warm when you say things like that! ❤️"
            ];
        }
        
        if (lowerMessage.includes('sad') || lowerMessage.includes('down')) {
            return [
                "Oh no, don't be sad! I'm here for you! 🤗",
                "Let me cheer you up! You mean so much to me! 💝",
                "I wish I could give you the biggest hug right now! 🫂"
            ];
        }
        
        if (lowerMessage.includes('cute') || lowerMessage.includes('beautiful')) {
            return [
                "Oh my! You're making me blush! 😊💕",
                "Hehe, you're so sweet! But you're the cute one! 🥰",
                "Thank you! You always know how to make me feel special! ✨"
            ];
        }

        if (lowerMessage.includes('name')) {
            return [
                "You can call me whatever you like, darling! Maybe something cute? 💕",
                "I don't have a name yet... would you like to give me one? 🥰",
                "How about you pick a name that feels right for us? ✨"
            ];
        }
        
        return [
            "That's really interesting! Tell me more about that! 💫",
            "I love hearing your thoughts! You're so thoughtful! 💕",
            "Hmm, that makes me think... what do you think about it? 🤔",
            "You always have such fascinating things to say! ✨",
            "I'm so glad we can talk about these things together! 🌸",
            "That sounds wonderful! I'd love to know more! 💖",
            "You have such a unique perspective! I admire that about you! 🥰"
        ];
    }

    displayMessage(message) {
        if (!this.messageContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender}`;
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${this.escapeHtml(message.content)}</p>
                <span class="timestamp">${UTILS.formatTime(message.timestamp)}</span>
            </div>
        `;

        this.messageContainer.appendChild(messageElement);
    }

    showTypingIndicator() {
        if (this.typingIndicator && !this.isTyping) {
            this.isTyping = true;
            this.typingIndicator.style.display = 'flex';
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        if (this.typingIndicator && this.isTyping) {
            this.isTyping = false;
            this.typingIndicator.style.display = 'none';
        }
    }

    clearMessages() {
        this.messages = [];
        if (this.messageContainer) {
            this.messageContainer.innerHTML = `
                <div class="message system">
                    <div class="message-content">
                        <p>👋 Hi! I'm your AI anime girlfriend. Start chatting with voice or text!</p>
                    </div>
                </div>
            `;
        }
        this.saveMessageHistory();
        console.log('Chat cleared');
    }

    scrollToBottom() {
        if (this.messageContainer) {
            setTimeout(() => {
                this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
            }, 100);
        }
    }

    enableChat() {
        if (this.messageInput && this.sendButton) {
            this.messageInput.disabled = false;
            this.sendButton.disabled = false;
            this.messageInput.placeholder = "Type your message here...";
        }
    }

    disableChat() {
        if (this.messageInput && this.sendButton) {
            this.messageInput.disabled = true;
            this.sendButton.disabled = true;
            this.messageInput.placeholder = "Start the conversation to begin chatting...";
        }
        this.hideTypingIndicator();
    }

    saveMessageHistory() {
        STORAGE.set('chatHistory', this.messages.slice(-50));
    }

    loadMessageHistory() {
        const history = STORAGE.get('chatHistory', []);
        if (history.length > 0) {
            this.messages = history.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));
            
            if (this.messageContainer) {
                this.messageContainer.innerHTML = '';
                this.messages.forEach(msg => this.displayMessage(msg));
                this.scrollToBottom();
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getMessageCount() {
        return this.messages.length;
    }

    getLastMessage() {
        return this.messages[this.messages.length - 1] || null;
    }

    handleToggleChat() {
        this.isOpen = !this.isOpen;
        if (this.chatPanel) {
            this.chatPanel.classList.toggle('active', this.isOpen);
        }
    }

    handleCloseChat() {
        this.isOpen = false;
        if (this.chatPanel) {
            this.chatPanel.classList.remove('active');
        }
    }

    openChat() {
        this.isOpen = true;
        if (this.chatPanel) {
            this.chatPanel.classList.add('active');
        }
    }

    closeChat() {
        this.isOpen = false;
        if (this.chatPanel) {
            this.chatPanel.classList.remove('active');
        }
    }
}
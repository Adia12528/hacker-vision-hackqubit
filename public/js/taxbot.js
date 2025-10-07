class TaxBot {
    constructor() {
        this.chatContainer = document.getElementById('chat-container');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        
        this.init();
    }
    
    init() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        this.addBotMessage("Hello! I'm TaxBot. How can I help you with your tax filing today? You can ask me about deductions, tax regimes, Form-16, or anything else related to income tax!");
    }
    
    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;
        
        this.addUserMessage(message);
        this.userInput.value = '';
        
        // Simulate bot thinking
        this.addBotMessage("Thinking...", true);
        
        const response = await this.getBotResponse(message);
        
        // Remove "Thinking..." message
        const thinkingMsg = this.chatContainer.lastChild;
        if (thinkingMsg.textContent === "Thinking...") {
            this.chatContainer.removeChild(thinkingMsg);
        }
        
        this.addBotMessage(response);
    }
    
    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = message;
        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addBotMessage(message, isThinking = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.textContent = message;
        if (isThinking) {
            messageDiv.style.fontStyle = 'italic';
            messageDiv.style.color = '#6b7280';
        }
        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    async getBotResponse(message) {
        // Simple rule-based responses
        const responses = {
            'hello': 'Hi there! How can I assist you with your taxes today?',
            'hi': 'Hello! I\'m here to help with your tax questions. What would you like to know?',
            '80c': 'Section 80C allows deductions up to ₹1.5 lakh for various investments and expenses like:\n• EPF/PPF\n• ELSS Mutual Funds\n• Life Insurance Premiums\n• Home Loan Principal Repayment\n• NSC\n• 5-year Tax Saver FDs\n• Children\'s Tuition Fees',
            'hra': 'HRA (House Rent Allowance) exemption depends on:\n1. Actual HRA received\n2. 50% of basic salary (metro) or 40% (non-metro)\n3. Actual rent paid minus 10% of basic salary\nYou need rent receipts and landlord PAN if rent exceeds ₹1 lakh annually.',
            'regime': 'The New Tax Regime has lower rates but fewer deductions, while the Old Regime allows more deductions but has higher rates. Generally:\n• Choose New Regime if your deductions are less than ₹3.75 lakh\n• Choose Old Regime if you have substantial deductions\nI can help you compare if you provide your income details!',
            'form16': 'Form-16 is a TDS certificate from your employer containing:\n• Salary breakdown\n• TDS deducted\n• Other income details\n• Deductions claimed\nYou can upload it in Step 2 of our filing process for automatic data extraction.',
            'deduction': 'Common deductions include:\n• 80C: ₹1.5 lakh (investments)\n• 80D: ₹25,000-₹1 lakh (health insurance)\n• 80E: Education loan interest\n• HRA: Rent allowance\n• 80G: Donations\nWhich deduction would you like to know more about?',
            'itr': 'ITR stands for Income Tax Return. You need to file it every year to declare your income and taxes paid. I can guide you through the steps or help you choose the right ITR form.',
            'due date': 'The due date for filing ITR for individuals is usually July 31st of the assessment year. Extensions may apply for certain cases.',
            'refund': 'Tax refund is the excess tax paid that you can claim back. You can track your refund status in the Refund History section.',
            'pan': 'PAN (Permanent Account Number) is a unique identifier for taxpayers in India. It is mandatory for filing taxes and financial transactions.',
            'audit': 'Tax audit is required if your business turnover exceeds ₹1 crore (or ₹50 lakh for professionals). I can help you understand audit requirements.',
            'advance tax': 'Advance tax is paid in installments if your tax liability exceeds ₹10,000 in a year. It helps avoid interest penalties.',
            'thank': 'You\'re welcome! Feel free to ask if you have more tax-related questions.',
            'bye': 'Goodbye! Remember to file your ITR before the deadline. Come back if you need more help!'
        };
        
        const lowerMessage = message.toLowerCase();
        
        // Check for exact matches first
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        // Check for related terms
        if (lowerMessage.includes('tax') || lowerMessage.includes('income')) {
            return "I can help you with tax calculations, deductions, regime comparison, and filing procedures. Could you be more specific about what you'd like to know?";
        }
        
        if (lowerMessage.includes('investment') || lowerMessage.includes('save')) {
            return "For tax savings, consider Section 80C options like PPF, ELSS, or insurance. Section 80D offers benefits for health insurance. Would you like details about specific investment options?";
        }
        
        return "I understand you're asking about taxes. For more specific assistance, please provide details about:\n• Your income range\n• Current investments\n• Specific deductions you're considering\nOr ask about: Section 80C, HRA, Old vs New regime, Form-16, etc.";
    }
}

// Initialize TaxBot and expose askQuestion for voice
let taxBotInstance;
function askQuestion(q) {
    if (taxBotInstance) {
        taxBotInstance.userInput.value = q;
        taxBotInstance.sendMessage();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    taxBotInstance = new TaxBot();
    window.askQuestion = askQuestion;
});
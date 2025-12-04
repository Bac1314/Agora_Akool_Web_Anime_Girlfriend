// Language component for handling language switching
class LanguageComponent {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
    }

    initializeElements() {
        // Language button and modal
        this.languageBtn = document.getElementById('languageBtn');
        this.languageModal = document.getElementById('languageModal');
        this.closeLanguageBtn = document.getElementById('closeLanguageBtn');
        this.languageOptions = document.querySelectorAll('.language-option');
        
        // Settings language select
        this.languageSelect = document.getElementById('languageSelect');
    }

    bindEvents() {
        // Language button click
        if (this.languageBtn) {
            this.languageBtn.addEventListener('click', () => this.showLanguageModal());
        }

        // Close language modal
        if (this.closeLanguageBtn) {
            this.closeLanguageBtn.addEventListener('click', () => this.hideLanguageModal());
        }

        // Language option clicks
        this.languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = e.currentTarget.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });

        // Language select change
        if (this.languageSelect) {
            this.languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.updateUI();
        });

        // Close modal when clicking outside
        if (this.languageModal) {
            this.languageModal.addEventListener('click', (e) => {
                if (e.target === this.languageModal) {
                    this.hideLanguageModal();
                }
            });
        }
    }

    showLanguageModal() {
        if (this.languageModal) {
            this.languageModal.style.display = 'flex';
            this.updateActiveLanguage();
        }
    }

    hideLanguageModal() {
        if (this.languageModal) {
            this.languageModal.style.display = 'none';
        }
    }

    changeLanguage(lang) {
        if (window.i18n && window.i18n.setLanguage(lang)) {
            this.hideLanguageModal();
            this.updateActiveLanguage();
            
            // Show a brief notification
            this.showLanguageChangeNotification(lang);
        }
    }

    updateActiveLanguage() {
        const currentLang = window.i18n?.getCurrentLanguage() || 'ja';
        
        // Update modal options
        this.languageOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        // Update settings select
        if (this.languageSelect) {
            this.languageSelect.value = currentLang;
        }
    }

    updateUI() {
        this.updateActiveLanguage();
        
        // Update language select options
        if (this.languageSelect && window.i18n) {
            const options = this.languageSelect.querySelectorAll('option');
            const languages = window.i18n.getAvailableLanguages();
            
            options.forEach((option, index) => {
                if (languages[index]) {
                    option.textContent = `${languages[index].flag} ${languages[index].name}`;
                }
            });
        }
    }

    showLanguageChangeNotification(lang) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        
        const langNames = {
            'ja': '🇯🇵 日本語',
            'en': '🇺🇸 English', 
            'ko': '🇰🇷 한국어',
            'zh': '🇨🇳 中文'
        };
        
        notification.textContent = langNames[lang] || lang;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 30;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
        
        // Add animations if not already present
        if (!document.querySelector('#language-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'language-notification-styles';
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
}

// Initialize language component when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageComponent = new LanguageComponent();
});
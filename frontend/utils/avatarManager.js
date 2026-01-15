class AvatarManager {
    constructor() {
        this.isEnabled = true;
        this.config = null;
        this.isValidated = false;
    }

    async initialize() {
        try {
            console.log('Initializing avatar manager...');
            
            this.config = await API.avatar.getConfig();
            const validation = await API.avatar.validate();
            
            this.isEnabled = this.config.enabled;
            this.isValidated = validation.valid;
            
            if (!this.isValidated) {
                console.warn('Avatar setup incomplete:', validation.message);
            }
            
            console.log('Avatar manager initialized:', {
                enabled: this.isEnabled,
                validated: this.isValidated,
                avatarId: this.config.avatarId
            });
            
            return true;
            
        } catch (error) {
            console.error('Failed to initialize avatar manager:', error);
            return false;
        }
    }

    getConfig() {
        return {
            enabled: this.isEnabled,
            validated: this.isValidated,
            avatarId: this.config?.avatarId,
            sampleRate: this.config?.sampleRate || 16000
        };
    }

    updateAvatarStatus(status, text) {
        const statusElement = document.querySelector('#avatarStatus .status-dot');
        const textElement = document.querySelector('#avatarStatus span:last-child');
        
        if (statusElement && textElement) {
            statusElement.className = 'status-dot';
            
            switch (status) {
                case 'online':
                    statusElement.classList.add('online');
                    break;
                case 'offline':
                    statusElement.classList.add('offline');
                    break;
                case 'warning':
                    statusElement.style.background = '#ffc107';
                    break;
                case 'error':
                    statusElement.style.background = '#dc3545';
                    break;
                case 'loading':
                    statusElement.style.background = '#17a2b8';
                    statusElement.style.animation = 'pulse 1s infinite';
                    break;
                default:
                    statusElement.classList.add('offline');
            }
            
            textElement.textContent = text || 'Avatar Loading';
        }
    }


    getDebugInfo() {
        return {
            enabled: this.isEnabled,
            validated: this.isValidated,
            config: this.config,
            ready: this.isEnabled && this.isValidated
        };
    }
}
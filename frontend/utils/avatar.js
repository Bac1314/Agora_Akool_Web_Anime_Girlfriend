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
                this.showAvatarWarning(validation.message);
            }
            
            console.log('Avatar manager initialized:', {
                enabled: this.isEnabled,
                validated: this.isValidated,
                avatarId: this.config.avatarId
            });
            
            return true;
            
        } catch (error) {
            console.error('Failed to initialize avatar manager:', error);
            this.showAvatarError('Failed to initialize avatar system');
            return false;
        }
    }

    isReady() {
        return this.isEnabled && this.isValidated;
    }

    getConfig() {
        return {
            enabled: this.isEnabled,
            validated: this.isValidated,
            avatarId: this.config?.avatarId,
            sampleRate: this.config?.sampleRate || 16000
        };
    }

    showAvatarWarning(message) {
        const placeholder = document.getElementById('avatarPlaceholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="avatar-warning">
                    <div class="avatar-icon">⚠️</div>
                    <p>Avatar Setup Incomplete</p>
                    <small>${message}</small>
                </div>
            `;
        }
        
        this.updateAvatarStatus('warning', 'Setup Required');
    }

    showAvatarError(message) {
        const placeholder = document.getElementById('avatarPlaceholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="avatar-error">
                    <div class="avatar-icon">❌</div>
                    <p>Avatar Error</p>
                    <small>${message}</small>
                </div>
            `;
        }
        
        this.updateAvatarStatus('error', 'Error');
    }

    showAvatarLoading() {
        const placeholder = document.getElementById('avatarPlaceholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="avatar-loading">
                    <div class="spinner"></div>
                    <p>Loading Avatar...</p>
                    <small>Please wait while we prepare your AI girlfriend</small>
                </div>
            `;
        }
        
        this.updateAvatarStatus('loading', 'Loading...');
    }

    resetAvatarDisplay() {
        const placeholder = document.getElementById('avatarPlaceholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="avatar-icon">👩‍💼</div>
                <p>Avatar will appear here</p>
            `;
        }
        
        this.updateAvatarStatus('offline', 'Avatar Loading');
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

    handleAvatarConnect(videoTrack) {
        console.log('Avatar connected, displaying video...');
        this.showAvatarVideo(videoTrack);
        this.updateAvatarStatus('online', 'Avatar Ready');
    }

    handleAvatarDisconnect() {
        console.log('Avatar disconnected');
        this.hideAvatarVideo();
        this.updateAvatarStatus('offline', 'Avatar Offline');
    }

    showAvatarVideo(videoTrack) {
        const avatarContainer = document.getElementById('avatarVideo');
        const placeholder = document.getElementById('avatarPlaceholder');
        
        if (avatarContainer && placeholder && videoTrack) {
            try {
                videoTrack.play(avatarContainer);
                placeholder.style.display = 'none';
                avatarContainer.style.display = 'block';
                
                console.log('Avatar video is now playing');
            } catch (error) {
                console.error('Failed to play avatar video:', error);
                this.showAvatarError('Failed to display avatar video');
            }
        }
    }

    hideAvatarVideo() {
        const avatarContainer = document.getElementById('avatarVideo');
        const placeholder = document.getElementById('avatarPlaceholder');
        
        if (avatarContainer && placeholder) {
            avatarContainer.style.display = 'none';
            placeholder.style.display = 'flex';
            avatarContainer.innerHTML = '';
            this.resetAvatarDisplay();
        }
    }

    toggle(enabled) {
        this.isEnabled = enabled;
        console.log(`Avatar ${enabled ? 'enabled' : 'disabled'}`);
        
        if (!enabled) {
            this.hideAvatarVideo();
            this.updateAvatarStatus('offline', 'Avatar Disabled');
        }
        
        return this.isEnabled;
    }

    getDebugInfo() {
        return {
            enabled: this.isEnabled,
            validated: this.isValidated,
            config: this.config,
            ready: this.isReady()
        };
    }
}
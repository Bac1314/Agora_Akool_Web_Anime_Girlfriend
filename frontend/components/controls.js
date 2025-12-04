class ControlsManager {
    constructor() {
        this.startButton = null;
        this.stopButton = null;
        this.muteButton = null;
        this.settingsButton = null;
        this.loadingOverlay = null;
        this.isMuted = false;
        this.isStarted = false;
        
        this.handleStart = this.handleStart.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.handleMute = this.handleMute.bind(this);
        this.handleSettings = this.handleSettings.bind(this);
    }

    initialize() {
        try {
            this.startButton = document.getElementById('startBtn');
            this.stopButton = document.getElementById('stopBtn');
            this.muteButton = document.getElementById('muteBtn');
            this.settingsButton = document.getElementById('settingsBtn');
            this.loadingOverlay = document.getElementById('loadingOverlay');

            if (!this.startButton || !this.stopButton) {
                throw new Error('Required control elements not found');
            }

            this.startButton.addEventListener('click', this.handleStart);
            this.stopButton.addEventListener('click', this.handleStop);
            this.muteButton?.addEventListener('click', this.handleMute);
            this.settingsButton?.addEventListener('click', this.handleSettings);

            this.updateControlStates();
            console.log('Controls manager initialized');
            return true;

        } catch (error) {
            console.error('Failed to initialize controls manager:', error);
            return false;
        }
    }

    async handleStart() {
        try {
            if (this.isStarted) return;

            this.showLoading('Connecting to AI assistant...');
            
            const settings = this.getSettings();
            const result = await window.agoraManager.startConversation(settings);
            
            if (result.success) {
                this.isStarted = true;
                this.updateControlStates();
                window.chatManager.enableChat();
                
                window.chatManager.sendMessage(
                    `Connected! Welcome ${settings.userName}. I'm ready to assist you.`,
                    'ai'
                );
                
                UTILS.showToast('Successfully connected to AI assistant!', 'success');
            }
            
        } catch (error) {
            console.error('Failed to start conversation:', error);
            UTILS.showToast(`Failed to start: ${error.message}`, 'error');
            this.updateControlStates();
            
        } finally {
            this.hideLoading();
        }
    }

    async handleStop() {
        try {
            if (!this.isStarted) return;

            this.showLoading('Disconnecting...');
            
            await window.agoraManager.stopConversation();
            
            this.isStarted = false;
            this.isMuted = false;
            this.updateControlStates();
            window.chatManager.disableChat();
            
            window.chatManager.sendMessage(
                'Conversation ended. Thank you for using our AI assistant service.',
                'system'
            );
            
            UTILS.showToast('Disconnected successfully', 'info');
            
        } catch (error) {
            console.error('Failed to stop conversation:', error);
            UTILS.showToast(`Failed to stop: ${error.message}`, 'error');
            
        } finally {
            this.hideLoading();
        }
    }

    async handleMute() {
        try {
            if (!this.isStarted) return;

            const wasMuted = this.isMuted;
            this.isMuted = await window.agoraManager.toggleMute();
            
            this.updateMuteButton();
            
            const status = this.isMuted ? 'muted' : 'unmuted';
            UTILS.showToast(`Microphone ${status}`, 'info');
            
        } catch (error) {
            console.error('Failed to toggle mute:', error);
            UTILS.showToast(`Failed to toggle mute: ${error.message}`, 'error');
        }
    }

    handleSettings() {
        const modal = new SettingsModal();
        modal.show();
    }

    updateControlStates() {
        if (this.startButton) {
            this.startButton.disabled = this.isStarted;
        }
        
        if (this.stopButton) {
            this.stopButton.disabled = !this.isStarted;
        }
        
        if (this.muteButton) {
            this.muteButton.disabled = !this.isStarted;
        }
        
        this.updateMuteButton();
    }

    updateMuteButton() {
        if (!this.muteButton) return;
        
        const muteIcon = this.muteButton.querySelector('#muteIcon');
        const muteText = this.muteButton.querySelector('#muteText');
        
        if (muteIcon) {
            muteIcon.textContent = this.isMuted ? '🔊' : '🎤';
        }
        
        if (muteText) {
            muteText.textContent = this.isMuted ? 'Unmute' : 'Mute';
        }
        
        this.muteButton.classList.toggle('muted', this.isMuted);
    }

    showLoading(message = 'Loading...') {
        if (this.loadingOverlay) {
            const messageElement = this.loadingOverlay.querySelector('.loading-content p');
            if (messageElement) {
                messageElement.textContent = message;
            }
            this.loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'none';
        }
    }

    getSettings() {
        return {
            channel: STORAGE.get('channelName', CONFIG.DEFAULT_CHANNEL),
            userName: STORAGE.get('userName', CONFIG.DEFAULT_USER_NAME),
            enableVoice: STORAGE.get('enableVoice', true),
            enableAvatar: STORAGE.get('enableAvatar', true)
        };
    }

    isConversationActive() {
        return this.isStarted;
    }

    getMuteStatus() {
        return this.isMuted;
    }
}

class SettingsModal {
    constructor() {
        this.modal = null;
        this.channelInput = null;
        this.userNameInput = null;
        this.enableVoiceCheckbox = null;
        this.enableAvatarCheckbox = null;
    }

    show() {
        this.modal = document.getElementById('settingsModal');
        if (!this.modal) return;

        this.initializeElements();
        this.loadCurrentSettings();
        this.attachEventListeners();
        
        this.modal.style.display = 'flex';
    }

    hide() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }

    initializeElements() {
        this.channelInput = document.getElementById('channelName');
        this.userNameInput = document.getElementById('userName');
        this.enableVoiceCheckbox = document.getElementById('enableVoice');
        this.enableAvatarCheckbox = document.getElementById('enableAvatar');
    }

    loadCurrentSettings() {
        if (this.channelInput) {
            this.channelInput.value = STORAGE.get('channelName', CONFIG.DEFAULT_CHANNEL);
        }
        
        if (this.userNameInput) {
            this.userNameInput.value = STORAGE.get('userName', CONFIG.DEFAULT_USER_NAME);
        }
        
        if (this.enableVoiceCheckbox) {
            this.enableVoiceCheckbox.checked = STORAGE.get('enableVoice', true);
        }
        
        if (this.enableAvatarCheckbox) {
            this.enableAvatarCheckbox.checked = STORAGE.get('enableAvatar', true);
        }
    }

    attachEventListeners() {
        const closeBtn = document.getElementById('closeSettingsBtn');
        const cancelBtn = document.getElementById('cancelSettingsBtn');
        const saveBtn = document.getElementById('saveSettingsBtn');

        if (closeBtn) closeBtn.addEventListener('click', () => this.hide());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.hide());
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveSettings());

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });
        }
    }

    saveSettings() {
        try {
            const settings = {
                channelName: this.channelInput?.value?.trim() || CONFIG.DEFAULT_CHANNEL,
                userName: this.userNameInput?.value?.trim() || CONFIG.DEFAULT_USER_NAME,
                enableVoice: this.enableVoiceCheckbox?.checked ?? true,
                enableAvatar: this.enableAvatarCheckbox?.checked ?? true
            };

            Object.entries(settings).forEach(([key, value]) => {
                STORAGE.set(key, value);
            });

            UTILS.showToast('Settings saved successfully!', 'success');
            this.hide();
            
            console.log('Settings saved:', settings);
            
        } catch (error) {
            console.error('Failed to save settings:', error);
            UTILS.showToast('Failed to save settings', 'error');
        }
    }
}
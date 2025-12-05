class ControlsManager {
    constructor() {
        this.callButton = null;
        this.muteButton = null;
        this.videoMuteButton = null;
        this.settingsButton = null;
        this.loadingOverlay = null;
        this.isMuted = false;
        this.isVideoMuted = false;
        this.isStarted = false;
        
        this.handleCall = this.handleCall.bind(this);
        this.handleMute = this.handleMute.bind(this);
        this.handleVideoMute = this.handleVideoMute.bind(this);
        this.handleSettings = this.handleSettings.bind(this);
    }

    initialize() {
        try {
            this.callButton = document.getElementById('callBtn');
            this.muteButton = document.getElementById('muteBtn');
            this.videoMuteButton = document.getElementById('videoMuteBtn');
            this.settingsButton = document.getElementById('settingsBtn');
            this.loadingOverlay = document.getElementById('loadingOverlay');

            if (!this.callButton) {
                throw new Error('Required control elements not found');
            }

            this.callButton.addEventListener('click', this.handleCall);
            this.muteButton?.addEventListener('click', this.handleMute);
            this.videoMuteButton?.addEventListener('click', this.handleVideoMute);
            this.settingsButton?.addEventListener('click', this.handleSettings);

            this.updateControlStates();
            
            // Listen for language changes
            window.addEventListener('languageChanged', () => {
                this.updateCallButton();
                this.updateMuteButton();
                this.updateVideoMuteButton();
            });
            
            console.log('Controls manager initialized');
            return true;

        } catch (error) {
            console.error('Failed to initialize controls manager:', error);
            return false;
        }
    }

    async handleCall() {
        try {
            if (!this.isStarted) {
                // Start call
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
                
            } else {
                // End call
                this.showLoading('Disconnecting...');
                
                await window.agoraManager.stopConversation();
                
                this.isStarted = false;
                this.isMuted = false;
                this.isVideoMuted = false;
                this.updateControlStates();
                window.chatManager.disableChat();
                
                window.chatManager.sendMessage(
                    'Conversation ended. Thank you for using our AI assistant service.',
                    'system'
                );
                
                UTILS.showToast('Disconnected successfully', 'info');
            }
            
        } catch (error) {
            console.error('Failed to toggle call:', error);
            UTILS.showToast(`Failed to ${this.isStarted ? 'stop' : 'start'}: ${error.message}`, 'error');
            this.updateControlStates();
            
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

    async handleVideoMute() {
        try {
            if (!this.isStarted) return;

            const wasVideoMuted = this.isVideoMuted;
            this.isVideoMuted = await window.agoraManager.toggleVideoMute();
            
            this.updateVideoMuteButton();
            
            const status = this.isVideoMuted ? 'muted' : 'unmuted';
            UTILS.showToast(`Video ${status}`, 'info');
            
        } catch (error) {
            console.error('Failed to toggle video mute:', error);
            UTILS.showToast(`Failed to toggle video mute: ${error.message}`, 'error');
        }
    }

    handleSettings() {
        const modal = new SettingsModal();
        modal.show();
    }

    updateControlStates() {
        this.updateCallButton();
        
        // Toggle call-active class on control bar to show/hide mute buttons
        const controlBar = document.querySelector('.control-bar');
        if (controlBar) {
            controlBar.classList.toggle('call-active', this.isStarted);
        }
        
        if (this.muteButton) {
            this.muteButton.disabled = !this.isStarted;
        }
        
        if (this.videoMuteButton) {
            this.videoMuteButton.disabled = !this.isStarted;
        }
        
        this.updateMuteButton();
        this.updateVideoMuteButton();
    }

    updateCallButton() {
        if (!this.callButton) return;
        
        const callIconImg = this.callButton.querySelector('#callIconImg');
        const callText = this.callButton.querySelector('#callText');
        
        if (this.isStarted) {
            // Show end call state (red)
            this.callButton.setAttribute('data-state', 'end');
            if (callIconImg) {
                callIconImg.src = '/src/assets/end.svg';
                callIconImg.alt = 'End Call';
            }
            if (callText) {
                if (window.i18n) {
                    callText.textContent = window.i18n.t('endCall');
                } else {
                    callText.textContent = 'End Call';
                }
            }
        } else {
            // Show start call state (green)
            this.callButton.setAttribute('data-state', 'start');
            if (callIconImg) {
                callIconImg.src = '/src/assets/call.svg';
                callIconImg.alt = 'Start Call';
            }
            if (callText) {
                if (window.i18n) {
                    callText.textContent = window.i18n.t('startCall');
                } else {
                    callText.textContent = 'Start Call';
                }
            }
        }
    }

    updateMuteButton() {
        if (!this.muteButton) return;
        
        const muteOverlay = this.muteButton.querySelector('#muteOverlay');
        const muteText = this.muteButton.querySelector('#muteText');
        
        if (muteOverlay) {
            muteOverlay.style.display = this.isMuted ? 'block' : 'none';
        }
        
        if (muteText) {
            const textKey = this.isMuted ? 'unmute' : 'mute';
            if (window.i18n) {
                muteText.textContent = window.i18n.t(textKey);
            } else {
                muteText.textContent = this.isMuted ? 'Unmute' : 'Mute';
            }
        }
        
        this.muteButton.classList.toggle('muted', this.isMuted);
    }

    updateVideoMuteButton() {
        if (!this.videoMuteButton) return;
        
        const videoMuteOverlay = this.videoMuteButton.querySelector('#videoMuteOverlay');
        const videoMuteText = this.videoMuteButton.querySelector('#videoMuteText');
        
        if (videoMuteOverlay) {
            videoMuteOverlay.style.display = this.isVideoMuted ? 'block' : 'none';
        }
        
        if (videoMuteText) {
            const textKey = this.isVideoMuted ? 'unmuteVideo' : 'muteVideo';
            if (window.i18n) {
                videoMuteText.textContent = window.i18n.t(textKey);
            } else {
                videoMuteText.textContent = this.isVideoMuted ? 'Unmute Video' : 'Mute Video';
            }
        }
        
        this.videoMuteButton.classList.toggle('muted', this.isVideoMuted);
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
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
                // Check if user has set their name
                const currentName = STORAGE.get('userName', '');
                if (!currentName || currentName === 'User' || currentName.trim() === '') {
                    // Show name prompt modal
                    this.showNamePrompt();
                    return;
                }
                
                // Start call
                this.showLoading(window.i18n.t('connectingToAI'));
                
                const settings = this.getSettings();
                const result = await window.agoraManager.startConversation(settings);
                
                if (result.success) {
                    this.isStarted = true;
                    this.updateControlStates();
                    window.chatManager.enableChat();
                    
                    // Start new chat session for AI summary tracking
                    window.chatManager.startNewSession();

                    // Update debug info (but don't auto-show)
                    if (window.app && window.app.updateDebugInfo) {
                        window.app.updateDebugInfo({
                            channel: settings.channel,
                            user: settings.userName,
                            agentId: result.agentId || 'N/A'
                        });
                    }

                    window.chatManager.sendMessage(
                        `New Session Started`,
                        'ai'
                    );

                    UTILS.showToast('Successfully connected to AI assistant!', 'success');
                }
                
            } else {
                // End call
                this.showLoading(window.i18n.t('disconnecting'));

                await window.agoraManager.stopConversation();

                // End chat session
                window.chatManager.endSession();

                this.isStarted = false;
                this.isMuted = false;
                this.isVideoMuted = false;
                this.updateControlStates();
                window.chatManager.disableChat();

                // Small delay to show disconnection loading
                setTimeout(() => {
                    this.hideLoading();
                }, 800);

                window.chatManager.sendMessage(
                    'Conversation ended. Thank you for using our AI assistant service.',
                    'system'
                );

                UTILS.showToast('Disconnected successfully', 'info');

                // Show conversation summary and rating
                this.showConversationSummary();
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

            this.isMuted = await window.agoraManager.toggleAudioMute();

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

    showNamePrompt() {
        const namePrompt = new NamePromptModal();
        namePrompt.show(() => {
            // Callback when name is set - restart the call process
            this.handleCall();
        });
    }

    getSettings() {
        return {
            channel: UTILS.generateChannelName(),
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

    async showConversationSummary() {
        const modal = new SummaryModal();
        await modal.show();
    }
}

class SummaryModal {
    constructor() {
        this.modal = null;
        this.summaryLoading = null;
        this.summaryContent = null;
        this.summaryError = null;
        this.starRating = null;
        this.ratingDescription = null;
        this.summaryText = null;
    }

    async show() {
        this.modal = document.getElementById('summaryModal');
        if (!this.modal) return;

        this.initializeElements();
        this.attachEventListeners();
        this.modal.style.display = 'flex';

        // Update i18n translations for modal
        if (window.i18n) {
            window.i18n.updateElementsWithI18n();
        }

        // Show loading state
        this.showLoading();

        // Get current session transcript only (not persistent history)
        const transcript = window.chatManager.getCurrentSessionMessages().filter(msg =>
            msg.sender === 'user' || msg.sender === 'ai'
        );

        if (transcript.length === 0) {
            this.showError('No conversation to summarize');
            return;
        }

        try {
            // Call backend API to get summary and rating
            const response = await fetch('/api/ai-summary/summarize-and-rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ transcript })
            });

            if (!response.ok) {
                throw new Error('Failed to generate summary');
            }

            const result = await response.json();
            this.displaySummary(result);
        } catch (error) {
            console.error('Error generating summary:', error);
            this.showError(error.message);
        }
    }

    initializeElements() {
        this.summaryLoading = document.getElementById('summaryLoading');
        this.summaryContent = document.getElementById('summaryContent');
        this.summaryError = document.getElementById('summaryError');
        this.starRating = document.getElementById('starRating');
        this.ratingDescription = document.getElementById('ratingDescription');
        this.summaryText = document.getElementById('summaryText');
    }

    attachEventListeners() {
        const closeBtn = document.getElementById('closeSummaryBtn');
        const doneBtn = document.getElementById('closeSummaryDoneBtn');

        if (closeBtn) closeBtn.addEventListener('click', () => this.hide());
        if (doneBtn) doneBtn.addEventListener('click', () => this.hide());

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });
        }
    }

    showLoading() {
        if (this.summaryLoading) this.summaryLoading.style.display = 'block';
        if (this.summaryContent) this.summaryContent.style.display = 'none';
        if (this.summaryError) this.summaryError.style.display = 'none';
    }

    displaySummary(result) {
        if (this.summaryLoading) this.summaryLoading.style.display = 'none';
        if (this.summaryContent) this.summaryContent.style.display = 'block';
        if (this.summaryError) this.summaryError.style.display = 'none';

        // Display star rating
        if (this.starRating) {
            const stars = this.starRating.querySelectorAll('.star');
            stars.forEach((star, index) => {
                if (index < result.rating) {
                    star.classList.add('filled');
                    // Stagger the animation
                    setTimeout(() => {
                        star.style.animationDelay = `${index * 0.1}s`;
                    }, 50);
                } else {
                    star.classList.remove('filled');
                }
            });
        }

        // Display rating description
        if (this.ratingDescription) {
            this.ratingDescription.textContent = result.ratingDescription;
        }

        // Display summary text
        if (this.summaryText) {
            this.summaryText.textContent = result.summary;
        }
    }

    showError(message) {
        if (this.summaryLoading) this.summaryLoading.style.display = 'none';
        if (this.summaryContent) this.summaryContent.style.display = 'none';
        if (this.summaryError) {
            this.summaryError.style.display = 'block';
            const errorP = this.summaryError.querySelector('p');
            if (errorP) {
                errorP.textContent = message || 'Failed to generate summary. Please try again.';
            }
        }
    }

    hide() {
        if (this.modal) {
            this.modal.style.display = 'none';

            // Reset the modal state
            if (this.starRating) {
                const stars = this.starRating.querySelectorAll('.star');
                stars.forEach(star => star.classList.remove('filled'));
            }

            // // Clear chat history after summary is dismissed
            // if (window.chatManager) {
            //     window.chatManager.clearMessages();
            // }
        }
    }
}

class SettingsModal {
    constructor() {
        this.modal = null;
        this.channelInput = null;
        this.userNameInput = null;
        this.enableVoiceCheckbox = null;
        this.enableAvatarCheckbox = null;
        this.systemPromptTextarea = null;
        this.resetPromptBtn = null;
    }

    async show() {
        this.modal = document.getElementById('settingsModal');
        if (!this.modal) return;

        this.initializeElements();
        await this.loadCurrentSettings();
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
        this.systemPromptTextarea = document.getElementById('systemPrompt');
        this.resetPromptBtn = document.getElementById('resetPromptBtn');
    }

    async loadCurrentSettings() {
        // Channel name is now auto-generated, so we don't load it from storage
        // Instead, show a placeholder indicating it will be auto-generated
        if (this.channelInput) {
            this.channelInput.value = '';
            this.channelInput.placeholder = 'Auto-generated for each call';
            this.channelInput.disabled = true;
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

        // Load system prompt from localStorage or fetch default from backend
        if (this.systemPromptTextarea) {
            const savedPrompt = STORAGE.get('systemPrompt', null);

            if (savedPrompt) {
                // Use saved prompt from localStorage
                this.systemPromptTextarea.value = savedPrompt;
            } else {
                // Fetch default from backend and save to localStorage
                try {
                    const response = await fetch('/api/settings/system-prompt/default');
                    if (response.ok) {
                        const data = await response.json();
                        this.systemPromptTextarea.value = data.systemPrompt;
                        this.systemPromptTextarea.placeholder = 'Using default system prompt...';
                        // Save default to localStorage for future use
                        STORAGE.set('systemPrompt', data.systemPrompt);
                    } else {
                        console.error('Failed to load default system prompt');
                        this.systemPromptTextarea.placeholder = 'Failed to load default system prompt';
                    }
                } catch (error) {
                    console.error('Error loading default system prompt:', error);
                    this.systemPromptTextarea.placeholder = 'Error loading system prompt';
                }
            }
        }
    }

    attachEventListeners() {
        const closeBtn = document.getElementById('closeSettingsBtn');
        const cancelBtn = document.getElementById('cancelSettingsBtn');
        const saveBtn = document.getElementById('saveSettingsBtn');

        if (closeBtn) closeBtn.addEventListener('click', () => this.hide());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.hide());
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveSettings());

        if (this.resetPromptBtn) {
            this.resetPromptBtn.addEventListener('click', () => this.resetSystemPrompt());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });
        }
    }

    async saveSettings() {
        try {
            const settings = {
                userName: this.userNameInput?.value?.trim() || CONFIG.DEFAULT_USER_NAME,
                enableVoice: this.enableVoiceCheckbox?.checked ?? true,
                enableAvatar: this.enableAvatarCheckbox?.checked ?? true
            };

            Object.entries(settings).forEach(([key, value]) => {
                STORAGE.set(key, value);
            });

            // Remove any old channelName from storage to ensure fresh generation
            STORAGE.remove('channelName');

            // Save system prompt to localStorage (per-user, persistent)
            if (this.systemPromptTextarea) {
                const systemPrompt = this.systemPromptTextarea.value.trim();
                if (systemPrompt) {
                    STORAGE.set('systemPrompt', systemPrompt);
                    console.log('System prompt saved to localStorage');
                }
            }

            UTILS.showToast('Settings saved successfully!', 'success');
            this.hide();

            console.log('Settings saved:', settings);

        } catch (error) {
            console.error('Failed to save settings:', error);
            UTILS.showToast('Failed to save settings', 'error');
        }
    }

    async resetSystemPrompt() {
        try {
            // Fetch default from backend
            const response = await fetch('/api/settings/system-prompt/default');

            if (!response.ok) {
                throw new Error('Failed to fetch default system prompt');
            }

            const data = await response.json();

            if (this.systemPromptTextarea) {
                this.systemPromptTextarea.value = data.systemPrompt;
            }

            // Update localStorage with default
            STORAGE.set('systemPrompt', data.systemPrompt);

            UTILS.showToast('System prompt reset to default', 'success');
        } catch (error) {
            console.error('Failed to reset system prompt:', error);
            UTILS.showToast('Failed to reset system prompt', 'error');
        }
    }

    hide() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }
}

class NamePromptModal {
    constructor() {
        this.modal = null;
        this.nameInput = null;
        this.callback = null;
    }

    show(callback) {
        this.callback = callback;
        this.createModal();
        this.modal.classList.remove('hidden');
        
        // Focus on input
        setTimeout(() => {
            if (this.nameInput) {
                this.nameInput.focus();
            }
        }, 100);
    }

    createModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('namePromptModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal HTML using CSS classes
        const modalHtml = `
            <div id="namePromptModal" class="name-prompt-modal hidden">
                <div class="name-prompt-content">
                    <h2 class="name-prompt-title">👋 What's your name?</h2>
                    <p class="name-prompt-subtitle">Please tell me your name so I can give you a personalized experience!</p>
                    
                    <input type="text" id="namePromptInput" class="name-prompt-input" placeholder="Enter your name...">
                    
                    <div class="name-prompt-buttons">
                        <button id="namePromptCancel" class="name-prompt-btn cancel">Cancel</button>
                        <button id="namePromptConfirm" class="name-prompt-btn confirm">Continue</button>
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Get elements
        this.modal = document.getElementById('namePromptModal');
        this.nameInput = document.getElementById('namePromptInput');
        const cancelBtn = document.getElementById('namePromptCancel');
        const confirmBtn = document.getElementById('namePromptConfirm');

        // Add event listeners
        confirmBtn.addEventListener('click', () => this.saveName());
        cancelBtn.addEventListener('click', () => this.hide());
        
        // Allow Enter key to confirm
        this.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveName();
            }
        });

        // Prevent closing by clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                // Don't close - name is required
            }
        });
    }

    saveName() {
        const name = this.nameInput.value.trim();
        if (name && name.length > 0) {
            // Save name to storage
            STORAGE.set('userName', name);
            UTILS.showToast(`Welcome, ${name}! 💕`, 'success');
            
            this.hide();
            
            // Call the callback to continue with conversation start
            if (this.callback) {
                this.callback();
            }
        } else {
            UTILS.showToast('Please enter your name to continue', 'error');
            this.nameInput.focus();
        }
    }

    hide() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            setTimeout(() => {
                this.modal.remove();
            }, 300);
        }
    }
}
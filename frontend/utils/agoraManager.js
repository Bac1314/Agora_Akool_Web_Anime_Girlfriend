/**
 * AgoraManager - Manages Agora RTC and RTM clients for voice/video communication and messaging
 *
 * Features:
 * - Real-time audio/video communication (RTC)
 * - Real-time messaging for transcriptions (RTM)
 * - Avatar video display management
 * - Connection state management
 */
class AgoraManager {
    constructor() {
        // RTC Client and Media Tracks
        this.rtcClient = null;
        this.localAudioTrack = null;
        this.localVideoTrack = null;
        this.remoteUsers = {};

        // RTM Client for Messaging
        this.rtmClient = null;
        this.onMessageCallback = null;
        this.onAgentStateCallback = null;

        // Connection State
        this.isConnected = false;
        this.currentChannel = null;
        this.currentUID = null;

        // Conversational AI State
        this.agentId = null;
        this.avatarUID = null;

        // Bind event handlers
        this.onUserJoined = this.onUserJoined.bind(this);
        this.onUserLeft = this.onUserLeft.bind(this);
        this.onUserPublished = this.onUserPublished.bind(this);
        this.onUserUnpublished = this.onUserUnpublished.bind(this);
        this.handleRtmMessage = this.handleRtmMessage.bind(this);
        this.handlePresenceEvent = this.handlePresenceEvent.bind(this);
    }

    // ===========================
    // INITIALIZATION METHODS
    // ===========================

    /**
     * Initialize Agora RTC client and set up event listeners
     */
    async initializeRTC() {
        try {
            if (typeof AgoraRTC === 'undefined') {
                throw new Error('Agora RTC SDK not loaded');
            }

            // Create RTC client
            this.rtcClient = AgoraRTC.createClient(CONFIG.AGORA_SETTINGS);

            // Set up RTC event listeners
            this.rtcClient.on("user-joined", this.onUserJoined);
            this.rtcClient.on("user-left", this.onUserLeft);
            this.rtcClient.on("user-published", this.onUserPublished);
            this.rtcClient.on("user-unpublished", this.onUserUnpublished);

            console.log('Agora RTC client initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize RTC client:', error);
            throw error;
        }
    }

    /**
     * Initialize Agora RTM client for real-time messaging
     * @param {string} appId - Agora App ID
     * @param {string} channel - Channel name to subscribe to
     * @param {number} uid - User ID
     */
    async initializeRTM(appId, channel, uid) {
        try {
            if (typeof AgoraRTM === 'undefined') {
                throw new Error('Agora RTM SDK not loaded');
            }

            console.log('Initializing RTM client...');

            // Create RTM client
            this.rtmClient = new AgoraRTM.RTM(appId, uid.toString());

            // Login to RTM
            await this.rtmClient.login();
            console.log('RTM login successful');

            // Subscribe to channel for messages
            await this.rtmClient.subscribe(channel);
            console.log('RTM subscribed to channel:', channel);

            // Set up RTM message listener
            this.rtmClient.addEventListener('message', this.handleRtmMessage);
            console.log('RTM message listener added');

            // Set up RTM presence listener for agent state updates
            this.rtmClient.addEventListener('presence', this.handlePresenceEvent);
            console.log('RTM presence listener added');

        } catch (error) {
            console.error('Failed to initialize RTM:', error);
            throw error;
        }
    }

    /**
     * Initialize both RTC and check for RTM availability
     * Legacy method for backward compatibility
     */
    async initialize() {
        return await this.initializeRTC();
    }

    // ===========================
    // CONVERSATION LIFECYCLE
    // ===========================

    /**
     * Start a new conversation with AI assistant
     * @param {Object} settings - Conversation settings (channel, userName, etc.)
     * @returns {Object} Conversation details (agentId, channel, UIDs)
     */
    async startConversation(settings = {}) {
        try {
            const channel = settings.channel || UTILS.generateChannelName();
            const userName = settings.userName || CONFIG.DEFAULT_USER_NAME;
            const userUID = 123;

            console.log(`Starting conversation on channel: ${channel}`);

            // Initialize RTC if not already done
            if (!this.rtcClient) {
                await this.initializeRTC();
            }

            // Get channel info and app ID
            const channelInfo = await API.agora.getChannelInfo(channel, userUID);

            // Join RTC channel
            await this.rtcClient.join(
                channelInfo.appId,
                channel,
                null,
                userUID
            );

            // Create and publish local audio/video tracks
            this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
            await this.rtcClient.publish([this.localAudioTrack, this.localVideoTrack]);

            // Display user's camera preview
            this.displayUserCamera(this.localVideoTrack);

            // Update connection state
            this.isConnected = true;
            this.currentChannel = channel;
            this.currentUID = userUID;

            // Update placeholder to show waiting for avatar
            this.updateAvatarPlaceholder('connecting');

            // Initialize RTM for messaging
            await this.initializeRTM(channelInfo.appId, channel, userUID);

            // Get system prompt from localStorage (per-user setting)
            const systemPrompt = STORAGE.get('systemPrompt', null);
            
            // Get previous chat history for context (if any)
            const chatHistory = window.chatManager ? window.chatManager.messages : [];
            const previousConversations = chatHistory.filter(msg => 
                msg.sender === 'user' || msg.sender === 'ai'
            ).slice(-20); // Last 20 messages for context

            // Start conversational AI agent
            const conversationData = await API.agora.startConversation({
                channel: channel,
                agentName: `agent_${userName}_${Date.now()}`,
                remoteUid: userUID,
                userName: userName, // Add userName for personalized greeting
                systemPrompt: systemPrompt, // Send user's custom prompt if available
                previousConversations: previousConversations, // Send chat history for context
                voiceId: settings.voiceId // Send selected voice ID
            });

            this.agentId = conversationData.agentId;
            this.avatarUID = conversationData.avatarUid;

            // Update UI status
            this.updateConnectionStatus('online');

            console.log('Conversation started successfully', {
                agentId: this.agentId,
                avatarUID: this.avatarUID,
                userUID: userUID
            });

            return {
                success: true,
                agentId: this.agentId,
                channel: channel,
                userUID: userUID,
                avatarUID: this.avatarUID
            };

        } catch (error) {
            console.error('Failed to start conversation:', error);
            this.updateConnectionStatus('offline');
            throw error;
        }
    }

    /**
     * Stop the current conversation and clean up resources
     */
    async stopConversation() {
        try {
            console.log('Stopping conversation...');

            // Stop conversational AI agent
            if (this.agentId) {
                await API.agora.stopConversation(this.agentId);
                this.agentId = null;
            }

            // Clean up RTM client
            if (this.rtmClient) {
                try {
                    if (this.currentChannel) {
                        await this.rtmClient.unsubscribe(this.currentChannel);
                    }
                    this.rtmClient.removeEventListener('message', this.handleRtmMessage);
                    this.rtmClient.removeEventListener('presence', this.handlePresenceEvent);
                    await this.rtmClient.logout();
                    this.rtmClient = null;
                    console.log('RTM client cleaned up');
                } catch (rtmError) {
                    console.error('Error cleaning up RTM:', rtmError);
                }
            }

            // Stop and close local tracks
            if (this.localAudioTrack) {
                this.localAudioTrack.stop();
                this.localAudioTrack.close();
                this.localAudioTrack = null;
            }

            if (this.localVideoTrack) {
                this.localVideoTrack.stop();
                this.localVideoTrack.close();
                this.localVideoTrack = null;
            }

            // Leave RTC channel
            if (this.rtcClient && this.isConnected) {
                await this.rtcClient.leave();
            }

            // Reset state
            this.isConnected = false;
            this.currentChannel = null;
            this.currentUID = null;
            this.avatarUID = null;
            this.remoteUsers = {};

            // Update UI
            this.updateConnectionStatus('offline');
            this.updateAvatarStatus('offline');
            this.hideAvatar();
            this.hideUserCamera();
            this.hideAgentState();

            // Reset placeholder to idle state
            this.updateAvatarPlaceholder('idle');

            console.log('Conversation stopped successfully');
            return true;

        } catch (error) {
            console.error('Failed to stop conversation:', error);
            throw error;
        }
    }

    // ===========================
    // RTC EVENT HANDLERS
    // ===========================

    /**
     * Handle user joining the RTC channel
     */
    onUserJoined(user) {
        console.log('User joined:', user.uid);
        this.remoteUsers[user.uid] = user;
    }

    /**
     * Handle user leaving the RTC channel
     */
    onUserLeft(user) {
        console.log('User left:', user.uid);
        delete this.remoteUsers[user.uid];

        // Hide avatar if it was the avatar user
        if (user.uid == this.avatarUID) {
            this.updateAvatarStatus('offline');
        }
    }

    /**
     * Handle user publishing media (audio/video)
     */
    async onUserPublished(user, mediaType) {
        console.log('User published:', user.uid, mediaType);

        // Subscribe to the user's media
        await this.rtcClient.subscribe(user, mediaType);

        // Handle avatar video stream
        if (user.uid == this.avatarUID && mediaType === 'video') {
            const videoTrack = user.videoTrack;
            if (videoTrack) {
                this.displayAvatar(videoTrack);
                this.updateAvatarStatus('online');
            }
        }

        // Play remote audio
        if (mediaType === 'audio') {
            const audioTrack = user.audioTrack;
            if (audioTrack) {
                audioTrack.play();
            }
        }
    }

    /**
     * Handle user unpublishing media (audio/video)
     */
    onUserUnpublished(user, mediaType) {
        console.log('User unpublished:', user.uid, mediaType);

        // Hide avatar if it stopped publishing video
        if (user.uid == this.avatarUID && mediaType === 'video') {
            this.hideAvatar();
            this.updateAvatarStatus('offline');
        }
    }

    // ===========================
    // RTM EVENT HANDLERS & MESSAGING
    // ===========================

    /**
     * Handle incoming RTM messages
     * Processes transcription messages from Agora Conversational AI
     */
    handleRtmMessage(event) {
        try {
            console.log('RTM message received:', event);

            // Filter messages for current channel
            if (event.channelType === 'MESSAGE' && event.channelName === this.currentChannel) {
                const message = event.message;

                // Parse JSON message
                if (typeof message === 'string') {
                    try {
                        const parsedMessage = JSON.parse(message);
                        console.log('Parsed RTM message:', parsedMessage);

                        // Trigger callback if set
                        if (this.onMessageCallback) {
                            this.onMessageCallback(parsedMessage);
                        }
                    } catch (e) {
                        console.log('Message is not JSON:', message);
                    }
                }
            }
        } catch (error) {
            console.error('Error handling RTM message:', error);
        }
    }

    /**
     * Set callback function for RTM messages
     * @param {Function} callback - Function to call when message is received
     */
    setMessageCallback(callback) {
        this.onMessageCallback = callback;
    }

    /**
     * Handle RTM presence events
     * Processes agent state updates from Agora Conversational AI
     */
    handlePresenceEvent(event) {
        try {
            console.log('RTM presence event received:', event);

            // Check if this is a remote state change event from the agent
            if (event.eventType === 'REMOTE_STATE_CHANGED') {
                // Check if this is from a different user (not ourselves)
                if (event.publisher !== this.currentUID?.toString()) {
                    // Get the state from stateChanged object
                    const stateChanged = event.stateChanged || {};

                    if (stateChanged.state) {
                        const agentState = stateChanged.state;
                        console.log('Agent state changed to:', agentState);

                        // Trigger callback if set
                        if (this.onAgentStateCallback) {
                            this.onAgentStateCallback(agentState);
                        }

                        // Update UI directly
                        this.updateAgentStateUI(agentState);
                    }
                }
            }
        } catch (error) {
            console.error('Error handling RTM presence event:', error);
        }
    }

    /**
     * Set callback function for agent state changes
     * @param {Function} callback - Function to call when agent state changes
     */
    setAgentStateCallback(callback) {
        this.onAgentStateCallback = callback;
    }

    /**
     * Update UI to show agent state
     * @param {string} state - Agent state (e.g., 'thinking', 'idle', 'speaking')
     */
    updateAgentStateUI(state) {
        const agentStateElement = document.getElementById('agentState');
        const agentStateText = document.getElementById('agentStateText');

        if (agentStateElement && agentStateText) {
            // Map agent states to user-friendly labels
            const stateLabels = {
                'thinking': 'Thinking...',
                'idle': 'Idle',
                'speaking': 'Speaking',
                'listening': 'Listening',
                'silent': 'Silent'
            };

            const displayText = stateLabels[state.toLowerCase()] || state;
            agentStateText.textContent = displayText;

            // Update state class for styling
            agentStateElement.className = 'agent-state-indicator';
            agentStateElement.classList.add(`state-${state.toLowerCase()}`);

            // Show the indicator
            agentStateElement.style.display = 'flex';
        }
    }

    /**
     * Send text message to AI assistant via RTM
     * @param {string} text - Message text to send
     */
    async sendTextMessage(text) {
        try {
            if (!this.rtmClient || !this.currentChannel) {
                throw new Error('RTM client not initialized or not connected to channel');
            }

            // Publish message with custom type for user transcription
            await this.rtmClient.publish(
                this.currentChannel,
                text,
                {
                    customType: "user.transcription"
                }
            );

            console.log('Text message sent via RTM:', text);
            return true;

        } catch (error) {
            console.error('Failed to send text message via RTM:', error);
            throw error;
        }
    }

    // ===========================
    // MEDIA CONTROLS
    // ===========================

    /**
     * Toggle local audio mute/unmute
     * @returns {boolean} New mute state (true = muted, false = unmuted)
     */
    async toggleAudioMute() {
        try {
            if (!this.localAudioTrack) {
                throw new Error('No audio track available');
            }

            const isMuted = !this.localAudioTrack.enabled;
            await this.localAudioTrack.setEnabled(isMuted);

            console.log(`Audio ${isMuted ? 'unmuted' : 'muted'}`);
            return !isMuted;
        } catch (error) {
            console.error('Failed to toggle audio mute:', error);
            throw error;
        }
    }

    /**
     * Toggle local video mute/unmute
     * @returns {boolean} New mute state (true = muted, false = unmuted)
     */
    async toggleVideoMute() {
        try {
            if (!this.localVideoTrack) {
                throw new Error('No video track available');
            }

            const isMuted = !this.localVideoTrack.enabled;
            await this.localVideoTrack.setEnabled(isMuted);

            // Show or hide user camera preview based on mute state
            if (isMuted) {
                this.displayUserCamera(this.localVideoTrack);
            } else {
                this.hideUserCamera();
            }

            console.log(`Video ${isMuted ? 'unmuted' : 'muted'}`);
            return !isMuted;
        } catch (error) {
            console.error('Failed to toggle video mute:', error);
            throw error;
        }
    }

    // ===========================
    // UI UPDATE METHODS
    // ===========================

    /**
     * Display avatar video stream
     * @param {MediaStreamTrack} videoTrack - Video track to display
     */
    displayAvatar(videoTrack) {
        const avatarContainer = document.getElementById('avatarVideo');
        const placeholder = document.getElementById('avatarPlaceholder');

        if (avatarContainer && placeholder) {
            videoTrack.play(avatarContainer);
            placeholder.style.display = 'none';
            avatarContainer.style.display = 'block';

            console.log('Avatar video displayed');
        }
    }

    /**
     * Update avatar placeholder text
     * @param {string} state - State: 'idle', 'connecting', or custom text
     */
    updateAvatarPlaceholder(state) {
        const placeholder = document.getElementById('avatarPlaceholder');
        if (!placeholder) return;

        const placeholderText = placeholder.querySelector('p[data-i18n]');
        if (!placeholderText) return;

        if (state === 'idle') {
            placeholderText.setAttribute('data-i18n', 'avatarLoading');
            placeholderText.textContent = window.i18n ? window.i18n.t('avatarLoading') : "Click 'Start Call' to connect";
        } else if (state === 'connecting') {
            placeholderText.setAttribute('data-i18n', 'avatarConnecting');
            placeholderText.textContent = window.i18n ? window.i18n.t('avatarConnecting') : 'Waiting for avatar...';
        }
    }

    /**
     * Hide avatar video and show placeholder
     */
    hideAvatar() {
        const avatarContainer = document.getElementById('avatarVideo');
        const placeholder = document.getElementById('avatarPlaceholder');

        if (avatarContainer && placeholder) {
            avatarContainer.style.display = 'none';
            placeholder.style.display = 'block';
            avatarContainer.innerHTML = '';

            // Update placeholder text based on connection state
            if (this.isConnected) {
                this.updateAvatarPlaceholder('connecting');
            } else {
                this.updateAvatarPlaceholder('idle');
            }

            console.log('Avatar video hidden');
        }
    }

    /**
     * Display user's camera preview
     * @param {MediaStreamTrack} videoTrack - Local video track to display
     */
    displayUserCamera(videoTrack) {
        const cameraPreview = document.getElementById('userCameraPreview');
        const cameraVideo = document.getElementById('userCameraVideo');

        if (cameraPreview && cameraVideo && videoTrack) {
            videoTrack.play(cameraVideo);
            cameraPreview.style.display = 'block';
            console.log('User camera preview displayed');
        }
    }

    /**
     * Hide user's camera preview
     */
    hideUserCamera() {
        const cameraPreview = document.getElementById('userCameraPreview');
        const cameraVideo = document.getElementById('userCameraVideo');

        if (cameraPreview && cameraVideo) {
            cameraPreview.style.display = 'none';
            cameraVideo.innerHTML = '';
            console.log('User camera preview hidden');
        }
    }

    /**
     * Update connection status UI indicator
     * @param {string} status - Status: 'online' or 'offline'
     */
    updateConnectionStatus(status) {
        const statusElement = document.querySelector('#connectionStatus .status-dot');
        const textElement = document.querySelector('#connectionStatus span:last-child');

        if (statusElement && textElement) {
            statusElement.className = `status-dot ${status}`;
            textElement.textContent = status === 'online' ? 'Connected' : 'Offline';
        }
    }

    /**
     * Update avatar status UI indicator
     * @param {string} status - Status: 'online' or 'offline'
     */
    updateAvatarStatus(status) {
        const statusElement = document.querySelector('#avatarStatus .status-dot');
        const textElement = document.querySelector('#avatarStatus span:last-child');

        if (statusElement && textElement) {
            statusElement.className = `status-dot ${status}`;
            textElement.textContent = status === 'online' ? 'Avatar Active' : 'Avatar Offline';
        }
    }

    /**
     * Hide agent state indicator
     */
    hideAgentState() {
        const agentStateElement = document.getElementById('agentState');
        if (agentStateElement) {
            agentStateElement.style.display = 'none';
        }
    }

    // ===========================
    // UTILITY METHODS
    // ===========================

    /**
     * Get current connection information
     * @returns {Object} Connection details
     */
    getConnectionInfo() {
        return {
            isConnected: this.isConnected,
            channel: this.currentChannel,
            userUID: this.currentUID,
            agentId: this.agentId,
            avatarUID: this.avatarUID,
            remoteUsers: Object.keys(this.remoteUsers)
        };
    }
}

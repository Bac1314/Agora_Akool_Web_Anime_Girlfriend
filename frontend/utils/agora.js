class AgoraManager {
    constructor() {
        this.client = null;
        this.localAudioTrack = null;
        this.remoteUsers = {};
        this.isConnected = false;
        this.currentChannel = null;
        this.currentUID = null;
        this.agentId = null;
        this.avatarUID = null;
        
        this.onUserJoined = this.onUserJoined.bind(this);
        this.onUserLeft = this.onUserLeft.bind(this);
        this.onUserPublished = this.onUserPublished.bind(this);
        this.onUserUnpublished = this.onUserUnpublished.bind(this);
    }

    async initialize() {
        try {
            if (typeof AgoraRTC === 'undefined') {
                throw new Error('Agora RTC SDK not loaded');
            }

            this.client = AgoraRTC.createClient(CONFIG.AGORA_SETTINGS);
            
            this.client.on("user-joined", this.onUserJoined);
            this.client.on("user-left", this.onUserLeft);
            this.client.on("user-published", this.onUserPublished);
            this.client.on("user-unpublished", this.onUserUnpublished);

            console.log('Agora client initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize Agora client:', error);
            throw error;
        }
    }

    async startConversation(settings = {}) {
        try {
            const channel = settings.channel || CONFIG.DEFAULT_CHANNEL;
            const userName = settings.userName || CONFIG.DEFAULT_USER_NAME;
            const userUID = 123;

            console.log(`Starting conversation on channel: ${channel}`);

            if (!this.client) {
                await this.initialize();
            }

            const channelInfo = await API.agora.getChannelInfo(channel, userUID);
            
            await this.client.join(
                channelInfo.appId, 
                channel, 
                null,
                userUID
            );

            this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            await this.client.publish([this.localAudioTrack]);

            this.isConnected = true;
            this.currentChannel = channel;
            this.currentUID = userUID;

            const conversationData = await API.agora.startConversation({
                channel: channel,
                agentName: `agent_${userName}_${Date.now()}`,
                remoteUid: userUID
            });

            this.agentId = conversationData.agentId;
            this.avatarUID = conversationData.avatarUid;

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

    async stopConversation() {
        try {
            console.log('Stopping conversation...');

            if (this.agentId) {
                await API.agora.stopConversation(this.agentId);
                this.agentId = null;
            }

            if (this.localAudioTrack) {
                this.localAudioTrack.stop();
                this.localAudioTrack.close();
                this.localAudioTrack = null;
            }

            if (this.client && this.isConnected) {
                await this.client.leave();
            }

            this.isConnected = false;
            this.currentChannel = null;
            this.currentUID = null;
            this.avatarUID = null;
            this.remoteUsers = {};

            this.updateConnectionStatus('offline');
            this.updateAvatarStatus('offline');

            console.log('Conversation stopped successfully');
            return true;

        } catch (error) {
            console.error('Failed to stop conversation:', error);
            throw error;
        }
    }

    async toggleMute() {
        try {
            if (!this.localAudioTrack) {
                throw new Error('No audio track available');
            }

            const isMuted = !this.localAudioTrack.enabled;
            await this.localAudioTrack.setEnabled(isMuted);
            
            console.log(`Audio ${isMuted ? 'unmuted' : 'muted'}`);
            return !isMuted;

        } catch (error) {
            console.error('Failed to toggle mute:', error);
            throw error;
        }
    }

    onUserJoined(user) {
        console.log('User joined:', user.uid);
        this.remoteUsers[user.uid] = user;
    }

    onUserLeft(user) {
        console.log('User left:', user.uid);
        delete this.remoteUsers[user.uid];
        
        if (user.uid == this.avatarUID) {
            this.updateAvatarStatus('offline');
        }
    }

    async onUserPublished(user, mediaType) {
        console.log('User published:', user.uid, mediaType);
        
        await this.client.subscribe(user, mediaType);
        
        if (user.uid == this.avatarUID && mediaType === 'video') {
            const videoTrack = user.videoTrack;
            if (videoTrack) {
                this.displayAvatar(videoTrack);
                this.updateAvatarStatus('online');
            }
        }

        if (mediaType === 'audio') {
            const audioTrack = user.audioTrack;
            if (audioTrack) {
                audioTrack.play();
            }
        }
    }

    onUserUnpublished(user, mediaType) {
        console.log('User unpublished:', user.uid, mediaType);
        
        if (user.uid == this.avatarUID && mediaType === 'video') {
            this.hideAvatar();
            this.updateAvatarStatus('offline');
        }
    }

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

    hideAvatar() {
        const avatarContainer = document.getElementById('avatarVideo');
        const placeholder = document.getElementById('avatarPlaceholder');
        
        if (avatarContainer && placeholder) {
            avatarContainer.style.display = 'none';
            placeholder.style.display = 'flex';
            avatarContainer.innerHTML = '';
            
            console.log('Avatar video hidden');
        }
    }

    updateConnectionStatus(status) {
        const statusElement = document.querySelector('#connectionStatus .status-dot');
        const textElement = document.querySelector('#connectionStatus span:last-child');
        
        if (statusElement && textElement) {
            statusElement.className = `status-dot ${status}`;
            textElement.textContent = status === 'online' ? 'Connected' : 'Offline';
        }
    }

    updateAvatarStatus(status) {
        const statusElement = document.querySelector('#avatarStatus .status-dot');
        const textElement = document.querySelector('#avatarStatus span:last-child');
        
        if (statusElement && textElement) {
            statusElement.className = `status-dot ${status}`;
            textElement.textContent = status === 'online' ? 'Avatar Active' : 'Avatar Offline';
        }
    }

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
class App {
    constructor() {
        this.agoraManager = null;
        this.avatarManager = null;
        this.chatManager = null;
        this.controlsManager = null;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            console.log('🌸 Initializing AI Anime Girlfriend App...');

            this.agoraManager = new AgoraManager();
            this.avatarManager = new AvatarManager();
            this.chatManager = new ChatManager();
            this.controlsManager = new ControlsManager();

            window.agoraManager = this.agoraManager;
            window.avatarManager = this.avatarManager;
            window.chatManager = this.chatManager;
            window.controlsManager = this.controlsManager;

            await this.avatarManager.initialize();

            const initResults = await Promise.all([
                this.chatManager.initialize(),
                this.controlsManager.initialize()
            ]);

            if (initResults.every(result => result)) {
                this.isInitialized = true;
                this.setupGlobalErrorHandlers();
                this.showWelcomeMessage();
                
                console.log('✅ App initialized successfully!');
                UTILS.showToast('Welcome to AI Anime Girlfriend!', 'success');
                
                return true;
            } else {
                throw new Error('Failed to initialize some components');
            }

        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.showInitializationError(error);
            return false;
        }
    }

    setupGlobalErrorHandlers() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            UTILS.showToast('An unexpected error occurred', 'error');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            UTILS.showToast('Connection error occurred', 'error');
            event.preventDefault();
        });

        window.addEventListener('beforeunload', (event) => {
            if (this.agoraManager?.isConnected) {
                event.preventDefault();
                event.returnValue = 'You have an active conversation. Are you sure you want to leave?';
                return event.returnValue;
            }
        });
    }

    showWelcomeMessage() {
        const avatarConfig = this.avatarManager.getConfig();
        
        let welcomeMessage = "🌸 Welcome to your AI Anime Girlfriend experience! ";
        
        if (avatarConfig.validated) {
            welcomeMessage += "Everything is set up perfectly! Click 'Start Chat' to begin our conversation! 💕";
        } else {
            welcomeMessage += "The chat system is ready, but avatar features may be limited. Check your environment variables for full functionality! ⚙️";
        }
        
        setTimeout(() => {
            this.chatManager.sendMessage(welcomeMessage, 'system');
        }, 1000);
    }

    showInitializationError(error) {
        const errorMessage = `
            <div style="text-align: center; padding: 20px; color: #dc3545;">
                <h2>❌ Initialization Error</h2>
                <p>Failed to start the AI Anime Girlfriend app.</p>
                <p><small>${error.message}</small></p>
                <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;

        const container = document.querySelector('.app-container');
        if (container) {
            container.innerHTML = errorMessage;
        }
    }

    getStatus() {
        return {
            initialized: this.isInitialized,
            agora: this.agoraManager?.getConnectionInfo() || null,
            avatar: this.avatarManager?.getDebugInfo() || null,
            chat: {
                messageCount: this.chatManager?.getMessageCount() || 0,
                lastMessage: this.chatManager?.getLastMessage() || null
            },
            controls: {
                active: this.controlsManager?.isConversationActive() || false,
                muted: this.controlsManager?.getMuteStatus() || false
            }
        };
    }

    async cleanup() {
        try {
            console.log('🧹 Cleaning up app...');
            
            if (this.agoraManager?.isConnected) {
                await this.agoraManager.stopConversation();
            }
            
            console.log('✅ App cleanup completed');
            
        } catch (error) {
            console.error('❌ Error during cleanup:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM loaded, starting app initialization...');
    
    const app = new App();
    window.app = app;
    
    const initialized = await app.initialize();
    
    if (!initialized) {
        console.error('💥 App failed to initialize');
    }
    
    window.addEventListener('beforeunload', () => {
        app.cleanup();
    });
});

window.addEventListener('load', () => {
    console.log('📱 Window loaded, app ready for use!');
});

console.log('📜 Main script loaded');
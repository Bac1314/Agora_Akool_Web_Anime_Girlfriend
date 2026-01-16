const CONFIG = {
    API_BASE_URL: window.location.origin,
    DEFAULT_USER_NAME: 'User',
    AGORA_SETTINGS: {
        codec: 'vp8',
        mode: 'rtc',
        role: 'host'
    },
    AVATAR_SETTINGS: {
        enabled: true,
        sampleRate: 16000
    }
};

const API = {
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE_URL}/api${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    },

    agora: {
        getChannelInfo: (channel, uid) => 
            API.request(`/agora/channel-info?channel=${channel}&uid=${uid}`),
        
        startConversation: (data) => 
            API.request('/agora/start', {
                method: 'POST',
                body: JSON.stringify(data)
            }),
        
        stopConversation: (agentId) => 
            API.request(`/agora/stop/${agentId}`, {
                method: 'DELETE'
            })
    },

    avatar: {
        getConfig: () => API.request('/avatar/config'),
        validate: () => API.request('/avatar/validate')
    }
};

const STORAGE = {
    get: (key, defaultValue = null) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
        }
    }
};

const UTILS = {
    generateChannelName: () => `anime-gf-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    
    formatTime: (date = new Date()) => {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },

    showToast: (message, type = 'info') => {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};
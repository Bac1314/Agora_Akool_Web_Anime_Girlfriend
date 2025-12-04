// Internationalization (i18n) system for multi-language support
class I18nManager {
    constructor() {
        this.currentLanguage = 'ja'; // Default to Japanese
        this.translations = {};
        this.loadTranslations();
        this.loadStoredLanguage();
    }

    loadTranslations() {
        this.translations = {
            'ja': {
                // App Title & Status
                title: 'バーチャル彼女',
                connecting: '彼女に接続しています...',
                connected: '接続済み',
                disconnected: '切断',
                calling: '彼女を呼んでいます...',
                
                // Avatar & Loading
                avatarLoading: '彼女を呼んでいます...',
                
                // Chat
                chat: 'チャット',
                messages: 'チャット',
                clear: 'クリア',
                messagePlaceholder: 'メッセージを入力してね...♪',
                responding: '彼女が返事を考えています...',
                welcomeMessage: 'こんにちは！私があなたの彼女よ♪ 今日はどうしたの？',
                
                // Controls
                startCall: '通話開始',
                endCall: '通話終了',
                mute: 'ミュート',
                unmute: 'ミュート解除',
                
                // Settings
                settings: '設定',
                roomName: 'ルーム名:',
                yourName: 'あなたの名前:',
                namePlaceholder: '名前を入力してください',
                enableVoice: '音声チャットを有効にする',
                enableVideo: 'ビデオ通話を有効にする',
                language: '言語:',
                cancel: 'キャンセル',
                save: '保存',
                
                // Languages
                japanese: '日本語',
                english: 'English',
                korean: '한국어',
                chinese: '中文'
            },
            
            'en': {
                // App Title & Status  
                title: 'Virtual Girlfriend',
                connecting: 'Connecting to your girlfriend...',
                connected: 'Connected',
                disconnected: 'Disconnected',
                calling: 'Calling your girlfriend...',
                
                // Avatar & Loading
                avatarLoading: 'Calling your girlfriend...',
                
                // Chat
                chat: 'Chat',
                messages: 'Chat',
                clear: 'Clear',
                messagePlaceholder: 'Type your message... ♪',
                responding: 'She is thinking of a response...',
                welcomeMessage: 'Hello! I\'m your girlfriend ♪ How are you today?',
                
                // Controls
                startCall: 'Start Call',
                endCall: 'End Call',
                mute: 'Mute',
                unmute: 'Unmute',
                
                // Settings
                settings: 'Settings',
                roomName: 'Room Name:',
                yourName: 'Your Name:',
                namePlaceholder: 'Enter your name',
                enableVoice: 'Enable Voice Chat',
                enableVideo: 'Enable Video Call',
                language: 'Language:',
                cancel: 'Cancel',
                save: 'Save',
                
                // Languages
                japanese: 'Japanese',
                english: 'English',
                korean: 'Korean',
                chinese: 'Chinese'
            },
            
            'ko': {
                // App Title & Status
                title: '가상 여자친구',
                connecting: '여자친구와 연결 중...',
                connected: '연결됨',
                disconnected: '연결 끊김',
                calling: '여자친구를 부르는 중...',
                
                // Avatar & Loading
                avatarLoading: '여자친구를 부르는 중...',
                
                // Chat
                chat: '채팅',
                messages: '채팅',
                clear: '지우기',
                messagePlaceholder: '메시지를 입력하세요... ♪',
                responding: '그녀가 답변을 생각하고 있어요...',
                welcomeMessage: '안녕하세요! 저는 당신의 여자친구예요 ♪ 오늘 어떠세요?',
                
                // Controls
                startCall: '통화 시작',
                endCall: '통화 종료',
                mute: '음소거',
                unmute: '음소거 해제',
                
                // Settings
                settings: '설정',
                roomName: '방 이름:',
                yourName: '당신의 이름:',
                namePlaceholder: '이름을 입력하세요',
                enableVoice: '음성 채팅 활성화',
                enableVideo: '영상 통화 활성화',
                language: '언어:',
                cancel: '취소',
                save: '저장',
                
                // Languages
                japanese: '일본어',
                english: '영어',
                korean: '한국어',
                chinese: '중국어'
            },
            
            'zh': {
                // App Title & Status
                title: '虚拟女友',
                connecting: '正在连接您的女友...',
                connected: '已连接',
                disconnected: '已断开',
                calling: '正在呼叫您的女友...',
                
                // Avatar & Loading
                avatarLoading: '正在呼叫您的女友...',
                
                // Chat
                chat: '聊天',
                messages: '聊天',
                clear: '清除',
                messagePlaceholder: '输入您的消息... ♪',
                responding: '她正在思考回复...',
                welcomeMessage: '你好！我是你的女朋友 ♪ 你今天怎么样？',
                
                // Controls
                startCall: '开始通话',
                endCall: '结束通话', 
                mute: '静音',
                unmute: '取消静音',
                
                // Settings
                settings: '设置',
                roomName: '房间名:',
                yourName: '您的姓名:',
                namePlaceholder: '请输入您的姓名',
                enableVoice: '启用语音聊天',
                enableVideo: '启用视频通话',
                language: '语言:',
                cancel: '取消',
                save: '保存',
                
                // Languages
                japanese: '日语',
                english: '英语',
                korean: '韩语',
                chinese: '中文'
            }
        };
    }

    loadStoredLanguage() {
        const stored = localStorage.getItem('virtualGirlfriend_language');
        if (stored && this.translations[stored]) {
            this.currentLanguage = stored;
        }
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('virtualGirlfriend_language', lang);
            this.updateUI();
            return true;
        }
        return false;
    }

    t(key) {
        const translation = this.translations[this.currentLanguage];
        return translation && translation[key] ? translation[key] : key;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getAvailableLanguages() {
        return [
            { code: 'ja', name: this.t('japanese'), flag: '🇯🇵' },
            { code: 'en', name: this.t('english'), flag: '🇺🇸' },
            { code: 'ko', name: this.t('korean'), flag: '🇰🇷' },
            { code: 'zh', name: this.t('chinese'), flag: '🇨🇳' }
        ];
    }

    updateUI() {
        // Update document title
        document.title = this.t('title') + ' - Virtual Girlfriend';
        
        // Update document language attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Trigger custom event for components to update
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: this.currentLanguage } 
        }));
        
        // Update all elements with data-i18n attributes
        this.updateElementsWithI18n();
    }

    updateElementsWithI18n() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type !== 'submit') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    // Format text with variables
    tf(key, variables = {}) {
        let text = this.t(key);
        Object.keys(variables).forEach(varKey => {
            text = text.replace(new RegExp(`{${varKey}}`, 'g'), variables[varKey]);
        });
        return text;
    }
}

// Create global i18n instance
window.i18n = new I18nManager();
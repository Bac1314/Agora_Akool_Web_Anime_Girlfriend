// Internationalization (i18n) system for multi-language support
class I18nManager {
    constructor() {
        this.currentLanguage = 'en'; // Default to English
        this.translations = {};
        this.loadTranslations();
        this.loadStoredLanguage();
        
        // Ensure UI updates when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateUI());
        } else {
            // DOM is already ready
            setTimeout(() => this.updateUI(), 0);
        }
    }

    loadTranslations() {
        this.translations = {
            'ja': {
                // App Title & Status
                title: 'バーチャル彼女',
                connecting: '彼女に接続しています...',
                connected: '接続済み',
                disconnected: '切断',
                calling: "'通話開始'をクリックして接続",

                // Avatar & Loading
                avatarLoading: "'通話開始'をクリックして接続",
                avatarConnecting: 'アバターに接続中...',
                
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
                muteVideo: 'ビデオミュート',
                unmuteVideo: 'ビデオ解除',
                
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
                
                // Connection States
                connectingToAI: 'AIアシスタントに接続中...',
                disconnecting: '切断中...',

                // Conversation Summary
                conversationSummary: '会話の要約',
                yourRating: '会話の評価',
                summary: '要約',
                analyzingConversation: '会話を分析中...',
                done: '完了',
                you: 'あなた',

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
                calling: "Click 'Start Call' to connect",

                // Avatar & Loading
                avatarLoading: "Click 'Start Call' to connect",
                avatarConnecting: 'Waiting for avatar...',
                
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
                muteVideo: 'Mute Video',
                unmuteVideo: 'Unmute Video',
                
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
                
                // Connection States
                connectingToAI: 'Connecting to AI assistant...',
                disconnecting: 'Disconnecting...',

                // Conversation Summary
                conversationSummary: 'Conversation Summary',
                yourRating: 'Your Conversation Rating',
                summary: 'Summary',
                analyzingConversation: 'Analyzing your conversation...',
                done: 'Done',
                you: 'You',

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
                calling: "'통화 시작'을 클릭하여 연결",

                // Avatar & Loading
                avatarLoading: "'통화 시작'을 클릭하여 연결",
                avatarConnecting: '아바타를 기다리는 중...',
                
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
                muteVideo: '비디오 음소거',
                unmuteVideo: '비디오 해제',
                
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
                
                // Connection States
                connectingToAI: 'AI 어시스턴트에 연결 중...',
                disconnecting: '연결 해제 중...',

                // Conversation Summary
                conversationSummary: '대화 요약',
                yourRating: '대화 평가',
                summary: '요약',
                analyzingConversation: '대화를 분석하는 중...',
                done: '완료',
                you: '당신',

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
                calling: "点击'开始通话'连接",

                // Avatar & Loading
                avatarLoading: "点击'开始通话'连接",
                avatarConnecting: '正在等待头像...',
                
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
                muteVideo: '静音视频',
                unmuteVideo: '取消静音视频',
                
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
                
                // Connection States
                connectingToAI: '正在连接AI助手...',
                disconnecting: '正在断开连接...',

                // Conversation Summary
                conversationSummary: '对话摘要',
                yourRating: '对话评分',
                summary: '摘要',
                analyzingConversation: '正在分析您的对话...',
                done: '完成',
                you: '您',

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

}

// Create global i18n instance
window.i18n = new I18nManager();
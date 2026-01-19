# 🌸 AI Anime Girlfriend Demo

A modern web-based AI anime girlfriend application featuring full-screen immersive experience with Agora ConvoAI cascaded voice-to-voice model integration, Akool avatar rendering, and real-time chat transcriptions. Experience natural conversations with your AI companion through voice or text chat.

![Demo Preview](https://via.placeholder.com/800x400/ff9a9e/ffffff?text=AI+Anime+Girlfriend+Demo)

## ✨ Features

- **🎬 Full-Screen Experience**: Immersive avatar display that fills the entire screen
- **💬 Real-Time Chat Transcriptions**: Live display of voice conversations via Agora RTM
- **✍️ Text & Voice Input**: Chat with text messages or speak naturally
- **🗣️ Cascaded Voice-to-Voice**: Advanced Agora ConvoAI with custom ASR, LLM, and TTS providers
- **🎭 Avatar Rendering**: Realistic Akool avatar with lip-sync and expressions
- **⭐ Conversation Summary & Rating**: AI analyzes each conversation and provides a 1-5 star rating with detailed summary
- **📱 Mobile-First Design**: Optimized for mobile devices with touch-friendly controls
- **⚙️ Customizable AI Models**: Configure your own LLM, ASR, and TTS services
- **🔒 Secure Architecture**: API keys safely stored on backend
- **🔐 HTTP Basic Authentication**: Optional password protection for production deployments
- **🎨 Modern UI/UX**: Glass-morphism effects, backdrop blur, and smooth animations
- **💫 Streaming Responses**: AI responses stream word-by-word for natural conversation flow

## 🎯 Prerequisites

Before setting up this project, ensure you have:

### Required Accounts & Services
- **Node.js** (version 16 or higher)
- **Agora Account** - [Sign up here](https://console.agora.io/)
  - App ID
  - API Key and Secret (for ConvoAI REST API)
- **Akool Account** - Contact Agora sales for API access
  - Akool API Key
  - Avatar ID from Akool dashboard
- **AI Service Providers** (Choose your preferred vendors)
  - **ASR**: Agora Ares (default), Azure Speech, OpenAI Whisper
  - **LLM**: OpenAI GPT-4o-mini (default), Azure OpenAI, Anthropic Claude
  - **TTS**: Microsoft Azure TTS (default), OpenAI TTS, ElevenLabs

### Development Tools
- Git
- Code editor (VS Code recommended)
- Modern web browser with WebRTC support

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd agora-akool-anime-girlfriend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory using the cascaded model configuration:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Agora Configuration
AGORA_APP_ID=your_agora_app_id_here
AGORA_API_KEY=your_agora_api_key_here
AGORA_API_SECRET=your_agora_api_secret_here

# Akool Configuration
AKOOL_API_KEY=your_akool_api_key_here
AKOOL_AVATAR_ID=your_avatar_id_here

# LLM Configuration (OpenAI Example)
LLM_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4o-mini
LLM_SYSTEM_PROMPT=You are a friendly AI anime girlfriend...

# TTS Configuration (Microsoft Azure Example)
TTS_Microsoft_API_KEY=your_azure_tts_key_here
TTS_Microsoft_REGION=eastus
TTS_Microsoft_VOICE=en-US-AriaNeural

# Server Configuration
PORT=3000
```

### 4. Start the Application
```bash
npm run dev
```

This starts both the backend server and serves the frontend. Open http://localhost:3000 in your browser.

### 5. Using the Demo
1. Click **"Start Call"** to begin the conversation
2. Wait for the avatar to load and connection to establish
3. **Speak naturally** or **type messages** in the chat to talk with your AI girlfriend
4. Watch transcriptions appear in real-time in the chat panel
5. Use the **"⚙️ Settings"** button to customize your experience
6. Click **"End Call"** when you're done
7. View your **conversation summary and rating** - automatically shown after each session

## 🏗️ Architecture Overview

### Backend (`/backend`)
- **Express.js server** handling API requests
- **Agora REST API integration** for ConvoAI session management
- **Akool avatar configuration** and validation
- **Cascaded AI model configuration** (ASR, LLM, TTS)
- **Environment variable management** for secure credential storage

### Frontend (`/frontend`)
- **Vanilla JavaScript** for maximum compatibility
- **Agora RTC Web SDK** for real-time audio/video communication
- **Agora RTM SDK** for real-time messaging and transcriptions
- **Responsive CSS** with anime-themed design
- **Modular component architecture**

### Key Components

#### AgoraManager (`/frontend/utils/agoraManager.js`)
Manages both RTC and RTM clients:
- **RTC Client**: Handles audio/video streams and avatar display
- **RTM Client**: Receives and sends real-time messages
- **Event Handlers**: Processes user join/leave, media publishing, and transcriptions
- **Media Controls**: Audio/video mute functionality

#### ChatManager (`/frontend/components/chat.js`)
Handles chat UI and message display:
- **RTM Message Processing**: Displays user and assistant transcriptions
- **Streaming Support**: Updates AI responses as they arrive
- **Duplicate Prevention**: Smart handling of text vs voice messages
- **Message History**: Persistent chat storage

#### ControlsManager (`/frontend/components/controls.js`)
Manages user controls:
- **Call Controls**: Start/stop conversations
- **Media Toggles**: Mute/unmute audio and video
- **Settings Management**: User preferences

### Project Structure
```
├── backend/
│   ├── controllers/       # API request handlers
│   │   ├── agoraController.js      # ConvoAI lifecycle
│   │   ├── avatarController.js     # Akool avatar config
│   │   └── aiSummaryController.js  # Conversation summaries
│   ├── middleware/        # Express middleware
│   │   └── auth.js        # HTTP Basic Authentication
│   ├── routes/           # Express route definitions
│   │   ├── agora_routes.js
│   │   ├── avatar_routes.js
│   │   └── aiSummary_routes.js
│   └── server.js         # Main server entry point
├── frontend/
│   ├── components/       # UI components
│   │   ├── chat.js       # Chat interface & RTM handling
│   │   ├── controls.js   # User controls
│   │   └── language.js   # i18n support
│   ├── styles/           # CSS styling
│   │   └── main.css      # Main stylesheet
│   ├── utils/            # Utility functions
│   │   ├── agoraManager.js  # RTC/RTM client manager
│   │   ├── config.js        # Configuration
│   │   └── i18n.js          # Internationalization
│   ├── index.html        # Main HTML file
│   └── main.js           # Application entry point
├── CLAUDE_sessions/      # Development session logs
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
├── CLAUDE.md            # Project documentation
└── README.md            # This file
```

## 🔧 Configuration

### Agora Settings
Configure your Agora settings in the [Agora Console](https://console.agora.io/):
1. Create a new project or use existing
2. Enable the **Conversational AI** service
3. Generate API credentials (API Key and Secret)
4. Note your App ID

### Akool Avatar Setup
1. Contact Agora sales to purchase Akool API access
2. Access the Akool dashboard through Agora's portal
3. Select or create an avatar
4. Note the Avatar ID for your `.env` file

### AI Model Configuration

The application uses a cascaded architecture where you can configure each component:

#### ASR (Speech-to-Text)
- **Agora Ares** (default): Built-in, no extra config needed
- **Others**: Check Agora Documentation

#### LLM (Language Model)
- **OpenAI GPT-4o-mini** (default): Fast and cost-effective
- **Azure OpenAI**: Enterprise-grade with SLA
- **Anthropic Claude**: Advanced reasoning capabilities
- **Others**: Check Agora Documentation

Configure via environment variables (see `.env.example`)

#### TTS (Text-to-Speech)
- **Microsoft Azure TTS** (default): High-quality voices
- **ElevenLabs**: Premium voice quality
- **Others**: Check Agora Documentation

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `AGORA_APP_ID` | Your Agora project App ID | ✅ Yes |
| `AGORA_API_KEY` | Agora REST API key | ✅ Yes |
| `AGORA_API_SECRET` | Agora REST API secret | ✅ Yes |
| `AKOOL_API_KEY` | Akool avatar API key | ✅ Yes |
| `AKOOL_AVATAR_ID` | Selected avatar ID | ✅ Yes |
| `LLM_URL` | LLM API endpoint | ✅ Yes |
| `LLM_API_KEY` | LLM API key | ✅ Yes |
| `LLM_MODEL` | Model name (e.g., gpt-4o-mini) | ✅ Yes |
| `LLM_SYSTEM_PROMPT` | AI personality prompt | ✅ Yes |
| `TTS_Microsoft_API_KEY` | Azure TTS API key | ✅ Yes |
| `TTS_Microsoft_REGION` | Azure region | ✅ Yes |
| `TTS_Microsoft_VOICE` | Voice name | ✅ Yes |
| `AUTH_USERNAME` | HTTP Basic Auth username | ❌ Optional |
| `AUTH_PASSWORD` | HTTP Basic Auth password | ❌ Optional |
| `PORT` | Server port (default: 3000) | ❌ Optional |

## 🎮 Usage Guide

### Starting a Conversation
1. Ensure all environment variables are properly configured
2. Click the **Start Call** button
3. Grant microphone and camera permissions when prompted
4. Wait for connection status to show "Connected"
5. Avatar status should display "Avatar Active"

### Interaction Methods

#### Voice Input
- Simply speak naturally into your microphone
- Your speech is transcribed and appears in the chat
- The AI responds with voice and text

#### Text Input
- Type messages in the chat input field
- Press Enter or click Send
- Messages are sent to the AI assistant via RTM
- The AI responds as if you spoke

### Chat Features
- **Real-Time Transcriptions**: See your voice converted to text instantly
- **Streaming Responses**: AI responses appear word-by-word
- **Message History**: Conversations are saved locally
- **Clear Chat**: Remove conversation history
- **Collapsible Panel**: Hide/show chat as needed

### Media Controls
- **Mute/Unmute Audio**: Control your microphone during the conversation
- **Mute/Unmute Video**: Control your camera
- **End Call**: Stop the conversation and cleanup resources

### Conversation Summary & Rating
After ending each conversation, you'll receive:
- **AI-Generated Summary**: A 2-3 sentence overview of your conversation
- **Star Rating (1-5)**: Based on conversation quality, engagement, and interaction
- **Rating Description**: Detailed explanation of your rating
  - ⭐ **1 Star - Poor**: Minimal engagement, rude or inappropriate behavior
  - ⭐⭐ **2 Stars - Below Average**: Limited engagement, somewhat dismissive
  - ⭐⭐⭐ **3 Stars - Average**: Decent conversation, polite but basic interaction
  - ⭐⭐⭐⭐ **4 Stars - Good**: Engaging conversation, friendly and interested
  - ⭐⭐⭐⭐⭐ **5 Stars - Excellent**: Deep, meaningful conversation with great emotional connection
- **Animated Display**: Gold stars fill in with smooth animation
- The modal appears automatically after ending each call

### Settings Panel
Access via the **Settings** button to customize:
- **Channel Name**: Change the conversation channel
- **Your Name**: Personalize how the AI addresses you
- **Voice Chat**: Enable/disable voice features
- **Avatar**: Toggle avatar rendering
- **Language**: Select interface language

## 🔍 Troubleshooting

### Common Issues

**Avatar not appearing:**
- Verify `AKOOL_API_KEY` and `AKOOL_AVATAR_ID` are correct
- Check browser console for WebRTC errors
- Ensure camera permissions are granted
- Wait a few seconds for avatar to initialize

**Connection failures:**
- Confirm all Agora credentials in `.env` file
- Check network connectivity
- Verify Agora account has sufficient credits
- Ensure ConvoAI service is enabled in Agora console

**No transcriptions appearing:**
- Verify RTM is connecting (check console logs)
- Ensure AI agent started successfully
- Check that `enable_rtm: true` in agent configuration
- Verify microphone is working and not muted

**Audio issues:**
- Grant microphone permissions in your browser
- Check system audio settings
- Try the mute/unmute button
- Verify TTS configuration is correct

**Text messages not working:**
- Ensure conversation is started (Call button shows "End Call")
- Check RTM client is initialized (console logs)
- Verify no browser errors in console

**Build errors:**
- Run `npm install` to ensure dependencies are installed
- Check Node.js version (16+ required)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

### Debug Information
- Press `Ctrl+Shift+D` to show debug panel with connection info
- Open browser Developer Tools (F12) for detailed logs
- Check Network tab for failed API requests
- Review Console for error messages

## 📚 API Documentation

### Backend Endpoints

#### GET `/api/agora/token`
Generate Agora access token (currently returns basic channel info)
- **Query params**: `channel`, `uid`
- **Response**: `{ appId, channel, uid }`

#### POST `/api/agora/start`
Start conversational AI session with cascaded models
- **Body**: `{ channel, agentName, remoteUid }`
- **Response**: `{ success, agentId, agentUid, avatarUid, channel }`
- **Features**:
  - Configures ASR, LLM, TTS providers
  - Enables RTM for transcriptions
  - Initializes Akool avatar

#### DELETE `/api/agora/stop/:agentId`
Stop conversational AI session
- **Params**: `agentId`
- **Response**: `{ success, message }`

#### GET `/api/avatar/config`
Get avatar configuration
- **Response**: `{ enabled, avatarId, apiKey }`

#### GET `/api/avatar/validate`
Validate avatar setup
- **Response**: `{ valid, missingKeys, message }`

#### POST `/api/ai-summary/summarize-and-rate`
Generate conversation summary and rating
- **Body**: `{ transcript: [{ sender, content }, ...] }`
- **Response**: `{ summary, rating, ratingDescription }`
- **Features**:
  - Uses configured LLM to analyze conversation
  - Returns 1-5 star rating with criteria
  - Provides 2-3 sentence summary
  - Includes detailed rating description

#### GET `/health`
Server health check
- **Response**: `{ status, timestamp }`

### RTM Message Format

The application uses Agora RTM to receive conversation transcriptions:

#### User Transcription
```json
{
  "object": "user.transcription",
  "text": "Hello, how are you?",
  "final": true,
  "turn_id": 1,
  "stream_id": 123,
  "user_id": "123",
  "language": "en-US",
  "data_type": "transcribe"
}
```

#### Assistant Transcription
```json
{
  "object": "assistant.transcription",
  "text": "I'm doing great! How can I help you today?",
  "turn_id": 1,
  "turn_seq_id": 0,
  "source": "tts",
  "data_type": "transcribe"
}
```

## 🚢 Deployment

### Deploying to Render

This application can be easily deployed to [Render](https://render.com) with the following steps:

#### 1. Prepare Your Repository
Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

#### 2. Create a New Web Service
1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** and select **"Web Service"**
3. Connect your Git repository
4. Configure the service:
   - **Name**: `ai-anime-girlfriend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Choose based on expected traffic (Free tier works for testing)

#### 3. Configure Environment Variables
In the Render dashboard, add all required environment variables from your `.env` file:

**Required Variables:**
```
AGORA_APP_ID=your_agora_app_id
AGORA_API_KEY=your_agora_api_key
AGORA_API_SECRET=your_agora_api_secret
AKOOL_API_KEY=your_akool_api_key
AKOOL_AVATAR_ID=your_avatar_id
LLM_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=your_llm_api_key
LLM_MODEL=gpt-4o-mini
LLM_SYSTEM_PROMPT=You are a friendly AI anime girlfriend...
TTS_Microsoft_API_KEY=your_tts_api_key
TTS_Microsoft_REGION=eastus
TTS_Microsoft_VOICE=en-US-AriaNeural
```

**Authentication (Recommended for Production):**
```
AUTH_USERNAME=your_chosen_username
AUTH_PASSWORD=your_secure_password
```

> **Security Note**: Setting `AUTH_USERNAME` and `AUTH_PASSWORD` will enable HTTP Basic Authentication, preventing unauthorized access to your application. Users will be prompted for credentials when accessing the site.

#### 4. Deploy
1. Click **"Create Web Service"**
2. Render will automatically build and deploy your application
3. Once deployed, you'll receive a URL like `https://your-app-name.onrender.com`

#### 5. Test Your Deployment
1. Visit your deployed URL
2. If authentication is enabled, you'll see a browser login prompt
3. Enter your `AUTH_USERNAME` and `AUTH_PASSWORD`
4. Test the application by starting a conversation

### Authentication

The application includes optional HTTP Basic Authentication to protect against misuse:

**How It Works:**
- When `AUTH_USERNAME` and `AUTH_PASSWORD` are set, all routes (except `/health`) require authentication
- Users see a browser-native login popup when accessing the site
- The browser remembers credentials during the session
- The `/health` endpoint remains public for monitoring purposes

**Enable Authentication:**
```bash
# In your .env file or Render environment variables
AUTH_USERNAME=demo
AUTH_PASSWORD=your_secure_password_here
```

**Disable Authentication:**
```bash
# Leave blank or remove these variables
AUTH_USERNAME=
AUTH_PASSWORD=
```

**Best Practices:**
- Use strong passwords for production deployments
- Consider using a password manager to generate credentials
- Share credentials only with authorized users
- Change passwords regularly for shared deployments

### Other Deployment Platforms

The application can also be deployed to:
- **Heroku**: Use the same environment variables and start command
- **Railway**: Similar configuration to Render
- **DigitalOcean App Platform**: Configure as a Node.js app
- **AWS/Azure/GCP**: Deploy as a containerized application or directly on a VM

## 🔗 External Resources

### Documentation
- [Agora ConvoAI Overview](https://docs.agora.io/en/conversational-ai/overview/product-overview)
- [Agora ConvoAI REST API](https://docs.agora.io/en/conversational-ai/rest-api/agent/join)
- [Agora RTM SDK Documentation](https://docs.agora.io/en/real-time-messaging/overview/product-overview)
- [Akool Avatar Integration](https://docs.agora.io/en/conversational-ai/models/avatar/akool)
- [Cascaded Models Configuration](https://docs.agora.io/en/conversational-ai/overview/cascaded-models)
- [Agora Workshop Template](https://github.com/AgoraIO-Community/Agora-Workshop-Template)

### Community Examples
- [Conversational AI Demo](https://github.com/AgoraIO-Community/Conversational-AI-Demo)

### Support
- [Agora Developer Community](https://www.agora.io/en/community/)
- [Agora Documentation](https://docs.agora.io/)
- [Submit Issues](https://github.com/your-repo/issues)

## 🛡️ Security Best Practices

- ✅ API keys stored securely on backend
- ✅ No credentials exposed to frontend
- ✅ Optional HTTP Basic Authentication for access control
- ✅ CORS properly configured
- ✅ Input validation on all endpoints
- ✅ Environment-specific configurations
- ✅ Secure token generation (when enabled)
- ✅ RTM messages properly filtered by channel
- ✅ Health endpoint remains public for monitoring

## 🚀 Recent Updates

### v2.2 - HTTP Basic Authentication (January 15, 2026)
- 🔐 Added optional HTTP Basic Authentication for production deployments
- 🛡️ Browser-native login popup to prevent unauthorized access
- 📝 Comprehensive deployment guide for Render and other platforms
- ⚙️ Flexible authentication (disabled by default for local development)
- 🏥 Public health endpoint for monitoring services

### v2.1 - Conversation Summary & Rating (January 9, 2026)
- ⭐ AI-powered conversation analysis after each session
- ⭐ 1-5 star rating system with detailed criteria
- ⭐ Automatic summary generation using LLM
- ⭐ Beautiful animated modal with gold star display
- ⭐ Mobile-responsive design with glass-morphism effects
- ⭐ Rating descriptions explaining conversation quality

### v2.0 - RTM Integration (January 8, 2026)
- ✨ Added Agora RTM for real-time chat transcriptions
- ✨ Implemented text messaging to AI assistant
- ✨ Streaming AI responses for natural conversation flow
- ✨ Smart duplicate prevention for mixed text/voice input
- 🔧 Refactored AgoraManager with clear RTC/RTM separation
- 📝 Comprehensive JSDoc comments and code organization
- 🎨 Improved chat UI with real-time updates

### v1.0 - Initial Release
- 🎬 Full-screen avatar experience
- 🗣️ Voice-to-voice AI conversations
- 🎭 Akool avatar integration
- ⚙️ Cascaded model configuration

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

For major changes, please open an issue first to discuss what you would like to change.

## 🎉 Acknowledgments

- **Agora.io** for providing the ConvoAI platform and RTM infrastructure
- **Akool** for realistic avatar technology
- **OpenAI** for LLM capabilities
- **Microsoft Azure** for TTS services
- The open-source community for inspiration and tools

---

**Made with 💕 for the developer community**

*For support or questions, please refer to the documentation links above or open an issue in this repository.*

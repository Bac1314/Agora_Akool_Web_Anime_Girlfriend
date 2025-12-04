# 🌸 AI Anime Girlfriend Demo

A modern web-based AI anime girlfriend application featuring full-screen immersive experience with Agora ConvoAI cascaded voice-to-voice model integration and Akool avatar rendering. Experience natural conversations with your AI companion through advanced real-time voice chat.

![Demo Preview](https://via.placeholder.com/800x400/ff9a9e/ffffff?text=AI+Anime+Girlfriend+Demo)

## ✨ Features

- **🎬 Full-Screen Experience**: Immersive avatar display that fills the entire screen
- **💬 Modern Chat Interface**: Collapsible chat panel with smooth animations
- **🗣️ Cascaded Voice-to-Voice**: Advanced Agora ConvoAI with custom ASR, LLM, and TTS providers
- **🎭 Avatar Rendering**: Realistic Akool avatar with lip-sync and expressions
- **📱 Mobile-First Design**: Optimized for mobile devices with touch-friendly controls
- **⚙️ Customizable AI Models**: Configure your own LLM, ASR, and TTS services
- **🔒 Secure Architecture**: API keys safely stored on backend, certificate-free Agora integration
- **🎨 Modern UI/UX**: Glass-morphism effects, backdrop blur, and smooth animations

## 🎯 Prerequisites

Before setting up this project, ensure you have:

### Required Accounts & Services
- **Node.js** (version 16 or higher)
- **Agora Account** - [Sign up here](https://console.agora.io/)
  - App ID (Certificate disabled for no-token setup)
  - API Key and Secret (for ConvoAI REST API)
- **Akool Account** - Contact Agora sales for API access
  - Akool API Key
  - Avatar ID from Akool dashboard
- **AI Service Providers** (Choose your preferred vendors)
  - **ASR**: Azure Speech, OpenAI Whisper, or others
  - **LLM**: OpenAI GPT, Azure OpenAI, Anthropic Claude, or others
  - **TTS**: Azure Speech, OpenAI TTS, ElevenLabs, or others

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

# Server Configuration
PORT=3000
```

### 4. Start the Application
```bash
npm run dev
```

This starts both the backend server and serves the frontend. Open http://localhost:3000 in your browser.

### 5. Using the Demo
1. Click **"🎬 Start Chat"** to begin the conversation
2. Wait for the avatar to load and connection to establish
3. Type messages in the chat input to talk with your AI girlfriend
4. Use the **"⚙️ Settings"** button to customize your experience
5. Click **"🛑 Stop Chat"** when you're done

## 🏗️ Architecture Overview

### Backend (`/backend`)
- **Express.js server** handling API requests
- **Agora REST API integration** for ConvoAI session management
- **Akool avatar configuration** and validation
- **Environment variable management** for secure credential storage

### Frontend (`/frontend`)
- **Vanilla JavaScript** for maximum compatibility
- **Agora RTC Web SDK** for real-time communication
- **Responsive CSS** with anime-themed design
- **Modular component architecture**

### Project Structure
```
├── backend/
│   ├── controllers/     # API request handlers
│   ├── routes/         # Express route definitions  
│   └── server.js       # Main server entry point
├── frontend/
│   ├── components/     # Chat and control components
│   ├── styles/         # CSS styling
│   ├── utils/          # Utility functions
│   └── index.html      # Main HTML file
├── .env.example        # Environment template
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🔧 Configuration

### Agora Settings
Configure your Agora settings in the [Agora Console](https://console.agora.io/):
1. Create a new project or use existing
2. Enable the **Conversational AI** service
3. Generate API credentials
4. Set up authentication tokens

### Akool Avatar Setup
1. Contact Agora sales to purchase Akool API access
2. Access the Akool dashboard through Agora's portal
3. Select or create an avatar
4. Note the Avatar ID for your `.env` file

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `AGORA_APP_ID` | Your Agora project App ID | ✅ Yes |
| `AGORA_API_KEY` | Agora REST API key | ✅ Yes |
| `AGORA_API_SECRET` | Agora REST API secret | ✅ Yes |
| `AKOOL_API_KEY` | Akool avatar API key | 🔶 Recommended |
| `AKOOL_AVATAR_ID` | Selected avatar ID | 🔶 Recommended |
| `PORT` | Server port (default: 3000) | ❌ Optional |

## 🎮 Usage Guide

### Starting a Conversation
1. Ensure all environment variables are properly configured
2. Click the **Start Chat** button
3. Wait for connection status to show "Connected"
4. Avatar status should display "Avatar Ready"

### Chat Features
- **Text Messages**: Type and send messages using the input field
- **Voice Chat**: Automatically enabled when conversation starts
- **Mute/Unmute**: Control your microphone during the conversation
- **Clear Chat**: Remove conversation history

### Settings Panel
Access via the **Settings** button to customize:
- **Channel Name**: Change the conversation channel
- **Your Name**: Personalize how the AI addresses you
- **Voice Chat**: Enable/disable voice features
- **Avatar**: Toggle avatar rendering

## 🔍 Troubleshooting

### Common Issues

**Avatar not appearing:**
- Verify `AKOOL_API_KEY` and `AKOOL_AVATAR_ID` are correct
- Check browser console for WebRTC errors
- Ensure camera permissions are granted

**Connection failures:**
- Confirm all Agora credentials in `.env` file
- Check network connectivity
- Verify Agora account has sufficient credits

**Audio issues:**
- Grant microphone permissions in your browser
- Check system audio settings
- Try the mute/unmute button

**Build errors:**
- Run `npm install` to ensure dependencies are installed
- Check Node.js version (16+ required)
- Clear npm cache: `npm cache clean --force`

### Debug Information
Enable debug mode by opening browser Developer Tools and checking the console for detailed logs.

## 📚 API Documentation

### Backend Endpoints

#### GET `/api/agora/token`
Generate Agora access token
- **Query params**: `channel`, `uid`
- **Response**: `{ token, appId, channel, uid }`

#### POST `/api/agora/start`
Start conversational AI session
- **Body**: `{ channel, agentName, remoteUid }`
- **Response**: `{ success, agentId, agentUid, avatarUid, channel }`

#### DELETE `/api/agora/stop/:agentId`
Stop conversational AI session
- **Params**: `agentId`
- **Response**: `{ success, message }`

#### GET `/api/avatar/config`
Get avatar configuration
- **Response**: `{ enabled, avatarId, sampleRate }`

#### GET `/api/avatar/validate`
Validate avatar setup
- **Response**: `{ valid, missingKeys, message }`

## 🔗 External Resources

### Documentation
- [Agora ConvoAI Overview](https://docs.agora.io/en/conversational-ai/overview/product-overview)
- [Agora ConvoAI REST API](https://docs.agora.io/en/conversational-ai/rest-api/agent/join)
- [Akool Avatar Integration](https://docs.agora.io/en/conversational-ai/models/avatar/akool)
- [Agora Workshop Template](https://github.com/AgoraIO-Community/Agora-Workshop-Template)

### Support
- [Agora Developer Community](https://www.agora.io/en/community/)
- [Agora Documentation](https://docs.agora.io/)
- [Submit Issues](https://github.com/your-repo/issues)

## 🛡️ Security Best Practices

- ✅ API keys stored securely on backend
- ✅ No credentials exposed to frontend
- ✅ CORS properly configured
- ✅ Input validation on all endpoints
- ✅ Environment-specific configurations
- ✅ Secure token generation

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 🎉 Acknowledgments

- **Agora.io** for providing the ConvoAI platform
- **Akool** for realistic avatar technology
- The open-source community for inspiration and tools

---

**Made with 💕 for the developer community**

*For support or questions, please refer to the documentation links above or open an issue in this repository.*
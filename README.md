# Pengu Pilot - Spaceship Game

A fun spaceship navigation game with AI assistant and social media integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API keys:
   - Copy `src/config.example.js` to `src/config.js`
   - Add your OpenAI API key to `src/config.js`
   - Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)

3. Run the development server:
```bash
npm run dev
```

## Features

- **Planet Navigation**: Visit different planets in the solar system
- **AI Assistant**: Chat with an AI assistant for help
- **Social Media Integration**: 
  - Twitter: Opens directly to @pengupilots
  - Telegram: Opens directly to t.me/pengupilot
- **Matrix Riddle**: Solve the mysterious riddle in the Matrix
- **Desert Game**: Defend against enemies in the desert
- **Music Player**: Enjoy space music while traveling

## Planets

- **Home**: Your cozy space station
- **Frostbite**: Desert game location
- **Twitter**: Opens Twitter profile
- **Telegram**: Opens Telegram channel
- **Nebula**: Gas giant planet
- **Matrix**: Mysterious digital realm with riddle

## Security

- API keys are stored in `src/config.js` (ignored by git)
- Never commit your actual API keys to version control
- Use `src/config.example.js` as a template

## Development

The game is built with:
- Vanilla JavaScript
- HTML5
- CSS3
- OpenAI API for AI assistant 
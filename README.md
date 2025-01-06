This is a discord music bot bootstrapped with <a href="https://discord.js.org/" target="_blank" rel="noopener noreferrer">Discord.js</a> and <a href="https://discord-player.js.org/" target="_blank" rel="noopener noreferrer">Discord Player</a> with easy control, beautiful design and autocomplete

Bot can play music with `Yandex Music` and default services (see <a href="https://discord-player.js.org/docs/creating-a-music-bot/02_extractors_integration" target="_blank" rel="noopener noreferrer">Extractors Integration</a>)

## Getting Started

**1.** Duplicate `example.env` to `.env` for production variables and `.dev.env` for development mode

**2.** Fill in the files `.env` and `.dev.env` according to variable names

**3.** Configure [`constants.ts`](https://github.com/Ximeo-dev/music-bot/blob/main/src/config/player/constants.ts). Specify the main color, emoji and excluded extractors

**4.** Invite the bot to a test server and any other one you wish

**_Run in development mode:_**

```
npm run dev
```

**_Run in production mode:_**

```
npm run build
npm start
```

**_Slash commands deploy:_**

For the test mode (only for the test guild) use `npm run deploy`.  
For the production mode (all guilds) use `npm run deploy-prod`.

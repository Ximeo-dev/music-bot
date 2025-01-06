This is a discord music bot bootstrapped with [Discord.js](https://discord.js.org/) and [Discord Player](https://discord-player.js.org/) with easy control, beautiful design and autocomplete

Bot can play music with `Yandex Music` and default services (see [Extractors Integration](https://discord-player.js.org/docs/creating-a-music-bot/02_extractors_integration))

## Getting Started

**1.** Duplicate `example.env` to `.env` for production variables and `.dev.env` for development mode

**2.** Fill in the file `.env` according to variable names

**3.** Configure [`constants.ts`](https://github.com/Ximeo-dev/music-bot/blob/main/src/config/player/constants.ts). Specify the main color, emoji and excluded extractors

**4.** Invite the bot to a test server and any other one you wish

***Run in development mode:***

```
npm run dev
```

***Run in production mode:***

```
npm run build
npm start
```

***Slash commands deploy:***

For the test mode (only for the test guild) use `npm run deploy`.
For the production mode (all guilds) use `npm run deploy-prod`.

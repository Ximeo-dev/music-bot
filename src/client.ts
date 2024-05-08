import { Player } from 'discord-player'
import { Client } from 'discord.js'
import Events from './events/index.js'
import PlayerEvents from './events/player/index.js'
import Keys from './keys.js'
import { getEnvVar } from './utils/env.js'
import { registerEvents } from './utils/events/events.js'
import { registerPlayerEvents } from './utils/events/playerEvents.js'
import { sendErrorLog } from './utils/sendErrorLog.js'
import { YandexMusicExtractor } from './extractors/YandexMusicExtractor.js'
import { DiscordPlayerOptions } from './config/player/constants.js'
import { ClientIntents } from './config/constants.js'
import './database/db.js'
const client = new Client({
	intents: [ClientIntents],
})

const player = new Player(client, {
	ytdlOptions: {
		requestOptions: {
			// headers: {
			// 	// this is optional, you can also ignore this part if you are not using youtube source
			// 	cookie: getEnvVar('YOUTUBE_COOKIE'),
			// },
		},
	},
})

player.extractors.register(YandexMusicExtractor, {
	access_token: getEnvVar('YANDEX_ACCESS_TOKEN'),
	uid: getEnvVar('YANDEX_UID'),
})

player.extractors.loadDefault(ext => {
	return !DiscordPlayerOptions.disableSources.includes(ext)
}, DiscordPlayerOptions.extractorConfig)

// player.extractors.loadDefault(ext => ext === 'YouTubeExtractor')

registerEvents(client, Events)
registerPlayerEvents(player, PlayerEvents)

client.login(Keys.clientToken).catch(err => {
	console.error('[Login Error]', err)
	process.exit(1)
})

player.on('debug', message => console.log(`[Player] ${message}`))
player.events.on('debug', (queue, message) =>
	console.log(`[${queue.guild.name}: ${queue.guild.id}] ${message}`)
)

process.on('unhandledRejection', (error: TypeError) =>
	sendErrorLog(client, error, 'error')
)

process.on('uncaughtExceptionMonitor', (error: TypeError) =>
	sendErrorLog(client, error, 'error')
)

process.on('warning', (warning: TypeError) => {
	sendErrorLog(client, warning, 'error')
})

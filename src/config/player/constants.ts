import { ExtractorLoaderOptionDict } from 'discord-player'
import { ColorResolvable } from 'discord.js'

export const COLORS = {
	player: '#70EFC5' as ColorResolvable,
}

export const EMOJIS = {
	successfully: '<:successfully:1229478775406727168>',
	previous: '<:previous:1226941023939465246>',
	rewind: '<:rewind:1226941726522871868>',
	pause: '<:pause:1226940595293917284>',
	play: '<:play:1226939928924131598>',
	fast_forward: '<:fastforward:1226941461300514957',
	next: '<:next:1226941228067848252>',
	shuffle_inactive: '<:shuffle_inactive:1229475819693539449>',
	shuffle_active: '<:shuffle_active:1229475773065334896>',
	musical_note: '<:musical_note:1231996075393552474>',
	playlist: '<:playlist:1231996216661905409>',
	loop_inactive: '<:loop_inactive:1234900005916250235>',
	loop_track: '<:loop_track:1234900125940322324>',
	loop_queue: '<:loop_queue:1234900053923987497>',
	volume: '<:volume:1236611551893520485>'
}

export const DiscordPlayerOptions: DiscordPlayerConfig = {
	extractorConfig: {
		YouTubeExtractor: {},
		SoundCloudExtractor: {},
		AppleMusicExtractor: {},
		SpotifyExtractor: {},
		VimeoExtractor: {},
		ReverbnationExtractor: {},
		AttachmentExtractor: {},
	},
	disableSources: [],
}

type DiscordPlayerConfig = {
	extractorConfig: ExtractorLoaderOptionDict
	disableSources: (keyof ExtractorLoaderOptionDict)[]
}

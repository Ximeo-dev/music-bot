import { GuildQueue, Track } from 'discord-player'
import { EmbedBuilder } from 'discord.js'
import { COLORS, EMOJIS } from './constants.js'
import { formatDuration } from '../../utils/formatDuration.js'

type EmbedInit = ConstructorParameters<typeof EmbedBuilder>[0]

export class EmbedGenerator extends EmbedBuilder {
	public static playerEmbed(
		queue: GuildQueue,
		track: Track,
		curProgress?: number
	) {
		const embed = EmbedGenerator.create()
			.setColor(COLORS.player)
			.setAuthor({
				name: track.author,
			})
			.setThumbnail(track.thumbnail)
			.setTitle(track.title)

		embed.setDescription(
			`${
				curProgress || curProgress === 0
					? formatDuration(curProgress)
					: queue.node.getTimestamp()?.current.label
			} | ${track.duration}`
		)

		// embed.setDescription(
		// 	queue.node.createProgressBar({
		// 		length: 10,
		// 		indicator: '<:1f9bd1:1227330208944881806>',
		// 	})
		// )

		if (track.requestedBy) {
			const member =
				queue.guild.members.cache.get(track.requestedBy.id) || track.requestedBy
			embed.setFooter({
				text: member.displayName,
				iconURL: member.displayAvatarURL(),
			})
		}

		return embed
	}

	public static create(data?: EmbedInit) {
		return new EmbedGenerator(data)
	}
}

import { SlashCommandBuilder } from 'discord.js'
import { useMetadata, useQueue } from 'discord-player'
import { command } from '../../utils/index.js'
import { EmbedGenerator } from '../../config/player/playerEmbed.js'
import { State } from '../../config/player/playerButtons.js'

const meta = new SlashCommandBuilder()
	.setName('pause')
	.setDescription('Приостановить воспроизведение трека')

export default command(meta, ({ interaction }) => {
	if (!interaction.inCachedGuild()) return

	const queue = useQueue(interaction.guildId)
	const [getMetadata, setMetadata] = useMetadata(interaction.guild.id)

	if (!queue?.currentTrack) {
		return interaction.reply({
			ephemeral: true,
			content: 'В данный момент ничего не играет',
		})
	}

	if (queue.channel?.id !== interaction.member.voice.channel?.id)
		return interaction.reply({
			ephemeral: true,
			content: 'Вы должны находиться в канале с ботом',
		})

	let content = 'Трек поставлен на паузу'
	if (queue.node.isPaused()) {
		content = 'Продолжаю воспроизведение трека'
	}
	const metadata: any = getMetadata()
	if (metadata.messageId) {
		const message = metadata.channel.messages.cache.get(metadata.messageId)
		if (queue.node.isPlaying()) {
			queue.node.setProgress(queue.node.getTimestamp()?.progress ?? 0)
			const embed = EmbedGenerator.playerEmbed(
				queue,
				queue.currentTrack,
			)
			message.edit({
				embeds: [embed],
				components: State.paused,
			})
		} else {
			message.edit({
				components: State.playing,
			})
		}
	}
	queue.node.setPaused(!queue.node.isPaused())
	return interaction.reply({
		ephemeral: true,
		content: content,
	})
})

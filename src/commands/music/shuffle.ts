import { SlashCommandBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { command } from '../../utils/index.js'

const meta = new SlashCommandBuilder()
	.setName('shuffle')
	.setDescription('Перемешать треки')

export default command(meta, ({ interaction }) => {
	if (!interaction.inCachedGuild()) return

	const queue = useQueue(interaction.guildId)

	if (!queue?.tracks) {
		return interaction.reply({
			ephemeral: true,
			content: 'Очередь пустая',
		})
	}

	if (queue.channel?.id !== interaction.member.voice.channel?.id)
		return interaction.reply({
			ephemeral: true,
			content: 'Вы должны находиться в канале с ботом',
		})

	if (queue.size === 0)
		return interaction.reply({
			ephemeral: true,
			content: 'В очереди только один трек',
		})

	queue.tracks.shuffle()
	queue.node.play()
	return interaction.reply({
		ephemeral: true,
		content: 'Треки буду воспроизводиться в рандомном порядке',
	})
})

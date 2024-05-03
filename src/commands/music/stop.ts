import { SlashCommandBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { command } from '../../utils/index.js'

const meta = new SlashCommandBuilder()
	.setName('stop')
	.setDescription('Остановить плеер и очистить очередь')

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

	queue.delete()
	return interaction.reply({
		ephemeral: true,
		content: 'Очередь очищена',
	})
})

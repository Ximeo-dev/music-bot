import { SlashCommandBuilder } from 'discord.js'
import { useHistory } from 'discord-player'
import { command } from '../../utils/index.js'

const meta = new SlashCommandBuilder()
	.setName('back')
	.setDescription('Вернуть предыдущий трек')

export default command(meta, async ({ interaction }) => {
	if (!interaction.inCachedGuild()) return

	const history = useHistory(interaction.guildId)

	if (!history)
		return interaction.reply({
			ephemeral: true,
			content: 'В данный момент ничего не играет',
		})

	if (history.queue.channel?.id !== interaction.member.voice.channel?.id)
		return interaction.reply({
			ephemeral: true,
			content: 'Вы должны находиться в канале с ботом',
		})

	if (history.isEmpty())
		return interaction.reply({
			ephemeral: true,
			content: 'Нет предыдущего трека',
		})

	await history.back()
	return interaction.reply({
		ephemeral: true,
		content: 'Включен предыдущий трек',
	})
})

import { SlashCommandBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { command } from '../../utils/index.js'

const meta = new SlashCommandBuilder()
	.setName('skip')
	.setDescription('Пропустить трек')

export default command(meta, ({ interaction }) => {
	if (!interaction.inCachedGuild()) return

	const queue = useQueue(interaction.guildId)

	if (!queue?.currentTrack)
		return interaction.reply({
			ephemeral: true,
			content: 'В данный момент ничего не играет',
		})

	if (queue.channel?.id !== interaction.member.voice.channel?.id)
		return interaction.reply({
			ephemeral: true,
			content: 'Вы должны находиться в канале с ботом',
		})

	queue.node.skip();
	return interaction.reply({
		ephemeral: true,
		content: 'Трек успешно пропущен',
	})
})

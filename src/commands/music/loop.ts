import { SlashCommandBuilder } from 'discord.js'
import { QueueRepeatMode, useQueue } from 'discord-player'
import { command } from '../../utils/index.js'
import { useDatabase } from '../../hooks/useDatabase.js'

const meta = new SlashCommandBuilder()
	.setName('loop')
	.setDescription('Выбрать режим повтора')
	.addNumberOption(option =>
		option.setName('mode').setDescription('Выберите режим').addChoices(
			{
				name: 'Автоматическое воспроизведение связанных песен существующей очереди',
				value: QueueRepeatMode.OFF,
			},
			{ name: 'Повторять текущий трек', value: QueueRepeatMode.TRACK },
			{ name: 'Повторять очередь', value: QueueRepeatMode.QUEUE },
			{ name: 'Отключить повторение', value: QueueRepeatMode.OFF }
		)
	)

export default command(meta, async ({ interaction }) => {
	if (!interaction.inCachedGuild()) return

	const queue = useQueue(interaction.guildId)
	const db = useDatabase()

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

	const mode =
		interaction.options.getInteger('mode', false) ?? queue.repeatMode === 0
			? 1
			: 0

	queue.setRepeatMode(mode)
	await db.guild.updateOne(
		{ id: interaction.guild.id },
		{ loopMode: mode },
		{ upsert: true }
	)
	return interaction.reply({
		ephemeral: true,
		content: `Текущий режим повторения: **${
			mode === 0
				? 'Выключен'
				: mode === 1
				? 'Повторять текущий трек'
				: mode === 2
				? 'Повторять очередь'
				: 'Автоматическое воспроизведение связанных песен существующей очереди'
		}**`,
	})
})

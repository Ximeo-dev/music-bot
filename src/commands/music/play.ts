import { SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils/index.js'
import { useMainPlayer, useQueue, serialize } from 'discord-player'
import { EMOJIS } from '../../config/player/constants.js'
import { useDatabase } from '../../hooks/useDatabase.js'
import { fetchPlayerOptions } from '../../config/player/playerOptions.js'

const meta = new SlashCommandBuilder()
	.setName('play')
	.setDescription('Включить трек')
	.addStringOption(option =>
		option
			.setName('search')
			.setDescription(
				'Ссылка или название трека/плейлиста/альбома. Не выбирайте трек, если хотите включить весь плейлист'
			)
			.setRequired(true)
			.setAutocomplete(true)
	)

export default command(meta, async ({ interaction, log }) => {
	if (!interaction.inCachedGuild()) return
	const query = interaction.options.getString('search', true)
	const player = useMainPlayer()
	const queue = useQueue(interaction.guild.id)
	const db = useDatabase()

	const channel = interaction.member?.voice?.channel

	if (!channel)
		return interaction.reply({
			ephemeral: true,
			content: 'Вы должны находиться в голосовом канале',
		})

	if (queue && queue.channel?.id !== channel.id)
		return interaction.reply({
			ephemeral: true,
			content: `Бот уже используется в канале ${queue.channel}`,
		})

	if (interaction.guild.members.me?.voice?.mute)
		interaction.guild.members.me?.voice.setMute(false)

	const result = await player
		.search(query, { requestedBy: interaction.member })
		.catch(() => null)

	if (!result?.hasTracks())
		return interaction.reply({
			ephemeral: true,
			content: `Не найдено треков по запросу: ${query}`,
		})

	await interaction.deferReply()

	try {
		const guildOptions = await fetchPlayerOptions(interaction.guild.id)
		const { track, searchResult, queue } = await player.play(channel, result, {
			nodeOptions: {
				metadata: {
					channel: interaction.channel,
					requestedBy: interaction.member.id,
				},
				volume: guildOptions.volume,
				repeatMode: guildOptions.loopMode,
				noEmitInsert: true,
				leaveOnStop: true,
				leaveOnStopCooldown: 60000 * 10,
				leaveOnEmpty: true,
				leaveOnEmptyCooldown: 60000,
				leaveOnEnd: true,
				leaveOnEndCooldown: 60000 * 3,
				preferBridgedMetadata: true,
				disableBiquad: true,
			},
			requestedBy: interaction.member,
			connectionOptions: {
				deaf: true,
			},
		})

		const tracks = [queue.currentTrack, ...queue.tracks.store].map(track =>
			serialize(track)
		)

		await db.guild.updateOne({ id: interaction.guild.id }, { queue: tracks })

		return interaction.editReply(
			searchResult.playlist
				? `${EMOJIS.playlist} Добавлен в очередь плейлист **${searchResult.playlist.title}**. Треков: **\`${searchResult.playlist.tracks.length}\`**`
				: `${EMOJIS.musical_note} Добавлен в очередь **${track.title}**`
		)
	} catch (e) {
		return log(e)
	}
})

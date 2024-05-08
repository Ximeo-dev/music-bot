import {
	Track,
	deserialize,
	useHistory,
	useMainPlayer,
	useQueue,
} from 'discord-player'
import { LogMethod } from '../../utils/index.js'
import { useDatabase } from '../../hooks/useDatabase.js'
import { fetchPlayerOptions } from '../../config/player/playerOptions.js'
import {
	ActionRowBuilder,
	ButtonComponent,
	ButtonInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js'
import { EmbedGenerator } from '../../config/player/playerEmbed.js'
import { PLAYER_BUTTONS } from '../../config/player/playerButtons.js'

export const playerButtons = async (
	log: LogMethod,
	interaction: ButtonInteraction<'cached'>
) => {
	try {
		if (interaction.customId === 'prev-track-btn') {
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

			if (!history.previousTrack) {
				if (!history.currentTrack) return interaction.deferUpdate()
				history.queue.node.seek(0)
				const embed = EmbedGenerator.playerEmbed(
					history.queue,
					history.currentTrack,
					0
				)
				const buttons = interaction.message.components
				buttons[0].components[2] =
					PLAYER_BUTTONS.pauseButton as unknown as ButtonComponent
				return interaction.update({ embeds: [embed], components: buttons })
			}
			history.previous()
			interaction.deferUpdate()
		} else if (interaction.customId === 'rewind-track-btn') {
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

			const buttons = interaction.message.components
			buttons[0].components[2] =
				PLAYER_BUTTONS.pauseButton as unknown as ButtonComponent
			const currentProgress = queue.node.getTimestamp()?.current.value ?? 0
			if (currentProgress <= 20 * 1000) {
				queue.node.seek(0)
				const embed = EmbedGenerator.playerEmbed(queue, queue.currentTrack, 0)
				return interaction.update({
					embeds: [embed],
					components: buttons,
				})
			}
			queue.node.seek(currentProgress - 20 * 1000)
			const embed = EmbedGenerator.playerEmbed(
				queue,
				queue.currentTrack,
				currentProgress - 20 * 1000
			)
			interaction.update({
				embeds: [embed],
				components: buttons,
			})
		} else if (
			interaction.customId === 'play-track-btn' ||
			interaction.customId === 'pause-track-btn'
		) {
			const queue = useQueue(interaction.guildId)

			if (!queue?.currentTrack) {
				const db = useDatabase()
				const guild = await db.guild.findOne({ id: interaction.guild.id })
				if (!guild?.queue)
					return interaction.reply({
						ephemeral: true,
						content: 'Очередь гильдии пуста',
					})
				if (!interaction.member.voice.channel)
					return interaction.reply({
						ephemeral: true,
						content: 'Вы должны находиться в голосовом канале',
					})
				const player = useMainPlayer()
				const tracks = guild?.queue
					.filter(track => track)
					.map(track => deserialize(player, track) as Track<unknown>)
				const playlist = player.createPlaylist({
					author: {
						name: '',
						url: '',
					},
					description: '',
					id: 'last_queue',
					source: 'arbitrary',
					thumbnail: '',
					title: 'Last Queue',
					tracks: tracks,
					type: 'playlist',
					url: '',
				})
				const guildOptions = await fetchPlayerOptions(interaction.guild.id)
				await player.play(interaction.member.voice.channel, playlist, {
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
				return interaction.deferUpdate()
			}

			if (queue.channel?.id !== interaction.member.voice.channel?.id)
				return interaction.reply({
					ephemeral: true,
					content: 'Вы должны находиться в канале с ботом',
				})

			const buttons = interaction.message.components
			const embed = EmbedGenerator.playerEmbed(queue, queue.currentTrack)
			if (!queue.node.isPaused()) {
				buttons[0].components[2] =
					PLAYER_BUTTONS.playButton as unknown as ButtonComponent
				queue.node.setPaused(true)
				return interaction.update({ embeds: [embed], components: buttons })
			}
			buttons[0].components[2] =
				PLAYER_BUTTONS.pauseButton as unknown as ButtonComponent
			queue.node.setPaused(false)
			interaction.update({ embeds: [embed], components: buttons })
		} else if (interaction.customId === 'forward-track-btn') {
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

			const currentTrackDuration = queue.currentTrack?.durationMS ?? 0
			const currentProgress = queue.node.getTimestamp()?.current.value ?? 0
			if (currentProgress >= currentTrackDuration - 30 * 1000) {
				queue.node.skip()
				queue.node.setPaused(false)
				return interaction.deferUpdate()
			}

			queue.node.seek(currentProgress + 30 * 1000)
			const buttons = interaction.message.components
			buttons[0].components[2] =
				PLAYER_BUTTONS.pauseButton as unknown as ButtonComponent
			const embed = EmbedGenerator.playerEmbed(
				queue,
				queue.currentTrack,
				currentProgress + 30 * 1000
			)
			interaction.update({
				embeds: [embed],
				components: buttons,
			})
		} else if (interaction.customId === 'next-track-btn') {
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

			queue.node.skip()
			queue.node.setPaused(false)
			interaction.deferUpdate()
		} else if (
			interaction.customId === 'shuffle-track-btn' ||
			interaction.customId === 'shuffle-active-track-btn'
		) {
			const queue = useQueue(interaction.guildId)
			const db = useDatabase()

			if (!queue?.tracks) {
				return interaction.reply({
					ephemeral: true,
					content: 'В очереди нет треков',
				})
			}

			if (queue.channel?.id !== interaction.member.voice.channel?.id)
				return interaction.reply({
					ephemeral: true,
					content: 'Вы должны находиться в канале с ботом',
				})

			const guild = await db.guild.findOne({ id: interaction.guild.id })
			const buttons = interaction.message.components
			if (!guild?.isShuffling) {
				await db.guild.updateOne(
					{ id: interaction.guild.id },
					{ isShuffling: true },
					{ upsert: true }
				)
				buttons[1].components[0] =
					PLAYER_BUTTONS.shuffleActiveButton as unknown as ButtonComponent
				queue.enableShuffle()
				return interaction.update({
					embeds: interaction.message.embeds,
					components: buttons,
				})
			}
			await db.guild.updateOne(
				{ id: interaction.guild.id },
				{ isShuffling: false },
				{ upsert: true }
			)
			buttons[1].components[0] =
				PLAYER_BUTTONS.shuffleInactiveButton as unknown as ButtonComponent
			queue.disableShuffle()
			interaction.update({
				embeds: interaction.message.embeds,
				components: buttons,
			})
		} else if (
			interaction.customId === 'loop-inactive-btn' ||
			interaction.customId === 'loop-track-btn' ||
			interaction.customId === 'loop-queue-btn'
		) {
			const queue = useQueue(interaction.guildId)
			const db = useDatabase()

			if (!queue?.currentTrack) {
				return interaction.reply({
					ephemeral: true,
					content: 'Сейчас ничего не играет',
				})
			}

			if (queue.channel?.id !== interaction.member.voice.channel?.id)
				return interaction.reply({
					ephemeral: true,
					content: 'Вы должны находиться в канале с ботом',
				})

			const guild = await db.guild.findOne({ id: interaction.guild.id })
			const buttons = interaction.message.components
			if (guild?.loopMode === 0) {
				await db.guild.updateOne(
					{ id: interaction.guild.id },
					{ loopMode: 2 },
					{ upsert: true }
				)
				buttons[1].components[1] =
					PLAYER_BUTTONS.loopQueueButton as unknown as ButtonComponent
				queue.setRepeatMode(2)
				interaction.update({
					embeds: interaction.message.embeds,
					components: buttons,
				})
			} else if (guild?.loopMode === 2) {
				await db.guild.updateOne(
					{ id: interaction.guild.id },
					{ loopMode: 1 },
					{ upsert: true }
				)
				buttons[1].components[1] =
					PLAYER_BUTTONS.loopTrackButton as unknown as ButtonComponent
				queue.setRepeatMode(1)
				interaction.update({
					embeds: interaction.message.embeds,
					components: buttons,
				})
			} else {
				await db.guild.updateOne(
					{ id: interaction.guild.id },
					{ loopMode: 0 },
					{ upsert: true }
				)
				buttons[1].components[1] =
					PLAYER_BUTTONS.loopInactiveButton as unknown as ButtonComponent
				queue.setRepeatMode(0)
				interaction.update({
					embeds: interaction.message.embeds,
					components: buttons,
				})
			}
		} else if (interaction.customId === 'volume-btn') {
			const queue = useQueue(interaction.guild.id)

			if (!queue?.currentTrack) {
				return interaction.reply({
					ephemeral: true,
					content: 'Сейчас ничего не играет',
				})
			}

			if (queue.channel?.id !== interaction.member.voice.channel?.id)
				return interaction.reply({
					ephemeral: true,
					content: 'Вы должны находиться в канале с ботом',
				})

			const modal = new ModalBuilder()
				.setCustomId('volume-modal')
				.setTitle('Настройка громкости')

			const volume = new TextInputBuilder()
				.setCustomId('volume-input')
				.setLabel('Громкость')
				.setStyle(TextInputStyle.Short)
				.setPlaceholder('Укажите громкость от 1 до 100')
				.setRequired(true)
				.setMinLength(1)
				.setMaxLength(3)

			const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
				volume
			)
			modal.addComponents(actionRow)

			await interaction.showModal(modal)
		}
	} catch (e) {
		log(e)
	}
}

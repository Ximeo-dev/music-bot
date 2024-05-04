import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { EMOJIS } from './constants.js'

const prevButton = new ButtonBuilder()
	.setCustomId('prev-track-btn')
	.setEmoji(EMOJIS.previous)
	.setStyle(ButtonStyle.Secondary)

const rewindButton = new ButtonBuilder()
	.setCustomId('rewind-track-btn')
	.setEmoji(EMOJIS.rewind)
	.setStyle(ButtonStyle.Secondary)

const pauseButton = new ButtonBuilder()
	.setCustomId('pause-track-btn')
	.setEmoji(EMOJIS.pause)
	.setStyle(ButtonStyle.Danger)

const playButton = new ButtonBuilder()
	.setCustomId('play-track-btn')
	.setEmoji(EMOJIS.play)
	.setStyle(ButtonStyle.Success)

const forwardButton = new ButtonBuilder()
	.setCustomId('forward-track-btn')
	.setEmoji(EMOJIS.fast_forward)
	.setStyle(ButtonStyle.Secondary)

const nextButton = new ButtonBuilder()
	.setCustomId('next-track-btn')
	.setEmoji(EMOJIS.next)
	.setStyle(ButtonStyle.Secondary)

const shuffleInactiveButton = new ButtonBuilder()
	.setCustomId('shuffle-track-btn')
	.setEmoji(EMOJIS.shuffle_inactive)
	.setStyle(ButtonStyle.Secondary)

const shuffleActiveButton = new ButtonBuilder()
	.setCustomId('shuffle-active-track-btn')
	.setEmoji(EMOJIS.shuffle_active)
	.setStyle(ButtonStyle.Secondary)

const loopInactiveButton = new ButtonBuilder()
	.setCustomId('loop-inactive-btn')
	.setEmoji(EMOJIS.loop_inactive)
	.setStyle(ButtonStyle.Secondary)

const loopTrackButton = new ButtonBuilder()
	.setCustomId('loop-track-btn')
	.setEmoji(EMOJIS.loop_track)
	.setStyle(ButtonStyle.Secondary)

const loopQueueButton = new ButtonBuilder()
	.setCustomId('loop-queue-btn')
	.setEmoji(EMOJIS.loop_queue)
	.setStyle(ButtonStyle.Secondary)

export const actionRowPlayerStart =
	new ActionRowBuilder<ButtonBuilder>().addComponents(
		prevButton,
		rewindButton,
		pauseButton,
		forwardButton,
		nextButton
	)

export const actionRowPlayerPaused =
	new ActionRowBuilder<ButtonBuilder>().addComponents(
		prevButton,
		rewindButton,
		playButton,
		forwardButton,
		nextButton
	)

const actionRowUtil =
	new ActionRowBuilder<ButtonBuilder>().addComponents(
		shuffleInactiveButton,
		loopInactiveButton
	)

const actionRowUtilShuffled =
	new ActionRowBuilder<ButtonBuilder>().addComponents(
		shuffleActiveButton,
		loopInactiveButton
	)

export const PLAYER_BUTTONS = {
	prevButton,
	rewindButton,
	pauseButton,
	playButton,
	forwardButton,
	nextButton,
	shuffleInactiveButton,
	shuffleActiveButton,
	loopInactiveButton,
	loopTrackButton,
	loopQueueButton,
}

export const State = {
	playing: [actionRowPlayerStart, actionRowUtil],
	paused: [actionRowPlayerPaused, actionRowUtil],
	playing_shuffled: [actionRowPlayerStart, actionRowUtilShuffled],
	paused_shuffled: [actionRowPlayerPaused, actionRowUtilShuffled],
}

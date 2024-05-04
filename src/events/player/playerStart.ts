import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonComponent,
	Message,
} from 'discord.js'
import { playerEvent } from '../../utils/events/playerEvents.js'
import { EmbedGenerator } from '../../config/player/playerEmbed.js'
import {
	PLAYER_BUTTONS,
	actionRowPlayerStart,
} from '../../config/player/playerButtons.js'
import { useDatabase } from '../../hooks/useDatabase.js'

export default playerEvent('playerStart', async ({ log }, queue, track) => {
	const embed = EmbedGenerator.playerEmbed(queue, track)
	const playerMessage = queue.metadata.playerMessage

	if (playerMessage) {
		const buttons = playerMessage.components
		buttons[0].components[2] =
			PLAYER_BUTTONS.pauseButton as unknown as ButtonComponent
		playerMessage.edit({
			embeds: [embed],
			components: playerMessage.components,
		})
		return
	}

	const db = useDatabase()
	const guild = await db.guild.findOne({ id: queue.guild.id })
	const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		guild?.isShuffling
			? PLAYER_BUTTONS.shuffleActiveButton
			: PLAYER_BUTTONS.shuffleInactiveButton,
		guild?.loopMode === 0
			? PLAYER_BUTTONS.loopInactiveButton
			: guild?.loopMode === 1
			? PLAYER_BUTTONS.loopTrackButton
			: PLAYER_BUTTONS.loopQueueButton,
	)

	const components = [actionRowPlayerStart, newRow]
	queue.metadata.channel
		.send({
			embeds: [embed],
			components: components,
		})
		.then(async (msg: Message) => {
			queue.setMetadata({ ...queue.metadata, playerMessage: msg })
		})
})

import { Message } from 'discord.js'
import { playerEvent } from '../../utils/events/playerEvents.js'
import { EmbedGenerator } from '../../config/player/playerEmbed.js'
import { State } from '../../config/player/playerButtons.js'

export default playerEvent('playerStart', ({ log }, queue, track) => {
	const embed = EmbedGenerator.playerEmbed(queue, track)

	const playerMessage = queue.metadata.playerMessage

	if (playerMessage) {
		playerMessage.edit({
			embeds: [embed],
			components: playerMessage.components,
		})
		log('message edited by event')
		return
	}

	// TODO: При первой инициализации плеера нужно подтягивать компоненты основываясь на бд
	// Потестить как работает ивент вместе с кнопками, которые его вызывают
	queue.metadata.channel
		.send({
			embeds: [embed],
			components: State.playing,
		})
		.then(async (msg: Message) => {
			queue.setMetadata({ ...queue.metadata, playerMessage: msg })
		})
})

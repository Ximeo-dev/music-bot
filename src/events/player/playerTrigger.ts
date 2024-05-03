import { Message } from 'discord.js'
import { State } from '../../config/player/playerButtons.js'
import { EmbedGenerator } from '../../config/player/playerEmbed.js'
import { playerEvent } from '../../utils/events/playerEvents.js'
import { useDatabase } from '../../hooks/useDatabase.js'

export default playerEvent(
	'playerTrigger',
	async ({ log }, queue, track, reason) => {
		const t1 = performance.now()
		const db = useDatabase()
		const guild = await db.guild.findOne({ id: queue.guild.id })
		const embed = EmbedGenerator.playerEmbed(queue, track)

		const component = queue.node.isPlaying()
			? guild?.isShuffling
				? State.playing_shuffled
				: State.playing
			: guild?.isShuffling
			? State.paused_shuffled
			: State.paused

		const playerMessage = queue.metadata.playerMessage

		if (playerMessage) {
			playerMessage.edit({ embeds: [embed], components: component })
			const t2 = performance.now()
			log(t2 - t1, 'ms')
			return
		}

		queue.metadata.channel
			.send({
				embeds: [embed],
				components: component,
			})
			.then(async (msg: Message) => {
				queue.setMetadata({ ...queue.metadata, playerMessage: msg })
			})
		const t2 = performance.now()
		log(t2 - t1, 'ms')
	}
)

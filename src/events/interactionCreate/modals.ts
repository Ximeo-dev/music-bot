import { useQueue } from 'discord-player'
import { useDatabase } from '../../hooks/useDatabase.js'
import { Events, event } from '../../utils/index.js'

export default event(Events.InteractionCreate, async ({ log }, interaction) => {
	if (!interaction.inCachedGuild()) return
	if (!interaction.isModalSubmit()) return

	try {
		if (interaction.customId === 'volume-modal') {
			let volume = parseInt(
				interaction.fields.getTextInputValue('volume-input')
			)

			if (!volume && volume !== 0) return interaction.deferUpdate()

			const queue = useQueue(interaction.guild.id)

			if (!queue?.currentTrack) return interaction.deferUpdate()

			const db = useDatabase()
			const guild = await db.guild.findOne({ id: interaction.guild.id })

			if (volume > 100) {
				volume = 100
			} else if (volume < 1) {
				volume = 1
			}

			queue.node.setVolume(volume)
			if (guild?.volume !== volume)
				await db.guild.updateOne(
					{ id: interaction.guild.id },
					{ volume },
					{ upsert: true }
				)
			return interaction.deferUpdate()
		}
	} catch (e) {
		log(e)
	}
})

import { useDatabase } from '../../hooks/useDatabase.js'
import { Events, event } from '../../utils/index.js'

export default event(Events.GuildCreate, async ({ log }, guild) => {
	const db = useDatabase()
	const data = await db.guild.findOne({ id: guild.id })

	if (!data) {
		await db.guild.create({ id: guild.id })
		log(`Guild ${guild.name} id: ${guild.id} successfully ADDED to database! Members: ${guild.memberCount}`)
	}
})

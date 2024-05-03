import { useDatabase } from '../../hooks/useDatabase.js'
import { Events, event } from '../../utils/index.js'

export default event(Events.GuildDelete, async ({ log }, guild) => {
	const db = useDatabase()
	const data = await db.guild.findOne({ id: guild.id })

	// Если в базе данных будут какие-либо важные записи (кастомные плейлисты и тд), возможно, нужно сохранять гильдию.
	if (data) {
		await db.guild.deleteOne({ id: guild.id })
		log(`Guild ${guild.name} id: ${guild.id} successfully REMOVED from database! Members: ${guild.memberCount}`)
	}
})

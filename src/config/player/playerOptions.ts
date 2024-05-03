import { useDatabase } from '../../hooks/useDatabase.js'

export const fetchPlayerOptions = async (guildId: string) => {
	const db = useDatabase()

	const guild = await db.guild.findOne({
		id: guildId,
	})

	if (!guild) {
		return await db.guild.create({
			id: guildId,
		})
	}

	return guild
}

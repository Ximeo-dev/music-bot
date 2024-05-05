import { useMainPlayer } from 'discord-player'
import { LogMethod } from '../../utils/index.js'
import { AutocompleteInteraction } from 'discord.js'

export const playAutocomplete = async (
	log: LogMethod,
	interaction: AutocompleteInteraction<'cached'>
) => {
	const query = interaction.options.getString('search', true)
	if (!query.length) return interaction.respond([])

	try {
		const player = useMainPlayer()

		// Добавить возможность поиска всех плейлистов юзера (https://music.yandex.ru/users/zavod3433/playlists/*)
		const data = await player.search(query, { requestedBy: interaction.user })

		if (!data.hasTracks()) return interaction.respond([])

		const results = []

		if (data.playlist && data.playlist.url.length < 100)
			results.push({
				name: `🎶 ${data.playlist.title.slice(0, 60)} | Треков: ${
					data.playlist.tracks.length
				}`,
				value: data.playlist.url,
			})

		results.push(
			...data.tracks
				.filter(track => track.url.length < 100)
				.slice(0, 11)
				.map(track => ({
					name: `🎵 ${track.duration} | ${track.title.slice(0, 80)}`,
					value: track.url,
				}))
		)

		return interaction.respond(results)
	} catch {
		return interaction.respond([]).catch(() => {})
	}
}

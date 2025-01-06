import { Playlist, Track, Util, useMainPlayer } from 'discord-player'
import { LogMethod, getEnvVar } from '../../utils/index.js'
import { AutocompleteInteraction } from 'discord.js'
import { YMApi } from 'ym-api-meowed'

interface RespondArray {
	name: string
	value: string
}

export const playAutocomplete = async (
	log: LogMethod,
	interaction: AutocompleteInteraction<'cached'>
) => {
	const query = interaction.options.getString('search', true)
	if (!query.length) return interaction.respond([])

	try {
		const player = useMainPlayer()

		// const regex =
		// 	/(^https:)\/\/music\.yandex\.[A-Za-z]+\/users\/[A-Za-z0-9.]+\/playlists/

		// if (regex.test(query)) {
		// 	const YM = new YMApi()
		// 	YM.init({
		// 		access_token: getEnvVar('YANDEX_ACCESS_TOKEN'),
		// 		uid: parseInt(getEnvVar('YANDEX_UID')),
		// 	})
		// 	const user = query.split('/')[4]
		// 	const kindArray = (await YM.getUserPlaylists(user)).map(
		// 		playlist => playlist.kind
		// 	)
		// 	const data = await YM.getPlaylists(kindArray, user)
		// 	const result: RespondArray[] = []
		// 	data.forEach(playlist => {
		// 		if (playlist.available) {
		// 			const newPlaylist = new Playlist(player, {
		// 				title: playlist.title,
		// 				thumbnail: `https://${playlist.ogImage.replace('%%', '600x600')}`,
		// 				description: `Created: ${playlist.created}`,
		// 				type: 'playlist',
		// 				source: 'arbitrary',
		// 				author: {
		// 					name: `${playlist.owner.name} (${playlist.owner.login})`,
		// 					url: `https://music.yandex.ru/users/${playlist.owner.login}`,
		// 				},
		// 				tracks: [],
		// 				id: playlist.playlistUuid,
		// 				url: `https://music.yandex.ru/users/${playlist.owner.login}/playlists/${playlist.kind}`,
		// 				rawPlaylist: data,
		// 			})
		// 			try {
		// 				log(playlist.tracks)
		// 				// .map(slot => {
		// 				// 	const track = slot.track
		// 				// 	return new Track(player, {
		// 				// 		title: track.title,
		// 				// 		raw: track,
		// 				// 		description: `Genre: ${
		// 				// 			track.albums[0].genre
		// 				// 		}, Release year: ${track.albums[0].year}, Explicit: ${
		// 				// 			track.contentWarning?.includes('explicit') ? 'Yes' : 'No'
		// 				// 		}`,
		// 				// 		author: track.artists
		// 				// 			.map((artist: any) => artist.name)
		// 				// 			.join(', '),
		// 				// 		url: `https://music.yandex.ru/album/${track.albums[0].id}/track/${track.id}`,
		// 				// 		source: 'arbitrary',
		// 				// 		thumbnail: `https://${track.coverUri.replace(
		// 				// 			'%%',
		// 				// 			'600x600'
		// 				// 		)}`,
		// 				// 		duration: Util.buildTimeCode(Util.parseMS(track.durationMs)),
		// 				// 		views: 0,
		// 				// 	})
		// 				// })
		// 			} catch (error) {
		// 				log(error)
		// 			}
		// 			// newPlaylist.tracks = tracks ?? []
		// 			// result.push({
		// 			// 	name: `🎶 ${newPlaylist.title.slice(0, 60)} | Треков: ${
		// 			// 		newPlaylist.tracks.length
		// 			// 	}`,
		// 			// 	value: newPlaylist.url,
		// 			// })
		// 		}
		// 	})
		// 	return interaction.respond(result)
		// }

		// Add the ability to search all playlists of the user (https://music.yandex.ru/users/zavod3433/playlists/*)
		const data = await player.search(query, { requestedBy: interaction.user })

		if (!data.hasTracks()) return interaction.respond([])

		const result: RespondArray[] = []

		if (data.playlist && data.playlist.url.length < 100)
			result.push({
				name: `🎶 ${data.playlist.title.slice(0, 60)} | Треков: ${
					data.playlist.tracks.length
				}`,
				value: data.playlist.url,
			})

		result.push(
			...data.tracks
				.filter(track => track.url.length < 100)
				.slice(0, 11)
				.map(track => ({
					name: `🎵 ${track.duration} | ${track.title.slice(
						0,
						60
					)} — ${track.author.slice(0, 30)}`,
					value: track.url,
				}))
		)

		return interaction.respond(result)
	} catch {
		return interaction.respond([]).catch(() => {})
	}
}

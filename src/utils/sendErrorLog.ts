import {
	Client,
	Colors,
	DiscordAPIError,
	EmbedBuilder,
	HTTPError,
	RequestBody,
	codeBlock,
} from 'discord.js'
import { getEnvVar } from './env.js'
import { logger } from './logger.js'

export type TypeError = DiscordAPIError | HTTPError | Error

export async function sendErrorLog(
	client: Client,
	error: TypeError,
	type: 'error' | 'warning'
) {
	try {
		if (error.message?.includes('Missing Access')) return
		if (error.message?.includes('Unknown Message')) return
		if (error.message?.includes('Unknown interaction')) return

		if (
			error.stack?.includes(
				"TypeError: Cannot read properties of undefined (reading 'messages')"
			)
		) {
			return logger.error('ERR_LOG', error)
		}

		const logChannelId = getEnvVar('LOG_CHANNEL_ID')
		if (!logChannelId)
			return logger.error('ERR_LOG', error?.stack || `${error}`)

		const channel =
			client.channels.cache.get(logChannelId) ||
			(await client.channels.fetch(logChannelId))

		if (!channel) {
			return logger.error('ERR_LOG', error?.stack || `${error}`)
		}

		const code = 'code' in error ? error.code : 'N/A'
		const httpStatus =
			'httpStatus' in error ? (error.httpStatus) : 'N/A'
		const requestData =
			'requestData' in error ? (error.requestData as RequestBody) : { json: {} }

		const name = error.name || 'N/A'
		let stack = error.stack || error
		let jsonString = ''

		try {
			jsonString = JSON.stringify(requestData.json, null, 2)
		} catch {
			jsonString = ''
		}

		if (jsonString?.length > 2048) {
			jsonString = jsonString ? `${jsonString?.slice(0, 2045)}...` : ''
		}

		if (typeof stack === 'string' && stack.length > 2048) {
			console.error(stack)
			stack =
				'An error occurred but was too long to send to Discord, check your console.'
		}

		const embed = new EmbedBuilder()
			.setTitle('An error occurred')
			.addFields(
				{ name: 'Name', value: name, inline: true },
				{
					name: 'Code',
					value: code.toString(),
					inline: true,
				},
				{
					name: 'httpStatus',
					value: httpStatus!.toString(),
					inline: true,
				},
				{
					name: 'Timestamp',
					value: logger.now,
					inline: true,
				},
				{
					name: 'Request data',
					value: codeBlock(jsonString.slice(0, 2045)),
					inline: false,
				}
			)
			.setDescription(codeBlock(`${stack}`))
			.setColor(type === 'error' ? Colors.Red : Colors.Orange)

		if (channel.isTextBased()) await channel.send({ embeds: [embed] })
	} catch (e) {
		console.error({ error })
		console.error(e)
	}
}

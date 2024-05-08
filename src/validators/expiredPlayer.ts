import { Message } from 'discord.js'

export default async function expiredPlayer(playerMessage: Message) {
	if (!playerMessage) return 'player-init'
	if (!playerMessage.editable) return true

	const messages = await playerMessage.channel.messages.fetch({
		after: playerMessage.id,
		limit: 10
	})

	if (messages.size >= 5) return true

	let attachmentsCount = 0
	messages.forEach(msg => {
		attachmentsCount += msg.attachments.size
	})

	if (attachmentsCount > 2) return true

	return false
}

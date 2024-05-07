import { Message } from 'discord.js'

export default async function expiredPlayer(playerMessage: Message){
	if (!playerMessage) return 'player-init'
	if (playerMessage.editable) {
		playerMessage.channel.messages
			.fetch({
				after: playerMessage.id,
				limit: 5,
			})
			.then(messages => {
				let attachments = 0
				messages.forEach(msg => {
					attachments += msg.attachments.size
				})
				if (attachments > 2) return true
				if (messages.size === 5) return true
			})
		return false
	}
	return true
}

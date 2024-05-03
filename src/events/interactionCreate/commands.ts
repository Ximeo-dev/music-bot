import commands from '../../commands/index.js'
import { Command, event, Events } from '../../utils/index.js'

const allCommands = commands.map(({ commands }) => commands).flat()
const allCommandsMap = new Map<string, Command>(
	allCommands.map(cmd => [cmd.meta.name, cmd])
)

export default event(
	Events.InteractionCreate,
	async ({ log, client }, interaction) => {
		if (!interaction.isChatInputCommand()) return

		try {
			const commandName = interaction.commandName
			const command = allCommandsMap.get(commandName)

			if (!command) throw new Error('Command not found...')

			await command.callback({
				client,
				interaction,
				log(...args) {
					log(`[${command.meta.name}]`, ...args)
				},
			})
		} catch (error) {
			log('[Command Error]', error)

			if (interaction.deferred)
				return interaction.editReply('Something went wrong')

			return interaction.reply('Something went wrong')
		}
	}
)

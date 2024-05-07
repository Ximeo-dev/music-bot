import { event, Events } from '../utils/index.js'
import { chatInputCommand } from './interactionCreate/chatInputCommand.js'
import { modals } from './interactionCreate/modals.js'
import { playAutocomplete } from './interactionCreate/playAutocomplete.js'
import { playerButtons } from './interactionCreate/playerButtons.js'

export default event(
	Events.InteractionCreate,
	async ({ log, client }, interaction) => {
		if (!interaction.inCachedGuild()) return

		if (interaction.isChatInputCommand())
			chatInputCommand({ log, client }, interaction)
		else if (interaction.isButton()) playerButtons(log, interaction)
		else if (interaction.isModalSubmit()) modals(log, interaction)
		else if (interaction.isAutocomplete() && interaction.commandName === 'play')
			playAutocomplete(log, interaction)
	}
)

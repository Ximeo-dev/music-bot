import { event, Events } from '../utils/index.js'
import { chatInputCommand } from './interactionCreate/chatInputCommand.js'
import { modalsInteraction } from './interactionCreate/modals.js'
import { playAutocomplete } from './interactionCreate/playAutocomplete.js'
import { playerButtonsInteraction } from './interactionCreate/playerButtons.js'

export default event(
	Events.InteractionCreate,
	async ({ log, client }, interaction) => {
		if (!interaction.inCachedGuild()) return

		if (interaction.isChatInputCommand())
			chatInputCommand({ log, client }, interaction)
		else if (interaction.isButton()) playerButtonsInteraction(log, interaction)
		else if (interaction.isModalSubmit()) modalsInteraction(log, interaction)
		else if (interaction.isAutocomplete() && interaction.commandName === 'play')
			playAutocomplete(log, interaction)
	}
)

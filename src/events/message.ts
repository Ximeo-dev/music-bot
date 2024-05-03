import { Message } from 'discord.js';
import { event, Events } from '../utils/index.js'

export default event(Events.MessageCreate, async ({ log }, message) => {
});
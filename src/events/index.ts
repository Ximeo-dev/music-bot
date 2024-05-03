import { Event } from '../utils/index.js'
import ready from './ready.js'
import message from './message.js';
import interactionCreate from './interactionCreate/index.js';
import guild from './guild/index.js'

export default [
    ready,
    message,
    ...interactionCreate,
    ...guild
] as Event[];
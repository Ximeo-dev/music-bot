import { Event } from '../../utils/index.js'
import commands from './commands.js';
import modals from './modals.js'
import play from './play.js'
import playerButtons from './playerButtons.js'

export default [
    commands,
    play,
    playerButtons,
    modals
] as Event[];
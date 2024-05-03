import { category } from "../../utils/index.js";
import back from './back.js'
import loop from './loop.js'
import pause from './pause.js'
import play from './play.js'
import shuffle from './shuffle.js'
import skip from './skip.js'
import stop from './stop.js';

export default category('Music', [
    play,
    pause,
    skip,
    back,
    stop,
    shuffle,
    loop
], { description: 'Музыкальные команды', emoji: '🎵' })
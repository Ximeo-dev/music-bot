import { category } from "../../utils/index.js"; 
import ping from "./ping.js";

export default category('Debug', [
    ping,
], { description: 'Системные команды', emoji: '🧰' })
import { Event } from '../../utils/index.js'
import guildCreate from './guildCreate.js'
import guildDelete from './guildDelete.js'

export default [guildCreate, guildDelete] as Event[]

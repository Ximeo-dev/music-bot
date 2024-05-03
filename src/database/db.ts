import mongoose from 'mongoose'
import { HooksRegistry, Symbols } from '../hooks/registry.js'
import { GuildModel } from './schemas/Guild.schema.js'
import { getEnvVar } from '../utils/env.js'

const db = await mongoose.connect(getEnvVar('MONGO_URL'))

console.log('Connected to the database')

export class MongoDatabase {
	public guild = GuildModel

	public constructor(public mongo: typeof db) {}
}

HooksRegistry.set(Symbols.Database, new MongoDatabase(db))

export { db }

import { SerializedTrack } from 'discord-player'
import { Schema, SchemaTypes, model } from 'mongoose'

export interface IGuildSchema {
	id: string
	volume: number
	loopMode: 0 | 1 | 2 | 3
	queue: SerializedTrack[]
	createdAt: Date
	updatedAt: Date
	isShuffling: boolean
}

export const GuildSchema = new Schema<IGuildSchema>(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		volume: {
			type: Number,
			default: 100,
			min: 1,
			max: 100,
		},
		loopMode: {
			type: Number,
			default: 0,
			min: 0,
			max: 2,
		},
		queue: {
			type: [SchemaTypes.Mixed as any],
			default: [],
		},
		isShuffling: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
)

export const GuildModel = model<IGuildSchema>('Guild', GuildSchema)

import { GuildQueueEvents, Player } from 'discord-player'
import { Awaitable } from 'discord.js'

export interface EventProps {
	log: (...args: unknown[]) => void
}

export type EventCallback<T extends keyof GuildQueueEvents> = (
	props: EventProps,
	...args: Parameters<GuildQueueEvents[T]>
) => Awaitable<unknown>

export interface IPlayerEvent<
	T extends keyof GuildQueueEvents = keyof GuildQueueEvents
> {
	key: T
	callback: EventCallback<T>
}

export function playerEvent<T extends keyof GuildQueueEvents>(
	key: T,
	callback: EventCallback<T>
): IPlayerEvent<T> {
	return { key, callback }
}

export function registerPlayerEvents(player: Player, events: IPlayerEvent[]): void {
	for (const { key, callback } of events) {
		player.events.on(key, (...args: any) => {
			const log = console.log.bind(console, `[Event: ${key}]`)

			try {
				callback({log}, ...args)
			} catch (error) {
				log('[Непойманная ошибка]', error)
			}
		})
	}
}

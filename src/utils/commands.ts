import { Awaitable, Client, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

type LogMethod = (...args: unknown[]) => void;

export interface CommandProps {
    interaction: ChatInputCommandInteraction,
    client: Client,
    log: LogMethod,
}

export type CommandCallback = (
    props: CommandProps
) => Awaitable<unknown>;

export type CommandMeta = SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>

export interface Command {
    meta: CommandMeta,
    callback: CommandCallback
}

export interface CommandCategoryExtra {
    description?: string,
    emoji?: string
}

export interface CommandCategory extends CommandCategoryExtra {
    name: string,
    commands: Command[]
}

export function command(meta: CommandMeta, callback: CommandCallback): Command {
    return {
        meta,
        callback
    }
}

export function category(name: string, commands: Command[], extra: CommandCategoryExtra = {}): CommandCategory {
    return {
        name,
        commands,
        ...extra,
    }
}
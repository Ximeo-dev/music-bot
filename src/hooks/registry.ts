export const HooksRegistry = new Map<symbol, unknown>();

export const Symbols = {
  Redis: Symbol('Redis'),
  Database: Symbol('Database'),
} as const;
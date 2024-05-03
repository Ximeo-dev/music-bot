import { HooksRegistry, Symbols } from './registry.js';
import { MongoDatabase } from '../database/db.js';

export function useDatabase() {
  const mongoose = HooksRegistry.get(Symbols.Database) as
    | MongoDatabase
    | undefined;

  if (!mongoose) {
    throw new Error('Mongoose has not been initialized');
  }

  return mongoose;
}
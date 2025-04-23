import * as SQLite from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { storeItems } from './schema'

export const sqliteDB = SQLite.openDatabaseSync('db.db')

const db = drizzle(sqliteDB, { schema: { storeItems } })

export default db

import * as SQLite from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { storeItems, contacts, scenarios } from './schema'

export const sqliteDB = SQLite.openDatabaseSync('db.db')

const db = drizzle(sqliteDB, { schema: { storeItems, contacts, scenarios } })

export default db

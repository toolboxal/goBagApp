import * as SQLite from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'

export const sqliteDB = SQLite.openDatabaseSync('db.db')

const db = drizzle(sqliteDB)

export default db

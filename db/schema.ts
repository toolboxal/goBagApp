import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const storeItems = sqliteTable('store_items', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  quantity: int().notNull(),
  dateExpiry: text('date_expiry').notNull(),
  category: text('category', {
    enum: ['food', 'medicine', 'supplies', 'clothing'],
  }).default('food'),
  notes: text('notes'),
  photoUrl: text('photo_url'),
})

export const storeItemsInsertSchema = createInsertSchema(storeItems, {
  name: (schema) =>
    schema
      .min(1, { message: 'name cannot be blank' })
      .max(25, { message: 'exceeds max length' }),
  quantity: (schema) => schema.min(1, { message: 'cannot be less than 1' }),
})

export type StoreItemFormData = Omit<
  z.infer<typeof storeItemsInsertSchema>,
  'category' | 'photoUrl'
>

import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const storeItems = sqliteTable('store_items', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  quantity: int().notNull(),
  dateExpiry: text('date_expiry'),
  category: text('category', {
    enum: ['food', 'medicine', 'supplies', 'clothing'],
  })
    .notNull()
    .default('food'),
  notes: text('notes'),
  photoUrl: text('photo_url'),
})

export const storeItemsInsertSchema = createInsertSchema(storeItems, {
  name: (schema) =>
    schema
      .min(1, { message: 'name cannot be blank' })
      .max(25, { message: 'exceeds max length' }),
  quantity: (schema) => schema.min(1, { message: 'cannot be less than 1' }),
  notes: (schema) => schema.max(100, { message: 'exceeded 100 characters' }),
})

export type StoreItemFormData = Omit<
  z.infer<typeof storeItemsInsertSchema>,
  'category' | 'photoUrl' | 'dateExpiry'
>

export const storeItemsSelectSchema = createSelectSchema(storeItems)

export type StoreItemSelect = z.infer<typeof storeItemsSelectSchema>

export const contacts = sqliteTable('contacts', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  phoneNumber: text(),
  remarks: text(),
  priority: text('priority', {
    enum: ['normal', 'high', 'critical'],
  })
    .notNull()
    .default('normal'),
  accounted: int('accounted', { mode: 'boolean' }).notNull().default(false),
})

export const contactsInsertSchema = createInsertSchema(contacts, {
  name: (schema) =>
    schema
      .min(1, { message: 'name cannot be blank' })
      .max(25, { message: 'exceeds max length' }),
  remarks: (schema) => schema.max(120, { message: 'exceeds max length' }),
})

export type ContactFormData = Omit<
  z.infer<typeof contactsInsertSchema>,
  'role' | 'accounted' | 'priority' | 'phoneNumber'
>

export const contactsSelectSchema = createSelectSchema(contacts)

export type contactsSelect = z.infer<typeof contactsSelectSchema>

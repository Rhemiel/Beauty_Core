import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const generatedImages = pgTable('generated_images', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  style: text('style'),
  color: text('color'),
  design: text('design'),
  prompt: text('prompt'),
  createdAt: timestamp('created_at').defaultNow(),
});

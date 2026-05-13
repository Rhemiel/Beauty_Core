import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const generatedImages = pgTable('generated_images', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  style: text('style'),
  color: text('color'),
  design: text('design'),
  theme: text('theme'),
  event: text('event'),
  prompt: text('prompt'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  role: text('role').notNull(), // 'admin', 'client', 'stylist'
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  points: integer('points').default(0), // Loyalty points
  totalSpent: text('total_spent').default('0'), // e.g. '₱4200'
  createdAt: timestamp('created_at').defaultNow(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g. 'Nail Studio'
  category: text('category').notNull(), // e.g. 'Nails', 'Hair'
  price: integer('price').notNull(), // Integer price
  duration: text('duration'), // e.g. '60 mins'
});

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => users.id),
  stylistId: integer('stylist_id').references(() => users.id),
  serviceId: integer('service_id').references(() => services.id),
  date: text('date').notNull(), // e.g. 'Apr 10, 2026'
  time: text('time').notNull(), // e.g. '10:00 AM'
  status: text('status').notNull(), // 'Confirmed', 'Pending', 'Completed', 'Cancelled'
  amount: text('amount'), // e.g. '₱350'
  rating: integer('rating'), // 1-5
  createdAt: timestamp('created_at').defaultNow(),
});

export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g. 'OPI Gel Polish'
  category: text('category').notNull(),
  stock: text('stock').notNull(), // e.g. '3 pcs'
  minLevel: text('min_level').notNull(), // e.g. '10 pcs'
});

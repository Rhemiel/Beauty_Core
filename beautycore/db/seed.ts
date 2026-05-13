import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding minimal database...');
  
  // Create 1 Client and 1 Stylist
  const [client] = await db.insert(schema.users).values([
    { role: 'client', name: 'Maria Santos', email: 'maria@example.com', points: 280, totalSpent: '₱4200' },
  ]).returning();
  
  const [stylist] = await db.insert(schema.users).values([
    { role: 'stylist', name: 'Andrea Lim', email: 'andrea@beautycore.com' },
  ]).returning();

  // Create 2 Services
  const [nailService] = await db.insert(schema.services).values([
    { name: 'Nail Studio', category: 'Nails', price: 350, duration: '60 min' },
  ]).returning();

  const [hairService] = await db.insert(schema.services).values([
    { name: 'Hair Design', category: 'Hair', price: 850, duration: '90 min' },
  ]).returning();

  // Create 2 Appointments
  await db.insert(schema.appointments).values([
    { clientId: client.id, stylistId: stylist.id, serviceId: nailService.id, date: 'May 10, 2026', time: '10:00 AM', status: 'Confirmed', amount: '₱350', rating: 5 },
    { clientId: client.id, stylistId: stylist.id, serviceId: hairService.id, date: 'May 15, 2026', time: '2:00 PM', status: 'Pending', amount: '₱850', rating: null },
  ]);

  // Create 2 Inventory items
  await db.insert(schema.inventory).values([
    { name: 'OPI Gel Polish – Nude', category: 'Nail', stock: '3 pcs', minLevel: '10 pcs' },
    { name: 'Keratin Treatment 500ml', category: 'Hair', stock: '1 btl', minLevel: '5 btl' },
  ]);

  console.log('Seed completed!');
}

seed().catch(console.error);

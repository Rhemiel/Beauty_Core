import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { appointments, services, users } from '../../../../db/schema';
import { eq, and, ne } from 'drizzle-orm';

export async function GET() {
  try {
    const clientId = 1; // Simulated logged-in user (Maria Santos)

    const appts = await db
      .select({
        service: services.name,
        date: appointments.date,
        time: appointments.time,
        status: appointments.status,
        amount: appointments.amount,
        staff: users.name,
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .innerJoin(users, eq(appointments.stylistId, users.id))
      .where(eq(appointments.clientId, clientId));

    const upcoming = appts.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
    const history = appts.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

    // Get user stats
    const [clientStats] = await db.select({ points: users.points, totalSpent: users.totalSpent })
      .from(users).where(eq(users.id, clientId));

    return NextResponse.json({ upcoming, history, stats: clientStats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

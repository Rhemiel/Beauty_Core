import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { appointments, services, users } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const stylistId = 2; // Simulated logged-in user (Andrea Lim)

    const appts = await db
      .select({
        client: users.name,
        service: services.name,
        date: appointments.date,
        time: appointments.time,
        status: appointments.status,
        amount: appointments.amount,
        rating: appointments.rating,
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .innerJoin(users, eq(appointments.clientId, users.id))
      .where(eq(appointments.stylistId, stylistId));

    // Today's schedule (for now, we'll just show pending/confirmed)
    const todaySchedule = appts.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
    // Recent services (completed)
    const recentServices = appts.filter(a => a.status === 'Completed');

    // Calculate avg rating
    const ratings = recentServices.map(r => r.rating).filter(r => r !== null);
    const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '5.0';

    return NextResponse.json({ todaySchedule, recentServices, avgRating });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { appointments, inventory, services, users } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allAppts = await db
      .select({
        client: users.name,
        service: services.name,
        time: appointments.time,
        status: appointments.status,
        amount: appointments.amount,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.clientId, users.id))
      .innerJoin(services, eq(appointments.serviceId, services.id));

    // Aggregate real revenue
    const revenueMap: Record<string, number> = {};
    let maxRev = 0;
    allAppts.forEach(a => {
      if (a.status === 'Completed' || a.status === 'Confirmed') {
        const val = parseInt(a.amount?.replace(/[^0-9]/g, '') || '0', 10);
        revenueMap[a.service] = (revenueMap[a.service] || 0) + val;
      }
    });

    const revenue = Object.keys(revenueMap).map(name => {
      maxRev = Math.max(maxRev, revenueMap[name]);
      return { name, val: revenueMap[name] };
    }).map(r => ({
      name: r.name,
      amount: `₱${r.val.toLocaleString()}`,
      pct: maxRev > 0 ? Math.round((r.val / maxRev) * 100) : 0
    })).sort((a,b) => b.pct - a.pct);

    const appts = allAppts.map(({ client, service, time, status }) => ({ client, service, time, status }));

    const lowStock = await db
      .select({
        name: inventory.name,
        cat: inventory.category,
        stock: inventory.stock,
        min: inventory.minLevel,
      })
      .from(inventory);

    return NextResponse.json({ appointments: appts, lowStock, revenue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

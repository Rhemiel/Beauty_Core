'use server'

import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'
import { MOCK_SERVICES, MOCK_APPOINTMENTS } from '../lib/mockData'

// ── PERSISTENT FILE STORAGE (Legacy / Mock) ──────────────────────────────────
const DB_PATH = path.join(process.cwd(), 'bookings.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) return MOCK_APPOINTMENTS;
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.length > 0 ? parsed : MOCK_APPOINTMENTS;
  } catch (e) {
    return MOCK_APPOINTMENTS;
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ── CLINIC INFO ───────────────────────────────────────────────────────────────
const CLINIC_INFO_PATH = path.join(process.cwd(), 'clinic-info.json');

const DEFAULT_CLINIC_INFO = {
  address: 'Governor Panotes Avenue, Front of Daet Elementary School, Daet, Camarines Norte 4600',
  hours_weekday: 'Monday – Saturday: 9:00 AM – 8:00 PM',
  hours_weekend: 'Sunday: Closed',
  phone: '+63 954 123 4567',
  email: 'andreasaestheticwellness@gmail.com',
  map_embed_url: 'https://maps.google.com/maps?q=Daet%20Elementary%20School&t=&z=17&ie=UTF8&iwloc=&output=embed',
  updated_at: new Date().toISOString(),
};

function readClinicInfo() {
  if (!fs.existsSync(CLINIC_INFO_PATH)) return DEFAULT_CLINIC_INFO;
  try { return JSON.parse(fs.readFileSync(CLINIC_INFO_PATH, 'utf8')); }
  catch (e) { return DEFAULT_CLINIC_INFO; }
}

export async function getClinicInfo() {
  return readClinicInfo();
}

export async function updateClinicInfo(data) {
  const updated = { ...readClinicInfo(), ...data, updated_at: new Date().toISOString() };
  fs.writeFileSync(CLINIC_INFO_PATH, JSON.stringify(updated, null, 2));
  revalidatePath('/');
  return { success: true };
}

// ── 1. SERVICE CATALOG BACKBONE ──────────────────────────────────────────────

export async function getServices() {
  return { success: true, data: MOCK_SERVICES };
}

// ── 2. AUTHENTICATION BACKBONE ──────────────────────────────────────────────

const USERS_PATH = path.join(process.cwd(), 'users.json');

function readUsers() {
  if (!fs.existsSync(USERS_PATH)) {
    return [
      { id: 1, name: 'Andrea', email: 'admin@andreas.com', password: 'admin123', role: 'admin' },
      { id: 2, name: 'Maria Santos', email: 'maria@email.com', password: 'client123', role: 'client' },
    ];
  }
  try {
    return JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
  } catch (e) {
    return [];
  }
}

export async function loginUser(formData) {
  const email = formData.get('email')
  const password = formData.get('password')
  const role = formData.get('role')

  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password && u.role === role);

  if (user) {
    if (user.role === 'stylist' && user.status === 'pending') {
      return { success: false, error: 'Your account is pending admin approval.' }
    }
    return { success: true, user: { ...user, password: undefined } }
  }

  if (email === 'admin@gmail.com' && password === 'admin' && role === 'admin') {
    return { success: true, user: { id: 0, name: 'Main Admin', role: 'admin', status: 'active' } }
  }
  if (email === 'stylist@gmail.com' && password === 'stylist' && role === 'stylist') {
    return { success: true, user: { id: 1, name: 'Lead Stylist', role: 'stylist', status: 'active' } }
  }
  if (email === 'client@gmail.com' && password === 'client' && role === 'client') {
    return { success: true, user: { id: 2, name: 'Sample Client', role: 'client', status: 'active' } }
  }

  return { success: false, error: 'Invalid credentials or role.' }
}

export async function registerUser(formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const password = formData.get('password')
  const role = formData.get('role') || 'client'

  const users = readUsers();

  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already exists.' };
  }

  const status = role === 'stylist' ? 'pending' : 'active';
  const newUser = { id: Date.now(), name, email, phone, password, role, status };

  users.push(newUser);
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));

  revalidatePath('/admin/dashboard');
  return { success: true, user: { ...newUser, password: undefined } };
}

export async function getPendingStylists() {
  const users = readUsers();
  const stylists = users.filter(u => u.role === 'stylist');
  return { success: true, data: JSON.parse(JSON.stringify(stylists)) };
}

export async function getAllUsers() {
  const users = readUsers();
  return { success: true, data: JSON.parse(JSON.stringify(users)) };
}

export async function approveUser(id) {
  const users = readUsers();
  const idx = users.findIndex(u => u.id.toString() === id.toString());
  if (idx !== -1) {
    users[idx].status = 'active';
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
    revalidatePath('/admin/dashboard');
    return { success: true };
  }
  return { success: false, error: 'User not found' };
}

export async function rejectUser(id) {
  const users = readUsers();
  const idx = users.findIndex(u => u.id.toString() === id.toString());
  if (idx !== -1) {
    users[idx].status = 'rejected';
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
    revalidatePath('/admin/dashboard');
    return { success: true };
  }
  return { success: false, error: 'User not found' };
}

// ── 3. APPOINTMENT BACKBONE ──────────────────────────────────────────────

export async function createAppointment(formData) {
  const guestName = formData.get('guestName')
  const guestPhone = formData.get('guestPhone')
  const serviceName = formData.get('serviceName')
  const date = formData.get('date')
  const time = formData.get('time')

  const bookings = readDB();
  const newId = Date.now();

  const newApp = {
    id: newId,
    client: guestName,
    phone: guestPhone,
    service: serviceName,
    date,
    time,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newApp);
  writeDB(bookings);

  revalidatePath('/admin/appointments');
  return { success: true, id: newId };
}

export async function getAllAppointments() {
  const data = readDB();
  return { success: true, data };
}

export async function updateAppointmentStatus(id, status) {
  const bookings = readDB();
  const idx = bookings.findIndex(a => a.id.toString() === id.toString());
  if (idx !== -1) {
    bookings[idx].status = status;
    writeDB(bookings);
    revalidatePath('/admin/appointments');
    return { success: true };
  }
  return { success: false, error: 'Appointment not found' };
}

// ── 4. INQUIRIES BACKBONE ──────────────────────────────────────────────

const INQ_PATH = path.join(process.cwd(), 'inquiries.json');

function readInquiries() {
  if (!fs.existsSync(INQ_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(INQ_PATH, 'utf8'));
  } catch (e) {
    return [];
  }
}

export async function submitInquiry(formData) {
  const inquiries = readInquiries();
  const newInq = {
    id: Date.now().toString(),
    firstName: formData.get('first'),
    lastName: formData.get('last'),
    email: formData.get('email'),
    message: formData.get('message'),
    status: 'pending',
    date: new Date().toISOString()
  };
  inquiries.unshift(newInq);
  fs.writeFileSync(INQ_PATH, JSON.stringify(inquiries, null, 2));
  return { success: true };
}

export async function getAllInquiries() {
  const data = readInquiries();
  return { success: true, data };
}

export async function getInquiries() {
  const data = readInquiries();
  return { success: true, data: JSON.parse(JSON.stringify(data)) };
}

export async function markInquiryReplied(id) {
  const data = readInquiries();
  const idx = data.findIndex(i => i.id.toString() === id.toString());
  if (idx !== -1) {
    data[idx].status = 'replied';
    fs.writeFileSync(INQ_PATH, JSON.stringify(data, null, 2));
    revalidatePath('/admin/dashboard');
    return { success: true };
  }
  return { success: false };
}

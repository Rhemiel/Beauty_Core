import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Public
import Home from './screens/Home'
import About from './screens/About'
import Services from './screens/Services'
import Contact from './screens/Contact'
import Login from './screens/Login'
import Register from './screens/Register'
import Booking from './screens/Booking'

// Admin
import AdminDashboard from './screens/admin/Dashboard'
import AdminAppointments from './screens/admin/Appointments'
import AdminClients from './screens/admin/Clients'
import AdminInventory from './screens/admin/Inventory'
import AdminFinance from './screens/admin/Finance'
import AdminMarketTrends from './screens/admin/MarketTrends'
import AdminSecurity from './screens/admin/Security'

// Client
import ClientDashboard from './screens/client/Dashboard'
import ClientAppointments from './screens/client/Appointments'
import ClientProfile from './screens/client/Profile'
import NailStudio from './screens/client/NailStudio'
import HairStudio from './screens/client/HairStudio'
import AIAdvisor from './screens/client/AIAdvisor'

// Stylist
import StylistDashboard from './screens/stylist/Dashboard'
import StylistAppointments from './screens/stylist/Appointments'
import StylistClients from './screens/stylist/Clients'
import StylistServices from './screens/stylist/Services'
import StylistNailStudio from './screens/stylist/NailStudio'
import StylistHairStudio from './screens/stylist/HairStudio'
import StylistProfile from './screens/stylist/Profile'

function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/booking" element={<Booking />} />

      {/* Admin - protected */}
      <Route path="/admin/dashboard"    element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/appointments" element={<ProtectedRoute role="admin"><AdminAppointments /></ProtectedRoute>} />
      <Route path="/admin/clients"      element={<ProtectedRoute role="admin"><AdminClients /></ProtectedRoute>} />
      <Route path="/admin/inventory"    element={<ProtectedRoute role="admin"><AdminInventory /></ProtectedRoute>} />
      <Route path="/admin/finance"      element={<ProtectedRoute role="admin"><AdminFinance /></ProtectedRoute>} />
      <Route path="/admin/market-trends" element={<ProtectedRoute role="admin"><AdminMarketTrends /></ProtectedRoute>} />
      <Route path="/admin/security"     element={<ProtectedRoute role="admin"><AdminSecurity /></ProtectedRoute>} />

      {/* Client - protected */}
      <Route path="/client/dashboard"   element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />
      <Route path="/client/appointments" element={<ProtectedRoute role="client"><ClientAppointments /></ProtectedRoute>} />
      <Route path="/client/profile"     element={<ProtectedRoute role="client"><ClientProfile /></ProtectedRoute>} />
      <Route path="/client/nail-studio" element={<ProtectedRoute role="client"><NailStudio /></ProtectedRoute>} />
      <Route path="/client/hair-studio" element={<ProtectedRoute role="client"><HairStudio /></ProtectedRoute>} />
      <Route path="/client/ai-advisor"  element={<ProtectedRoute role="client"><AIAdvisor /></ProtectedRoute>} />

      {/* Stylist - protected */}
      <Route path="/stylist/dashboard"    element={<ProtectedRoute role="stylist"><StylistDashboard /></ProtectedRoute>} />
      <Route path="/stylist/appointments" element={<ProtectedRoute role="stylist"><StylistAppointments /></ProtectedRoute>} />
      <Route path="/stylist/clients"      element={<ProtectedRoute role="stylist"><StylistClients /></ProtectedRoute>} />
      <Route path="/stylist/services"     element={<ProtectedRoute role="stylist"><StylistServices /></ProtectedRoute>} />
      <Route path="/stylist/nail-studio"  element={<ProtectedRoute role="stylist"><StylistNailStudio /></ProtectedRoute>} />
      <Route path="/stylist/hair-studio"  element={<ProtectedRoute role="stylist"><StylistHairStudio /></ProtectedRoute>} />
      <Route path="/stylist/profile"      element={<ProtectedRoute role="stylist"><StylistProfile /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

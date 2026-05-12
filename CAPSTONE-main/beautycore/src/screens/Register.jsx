import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../app/actions'

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState('client')
  const [form, setForm] = useState({ first: '', last: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Strict Password Matching Check
    if (form.password.trim() === "" || form.confirm.trim() === "") {
      return setError('Please fill in all password fields.')
    }
    
    if (form.password !== form.confirm) {
      // Direct feedback for user
      return setError('ERROR: Passwords do not match. Please verify and try again.')
    }
    
    setLoading(true)
    setError('')
    
    const formData = new FormData()
    formData.append('name', `${form.first.trim()} ${form.last.trim()}`)
    formData.append('email', form.email.trim())
    formData.append('phone', form.phone.trim())
    formData.append('password', form.password)
    formData.append('role', role)

    const res = await registerUser(formData)
    if (res.success) {
      navigate('/login')
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  const inputCls = "w-full bg-[#b040d8]/8 border border-[#b040d8]/25 text-white font-sans text-xs px-3.5 py-3 outline-none transition-colors focus:border-[#f0a800] placeholder:text-white/25"
  const labelCls = "block font-sans text-[10px] font-semibold tracking-[1.5px] uppercase text-[#c8a8e0] mb-[7px]"

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8" style={{ background: 'linear-gradient(135deg,#1a0a2e 0%,#2d1054 60%,#1a0a2e 100%)' }}>
      <div className="w-full max-w-[460px] flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <span className="font-serif text-[18px] font-semibold tracking-[3px] text-white">ANDREA'S</span>
          <span className="font-sans text-[8px] tracking-[2px] text-[#f0a800] uppercase">AESTHETIC &amp; WELLNESS CLINIC</span>
        </div>

        <div className="w-full bg-white/[0.04] border border-[#b040d8]/25 px-9 py-10 backdrop-blur-md">
          <h2 className="font-serif text-[28px] font-normal text-white text-center mb-1.5">Create Account</h2>
          <p className="font-sans text-[11px] text-[#c8a8e0] text-center tracking-[0.5px] mb-7">Join us and start booking your treatments</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="bg-[#eb5757]/10 border border-[#eb5757]/30 text-[#eb5757] text-[11px] px-3 py-2 mb-4">{error}</div>}
            
            <div className="flex border border-[#b040d8]/30 mb-6">
              {['client', 'stylist'].map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 font-sans text-[11px] font-semibold tracking-[1.5px] uppercase cursor-pointer border-none transition-all duration-200
                    ${role === r ? 'bg-[#7b2fa0] text-white' : 'bg-transparent text-[#9a7ab8]'}`}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3.5 mb-4">
              <div><label className={labelCls}>First Name</label><input type="text" value={form.first} onChange={e => setForm({...form, first: e.target.value})} placeholder="Andrea" required className={inputCls} /></div>
              <div><label className={labelCls}>Last Name</label><input type="text" value={form.last} onChange={e => setForm({...form, last: e.target.value})} placeholder="Santos" required className={inputCls} /></div>
            </div>
            <div className="mb-4"><label className={labelCls}>Email Address</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required className={inputCls} /></div>
            <div className="mb-4"><label className={labelCls}>Phone Number</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+63 912 345 6789" className={inputCls} /></div>
            <div className="mb-4"><label className={labelCls}>Password</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required className={inputCls} /></div>
            <div className="mb-6"><label className={labelCls}>Confirm Password</label><input type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} placeholder="••••••••" required className={inputCls} /></div>

            <button type="submit" disabled={loading} className={`block w-full bg-[#f0a800] text-[#1a0a2e] font-sans text-[11px] font-bold tracking-[2.5px] uppercase py-3.5 border-none cursor-pointer transition-all duration-200 hover:bg-[#f5c040] ${loading ? 'opacity-50' : ''}`}>
              {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
            <p className="text-center font-sans text-[11px] text-[#9a7ab8] mt-[18px]">
              Already have an account? <Link to="/login" className="text-[#f0a800]">Sign in</Link>
            </p>
          </form>
        </div>

        <Link to="/" className="font-sans text-[11px] text-[#9a7ab8] tracking-[1px] hover:text-[#f0a800] transition-colors">← Back to website</Link>
      </div>
    </div>
  )
}

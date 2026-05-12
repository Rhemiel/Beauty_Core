import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getServices } from '../../app/actions'

export default function Services() {
  const [services, setServices] = useState([])
  const [active, setActive] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      const res = await getServices()
      if (res.success) {
        setServices(res.data)
        if (res.data.length > 0) setActive(res.data[0].id)
      }
      setLoading(false)
    }
    fetchServices()
  }, [])

  useEffect(() => {
    if (services.length === 0) return

    const handleScroll = () => {
      // sweet spot is about 1/3 down the screen
      const triggerPoint = window.innerHeight / 3
      
      let closestSection = services[0].id
      let minDistance = Infinity

      for (const svc of services) {
        const el = document.getElementById(svc.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // We want the section that is closest to our trigger point but not below it entirely
          const distance = Math.abs(rect.top - triggerPoint)
          
          if (rect.top < window.innerHeight / 2 && rect.bottom > triggerPoint) {
             closestSection = svc.id
             break; // Found the one we are looking at
          }
        }
      }
      setActive(closestSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [services])

  const current = services.find(s => s.id === active)

  if (loading) return <div className="min-h-screen bg-[#1a0a2e] flex items-center justify-center text-white font-serif">Loading Services...</div>

  return (
    <div>
      <Navbar />

      {/* HERO */}
      <section className="py-[70px] px-10 pb-[50px] text-center border-b border-[#b040d8]/20" style={{ background: 'linear-gradient(160deg,#1a0a2e 0%,#2d1054 100%)' }}>
        <h1 className="font-serif font-light tracking-[8px] text-white uppercase mb-2" style={{ fontSize: 'clamp(28px,5vw,48px)' }}>OUR SERVICES</h1>
        <p className="font-sans text-[11px] tracking-[2px] text-[#f0a800] uppercase">Andrea's Aesthetic &amp; Wellness Clinic</p>
      </section>

      {/* BODY */}
      <section className="bg-[#f9f4ff] pb-20">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-[200px_1fr] gap-0 max-[900px]:grid-cols-1">

          {/* Sidebar */}
          <aside className="py-10 border-r border-[#7b2fa0]/15 sticky top-[80px] h-fit max-[900px]:static max-[900px]:border-r-0 max-[900px]:border-b max-[900px]:border-[#7b2fa0]/15 max-[900px]:pb-5 z-[20]">
            <p className="font-sans text-[9px] font-bold tracking-[2.5px] text-[#7b2fa0] uppercase mb-5 pr-5">Menu</p>
            <nav className="flex flex-col gap-1.5 max-[900px]:flex-row max-[900px]:flex-wrap max-[900px]:gap-2">
              {services.map(s => (
                <a key={s.id} href={`#${s.id}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActive(s.id);
                  }}
                  className={`block font-sans text-[11px] py-[12px] px-5 border-r-[3px] transition-all duration-300 cursor-pointer no-underline
                    ${active === s.id 
                      ? 'text-[#7b2fa0] font-bold border-[#f0a800] bg-[#7b2fa0]/5 shadow-[inset_-4px_0_10px_rgba(240,168,0,0.05)]' 
                      : 'text-[#888] border-transparent hover:text-[#7b2fa0] hover:bg-[#7b2fa0]/5'}`}>
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <main className="pt-10 pl-10 max-[900px]:pl-0 max-[900px]:pt-8">
            {services.map(svc => (
              <section key={svc.id} id={svc.id} className="mb-[60px] pb-[60px] border-b border-[#7b2fa0]/12 last:border-b-0 last:mb-0">
                {/* Banner */}
                <div className="w-full h-[180px] relative flex flex-col items-start justify-end p-6 mb-6 overflow-hidden bg-[#2d1054]">
                  <img src={
                    svc.id === 'japanese-head-spa' ? '/headspa.webp' : 
                    svc.id === 'hair-design' ? '/hairextension.jpg' : 
                    svc.id === 'nail-studio' ? '/nails.jpg' : 
                    svc.id === 'face-laser' ? '/face_laser.png' : 
                    svc.id === 'massage-therapy' ? '/massage_stone.png' :
                    '/salon_inside.jpg'
                  } alt={svc.label} className="absolute inset-0 w-full h-full object-cover object-center" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 60%)' }} />
                  <div className="relative z-10">
                    <h2 className="font-serif text-[28px] font-normal tracking-[3px] text-white mb-1 uppercase">{svc.label}</h2>
                    <p className="text-[11px] text-[#f5c040] font-bold tracking-[1.5px] uppercase">{svc.sub}</p>
                  </div>
                </div>
                <p className="text-xs text-[#555] mb-5 leading-[1.7]">{svc.intro}</p>
                {svc.categories.map(cat => (
                  <div key={cat.title} className="mb-6">
                    <p className="font-sans text-[10px] font-bold tracking-[2px] text-[#7b2fa0] uppercase mb-2.5 pb-1.5 border-b border-[#7b2fa0]/20">{cat.title}</p>
                    <div className="grid grid-cols-2 gap-x-10 max-[900px]:grid-cols-1">
                      {cat.items.map(([name, price]) => (
                        <div key={name} className="flex justify-between items-baseline py-[7px] border-b border-black/5 gap-3">
                          <span className="text-xs text-[#333] flex-1">{name}</span>
                          <span className="font-sans text-xs font-semibold text-[#7b2fa0] whitespace-nowrap">{price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </main>
        </div>
      </section>

      <Footer />
    </div>
  )
}

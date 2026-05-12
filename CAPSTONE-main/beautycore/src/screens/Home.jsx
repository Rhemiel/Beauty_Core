import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Home() {
  // Hardcoded default clinic info for the SPA version to ensure consistency
  const clinic = {
    address: 'Purok 5, Bagasbas Road, Daet, Camarines Norte 4600, Philippines',
    hours_weekday: 'Monday – Saturday: 9:00 AM – 8:00 PM',
    hours_weekend: 'Sunday: 10:00 AM – 6:00 PM',
    phone: '+63 954 123 4567',
    email: 'andreasaestheticwellness@gmail.com',
    map_embed_url: 'https://maps.google.com/maps?q=Bagasbas%20Road%20Daet&t=&z=17&ie=UTF8&iwloc=&output=embed',
  }

  return (
    <div className="bg-[#f9f4ff] flex flex-col min-h-screen">
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-tag   { animation: fade-up 0.9s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .hero-title { animation: fade-up 1s  cubic-bezier(.22,1,.36,1) 0.3s both; }
        .hero-sub   { animation: fade-up 1s  cubic-bezier(.22,1,.36,1) 0.55s both; }
        .hero-cta   { animation: fade-up 1s  cubic-bezier(.22,1,.36,1) 0.75s both; }

        .reveal-up { opacity: 1; transform: translateY(0); }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-center px-6 py-20 overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#1a0a2e 0%,#2d1054 50%,#1a0a2e 100%)' }}>
        <div className="relative z-10 max-w-[700px]">
          <p className="hero-tag font-sans text-[10px] tracking-[4px] text-[#f0a800] uppercase mb-5">AESTHETIC &amp; WELLNESS CLINIC</p>
          <h1 className="hero-title font-serif font-light tracking-[14px] text-white leading-none mb-7" style={{ fontSize: 'clamp(56px,10vw,100px)' }}>ANDREA'S</h1>
          <p className="hero-sub font-sans text-[13px] font-light text-[#e0c8f0] leading-[1.9] max-w-[480px] mx-auto mb-9">
            Experience the ultimate in beauty, wellness, and self-care. A luxury retreat designed to restore, refresh, and rejuvenate your mind and body.
          </p>
          <div className="hero-cta">
            <Link to="/services" className="inline-block font-sans text-[10px] font-semibold tracking-[2.5px] uppercase text-[#f0a800] border border-[#f0a800] px-[30px] py-3 transition-all hover:bg-[#f0a800] hover:text-[#1a0a2e]">
              DISCOVER OUR SERVICES
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES - COMPACT & MINI */}
      <section className="bg-[#f9f4ff] py-16" id="services">
        <div className="max-w-[900px] mx-auto px-6">
          <h2 className="font-serif font-normal tracking-[6px] uppercase text-center text-[#1a0a2e] mb-2" style={{ fontSize: '28px' }}>SERVICES WE OFFER</h2>
          <div className="w-8 h-px bg-[#c88800] mx-auto mb-10" />
          <div className="grid grid-cols-5 gap-3 mb-10 max-[1100px]:grid-cols-3 max-[700px]:grid-cols-1">
            {[
              { label: 'HEAD SPA', img: '/headspa.webp' },
              { label: 'HAIR', img: '/hairextension.jpg' },
              { label: 'FACE & LASER', img: '/face_laser.png' },
              { label: 'NAILS', img: '/nails.jpg' },
              { label: 'MASSAGE', img: '/massage_stone.png' },
            ].map(({ label, img }) => (
              <div key={label} className="aspect-[4/5] relative group overflow-hidden border border-black/5 shadow-sm">
                <img src={img} alt={label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/25 transition-all" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-1">
                  <h3 className="font-serif text-[10px] text-white text-center tracking-[1.5px] uppercase">{label}</h3>
                  <Link to="/login" className="font-sans text-[6px] font-bold tracking-[1px] uppercase bg-white text-[#1a0a2e] px-2.5 py-1 transition hover:bg-[#f0a800] hover:text-white">
                    BOOK NOW
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/login" className="inline-block font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-white bg-[#1a0a2e] px-8 py-3 transition-all hover:bg-[#b040d8]">
              BOOK YOUR APPOINTMENT
            </Link>
          </div>
        </div>
      </section>

      {/* LOCATION MAP SECTION - SPLIT LAYOUT (Details Left, Map Right) */}
      <section className="bg-white py-24 px-10 border-t border-[#b040d8]/10" id="location">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 gap-16 items-center max-[900px]:grid-cols-1">
          {/* Details (LEFT) */}
          <div>
            <p className="font-sans text-[10px] tracking-[4px] text-[#f0a800] uppercase mb-4">Our Sanctuary</p>
            <h2 className="font-serif text-[38px] text-[#1a0a2e] mb-8 leading-tight">Find Us in Daet</h2>
            <div className="space-y-8">
              <div className="flex gap-5">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-bold text-[#1a0a2e] text-[13px] uppercase tracking-[1px] mb-1">Our Location</p>
                  <p className="text-[12px] text-[#666] leading-relaxed">{clinic.address}</p>
                </div>
              </div>
              <div className="flex gap-5">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="font-bold text-[#1a0a2e] text-[13px] uppercase tracking-[1px] mb-1">Opening Hours</p>
                  <p className="text-[12px] text-[#666] leading-relaxed">
                    {clinic.hours_weekday}<br />{clinic.hours_weekend}
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-bold text-[#1a0a2e] text-[13px] uppercase tracking-[1px] mb-1">Get in Touch</p>
                  <p className="text-[12px] text-[#666] leading-relaxed">{clinic.phone}<br />{clinic.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map (RIGHT) */}
          <div className="flex flex-col">
            <div className="h-[450px] bg-gray-100 overflow-hidden shadow-2xl border border-[#b040d8]/10 mb-6">
              <iframe
                src={clinic.map_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
            {/* PIN TO GOOGLE MAPS LINK */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto w-fit bg-[#f0a800] text-[#1a0a2e] font-sans font-bold text-[10px] tracking-[2px] uppercase px-10 py-4 shadow-md hover:bg-[#f5c040] transition-all flex items-center gap-2 border border-[#b040d8]/10"
            >
              <span className="text-base">📍</span> PIN ADDRESS ON GOOGLE MAPS
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

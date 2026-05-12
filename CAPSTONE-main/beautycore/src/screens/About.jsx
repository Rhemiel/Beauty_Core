import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* ── Scroll-reveal hook ── */
function useReveal(options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('revealed')
        obs.disconnect()
      }
    }, { threshold: 0.15, ...options })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function About() {
  const photoRef   = useReveal()
  const textRef    = useReveal()
  const pillar0    = useReveal()
  const pillar1    = useReveal()
  const pillar2    = useReveal()

  return (
    <div>
      <style>{`
        .reveal-left {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1);
        }
        .reveal-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1);
        }
        .reveal-up.delay-1 { transition-delay:.15s; }
        .reveal-up.delay-2 { transition-delay:.30s; }
        .reveal-left.revealed,
        .reveal-up.revealed {
          opacity: 1;
          transform: translate(0,0);
        }

        .pillar-card { transition: transform .3s ease, box-shadow .3s ease; }
        .pillar-card:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(176,64,216,.25); }

        .about-photo-wrap {
          border-radius: 4px;
          overflow: hidden;
          border: 2px solid rgba(176,64,216,.5);
        }
      `}</style>

      <Navbar />

      {/* ── MEET ANDREA ── */}
      <section className="bg-[#f9f4ff] py-24">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-[1fr_1.6fr] gap-[60px] items-start max-[900px]:grid-cols-1">
          <div ref={photoRef} className="reveal-left about-photo-wrap aspect-[3/4] w-full max-[900px]:max-w-[400px] max-[900px]:mx-auto">
            <img src="/aboutpic.jpg" alt="Andrea" className="w-full h-full object-cover" />
          </div>
          <div ref={textRef} className="reveal-up pt-2.5">
            <p className="font-sans text-[10px] tracking-[3px] text-[#c88800] uppercase mb-3">THE FOUNDER</p>
            <h2 className="font-serif text-[42px] text-[#1a0a2e] mb-6 tracking-[2px]">MEET ANDREA</h2>
            <p className="font-sans text-[13px] text-[#444] leading-[1.9] mb-4">
              Andrea founded this clinic with a singular vision: to create a sanctuary where beauty and wellness converge. With over 15 years of experience in aesthetic medicine and holistic wellness, she has built a team of dedicated professionals who share her passion for excellence.
            </p>
            <p className="font-sans text-[13px] text-[#444] leading-[1.9] mb-4">
              Her approach is rooted in the belief that true beauty comes from within. Every treatment, every service, and every interaction at Andrea's is designed to nurture not just your appearance, but your overall sense of wellbeing and confidence.
            </p>
            <p className="font-sans text-[13px] text-[#444] leading-[1.9] mb-4">
              From the carefully curated product lines to the bespoke treatment protocols, every detail reflects Andrea's commitment to providing an experience that is as transformative as it is luxurious. She believes that self-care is not a luxury — it is a fundamental act of self-respect.
            </p>
            <p className="font-serif text-[15px] text-[#666] mt-6 italic">— Andrea, Founder &amp; Principal Specialist</p>
          </div>
        </div>
      </section>

      {/* ── CORE PILLARS ── */}
      <section className="py-24" style={{ background:'linear-gradient(160deg,#1a0a2e 0%,#2d1054 100%)' }}>
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <h2 className="font-serif text-[36px] text-white mb-12 uppercase tracking-[6px]">OUR CORE PILLARS</h2>
          <div className="grid grid-cols-3 gap-8 max-[900px]:grid-cols-1">
            {[
              { ref: pillar0, delay: '',        title:'PRECISION',   text:'Every treatment is performed with meticulous attention to detail using advanced techniques.' },
              { ref: pillar1, delay:'delay-1',  title:'PURITY',      text:'We use only high-quality, ethically sourced products for your skin and hair.' },
              { ref: pillar2, delay:'delay-2',  title:'TRANQUILITY', text:'A space designed for calm, helping you unwind from the moment you enter.' },
            ].map(({ ref, delay, title, text }) => (
              <div key={title} ref={ref} className={`reveal-up ${delay} pillar-card border border-[#b040d8]/20 p-8`} style={{ background:'rgba(176,64,216,.06)' }}>
                <h4 className="font-sans text-[11px] font-semibold tracking-[2.5px] text-[#f0a800] uppercase mb-4">{title}</h4>
                <p className="font-sans text-xs text-[#e0c8f0] leading-[1.9]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SANCTUARY (GALLERY) ── */}
      <section className="bg-white py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-sans text-[10px] tracking-[4px] text-[#f0a800] uppercase mb-4">OUR CLINIC</p>
            <h2 className="font-serif text-[36px] text-[#1a0a2e] mb-4">The Sanctuary</h2>
            <p className="font-sans text-[13px] text-[#666] max-w-[600px] mx-auto">A glimpse of our beautifully designed spaces, crafted specifically for your relaxation and comfort.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 max-[800px]:grid-cols-1">
            <div className="group relative overflow-hidden shadow-md">
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/salon_inside.jpg" alt="Inside" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                <h4 className="font-sans text-[11px] text-[#f0a800] uppercase tracking-[2px]">Inside The Salon</h4>
              </div>
            </div>
            <div className="group relative overflow-hidden shadow-md">
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/salon_outside.avif" alt="Outside" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                <h4 className="font-sans text-[11px] text-[#f0a800] uppercase tracking-[2px]">Outside The Salon</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEET THE TEAM ── */}
      <section className="bg-[#f9f4ff] py-24">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <p className="font-sans text-[10px] tracking-[4px] text-[#f0a800] uppercase mb-4">THE EXPERTS</p>
          <h2 className="font-serif text-[36px] text-[#1a0a2e] mb-12">Meet Our Team</h2>
          <div className="max-w-[900px] mx-auto group">
            <div className="aspect-[16/9] mb-6 overflow-hidden rounded-sm shadow-xl">
              <img src="/salon_team.webp" alt="The Team" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <h4 className="font-serif text-[24px] text-[#1a0a2e]">The Andrea's Family</h4>
            <p className="font-sans text-[12px] tracking-[2px] text-[#f0a800] uppercase mt-2">Management & Specialist Team</p>
          </div>
        </div>
      </section>

      {/* ── BOOKING CTA ── */}
      <section className="bg-[#1a0a2e] py-20 text-center">
        <Link to="/login" className="inline-block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#1a0a2e] bg-[#f0a800] px-12 py-5 shadow-xl hover:bg-white transition-all duration-300">
          BOOK YOUR APPOINTMENT
        </Link>
      </section>

      <Footer />
    </div>
  )
}

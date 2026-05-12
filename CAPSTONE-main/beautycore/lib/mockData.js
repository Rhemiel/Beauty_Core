// ── MOCK DATA REPOSITORY ──
// This file acts as our temporary "database". 
// Later, we will simply replace these with SQL queries.

export const MOCK_SERVICES = [
  {
    id: 'japanese-head-spa', label: 'Japanese Head Spa',
    sub: 'Scalp treatment & deep relaxation ritual',
    intro: 'Experience the ancient Japanese art of scalp care. Our head spa treatments combine deep cleansing, nourishing scalp massage, and premium hair treatments to restore balance and promote healthy hair growth.',
    categories: [
      { title: 'Signature Treatments', items: [
        ['Classic Head Spa (60 min)', '₱850'], ['Deep Cleanse Head Spa (75 min)', '₱1,100'], ['Scalp Detox Treatment', '₱750'],
        ['Premium Head Spa (90 min)', '₱1,350'], ['Scalp Analysis & Treatment', '₱950'], ['Hydrating Scalp Ritual', '₱900'],
      ]},
      { title: 'Add-Ons', items: [
        ['Aromatherapy Enhancement', '₱150'], ['Hot Oil Treatment', '₱200'],
        ['Neck & Shoulder Massage', '₱250'], ['Hair Mask Treatment', '₱300'],
      ]},
    ],
  },
  {
    id: 'hair-design', label: 'Hair Design',
    sub: 'Cuts, colour & styling by expert stylists',
    intro: 'Our talented stylists bring your vision to life with precision cuts, vibrant colour, and flawless styling. From everyday looks to special occasion transformations, we deliver results that exceed expectations.',
    categories: [
      { title: 'Cuts & Styling', items: [
        ["Women's Cut & Blowdry", '₱350'], ["Men's Cut", '₱180'], ["Children's Cut (under 12)", '₱150'], ['Blowdry & Style', '₱250'],
        ['Updo / Special Occasion', '₱500'], ['Bridal Hair', 'Mula ₱1,500'], ['Keratin Treatment', 'Mula ₱2,500'], ['Hair Extensions Consult', 'Libre'],
      ]},
      { title: 'Colour Services', items: [
        ['Full Colour', 'Mula ₱800'], ['Highlights (Full)', 'Mula ₱1,200'], ['Highlights (Partial)', 'Mula ₱700'],
        ['Balayage', 'Mula ₱1,500'], ['Toner / Gloss', '₱350'], ['Colour Correction', 'Konsultasyon'],
      ]},
    ],
  },
  {
    id: 'face-laser', label: 'Face & Laser',
    sub: 'Advanced aesthetic treatments for radiant skin',
    intro: 'Our medical-grade facial and laser treatments are performed by certified aesthetic specialists. We use the latest technology to address a wide range of skin concerns with safe, effective, and long-lasting results.',
    categories: [
      { title: 'Facial Treatments', items: [
        ['Classic Facial (60 min)', '₱600'], ['HydraFacial', '₱1,800'], ['Microdermabrasion', '₱1,200'], ['Chemical Peel (Light)', '₱1,000'],
        ['Chemical Peel (Medium)', '₱1,500'], ['LED Light Therapy', '₱700'], ['Microneedling', '₱2,500'], ['PRP Facial', '₱4,500'],
      ]},
      { title: 'Laser Treatments', items: [
        ['Laser Hair Removal – Face', 'Mula ₱800'], ['Laser Hair Removal – Body', 'Mula ₱1,500'], ['Laser Skin Resurfacing', 'Mula ₱3,500'],
        ['IPL Photofacial', '₱2,200'], ['Pigmentation Treatment', 'Mula ₱1,800'], ['Vascular Treatment', 'Mula ₱2,000'],
      ]},
    ],
  },
  {
    id: 'nail-studio', label: 'Nail Studio',
    sub: 'Manicures, pedicures & nail art',
    intro: 'Indulge in our full range of nail services, from classic manicures to intricate nail art. Our nail technicians use only premium, long-lasting products to keep your nails looking flawless.',
    categories: [
      { title: 'Manicure Services', items: [
        ['Classic Manicure', '₱180'], ['Gel Manicure', '₱350'], ['Acrylic Full Set', '₱650'], ['Acrylic Infill', '₱450'],
        ['Gel Extensions', '₱750'], ['Nail Art (per nail)', 'Mula ₱50'], ['Gel Removal', '₱150'], ['Nail Repair', '₱80'],
      ]},
      { title: 'Pedicure Services', items: [
        ['Classic Pedicure', '₱220'], ['Gel Pedicure', '₱400'], ['Spa Pedicure (60 min)', '₱550'],
        ['Luxury Pedicure (75 min)', '₱750'], ['Callus Treatment', '₱200'], ['Paraffin Wax Add-On', '₱150'],
      ]},
    ],
  },
  {
    id: 'massage-therapy', label: 'Massage Therapy',
    sub: 'Therapeutic & relaxation massage',
    intro: 'Our certified massage therapists offer a range of therapeutic and relaxation massages tailored to your individual needs. Whether you seek relief from tension or simply wish to unwind, we have the perfect treatment for you.',
    categories: [
      { title: 'Full Body Massage', items: [
        ['Swedish Massage (60 min)', '₱600'], ['Swedish Massage (90 min)', '₱850'], ['Deep Tissue (60 min)', '₱700'],
        ['Deep Tissue (90 min)', '₱950'], ['Hot Stone Massage (75 min)', '₱900'], ['Aromatherapy Massage', '₱750'],
      ]},
      { title: 'Targeted Treatments', items: [
        ['Back, Neck & Shoulder (30 min)', '₱350'], ['Foot Reflexology (45 min)', '₱450'],
        ['Prenatal Massage (60 min)', '₱650'], ['Sports Massage (60 min)', '₱700'],
      ]},
    ],
  },
]

export const MOCK_APPOINTMENTS = [
  { id: 1, client: 'Maria Santos', phone: '+63 912 111 1111', service: 'Nail Studio', date: '2026-04-08', time: '9:00 AM', staff: 'Andrea', status: 'Confirmed', notes: '' },
  { id: 2, client: 'Jessa Reyes', phone: '+63 912 222 2222', service: 'Japanese Head Spa', date: '2026-04-08', time: '10:00 AM', staff: 'Maria', status: 'Confirmed', notes: 'Sensitive scalp' },
  { id: 3, client: 'Carla Dizon', phone: '+63 912 333 3333', service: 'Hair Design', date: '2026-04-08', time: '11:30 AM', staff: 'Jessa', status: 'Pending', notes: '' },
]

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Car, ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import { PageWrapper, staggerContainer, fadeSlideUp } from '../motion.jsx'

const MANUFACTURERS = [
  '', 'Maruti', 'Hyundai', 'Honda', 'Toyota', 'Ford', 'Mahindra',
  'Tata', 'Volkswagen', 'Skoda', 'Renault', 'Nissan', 'Audi', 'BMW',
  'Mercedes', 'Jeep', 'MG', 'Kia', 'Chevrolet', 'Fiat', 'Mini', 'Datsun', 'Other'
]

const INFO_CARDS = [
  { icon: '⚙️', title: 'REAL-TIME DATA', body: 'Our AI pulls from 1.2M active listings to ensure your valuation is accurate to the hour.' },
  { icon: '📈', title: 'MARKET TRENDS', body: 'We factor in regional demand and depreciation curves for your specific car model.' },
  { icon: '🔬', title: 'ML POWERED', body: 'Random Forest model trained on 815 real Quikr listings, tuned with RandomizedSearchCV.' },
]

export default function Step1({ data, update, onNext, onBack }) {
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!data.company) e.company = 'Please select a manufacturer'
    if (!data.year || parseInt(data.year) < 1990 || parseInt(data.year) > 2025) e.year = 'Enter a valid year (1990–2025)'
    if (!data.name?.trim()) e.name = 'Enter the model name'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <PageWrapper custom={1}>
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <Navbar showClose onClose={onBack} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,3vw,40px) clamp(16px,4vw,48px) 100px' }}>

          {/* ── Progress header ───────────────────── */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'clamp(28px,4vw,48px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="label-sm" style={{ color: 'var(--color-outline)' }}>STEP 1 OF 3</span>
              <span className="label-sm" style={{ color: 'var(--color-primary)' }}>33% Complete</span>
            </div>
            <div className="progress-track" style={{ height: 5 }}>
              <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: '33%' }} transition={{ duration: 0.7, ease: [0.4,0,0.2,1] }} />
            </div>
            <h1 className="headline-lg" style={{ marginTop: 24, color: 'var(--color-on-surface)' }}>Car Basics</h1>
            <p className="body-md" style={{ color: 'var(--color-on-surface-var)', marginTop: 6 }}>Enter your vehicle details to begin the high-precision market valuation analysis.</p>
          </motion.div>

          {/* ── Main content grid ─────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(20px,3vw,40px)' }}
            ref={el => { if (el && window.innerWidth >= 900) el.style.gridTemplateColumns = '1.4fr 1fr' }}>

            {/* Left — Form */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate">

              {/* Hero strip */}
              <motion.div
                variants={fadeSlideUp}
                style={{
                  borderRadius: 16, marginBottom: 28,
                  background: 'linear-gradient(135deg, rgba(46,91,255,0.2) 0%, rgba(123,208,255,0.08) 100%)',
                  border: '1px solid rgba(184,195,255,0.15)',
                  padding: 'clamp(20px,2.5vw,32px)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', right: -20, top: -20, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,91,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <svg style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.07 }} width="220" height="110" viewBox="0 0 220 110" fill="none">
                  <path d="M20 80 L50 35 L100 20 L160 24 L200 80 Z" fill="white"/>
                  <ellipse cx="60" cy="85" rx="20" ry="14" fill="white"/>
                  <ellipse cx="160" cy="85" rx="20" ry="14" fill="white"/>
                </svg>
                <p className="label-sm" style={{ color: 'var(--color-primary)', marginBottom: 10 }}>PRECISION VALUATION ENGINE</p>
                <p style={{ fontSize: 'clamp(15px,1.5vw,18px)', color: 'var(--color-on-surface)', fontWeight: 600, margin: '0 0 8px', maxWidth: '65%' }}>
                  Enter your vehicle details to begin our high-precision market analysis
                </p>
                <p style={{ fontSize: 13, color: 'var(--color-on-surface-var)', margin: 0 }}>Neural-calibrated valuations in under 3 seconds.</p>
              </motion.div>

              {/* Form fields */}
              <div style={{ display: 'grid', gap: 20 }}>
                {/* Manufacturer */}
                <motion.div variants={fadeSlideUp}>
                  <label className="label-sm" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: 10 }}>MANUFACTURER</label>
                  <div style={{ position: 'relative' }}>
                    <select className="input-field" value={data.company}
                      onChange={e => { update({ company: e.target.value }); setErrors(p => ({...p, company: ''})) }}
                      style={{ paddingRight: 44 }}>
                      <option value="">Select Brand</option>
                      {MANUFACTURERS.filter(Boolean).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline)', pointerEvents: 'none' }} />
                  </div>
                  {errors.company && <p style={{ color: 'var(--color-error)', fontSize: 13, marginTop: 6 }}>{errors.company}</p>}
                </motion.div>

                {/* Year + Model side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16 }}>
                  <motion.div variants={fadeSlideUp}>
                    <label className="label-sm" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: 10 }}>YEAR</label>
                    <div style={{ position: 'relative' }}>
                      <input className="input-field" type="number" placeholder="e.g. 2019"
                        min="1990" max="2025" value={data.year}
                        onChange={e => { update({ year: e.target.value }); setErrors(p => ({...p, year: ''})) }}
                        style={{ fontVariantNumeric: 'tabular-nums', paddingRight: 44 }} />
                      <Calendar size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline)', pointerEvents: 'none' }} />
                    </div>
                    {errors.year && <p style={{ color: 'var(--color-error)', fontSize: 13, marginTop: 6 }}>{errors.year}</p>}
                  </motion.div>

                  <motion.div variants={fadeSlideUp}>
                    <label className="label-sm" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: 10 }}>MODEL NAME</label>
                    <div style={{ position: 'relative' }}>
                      <input className="input-field" type="text" placeholder="e.g. Swift, Creta, i20, City"
                        value={data.name}
                        onChange={e => { update({ name: e.target.value }); setErrors(p => ({...p, name: ''})) }}
                        style={{ paddingRight: 44 }} />
                      <Car size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline)', pointerEvents: 'none' }} />
                    </div>
                    {errors.name && <p style={{ color: 'var(--color-error)', fontSize: 13, marginTop: 6 }}>{errors.name}</p>}
                  </motion.div>
                </div>
              </div>

              {/* Continue button */}
              <motion.div variants={fadeSlideUp} style={{ marginTop: 28 }}>
                <motion.button
                  className="btn-primary"
                  onClick={() => { if (validate()) onNext() }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '16px 28px' }}
                >
                  Continue <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right — Info cards */}
            <motion.div
              variants={staggerContainer} initial="initial" animate="animate"
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              {INFO_CARDS.map((c, i) => (
                <motion.div
                  key={i} variants={fadeSlideUp}
                  className="glass-card-sm"
                  style={{ padding: 'clamp(16px,2vw,24px)', display: 'flex', gap: 16, alignItems: 'flex-start' }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{c.icon}</span>
                  <div>
                    <p className="label-sm" style={{ color: 'var(--color-primary)', marginBottom: 6 }}>{c.title}</p>
                    <p style={{ fontSize: 14, color: 'var(--color-on-surface-var)', margin: 0, lineHeight: 1.65 }}>{c.body}</p>
                  </div>
                </motion.div>
              ))}

              {/* Quick tip */}
              <motion.div
                variants={fadeSlideUp}
                style={{ padding: 16, borderRadius: 10, border: '1px solid rgba(184,195,255,0.12)', background: 'rgba(184,195,255,0.04)' }}
              >
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-on-surface-var)', lineHeight: 1.6 }}>
                  💡 <strong style={{ color: 'var(--color-on-surface)' }}>Tip:</strong> Use the exact model name as it appears on the car's documents (e.g. "Creta", "i20", "City") for the most accurate valuation.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

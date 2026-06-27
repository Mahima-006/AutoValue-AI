import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { PageWrapper, staggerContainer, fadeSlideUp } from '../motion.jsx'

const CONDITIONS = [
  {
    id: 'Fair', emoji: '⚡',
    description: 'Noticeable wear and tear, potential minor repairs needed, but mechanically sound and road-worthy.'
  },
  {
    id: 'Good', emoji: '👍',
    description: 'Normal wear with a clean title and well-maintained engine. The most common used-car condition.'
  },
  {
    id: 'Excellent', emoji: '⭐',
    description: 'Near-showroom quality: no visible damage, full service records, possibly under extended warranty.'
  },
]

const FEATURES = [
  { id: 'Panoramic Sunroof',    emoji: '☀️',  desc: 'Adds light & value' },
  { id: 'Leather Seats',        emoji: '🪑',  desc: 'Premium interior upgrade' },
  { id: 'Navigation System',    emoji: '🧭',  desc: 'Built-in GPS & maps' },
  { id: 'Advanced Safety Pkg',  emoji: '🛡️',  desc: 'ADAS & airbag suite' },
]

export default function Step2({ data, update, onNext, onBack }) {
  const [isDragging, setIsDragging] = useState(false)

  const toggleFeature = id => {
    const cur = data.features || []
    update({ features: cur.includes(id) ? cur.filter(f => f !== id) : [...cur, id] })
  }

  const pct = (data.kms_driven / 200000) * 100
  const mileageDisplay = Number(data.kms_driven).toLocaleString('en-IN')

  return (
    <PageWrapper custom={1}>
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <Navbar showClose onClose={onBack} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,3vw,40px) clamp(16px,4vw,48px) 100px' }}>

          {/* Progress */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'clamp(28px,4vw,48px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="label-sm" style={{ color: 'var(--color-outline)' }}>STEP 2 OF 3</span>
              <span className="label-sm" style={{ color: 'var(--color-primary)' }}>66% Complete</span>
            </div>
            <div className="progress-track" style={{ height: 5 }}>
              <motion.div className="progress-fill" initial={{ width: '33%' }} animate={{ width: '66%' }} transition={{ duration: 0.7, ease: [0.4,0,0.2,1] }} />
            </div>
            <h1 className="headline-lg" style={{ marginTop: 24 }}>Condition & Mileage</h1>
            <p className="body-md" style={{ color: 'var(--color-on-surface-var)', marginTop: 6 }}>Detailed vehicle specs help us refine your market-calibrated estimate.</p>
          </motion.div>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}
            ref={el => { if (el && window.innerWidth >= 900) el.style.gridTemplateColumns = '1fr 1fr' }}>

            {/* ── Left column ───────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Mileage */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-card-sm" style={{ padding: 'clamp(20px,2.5vw,28px)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <p className="label-sm" style={{ color: 'var(--color-outline)', marginBottom: 6 }}>CURRENT MILEAGE</p>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--color-on-surface-var)' }}>Kilometres driven since new</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: 'var(--color-on-surface)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                      {mileageDisplay}
                    </span>
                    <span style={{ fontSize: 14, color: 'var(--color-outline)', marginLeft: 4 }}>KM</span>
                  </div>
                </div>

                <input type="range" min="0" max="200000" step="1000"
                  value={data.kms_driven}
                  onChange={e => update({ kms_driven: parseInt(e.target.value) })}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchEnd={() => setIsDragging(false)}
                  className="mileage-slider"
                  style={{ '--slider-pct': `${pct}%` }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                  {['0', '50k', '1L', '1.5L', '2L+'].map((l, i) => (
                    <span key={i} style={{ fontSize: 10, color: 'var(--color-outline)', letterSpacing: '0.04em' }}>{l}</span>
                  ))}
                </div>

                {/* Mileage rating */}
                <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 8, background: 'rgba(184,195,255,0.06)', border: '1px solid rgba(184,195,255,0.1)' }}>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--color-on-surface-var)', fontStyle: 'italic' }}>
                    {data.kms_driven < 30000 ? '🟢 Low mileage — significantly boosts market value.' :
                     data.kms_driven < 80000 ? '🟡 Average mileage — within typical used-car range.' :
                     data.kms_driven < 150000 ? '🟠 High mileage — expect moderate value reduction.' :
                     '🔴 Very high mileage — strong reduction in resale value.'}
                  </p>
                </div>
              </motion.div>

              {/* Fuel type */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="glass-card-sm" style={{ padding: 'clamp(20px,2.5vw,28px)' }}>
                <p className="headline-md" style={{ marginBottom: 16 }}>Fuel Type</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {['Petrol', 'Diesel', 'CNG', 'LPG'].map(fuel => {
                    const sel = data.fuel_type === fuel
                    return (
                      <motion.button key={fuel} whileTap={{ scale: 0.97 }} onClick={() => update({ fuel_type: fuel })}
                        style={{
                          padding: '14px 10px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                          fontSize: 14, fontWeight: 600, textAlign: 'center',
                          border: `1.5px solid ${sel ? 'var(--color-primary)' : 'var(--color-outline-var)'}`,
                          background: sel ? 'rgba(184,195,255,0.1)' : 'var(--color-surface-high)',
                          color: sel ? 'var(--color-primary)' : 'var(--color-on-surface-var)',
                          boxShadow: sel ? '0 0 16px var(--glow-primary)' : 'none',
                          transition: 'all 0.2s ease',
                        }}>
                        {fuel === 'Petrol' ? '⛽' : fuel === 'Diesel' ? '🛢️' : fuel === 'CNG' ? '🌿' : '🔵'} {fuel}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* ── Right column ──────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Condition */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card-sm" style={{ padding: 'clamp(20px,2.5vw,28px)' }}>
                <p className="headline-md" style={{ marginBottom: 16 }}>Vehicle Condition</p>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  {CONDITIONS.map(c => (
                    <motion.button key={c.id} className={`condition-card ${data.condition === c.id ? 'selected' : ''}`}
                      onClick={() => update({ condition: c.id })} whileTap={{ scale: 0.96 }}>
                      <span style={{ fontSize: 24 }}>{c.emoji}</span>
                      <span className="label-sm" style={{ marginTop: 4, fontSize: 11 }}>{c.id}</span>
                    </motion.button>
                  ))}
                </div>
                <motion.div key={data.condition} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(184,195,255,0.05)', border: '1px solid rgba(184,195,255,0.1)' }}>
                  <p style={{ margin: 0, fontSize: 13, fontStyle: 'italic', color: 'var(--color-on-surface-var)', lineHeight: 1.6 }}>
                    {CONDITIONS.find(c => c.id === data.condition)?.description}
                  </p>
                </motion.div>
              </motion.div>

              {/* Premium features */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="glass-card-sm" style={{ padding: 'clamp(20px,2.5vw,28px)' }}>
                <p className="headline-md" style={{ marginBottom: 6 }}>Premium Features</p>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--color-on-surface-var)' }}>
                  Each selected feature adds ~2% to the base prediction.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {FEATURES.map(feat => {
                    const checked = (data.features || []).includes(feat.id)
                    return (
                      <motion.button key={feat.id} className={`feature-row ${checked ? 'selected' : ''}`}
                        onClick={() => toggleFeature(feat.id)} whileTap={{ scale: 0.99 }}>
                        <span style={{ fontSize: 20 }}>{feat.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, display: 'block' }}>{feat.id}</span>
                          <span style={{ fontSize: 12, color: 'var(--color-outline)' }}>{feat.desc}</span>
                        </div>
                        <div className={`feature-checkbox ${checked ? 'checked' : ''}`}>
                          {checked && <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom nav */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: 14, marginTop: 32, maxWidth: 600 }}>
            <button className="btn-ghost" onClick={onBack} style={{ flex: '0 0 auto', gap: 8 }}>
              <ArrowLeft size={16} /> Back
            </button>
            <motion.button className="btn-primary" onClick={onNext}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ flex: 1, justifyContent: 'center', fontSize: 16 }}>
              Next Step <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react'
import Navbar from '../components/Navbar'
import { PageWrapper, staggerContainer, fadeSlideUp } from '../motion.jsx'
import { predictPrice } from '../api'

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Surat', 'Indore', 'Other']

export default function Step3({ data, update, onSubmit, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      const result = await predictPrice(data)
      onSubmit(result)
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reviewRows = [
    { label: 'Manufacturer', value: data.company || '—' },
    { label: 'Year', value: data.year || '—' },
    { label: 'Model', value: data.name || '—' },
    { label: 'Mileage', value: data.kms_driven ? `${Number(data.kms_driven).toLocaleString('en-IN')} km` : '—' },
    { label: 'Fuel Type', value: data.fuel_type || '—' },
    { label: 'Condition', value: data.condition || '—' },
    { label: 'Location', value: data.location || 'Not specified' },
    { label: 'Premium Features', value: (data.features?.length || 0) > 0 ? data.features.join(', ') : 'None selected' },
  ]

  return (
    <PageWrapper custom={1}>
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <Navbar showClose onClose={onBack} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,3vw,40px) clamp(16px,4vw,48px) 60px' }}>

          {/* Progress */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'clamp(28px,4vw,48px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="label-sm" style={{ color: 'var(--color-outline)' }}>STEP 3 OF 3</span>
              <span className="label-sm" style={{ color: 'var(--color-primary)' }}>99% Complete</span>
            </div>
            <div className="progress-track" style={{ height: 5 }}>
              <motion.div className="progress-fill" initial={{ width: '66%' }} animate={{ width: '99%' }} transition={{ duration: 0.7, ease: [0.4,0,0.2,1] }} />
            </div>
            <h1 className="headline-lg" style={{ marginTop: 24 }}>Location & Review</h1>
            <p className="body-md" style={{ color: 'var(--color-on-surface-var)', marginTop: 6 }}>One final check before we run the prediction — confirm your details below.</p>
          </motion.div>

          {/* Two-column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}
            ref={el => { if (el && window.innerWidth >= 900) el.style.gridTemplateColumns = '1fr 1.2fr' }}>

            {/* Left — Location + notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-card-sm" style={{ padding: 'clamp(20px,2.5vw,28px)' }}>
                <p className="headline-md" style={{ marginBottom: 8 }}>Vehicle Location</p>
                <p style={{ fontSize: 14, color: 'var(--color-on-surface-var)', marginBottom: 18, lineHeight: 1.6 }}>
                  Regional demand affects resale value. Metros generally command 5–12% higher prices than tier-2 cities.
                </p>
                <label className="label-sm" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: 10 }}>CITY</label>
                <div style={{ position: 'relative' }}>
                  <select className="input-field" value={data.location || ''} onChange={e => update({ location: e.target.value })} style={{ paddingLeft: 44 }}>
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <MapPin size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline)', pointerEvents: 'none' }} />
                </div>
              </motion.div>

              {/* Disclaimer */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                style={{ padding: '16px 18px', borderRadius: 10, border: '1px solid rgba(184,195,255,0.1)', background: 'rgba(184,195,255,0.04)' }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-on-surface-var)', lineHeight: 1.6 }}>
                  🤖 <strong style={{ color: 'var(--color-on-surface)' }}>About this prediction:</strong> The model was trained on real Quikr used-car listings (Indian market, INR). Confidence scores and price trends are heuristic estimates derived from model R². This is a demo project, not a financial instrument.
                </p>
              </motion.div>

              {/* What happens next */}
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                className="glass-card-sm" style={{ padding: 'clamp(16px,2vw,24px)' }}>
                <p className="label-sm" style={{ color: 'var(--color-primary)', marginBottom: 14 }}>WHAT HAPPENS NEXT</p>
                {[
                  { step: '01', text: 'Your inputs are sent to the FastAPI backend' },
                  { step: '02', text: 'The Random Forest model runs the prediction (< 50ms)' },
                  { step: '03', text: 'We apply condition & feature multipliers' },
                  { step: '04', text: 'Your animated results screen appears instantly' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 3 ? 12 : 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary-container)', minWidth: 24 }}>{s.step}</span>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--color-on-surface-var)', lineHeight: 1.5 }}>{s.text}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Summary + submit */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="glass-card" style={{ padding: 'clamp(20px,2.5vw,32px)' }}>
                <p className="label-sm" style={{ color: 'var(--color-primary)', marginBottom: 20 }}>VALUATION SUMMARY</p>
                <div>
                  {reviewRows.map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                      padding: '11px 0',
                      borderBottom: i < reviewRows.length - 1 ? '1px solid var(--color-outline-var)' : 'none',
                      gap: 12,
                    }}>
                      <span style={{ fontSize: 14, color: 'var(--color-on-surface-var)', flexShrink: 0 }}>{row.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-on-surface)', textAlign: 'right' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 16, padding: '12px 16px', background: 'var(--color-error-container)', borderRadius: 8 }}>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--color-error)' }}>⚠️ {error}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,180,171,0.7)' }}>
                      Make sure the backend is running: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 3 }}>uvicorn main:app --reload</code>
                    </p>
                  </motion.div>
                )}

                <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                  <button className="btn-ghost" onClick={onBack} style={{ flex: '0 0 auto', padding: '14px 20px' }}>
                    <ArrowLeft size={16} />
                  </button>
                  <motion.button className="btn-primary" onClick={handleSubmit} disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
                    style={{ flex: 1, justifyContent: 'center', fontSize: 16, opacity: loading ? 0.75 : 1 }}>
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          style={{ display: 'inline-block', width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                        Calculating value…
                      </span>
                    ) : (
                      <> Get My Valuation <ArrowRight size={18} /> </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

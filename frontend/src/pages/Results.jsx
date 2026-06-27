import { motion } from 'framer-motion'
import { ArrowUpRight, Download, Pencil, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import AnimatedPrice from '../components/AnimatedPrice'
import PriceChart from '../components/PriceChart'
import { PageWrapper, staggerContainer, fadeSlideUp, scaleIn } from '../motion.jsx'

function ConfidenceBar({ score }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <span className="label-sm" style={{ color: 'var(--color-outline)' }}>CONFIDENCE SCORE</span>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-on-surface-var)', fontStyle: 'italic' }}>
            Based on model R² and input data quality
          </p>
        </div>
        <span style={{ fontWeight: 700, fontSize: 'clamp(22px,3vw,30px)', color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(score * 100)}%
        </span>
      </div>
      <div className="progress-track" style={{ height: 8, borderRadius: 4 }}>
        <motion.div className="progress-fill" initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.4,0,0.2,1] }}
          style={{ height: '100%', borderRadius: 4 }} />
      </div>
    </div>
  )
}

function VolatilityBadge({ level }) {
  const c = {
    Low:    { bg: 'rgba(74,222,128,0.12)', text: '#4ade80', border: 'rgba(74,222,128,0.3)' },
    Medium: { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
    High:   { bg: 'rgba(255,180,171,0.12)', text: 'var(--color-error)', border: 'rgba(255,180,171,0.3)' },
  }[level] || {}
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 4, fontSize: 12, fontWeight: 600, padding: '5px 12px',
      letterSpacing: '0.05em',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.text }} />
      {level} Volatility
    </span>
  )
}

export default function Results({ prediction, formData, onRefine }) {
  const p = prediction || {}
  const carLabel = `${formData?.year || ''} ${formData?.company || ''} ${formData?.name || ''}`.trim()
  const carAge = p.car_age || (2024 - parseInt(formData?.year || 2020))

  return (
    <PageWrapper custom={1}>
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <Navbar />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,3vw,40px) clamp(16px,4vw,48px) 120px' }}>

          {/* ── Hero price block ───────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ marginBottom: 'clamp(28px,4vw,48px)' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <motion.span className="chip" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                style={{ background: 'rgba(46,91,255,0.15)', borderColor: 'rgba(46,91,255,0.4)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                VALUATION LIVE
              </motion.span>
              <span style={{ fontSize: 15, color: 'var(--color-on-surface-var)', fontWeight: 500 }}>{carLabel}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <p className="label-sm" style={{ color: 'var(--color-outline)', marginBottom: 10 }}>ESTIMATED MARKET VALUE</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontSize: 'clamp(40px,7vw,80px)', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    <AnimatedPrice value={p.predicted_price || 0} prefix="₹" duration={2} />
                  </span>
                  <span style={{ fontSize: 16, color: 'var(--color-outline)', fontWeight: 600 }}>INR</span>
                </div>
              </div>

              {/* Action buttons top-right */}
              <div style={{ display: 'flex', gap: 10, flexShrink: 0, alignSelf: 'flex-end' }}>
                <motion.button className="btn-primary" onClick={() => window.print()}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ gap: 8 }}>
                  <Download size={16} /> Save Report
                </motion.button>
                <motion.button className="btn-ghost" onClick={onRefine}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ gap: 8 }}>
                  <Pencil size={15} /> Refine
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── Main results grid ──────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}
            ref={el => { if (el && window.innerWidth >= 900) el.style.gridTemplateColumns = '1.1fr 0.9fr' }}>

            {/* ── Left column ───────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Confidence + Volatility */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card-sm" style={{ padding: 'clamp(20px,2.5vw,28px)' }}>
                <ConfidenceBar score={p.confidence_score || 0.8} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, flexWrap: 'wrap', gap: 12 }}>
                  <VolatilityBadge level={p.market_volatility || 'Low'} />
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--color-on-surface-var)', fontStyle: 'italic' }}>
                    How much prices fluctuate for this model in your region
                  </p>
                </div>
              </motion.div>

              {/* Price Trends chart */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="glass-card" style={{ padding: 'clamp(20px,2.5vw,28px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h3 className="headline-md" style={{ margin: 0 }}>Price Trends</h3>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-on-surface-var)' }}>12-month market data for this model variant</p>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {[
                      { color: 'var(--color-primary-container)', label: 'Predicted' },
                      { color: 'var(--color-tertiary)', label: 'Market Avg', dashed: true },
                    ].map(l => (
                      <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 22, height: 2, borderTop: `2px ${l.dashed ? 'dashed' : 'solid'} ${l.color}` }} />
                        <span style={{ fontSize: 12, color: 'var(--color-on-surface-var)' }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <PriceChart data={p.price_trend || []} />
              </motion.div>

              {/* Demand High card */}
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                className="glass-card" style={{ padding: 'clamp(20px,2.5vw,28px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,91,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>📊</span>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Demand High</h3>
                </div>
                <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--color-on-surface-var)', lineHeight: 1.7 }}>
                  Current supply for this specific trim is below quarterly average, driving values upward. Regional buyer demand is outpacing available listings.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TrendingUp size={14} style={{ color: 'var(--color-tertiary)' }} />
                  <span style={{ fontSize: 14, color: 'var(--color-tertiary)', fontWeight: 600, cursor: 'pointer' }}>
                    Strong resale potential
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ── Right column ──────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Vehicle profile */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                className="glass-card-sm" style={{ padding: 'clamp(20px,2.5vw,28px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <h3 className="headline-md" style={{ margin: 0 }}>Vehicle Profile</h3>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17l2-6h14l2 6M7 17V11M17 17V11" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="7" cy="19" r="1" fill="var(--color-primary)"/>
                    <circle cx="17" cy="19" r="1" fill="var(--color-primary)"/>
                  </svg>
                </div>
                {[
                  { label: 'Mileage',   value: `${Number(formData?.kms_driven || 0).toLocaleString('en-IN')} km` },
                  { label: 'Condition', value: formData?.condition || 'Good' },
                  { label: 'Fuel Type', value: formData?.fuel_type || 'Petrol' },
                  { label: 'Car Age',   value: `${carAge} years` },
                  { label: 'Location',  value: formData?.location || 'Not specified' },
                  { label: 'Features',  value: (formData?.features?.length || 0) > 0 ? `${formData.features.length} premium` : 'None' },
                ].map((row, i, arr) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--color-outline-var)' : 'none' }}>
                    <span style={{ fontSize: 14, color: 'var(--color-on-surface-var)' }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-on-surface)', fontVariantNumeric: 'tabular-nums' }}>{row.value}</span>
                  </div>
                ))}
              </motion.div>

              {/* Comparative Analysis */}
              <motion.div
                variants={staggerContainer} initial="initial" whileInView="animate"
                viewport={{ once: true }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: 14 }}>Comparative Analysis</h3>
                <p style={{ fontSize: 14, color: 'var(--color-on-surface-var)', marginBottom: 14, lineHeight: 1.6 }}>
                  How this vehicle stacks up against similar listings in {formData?.location || 'your region'}.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  {[
                    { emoji: '🏆', value: p.percentile || 'Top 15%', label: 'Condition percentile' },
                    { emoji: '✅', value: 'Clean',                   label: 'Title & service (assumed)' },
                  ].map((tile, i) => (
                    <motion.div key={i} variants={fadeSlideUp} className="glass-card-sm"
                      style={{ padding: 'clamp(14px,1.8vw,20px)', textAlign: 'center' }}>
                      <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{tile.emoji}</span>
                      <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 18, color: 'var(--color-primary)' }}>{tile.value}</p>
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--color-outline)', letterSpacing: '0.04em' }}>{tile.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Verified appraisal */}
                <motion.div variants={scaleIn} className="glass-card"
                  style={{ padding: 'clamp(18px,2vw,24px)', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(46,91,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(184,195,255,0.25)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: 'var(--color-on-surface)' }}>Verified Appraisal</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-on-surface-var)' }}>
                      Data backed by 48,000+ real market points.
                      Model R²: <strong style={{ color: 'var(--color-primary)' }}>{((p.model_r2 || 0.63) * 100).toFixed(1)}%</strong>
                    </p>
                  </div>
                </motion.div>

                {/* Model metrics mini */}
                <motion.div variants={fadeSlideUp} style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'ALGORITHM', value: 'RF' },
                    { label: 'R² SCORE', value: `${((p.model_r2 || 0.63) * 100).toFixed(0)}%` },
                    { label: 'PERCENTILE', value: p.percentile || 'Top 15%' },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--color-surface-high)', border: '1px solid var(--color-outline-var)', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
                      <p className="label-sm" style={{ color: 'var(--color-outline)', marginTop: 4, fontSize: 9 }}>{s.label}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        <BottomNav active="estimate" />
      </div>
    </PageWrapper>
  )
}

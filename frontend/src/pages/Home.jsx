import { useState } from 'react'
import { ArrowUpRight, Award, Gauge, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = ['Models', 'Performance', 'Design', 'Test Drive']

const STATS = [
  { value: '815+', label: 'Cars Analysed' },
  { value: '63%',  label: 'Model R² Score' },
  { value: '< 3s', label: 'Instant Result' },
]

const RECENT = [
  { name: '2021 BMW M5 GS',        price: '₹42,00,000', change: '+7.4%',  pos: true,  status: 'Verified Value' },
  { name: '2023 Maruti Swift',      price: '₹7,20,000',  change: '-1.2%',  pos: false, status: 'Market Price' },
  { name: '2022 Hyundai Creta',     price: '₹14,50,000', change: '+2.8%',  pos: true,  status: 'Market Stability' },
  { name: '2020 Toyota Fortuner',   price: '₹26,00,000', change: 'Stable', pos: true,  status: 'Verified Value' },
  { name: '2019 Maruti Alto',       price: '₹3,40,000',  change: '-0.5%',  pos: false, status: 'Market Price' },
  { name: '2018 Honda City',        price: '₹7,80,000',  change: '+1.1%',  pos: true,  status: 'EV Adjusted' },
]

const INSIGHTS = [
  { tag: 'MARKET ALERT', time: '2h ago', headline: 'EV resale values stabilise as new models arrive', teaser: 'Secondary market prices hold despite new launches.' },
  { tag: 'REPORT',       time: '5h ago', headline: 'Luxury segment sees 12% demand surge in Q2',     teaser: 'High-end valuations above ₹30L up significantly.' },
  { tag: 'REPORT',       time: '1d ago', headline: 'Diesel vehicles regain resale momentum',          teaser: 'Fuel efficiency concerns driving buyers back to diesel.' },
]

export default function Home({ onStart }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════════════
          SECTION 1 — FULLSCREEN HERO
      ══════════════════════════════════════════════ */}
      <section style={{ position: 'relative', width: '100%', height: '100svh', minHeight: 600, overflow: 'hidden' }}>

        {/* Background Image */}
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, backgroundImage: 'url(/hero_car_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to right, rgba(5,20,36,0.92) 0%, rgba(5,20,36,0.65) 50%, rgba(5,20,36,0.35) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top, rgba(5,20,36,0.8) 0%, transparent 40%)' }} />
        {/* Blue ambient glow */}
        <div style={{ position: 'absolute', top: '30%', left: '5%', width: 600, height: 600, zIndex: 1, background: 'radial-gradient(circle, rgba(46,91,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* ── Navbar ─────────────────────────────── */}
        <nav style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'clamp(16px,2.5vw,28px) clamp(20px,5vw,64px)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'var(--color-primary-container)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(46,91,255,0.5)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 17l2-7h14l2 7M7 17V9M17 17V9M12 17v-3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="7" cy="19" r="1.5" fill="white"/>
                <circle cx="17" cy="19" r="1.5" fill="white"/>
              </svg>
            </div>
            <span className="font-podium" style={{ fontSize: 'clamp(20px,2.5vw,28px)', color: 'white', letterSpacing: '0.12em' }}>
              AutoValue <span style={{ color: 'var(--color-primary)' }}>AI</span>
            </span>
          </div>

          {/* Desktop nav links */}
          <div style={{ display: 'none', gap: 40 }} className="desktop-nav" id="desktop-nav-links"
            ref={el => { if (el) el.style.display = window.innerWidth >= 768 ? 'flex' : 'none' }}>
            {NAV_LINKS.map(link => (
              <a key={link} href="#" style={{
                color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
              >{link}</a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={onStart}
              style={{
                display: window.innerWidth >= 768 ? 'inline-flex' : 'none',
                alignItems: 'center', gap: 6,
                border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4,
                background: 'transparent', color: 'white',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
                padding: '12px 24px', cursor: 'pointer', fontFamily: 'inherit',
                textTransform: 'uppercase', transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent' }}
            >
              Start Valuation <ArrowUpRight size={14} />
            </button>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenuOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              aria-label="Open menu"
            >
              <div style={{ width: 24, height: 2, background: 'white', marginBottom: 6 }} />
              <div style={{ width: 24, height: 2, background: 'white', marginBottom: 6 }} />
              <div style={{ width: 16, height: 2, background: 'white' }} />
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu Overlay ─────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 50,
                background: 'rgba(5,20,36,0.97)', backdropFilter: 'blur(8px)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Menu header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
                <span className="font-podium" style={{ fontSize: 22, color: 'white', letterSpacing: '0.12em' }}>
                  AutoValue <span style={{ color: 'var(--color-primary)' }}>AI</span>
                </span>
                <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: 4 }}>
                  <X size={24} />
                </button>
              </div>

              {/* Menu links */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px', gap: 8 }}>
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link}
                    href="#"
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 + 0.1, duration: 0.4 }}
                    style={{
                      display: 'block', color: 'white', textDecoration: 'none',
                      fontSize: 'clamp(36px,8vw,56px)',
                      fontFamily: "'Podium Sharp','Impact','Arial Black',sans-serif",
                      fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.15,
                      padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >{link}</motion.a>
                ))}
                <motion.button
                  onClick={() => { setMenuOpen(false); onStart() }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="btn-primary"
                  style={{ marginTop: 32, width: '100%', justifyContent: 'center', fontSize: 15 }}
                >
                  Start Valuation <ArrowUpRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hero Content ────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(80px,10vh,120px) clamp(20px,5vw,80px) clamp(60px,8vh,100px)',
        }}>
          {/* Tagline */}
          <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'clamp(20px,3vh,32px)' }}>
            <Gauge size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(11px,1.2vw,14px)', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              Engineered for Precision
            </span>
          </div>

          {/* Main heading */}
          <div className="animate-fade-up-delay-1" style={{ marginBottom: 'clamp(16px,2.5vh,28px)' }}>
            {['Instant.', 'Accurate.', 'Valuation.'].map((word, i) => (
              <div key={i} className="font-podium" style={{
                fontSize: 'clamp(42px,8.5vw,96px)',
                color: i === 2 ? 'var(--color-primary)' : 'white',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
              }}>{word}</div>
            ))}
          </div>

          {/* Sub-text */}
          <p className="animate-fade-up-delay-2 font-inter" style={{
            color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(14px,1.4vw,17px)',
            lineHeight: 1.7, maxWidth: 480,
            marginBottom: 'clamp(24px,4vh,40px)',
          }}>
            We harness neural networks trained on 40M+ data points
            to get the most accurate real-time market value for any
            vehicle — <strong style={{ color: 'white' }}>in seconds.</strong>
          </p>

          {/* CTA row */}
          <div className="animate-fade-up-delay-3" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'clamp(12px,2vw,24px)', marginBottom: 'clamp(32px,5vh,56px)' }}>
            <button
              onClick={onStart}
              className="group"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'black', color: 'white',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 6, fontSize: 'clamp(10px,1vw,12px)',
                fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: 'clamp(12px,1.5vh,16px) clamp(20px,2vw,28px)',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.boxShadow = '0 0 24px rgba(46,91,255,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'black'; e.currentTarget.style.boxShadow = 'none' }}
            >
              Start Valuation <ArrowUpRight size={14} style={{ transition: 'transform 0.2s' }} />
            </button>

            {/* Award badge (desktop only) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Award size={32} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <div>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Award-Winning</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Engineering</p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up-delay-4" style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px,4vw,56px)', alignItems: 'flex-start' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="font-inter" style={{
                  color: 'white', fontSize: 'clamp(28px,4.5vw,52px)',
                  fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}>{s.value}</span>
                <span style={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: 'clamp(9px,0.9vw,11px)', fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 6,
                }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade to next section */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, zIndex: 4, background: 'linear-gradient(to bottom, transparent, var(--color-bg))' }} />
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — RECENT VALUATIONS
      ══════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p className="label-sm" style={{ color: 'var(--color-primary)', marginBottom: 8 }}>LIVE MARKET DATA</p>
              <h2 className="headline-lg" style={{ color: 'var(--color-on-surface)' }}>Recent Valuations</h2>
            </div>
            <span style={{ color: 'var(--color-tertiary)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowUpRight size={14} />
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {RECENT.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="glass-card-sm card-hover"
                style={{ padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: `linear-gradient(135deg, rgba(${i % 2 === 0 ? '46,91,255' : '123,208,255'},0.25), rgba(5,20,36,0.6))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17l2-6h14l2 6M7 17V11M17 17V11" stroke={i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-tertiary)'} strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="7" cy="19" r="1" fill={i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-tertiary)'}/>
                      <circle cx="17" cy="19" r="1" fill={i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-tertiary)'}/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: 'var(--color-on-surface)' }}>{v.name}</p>
                    <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--color-outline)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{v.status}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, fontVariantNumeric: 'tabular-nums', color: 'var(--color-on-surface)' }}>{v.price}</p>
                  <span style={{ fontSize: 12, fontWeight: 600, color: v.pos ? '#4ade80' : 'var(--color-error)' }}>{v.change}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          SECTION 3 — MARKET INSIGHTS + CTA
      ══════════════════════════════════════════════ */}
      <section style={{ padding: '0 clamp(20px,5vw,80px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'start' }}>

          {/* Insights column */}
          <div>
            <p className="label-sm" style={{ color: 'var(--color-primary)', marginBottom: 8 }}>MARKET INTELLIGENCE</p>
            <h2 className="headline-lg" style={{ color: 'var(--color-on-surface)', marginBottom: 24 }}>Market Insights</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {INSIGHTS.map((ins, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="glass-card-sm card-hover"
                  style={{ padding: '18px 20px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="chip" style={{ fontSize: 10 }}>{ins.tag}</span>
                    <span style={{ fontSize: 12, color: 'var(--color-outline)' }}>{ins.time}</span>
                  </div>
                  <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 15, color: 'var(--color-on-surface)' }}>{ins.headline}</p>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--color-on-surface-var)', lineHeight: 1.6 }}>{ins.teaser}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{ position: 'sticky', top: 100 }}
          >
            <div className="glass-card" style={{ padding: 'clamp(28px,3.5vw,48px)' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'var(--color-primary-container)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
                boxShadow: '0 0 24px rgba(46,91,255,0.4)',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 'clamp(22px,2.5vw,30px)', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: 12 }}>
                Ready to value your car?
              </h3>
              <p style={{ fontSize: 15, color: 'var(--color-on-surface-var)', lineHeight: 1.7, marginBottom: 28 }}>
                It takes less than 60 seconds. Fill in your car's details, and our ML model will return a market-calibrated price estimate instantly.
              </p>
              <motion.button
                onClick={onStart}
                className="btn-primary pulse-glow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '16px 24px' }}
              >
                Start Free Valuation <ArrowUpRight size={18} />
              </motion.button>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-outline-var)', display: 'flex', justifyContent: 'space-around' }}>
                {[{ v: 'Free', l: 'Forever' }, { v: '< 3s', l: 'Result' }, { v: '100%', l: 'Private' }].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>{s.v}</p>
                    <p className="label-sm" style={{ color: 'var(--color-outline)', marginTop: 4 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--color-outline-var)',
        padding: 'clamp(32px,4vw,48px) clamp(20px,5vw,80px)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: 16,
        maxWidth: 1280, margin: '0 auto',
      }}>
        <span className="font-podium" style={{ fontSize: 18, color: 'var(--color-on-surface)', letterSpacing: '0.12em' }}>
          AutoValue <span style={{ color: 'var(--color-primary)' }}>AI</span>
        </span>
        <p style={{ fontSize: 13, color: 'var(--color-outline)', margin: 0 }}>
          A demo ML showcase project · Trained on Quikr used-car data · Prices in INR
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['GitHub', 'LinkedIn', 'InternPe'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: 'var(--color-outline)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--color-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-outline)'}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}

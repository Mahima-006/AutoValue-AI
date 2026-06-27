// Navbar component — shared across all screens
export default function Navbar({ showClose, onClose, modelVersion = '4.2' }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px', position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(5, 20, 36, 0.92)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--color-outline-var)'
    }}>
      {/* Logo + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '8px',
          background: 'var(--color-primary-container)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(46,91,255,0.4)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 17l2-7h14l2 7M7 17V9M17 17V9M12 17v-3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="7" cy="19" r="1.5" fill="white"/>
            <circle cx="17" cy="19" r="1.5" fill="white"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '17px', color: 'var(--color-on-surface)' }}>
          AutoValue <span style={{ color: 'var(--color-primary)' }}>AI</span>
        </span>
      </div>

      {/* Right: version chip or close button */}
      {showClose ? (
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: 'var(--color-on-surface-var)',
          cursor: 'pointer', padding: '4px', fontSize: '20px', lineHeight: 1,
        }}>✕</button>
      ) : (
        <div className="chip" style={{ fontSize: '11px', padding: '4px 8px' }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#4ade80', display: 'inline-block', marginRight: 4,
            boxShadow: '0 0 6px #4ade80'
          }} />
          Live Model v{modelVersion}
        </div>
      )}
    </nav>
  )
}

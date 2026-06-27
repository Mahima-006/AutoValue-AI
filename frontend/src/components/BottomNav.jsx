// Bottom navigation bar
export default function BottomNav({ active = 'estimate' }) {
  const tabs = [
    {
      id: 'estimate', label: 'Estimate',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 17l2-7h14l2 7M7 17V9M17 17V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="7" cy="19" r="1.5" fill="currentColor"/>
        <circle cx="17" cy="19" r="1.5" fill="currentColor"/>
      </svg>
    },
    {
      id: 'insights', label: 'Insights',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 20h18M5 20V12M10 20V8M15 20V4M20 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    },
    {
      id: 'saved', label: 'Saved',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    },
  ]

  return (
    <div className="bottom-nav">
      {tabs.map(tab => (
        <button key={tab.id} className={`bottom-nav-item ${active === tab.id ? 'active' : ''}`}>
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

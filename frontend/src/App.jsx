import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Step1 from './pages/Step1'
import Step2 from './pages/Step2'
import Step3 from './pages/Step3'
import Results from './pages/Results'
import './index.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [formData, setFormData] = useState({
    company: '', year: '', name: '', kms_driven: 45000,
    fuel_type: 'Petrol', condition: 'Good', features: [], location: ''
  })
  const [prediction, setPrediction] = useState(null)
  const [direction, setDirection] = useState(1) // 1=forward, -1=back

  const go = (to, dir = 1) => {
    setDirection(dir)
    setScreen(to)
  }

  const updateForm = (fields) => setFormData(prev => ({ ...prev, ...fields }))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <AnimatePresence mode="wait" custom={direction}>
        {screen === 'home' && (
          <Home key="home" onStart={() => go('step1')} />
        )}
        {screen === 'step1' && (
          <Step1 key="step1" data={formData} update={updateForm}
            onNext={() => go('step2')} onBack={() => go('home', -1)} />
        )}
        {screen === 'step2' && (
          <Step2 key="step2" data={formData} update={updateForm}
            onNext={() => go('step3')} onBack={() => go('step1', -1)} />
        )}
        {screen === 'step3' && (
          <Step3 key="step3" data={formData} update={updateForm}
            onSubmit={(result) => { setPrediction(result); go('results') }}
            onBack={() => go('step2', -1)} />
        )}
        {screen === 'results' && (
          <Results key="results" prediction={prediction} formData={formData}
            onRefine={() => go('step1', -1)} />
        )}
      </AnimatePresence>
    </div>
  )
}

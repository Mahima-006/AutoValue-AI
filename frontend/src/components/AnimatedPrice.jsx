import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

// Animated count-up number component
export default function AnimatedPrice({ value, prefix = '₹', duration = 1.8 }) {
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return controls.stop
  }, [value])

  const formatted = display.toLocaleString('en-IN')

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{formatted}
    </span>
  )
}

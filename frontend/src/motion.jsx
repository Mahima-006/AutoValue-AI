import { motion } from 'framer-motion'

// Shared slide-and-fade page transition variants
export const pageVariants = {
  initial: (dir) => ({
    x: dir > 0 ? '60px' : '-60px',
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
  exit: (dir) => ({
    x: dir > 0 ? '-60px' : '60px',
    opacity: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  }),
}

// Stagger container for child cards/items
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}

export const fadeSlideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
}

// Reusable animated page wrapper
export function PageWrapper({ children, custom }) {
  return (
    <motion.div
      custom={custom}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      {children}
    </motion.div>
  )
}

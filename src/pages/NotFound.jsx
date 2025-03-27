import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home as HomeIcon } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="text-9xl font-bold text-primary-light mb-4">404</div>
        
        <h1 className="text-3xl font-bold mb-4 text-surface-800 dark:text-surface-100">
          Page Not Found
        </h1>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors"
        >
          <HomeIcon size={18} />
          Back to Calculator
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
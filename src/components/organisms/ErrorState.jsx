import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error" />
      </motion.div>
      <h3 className="mt-4 text-lg font-heading font-semibold text-gray-900">
        Oops! Something went wrong
      </h3>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        {message}
      </p>
      {onRetry && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <Button onClick={onRetry} icon="RefreshCw">
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ErrorState
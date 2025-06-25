import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const TaskHeader = ({ 
  selectedCategory, 
  categories, 
  taskStats,
  className = '' 
}) => {
  const getCategoryName = () => {
    if (selectedCategory === null) return 'All Tasks'
    const category = categories.find(c => c.Id === selectedCategory)
    return category ? category.name : 'All Tasks'
  }

  const getCategoryColor = () => {
    if (selectedCategory === null) return '#5B4FE5'
    const category = categories.find(c => c.Id === selectedCategory)
    return category ? category.color : '#5B4FE5'
  }

  const completionPercentage = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100)
    : 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-6 border border-gray-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-3 h-8 rounded-full"
            style={{ backgroundColor: getCategoryColor() }}
          />
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              {getCategoryName()}
            </h1>
            <p className="text-gray-600 mt-1">
              {taskStats.total} total • {taskStats.active} active • {taskStats.completed} completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Completion Progress */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="2"
                />
                <motion.path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={getCategoryColor()}
                  strokeWidth="2"
                  strokeDasharray="100, 100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - completionPercentage }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-900">
                  {completionPercentage}%
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Progress
            </div>
          </div>

          {/* Tasks Completed Today */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-accent">
              {taskStats.completedToday || 0}
            </div>
            <div className="text-sm text-gray-600">
              Done Today
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { label: 'High Priority', value: taskStats.highPriority || 0, color: 'text-error' },
          { label: 'Due Today', value: taskStats.dueToday || 0, color: 'text-warning' },
          { label: 'Overdue', value: taskStats.overdue || 0, color: 'text-error' },
          { label: 'This Week', value: taskStats.thisWeek || 0, color: 'text-info' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="text-center p-3 rounded-lg bg-gray-50"
          >
            <div className={`text-lg font-semibold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default TaskHeader
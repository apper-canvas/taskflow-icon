import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const FilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  priorityFilter, 
  onPriorityFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ]

  const hasActiveFilters = priorityFilter !== 'all' || statusFilter !== 'all' || searchQuery

  return (
    <motion.div 
      layout
      className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            icon="Search"
          />
        </div>
        
        <Button
          variant="ghost"
          icon={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Filters
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            icon="X"
            onClick={onClearFilters}
            className="text-error hover:text-error"
          >
            Clear
          </Button>
        )}
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="pt-4 flex flex-wrap gap-4">
          {/* Priority Filter */}
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Active Filter Pills */}
      {(priorityFilter !== 'all' || statusFilter !== 'all') && (
        <div className="mt-3 flex flex-wrap gap-2">
          {priorityFilter !== 'all' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              <span>Priority: {priorityFilter}</span>
              <button
                onClick={() => onPriorityFilterChange('all')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <ApperIcon name="X" className="w-3 h-3" />
              </button>
            </motion.div>
          )}
          
          {statusFilter !== 'all' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
            >
              <span>Status: {statusFilter}</span>
              <button
                onClick={() => onStatusFilterChange('all')}
                className="hover:bg-secondary/20 rounded-full p-0.5"
              >
                <ApperIcon name="X" className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default FilterBar
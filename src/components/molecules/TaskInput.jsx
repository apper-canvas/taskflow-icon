import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const TaskInput = ({ onAddTask, categories, selectedCategory, className = '' }) => {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [categoryId, setCategoryId] = useState(selectedCategory || '')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (title.trim()) {
      await onAddTask({
        title: title.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        categoryId: categoryId || (categories.length > 0 ? categories[0].Id : null)
      })
      setTitle('')
      setDueDate('')
      setIsExpanded(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setIsExpanded(false)
      setTitle('')
    }
  }

  const quickDateOptions = [
    { label: 'Today', value: new Date().toISOString().split('T')[0] },
    { label: 'Tomorrow', value: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
    { label: 'Next Week', value: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] }
  ]

  return (
    <motion.div 
      layout
      className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              placeholder="Add a new task..."
              icon="Plus"
              className="w-full"
            />
          </div>
          
          <Button type="submit" disabled={!title.trim()}>
            Add
          </Button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pt-4 space-y-4">
            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'high', label: 'High', color: 'bg-error' },
                  { value: 'medium', label: 'Medium', color: 'bg-warning' },
                  { value: 'low', label: 'Low', color: 'bg-info' }
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPriority(option.value)}
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium transition-colors
                      ${priority === option.value 
                        ? `${option.color} text-white` 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {categories.map((category) => (
                    <option key={category.Id} value={category.Id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <div className="flex gap-2 mb-2">
                {quickDateOptions.map((option) => (
                  <motion.button
                    key={option.label}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDueDate(option.value)}
                    className={`
                      px-3 py-1 rounded-full text-sm transition-colors
                      ${dueDate === option.value 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim()}>
                Add Task
              </Button>
            </div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default TaskInput
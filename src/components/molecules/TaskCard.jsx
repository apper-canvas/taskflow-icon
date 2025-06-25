import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const TaskCard = ({ 
  task, 
  category, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  onUpdate,
  className = '' 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleToggleComplete = async () => {
    if (!task.completed) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1000)
    }
    await onToggleComplete(task.Id, !task.completed)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (editTitle.trim() && editTitle !== task.title) {
      await onUpdate(task.Id, { title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const getDueDateDisplay = () => {
    if (!task.dueDate) return null
    
    const dueDate = new Date(task.dueDate)
    const isOverdue = isPast(dueDate) && !isToday(dueDate)
    
    let dateText = format(dueDate, 'MMM d')
    if (isToday(dueDate)) dateText = 'Today'
    else if (isTomorrow(dueDate)) dateText = 'Tomorrow'
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${
        isOverdue 
          ? 'bg-error/10 text-error' 
          : isToday(dueDate) 
            ? 'bg-accent/10 text-accent' 
            : 'bg-gray-100 text-gray-600'
      }`}>
        {dateText}
      </span>
    )
  }

  const priorityColors = {
    high: 'border-l-error',
    medium: 'border-l-warning', 
    low: 'border-l-info'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      className={`
        relative bg-white rounded-xl p-4 border-l-4 transition-all duration-200
        ${priorityColors[task.priority]}
        ${task.completed ? 'opacity-60' : ''}
        ${className}
      `}
    >
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0, 
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  rotate: 0 
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 1,
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  rotate: 360 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="absolute w-2 h-2 bg-accent rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
          />
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full px-2 py-1 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
          ) : (
            <h3 
              className={`font-medium text-gray-900 cursor-pointer hover:text-primary transition-colors ${
                task.completed ? 'line-through' : ''
              }`}
              onClick={handleEdit}
            >
              {task.title}
            </h3>
          )}

          <div className="flex items-center gap-2 mt-2">
            {category && (
              <Badge variant="default" size="small">
                <div 
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </Badge>
            )}
            
            <Badge variant={task.priority} size="small">
              {task.priority}
            </Badge>

            {getDueDateDisplay()}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEdit}
            className="p-1 text-gray-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.Id)}
            className="p-1 text-gray-400 hover:text-error transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard
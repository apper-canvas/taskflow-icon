import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import TaskCard from "@/components/molecules/TaskCard";
import ApperIcon from "@/components/ApperIcon";

const TaskList = ({ 
  tasks, 
  categories, 
  onUpdateTask, 
  onDeleteTask,
  searchQuery = '',
  priorityFilter = 'all',
  statusFilter = 'all',
  className = '' 
}) => {
  const [optimisticTasks, setOptimisticTasks] = useState(tasks)

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    let filtered = optimisticTasks

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => 
        statusFilter === 'completed' ? task.completed : !task.completed
      )
    }

    // Sort by order, then by completion status
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      return a.order - b.order
    })
  }, [optimisticTasks, searchQuery, priorityFilter, statusFilter])

  const handleToggleComplete = async (taskId, completed) => {
    // Optimistic update
    setOptimisticTasks(prev => 
      prev.map(task => 
        task.Id === taskId ? { ...task, completed } : task
      )
    )

    try {
      await onUpdateTask(taskId, { completed })
      toast.success(completed ? 'Task completed!' : 'Task reopened')
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticTasks(prev => 
        prev.map(task => 
          task.Id === taskId ? { ...task, completed: !completed } : task
        )
      )
      toast.error('Failed to update task')
    }
  }

  const handleUpdateTask = async (taskId, updates) => {
    // Optimistic update
    setOptimisticTasks(prev => 
      prev.map(task => 
        task.Id === taskId ? { ...task, ...updates } : task
      )
    )

    try {
      await onUpdateTask(taskId, updates)
      toast.success('Task updated')
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticTasks(tasks)
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    // Optimistic update
    setOptimisticTasks(prev => prev.filter(task => task.Id !== taskId))

    try {
      await onDeleteTask(taskId)
      toast.success('Task deleted')
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticTasks(tasks)
      toast.error('Failed to delete task')
    }
  }

  // Update optimistic tasks when props change
  React.useEffect(() => {
    setOptimisticTasks(tasks)
  }, [tasks])

  if (filteredTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col items-center justify-center py-12 ${className}`}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300" />
        </motion.div>
        <h3 className="mt-4 text-lg font-heading font-semibold text-gray-900">
          {searchQuery || priorityFilter !== 'all' || statusFilter !== 'all' 
            ? 'No tasks match your filters' 
            : 'No tasks yet'
          }
        </h3>
        <p className="mt-2 text-gray-600 text-center max-w-md">
          {searchQuery || priorityFilter !== 'all' || statusFilter !== 'all'
            ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
            : 'Get started by adding your first task. Break down your goals into manageable steps!'
          }
        </p>
      </motion.div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task, index) => {
          const category = categories.find(c => c.Id === task.categoryId)
          
          return (
            <motion.div
              key={task.Id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.2,
                delay: index * 0.05,
                layout: { duration: 0.3 }
              }}
            >
              <TaskCard
                task={task}
                category={category}
                onToggleComplete={handleToggleComplete}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default TaskList
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { isPast, isThisWeek, isToday, parseISO } from "date-fns";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import CategorySidebar from "@/components/molecules/CategorySidebar";
import TaskInput from "@/components/molecules/TaskInput";
import FilterBar from "@/components/molecules/FilterBar";
import TaskHeader from "@/components/organisms/TaskHeader";
import TaskList from "@/components/organisms/TaskList";
import SkeletonLoader from "@/components/organisms/SkeletonLoader";
import ErrorState from "@/components/organisms/ErrorState";
import Icon from "@/components/atoms/Icon";



const TaskManager = () => {
  // Data states
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // UI states
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Load initial data
  useEffect(() => {
    loadData()
    
    // Handle mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Task operations
  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [...prev, newTask])
      toast.success('Task added successfully!')
    } catch (err) {
      toast.error('Failed to add task')
    }
  }

  const handleUpdateTask = async (taskId, updateData) => {
    try {
      const updatedTask = await taskService.update(taskId, updateData)
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ))
    } catch (err) {
      toast.error('Failed to update task')
      throw err // Re-throw for optimistic update handling
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
    } catch (err) {
      toast.error('Failed to delete task')
      throw err // Re-throw for optimistic update handling
    }
  }

  // Category operations
  const handleAddCategory = async (categoryData) => {
    try {
      const newCategory = await categoryService.create(categoryData)
      setCategories(prev => [...prev, newCategory])
      toast.success('Category added successfully!')
    } catch (err) {
      toast.error('Failed to add category')
    }
  }

  // Filter operations
  const handleClearFilters = () => {
    setSearchQuery('')
    setPriorityFilter('all')
    setStatusFilter('all')
  }

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const filteredTasks = selectedCategory 
      ? tasks.filter(task => task.categoryId === selectedCategory)
      : tasks

    const total = filteredTasks.length
    const completed = filteredTasks.filter(task => task.completed).length
    const active = total - completed
    
    const completedToday = filteredTasks.filter(task => 
      task.completed && task.updatedAt && isToday(parseISO(task.updatedAt))
    ).length

    const highPriority = filteredTasks.filter(task => 
      task.priority === 'high' && !task.completed
    ).length

    const dueToday = filteredTasks.filter(task => 
      task.dueDate && !task.completed && isToday(parseISO(task.dueDate))
    ).length

    const overdue = filteredTasks.filter(task => 
      task.dueDate && !task.completed && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate))
    ).length

    const thisWeek = filteredTasks.filter(task => 
      task.dueDate && !task.completed && isThisWeek(parseISO(task.dueDate))
    ).length

    return {
      total,
      completed,
      active,
      completedToday,
      highPriority,
      dueToday,
      overdue,
      thisWeek
    }
  }, [tasks, selectedCategory])

  // Calculate task counts by category
  const taskCounts = useMemo(() => {
    const counts = {}
    categories.forEach(category => {
      counts[category.Id] = tasks.filter(task => 
        task.categoryId === category.Id && !task.completed
      ).length
    })
    return counts
  }, [tasks, categories])

  // Filter tasks for display
  const displayTasks = useMemo(() => {
    return selectedCategory 
      ? tasks.filter(task => task.categoryId === selectedCategory)
      : tasks
  }, [tasks, selectedCategory])

  if (loading) {
    return (
      <div className="h-screen flex bg-background">
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-white rounded-xl"></div>
              <div className="h-20 bg-white rounded-xl"></div>
              <div className="h-16 bg-white rounded-xl"></div>
              <SkeletonLoader count={5} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={isMobile ? { x: -300 } : { x: 0 }}
        animate={isMobile ? { x: sidebarOpen ? 0 : -300 } : { x: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`
          ${isMobile ? 'fixed z-50' : 'static'} 
          h-full
        `}
      >
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddCategory={handleAddCategory}
          taskCounts={taskCounts}
        />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
<button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Icon name="Menu" className="w-6 h-6" />
            </button>
            <h1 className="font-heading font-bold text-gray-900">TaskFlow</h1>
            <div className="w-10"></div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <TaskHeader
              selectedCategory={selectedCategory}
              categories={categories}
              taskStats={taskStats}
            />

            {/* Task Input */}
            <TaskInput
              onAddTask={handleAddTask}
              categories={categories}
              selectedCategory={selectedCategory}
            />

            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onClearFilters={handleClearFilters}
            />

            {/* Task List */}
            <TaskList
              tasks={displayTasks}
              categories={categories}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              searchQuery={searchQuery}
              priorityFilter={priorityFilter}
              statusFilter={statusFilter}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskManager
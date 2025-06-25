import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onAddCategory,
  taskCounts = {},
  className = '' 
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#5B4FE5')

  const predefinedColors = [
    '#5B4FE5', '#10B981', '#FFAB00', '#EF4444', 
    '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'
  ]

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      await onAddCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor
      })
      setNewCategoryName('')
      setNewCategoryColor('#5B4FE5')
      setIsAddingCategory(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddCategory()
    } else if (e.key === 'Escape') {
      setIsAddingCategory(false)
      setNewCategoryName('')
    }
  }

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`w-64 bg-white border-r border-gray-200 flex flex-col ${className}`}
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-heading font-semibold text-gray-900">
          Categories
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* All Tasks */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectCategory(null)}
          className={`
            w-full flex items-center justify-between p-3 rounded-lg mb-2 text-left transition-colors
            ${selectedCategory === null 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-gray-50 text-gray-700'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <ApperIcon name="Inbox" className="w-5 h-5" />
            <span className="font-medium">All Tasks</span>
          </div>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
            {Object.values(taskCounts).reduce((sum, count) => sum + count, 0)}
          </span>
        </motion.button>

        {/* Category List */}
        <div className="space-y-1">
          {categories.map((category) => (
            <motion.button
              key={category.Id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(category.Id)}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors
                ${selectedCategory === category.Id 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-gray-50 text-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                {taskCounts[category.Id] || 0}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Add Category */}
        <AnimatePresence>
          {isAddingCategory ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50"
            >
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Category name"
                className="mb-3"
                autoFocus
              />
              
              <div className="flex gap-2 mb-3">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      newCategoryColor === color ? 'border-gray-600' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="small" onClick={handleAddCategory}>
                  Add
                </Button>
                <Button 
                  size="small" 
                  variant="ghost" 
                  onClick={() => setIsAddingCategory(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <Button
                variant="ghost"
                size="small"
                icon="Plus"
                onClick={() => setIsAddingCategory(true)}
                className="w-full justify-start"
              >
                Add Category
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default CategorySidebar
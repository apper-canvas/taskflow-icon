import { mockCategories } from '../mockData/categories.json'
import { delay } from '@/utils/delay'

let categories = [...mockCategories]

export const categoryService = {
  async getAll() {
    await delay(250)
    return [...categories]
  },

  async getById(id) {
    await delay(200)
    const category = categories.find(c => c.Id === parseInt(id, 10))
    if (!category) {
      throw new Error('Category not found')
    }
    return { ...category }
  },

  async create(categoryData) {
    await delay(300)
    const newCategory = {
      ...categoryData,
      Id: Math.max(...categories.map(c => c.Id), 0) + 1,
      order: categories.length
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async update(id, updateData) {
    await delay(250)
    const index = categories.findIndex(c => c.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    const updatedCategory = { 
      ...categories[index], 
      ...updateData,
      Id: categories[index].Id // Prevent ID modification
    }
    categories[index] = updatedCategory
    return { ...updatedCategory }
  },

  async delete(id) {
    await delay(300)
    const index = categories.findIndex(c => c.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    const deletedCategory = categories[index]
    categories.splice(index, 1)
    return { ...deletedCategory }
  }
}
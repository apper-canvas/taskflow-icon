import { mockTasks } from '../mockData/tasks.json'
import { delay } from '@/utils/delay'

let tasks = [...mockTasks]

export const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.Id === parseInt(id, 10))
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  },

  async create(taskData) {
    await delay(400)
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      completed: false,
      order: tasks.length
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updateData) {
    await delay(300)
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const updatedTask = { 
      ...tasks[index], 
      ...updateData,
      Id: tasks[index].Id // Prevent ID modification
    }
    tasks[index] = updatedTask
    return { ...updatedTask }
  },

  async delete(id) {
    await delay(300)
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const deletedTask = tasks[index]
    tasks.splice(index, 1)
    return { ...deletedTask }
  },

  async reorder(taskId, newOrder) {
    await delay(200)
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(taskId, 10))
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    tasks[taskIndex].order = newOrder
    return { ...tasks[taskIndex] }
  }
}
import TaskManager from '@/components/pages/TaskManager'

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/',
    icon: 'CheckSquare',
    component: TaskManager
  }
}

export const routeArray = Object.values(routes)
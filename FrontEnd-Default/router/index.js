import { createRouter, createWebHistory } from 'vue-router'
import Task from '@/components/Task.vue'
import TaskDetail from '@/TaskDetail.vue'
import AddTaskDetail from '@/AddTaskDetail.vue'
import EditTaskDetail from '@/components/EditTaskDetail.vue'
const history = createWebHistory()
const routes = [
  {
    path: '/',
    redirect: '/task'
  },
  {
    path: '/task',
    name: 'Task',
    component: Task,
    children: [
      {
        path: ':id',
        component: TaskDetail,
        name: 'TaskDetail'
      },
      {
        path: 'add',
        component: AddTaskDetail,
        name: 'AddTaskDetail'
      },
      {
        path: ':id/edit',
        component: EditTaskDetail,
        name: 'EditTaskDetail'
      }
    ]
  }
]

const router = createRouter({
  history,
  routes
})

export default router

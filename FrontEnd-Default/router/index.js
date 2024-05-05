import { createRouter, createWebHistory } from 'vue-router'
import Task from '@/components/Task.vue'
import TaskDetail from '@/TaskDetail.vue'
import DeleteTaskDetail from '@/DeletePopUp.vue'
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
        component: TaskDetail,
        name: 'AddTaskDetail'
      },
      {
        path: ':id/edit',
        component: TaskDetail,
        name: 'EditTaskDetail'
      },
      {
        path: ':id/delete',
        component: DeleteTaskDetail,
        name: 'DeleteTaskDetail'
      }
    ]
  }
]

const router = createRouter({
  history,
  routes
})

export default router

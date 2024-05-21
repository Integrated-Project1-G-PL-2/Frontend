import { createRouter, createWebHistory } from 'vue-router'
import Task from '@/components/Task.vue'
import TaskDetail from '@/TaskDetail.vue'
import DeleteTaskDetail from '@/DeletePopUp.vue'
import StatusesList from '@/components/StatusesList.vue'
import StatusPopUp from '@/components/StatusPopUp.vue'
import DeleteStatus from '@/components/DeleteStatus.vue'
const history = createWebHistory(import.meta.env.BASE_URL)
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
  },
  {
    path: '/status',
    name: 'StatusList',
    component: StatusesList,
    children: [
      {
        path: 'add',
        component: StatusPopUp,
        name: 'StatusAdd'
      },
      {
        path: ':id/delete',
        component: DeleteStatus,
        name: 'DeleteStatus'
      }
      ,
      {
        path: ':id/edit',
        component: StatusPopUp,
        name: 'StatusEdit'
      }
    ]
  }
]

const router = createRouter({
  history,
  routes
})

export default router

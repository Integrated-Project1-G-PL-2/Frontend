import { createRouter, createWebHistory } from 'vue-router'
import Task from '@/components/Task.vue'
import TaskDetail from '@/components/TaskDetail.vue'
import DeleteTaskDetail from '@/components/DeletePopUp.vue'
import StatusesList from '@/components/StatusesList.vue'
import StatusPopUp from '@/components/StatusPopUp.vue'
import DeleteStatus from '@/components/DeleteStatus.vue'
import LoginPage from '@/components/LoginPage.vue'
import BoardList from '@/components/BoardList.vue'
import AddNewBoard from '@/components/AddNewBoard.vue'
const history = createWebHistory(import.meta.env.BASE_URL)
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/board',
    name: 'Board',
    component: BoardList,
    // children: [
    //       {
    //         path: 'id',
    //         name: 'Task',
    //         component: Task
    //       }
    // ]
  },
  {
    path: '/board/id',
    name: 'Task',
    component: Task,
    children: [
      {
        path: '/board/id/task/add',
        name: 'AddTaskDetail',
        component: TaskDetail
      },
      {
        path: '/board/id/task/:id',
        name: 'TaskDetail',
        component: TaskDetail
      },
      {
        path: '/board/id/task/:id/edit',
        name: 'EditTaskDetail',
        component: TaskDetail
      },
      {
        path: '/board/id/task/:id/delete',
        name: 'DeleteTaskDetail',
        component: DeleteTaskDetail
      }
    ]
  },
 


  // },
  // {
  //   path: '/task',
  //   name: 'Task',
  //   component: Task,
  //   children: [
  //     {
  //       path: ':id',
  //       component: TaskDetail,
  //       name: 'TaskDetail'
  //     },
  //     {
  //       path: 'add',
  //       component: TaskDetail,
  //       name: 'AddTaskDetail'
  //     },
  //     {
  //       path: ':id/edit',
  //       component: TaskDetail,
  //       name: 'EditTaskDetail'
  //     },
  //     {
  //       path: ':id/delete',
  //       component: DeleteTaskDetail,
  //       name: 'DeleteTaskDetail'
  //     }
  //   ]
  // },
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
      },
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

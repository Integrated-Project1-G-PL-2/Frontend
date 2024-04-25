import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Task from './components/Task.vue'
import TaskDetail from './TaskDetail.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/task' },
    {
      path: '/task',
      component: Task
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
// createApp(App).mount('#app')

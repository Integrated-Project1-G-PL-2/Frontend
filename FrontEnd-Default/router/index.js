import { createRouter, createWebHistory } from "vue-router";
import Task from "@/components/Task.vue";
import TaskDetail from "@/TaskDetail.vue";
const history = createWebHistory();
const routes = [
  {
    path: "/",
    redirect: "/task",
  },
  {
    path: "/task",
    name: "Task",
    component: Task,
    children: [
      {
        path: ":id",
        component: TaskDetail,
        name: "TaskDetail",
      },
    ],
  },
];

const router = createRouter({
  history,
  routes,
});

export default router;

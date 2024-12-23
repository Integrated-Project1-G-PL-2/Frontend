import { createRouter, createWebHistory } from "vue-router";
import Task from "@/components/Task.vue";
import TaskDetail from "@/components/TaskDetail.vue";
import DeleteTaskDetail from "@/components/DeletePopUp.vue";
import StatusesList from "@/components/StatusesList.vue";
import StatusPopUp from "@/components/StatusPopUp.vue";
import DeleteStatus from "@/components/DeleteStatus.vue";
import LoginPage from "@/components/LoginPage.vue";
import BoardList from "@/components/BoardList.vue";
import AddNewBoard from "@/components/AddNewBoard.vue";
import CollaboratorManagement from "@/components/CollaboratorManagement.vue";
import CollabAddInvitation from "@/components/CollabAddInvitation.vue";
import AttachmentsDetail from "@/components/AttachmentsDetail.vue";
import DeleteAttachment from "@/components/DeleteAttachment.vue";
import LoginMicrosoftPage from "@/components/LoginMicrosoftPage.vue";
import CallBackPage from "@/components/CallBackPage.vue";
const history = createWebHistory(import.meta.env.BASE_URL);
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/login/microsoft",
    name: "LoginWithMicrosoft",
    component: LoginMicrosoftPage,
  },
  {
    path: "/board",
    name: "Board",
    component: BoardList,
    children: [
      {
        path: "/board/add",
        name: "AddNewBoard",
        component: AddNewBoard,
      },
    ],
  },
  {
    path: "/board/:id",
    name: "Task",
    component: Task,
    children: [
      {
        path: "/board/:id/task/add",
        name: "AddTaskDetail",
        component: TaskDetail,
      },
      {
        path: "/board/:id/task/:tid/edit/attachment/add",
        name: "AddAttachmentsDetail",
        component: AttachmentsDetail,
      },
      {
        path: "/board/:id/task/:tid/edit/attachment/delete",
        name: "DeleteAttachmentsDetail",
        component: DeleteAttachment,
      },
      {
        path: "/board/:id/task/:tid",
        name: "DetailTask",
        component: TaskDetail,
      },
      {
        path: "/board/:id/task/:tid/edit",
        name: "EditTaskDetail",
        component: TaskDetail,
      },
      {
        path: "/board/:id/task/:tid/delete",
        name: "DeleteTaskDetail",
        component: DeleteTaskDetail,
      },
    ],
  },

  {
    path: "/board/:id/status",
    name: "StatusList",
    component: StatusesList,
    children: [
      {
        path: "/board/:id/status/add",
        component: StatusPopUp,
        name: "StatusAdd",
      },
      {
        path: "/board/:id/status/:sid/delete",
        component: DeleteStatus,
        name: "DeleteStatus",
      },
      {
        path: "/board/:id/status/:sid/edit",
        component: StatusPopUp,
        name: "StatusEdit",
      },
    ],
  },
  {
    path: "/board/:id/collab",
    name: "CollabList",
    component: CollaboratorManagement,
  },
  {
    path: "/board/:id/collab/invitations",
    component: CollabAddInvitation,
    name: "AddInvitation",
  },
  {
    path: "/callback/login",
    component: CallBackPage,
  },
];

const router = createRouter({
  history,
  routes,
});

export default router;

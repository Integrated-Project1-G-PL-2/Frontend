<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem
} from '../utils/fetchUtils.js'
import TaskManager from '../utils/TaskManager.js'
import TaskDetail from '@/TaskDetail.vue'
import { useRoute, useRouter } from 'vue-router'
import DeletePopUp from '@/DeletePopUp.vue'
import AlertPopUp from './../components/AlertPopUp.vue'

const router = useRouter()
const route = useRoute()
const showTaskDetailModal = ref(false)
const taskManager = TaskManager
const taskDetail = reactive({})
const showDeleteTaskDetail = ref(false)
const operation = ref('')
const showTitle = ref('')
const greenPopup = reactive({
  add : {state : false , taskTitle : ''},
  edit : {state : false , taskTitle : ''},
  delete : {state : false , taskTitle : ''},
})
const redPopup = reactive({
  edit : {state : false , taskTitle : ''},
  delete : {state : false , taskTitle : ''},
})

onMounted(async () => {
  taskManager.setTasks(await getItems(import.meta.env.VITE_BASE_URL))
})
const showTaskDetail = async function (id, operate) {
  router.push({ name: 'TaskDetail', params: { id: id } })
  operation.value = operate
  taskDetail.value = await getItemById(import.meta.env.VITE_BASE_URL, id)
  if (taskDetail.value.status == '404') {
    alert('The requested task does not exist')
    router.replace({ name: 'Task' })
    return
  }
  showTaskDetailModal.value = true
}

const showEditTaskDetail = async function (id, operate) {
  router.push({ name: 'EditTaskDetail', params: { id: id } })
  operation.value = operate
  taskDetail.value = await getItemById(import.meta.env.VITE_BASE_URL, id)
  if (taskDetail.value.status == '404') {
    alert('The requested task does not exist')
    router.replace({ name: 'Task' })
    return
  }
  showTaskDetailModal.value = true
}
if (route.params.id) {
  showTaskDetail(route.params.id, 'show')
}
const showAddPopUpTaskDetail = function (operate) {
  router.replace({ name: 'AddTaskDetail' })
  operation.value = operate
  showTaskDetailModal.value = true
}
const showDeletePopUpTaskDetail = function (obj) {
  router.push({ name: 'DeleteTaskDetail', params: { id: obj.id } })
  taskDetail.value = {id: obj.id, taskTitle : obj.taskTitle}
  showDeleteTaskDetail.value = true
}

const clearDeletePopUp = async function () {
  router.push({ name: 'Task' })
  showDeleteTaskDetail.value = false
}


const showDelComplete = async function () {
  router.push({ name: 'Task' })
  showDeleteTaskDetail.value = false
  greenPopup.delete.state = true
}

const openRedPopup = async function (obj) {
  redPopup[obj.operate].state = true
  redPopup[obj.operate].taskTitle = obj.taskTitle
}

const openGreenPopup = async function (obj) {
  greenPopup[obj.operate].state = true
  greenPopup[obj.operate].taskTitle = obj.taskTitle
}

const closeRedPopup = async function (operate) {
  router.push({ name: 'Task' })
  redPopup[operate].state = false;
}

const closeGreenPopup = async function (operate) {
  router.push({ name: 'Task' })
  greenPopup[operate].state = false

}
</script>

<template>
  <div class="bg-white relative border rounded-lg overflow-auto">
    <h1 class="font-bold text-center">IT-Bangmod Kradan Kanban</h1>
    <AlertPopUp
      v-if="greenPopup.add.state"
      :titles="'The task ' + greenPopup.add.taskTitle + ' has been successfully added.'"
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :operate="'add'"
    />
    <AlertPopUp
      v-if="redPopup.delete.state"
      :titles="
        'An error has occurred, the task ' + redPopup.delete.taskTitle + ' does not exist.'
      "
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
      :operate="'delete'"
    />
    <AlertPopUp
      v-if="greenPopup.delete.state"
      :titles="'The task ' + greenPopup.delete.taskTitle + ' has been deleted.'"
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :operate="'delete'"
    />
    <AlertPopUp
      v-if="greenPopup.edit.state"
      :titles="'The task ' + greenPopup.edit.taskTitle + ' has been updated.'"
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :operate="'edit'"
    />
    <AlertPopUp
      v-if="redPopup.edit.state"
      :titles="'An error occurred editting the task.' + redPopup.edit.taskTitle"
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
      :operate="'edit'"
    />
    <div class="flex justify-end">
      <button
        @click="showAddPopUpTaskDetail('add')"
        class="itbkk-button-add bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-3 mt-2"
      >
        ✚ Add New Task
      </button>
    </div>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th class="px-4 py-3"></th>
          <th class="px-4 py-3">Title</th>
          <th class="px-4 py-3">Assignees</th>
          <th class="px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(task,index) in taskManager.getTasks()"
          :key="task.id"
          class="itbkk-item border-b cursor-pointer"
        >
          <td class="px-4 py-3">
            {{ index + 1 }}
            <div
              class="inline-flex"
              @click="showEditTaskDetail(task.id, 'edit')"
            >
              ⚙️
            </div>
            <div
              class="inline-flex"
              @click="showDeletePopUpTaskDetail({id : index + 1, taskTitle : task.title})"
            >
              🗑️
            </div>
          </td>
          <td class="itbkk-title px-4 py-3">
            <div
              class="hover:text-sky-500"
              @click="showTaskDetail(task.id, 'show')"
            >
              {{ task.title }}
            </div>
          </td>
          <td
            class="itbkk-assignees px-4 py-3"
            :class="task.assignees == null ? 'italic' : ''"
          >
            {{ task.assignees == null ? 'Unassigned' : task.assignees }}
          </td>
          <td class="itbkk-status px-4 py-3">
            <div
              class="w-full bg-emerald-500 flex justify-center rounded-md"
              :style="{
                backgroundColor:
                  task.status === 'To Do'
                    ? '#FFC0CB'
                    : task.status === 'Doing'
                    ? '#ffff99'
                    : task.status === 'No Status' || 'NO_STATUS'
                    ? 'lightgray'
                    : '#90EE90'
              }"
            >
              <p>{{ task.status }}</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <teleport to="body" v-if="showTaskDetailModal">
    <TaskDetail
      :taskDetail="taskDetail"
      @showTaskDetailModal="showTaskDetailModal = false"
      :operate="operation"
      @showRedPopup="openRedPopup"
      @showGreenPopup="openGreenPopup"
    ></TaskDetail>
  </teleport>
  <teleport to="body" v-if="showDeleteTaskDetail">
    <DeletePopUp
      @cancelDetail="clearDeletePopUp"
      @confirmDetail="showDelComplete"
      @redAlert="openRedPopup"
      :taskId="taskDetail"
    >
    </DeletePopUp>
  </teleport>
</template>
<style scoped></style>

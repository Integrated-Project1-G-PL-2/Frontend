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
const Id = ref('')
const showDEGTitle = ref('')
const showDERTitle = ref('')
const showEDRTitle = ref('')
const showEDGTitle = ref('')

const greenPopup = reactive({
  add : false,
  edit : false,
  delete : false,
})
const redPopup = reactive({
  edit : false,
  delete : false,
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
  router.push({ name: 'AddTaskDetail' })
  operation.value = operate
  showTaskDetailModal.value = true
}
const showDeletePopUpTaskDetail = function (id) {
  router.push({ name: 'DeleteTaskDetail', params: { id: id } })
  Id.value = id
  showDeleteTaskDetail.value = true
}
const saveTaskDetailAlert = async function (title) {
  router.push({ name: 'Task' })
  showTaskDetailModal.value = false
  greenPopup.add = true
  showTitle.value = title
}

const clearDeletePopUp = async function () {
  router.push({ name: 'Task' })
  showDeleteTaskDetail.value = false
}

const taskDetailForm = (detail) => {
  detail.addTitle
}

const showRedEditAlert = function () {
  redPopup.edit = true
}

const showGreenEditAlert = function () {
  greenPopup.edit = true
}

const showDelComplete = async function () {
  router.push({ name: 'Task' })
  showDeleteTaskDetail.value = false
  greenPopup.delete = true
}

const showRedAlertPop = function () {
  redPopup.delete = true
}
const closeAlerts = async function () {
  router.push({ name: 'Task' })
  greenPopup.add = false
  console.log('a')
}
const closeRedDeleteAlert = async function () {
  router.push({ name: 'Task' })
  redPopup.delete = false
}
const closeGreDeleteAlert = async function () {
  router.push({ name: 'Task' })
  greenPopup.delete= false
}
const closeGreEDAlert = async function () {
  router.push({ name: 'Task' })
  greenPopup.edit = false
}
const closeRedEDAlert = async function () {
  router.push({ name: 'Task' })
  redPopup.edit = false
}
</script>

<template>
  <div class="bg-white relative border rounded-lg overflow-auto">
    <h1 class="font-bold text-center">IT-Bangmod Kradan Kanban</h1>
    <AlertPopUp
      v-if="greenPopup.add"
      :titles="'The task ' + showTitle + ' has been successfully added.'"
      @closePopUp="closeAlerts"
      message="Success!!"
      styleType="green"
    />
    <AlertPopUp
      v-if="redPopup.delete"
      :titles="
        'An error has occurred, the task ' + showDERTitle + ' does not exist.'
      "
      @closePopUp="closeRedDeleteAlert"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="greenPopup.delete"
      :titles="'The task ' + showDEGTitle + ' has been deleted.'"
      @closePopUp="closeGreDeleteAlert"
      message="Success!!"
      styleType="green"
    />
    <AlertPopUp
      v-if="greenPopup.edit"
      :titles="'The task ' + showEDGTitle + ' has been updated.'"
      @closePopUp="closeGreEDAlert"
      message="Success!!"
      styleType="green"
    />
    <AlertPopUp
      v-if="redPopup.edit"
      :titles="'An error occurred editting the task.' + showEDRTitle"
      @closePopUp="closeRedEDAlert"
      message="Error!!"
      styleType="red"
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
          v-for="task in taskManager.getTasks()"
          :key="task.id"
          class="itbkk-item border-b cursor-pointer"
        >
          <td class="px-4 py-3">
            {{ task.id }}
            <div
              class="inline-flex"
              @click="showEditTaskDetail(task.id, 'edit')"
            >
              ⚙️
            </div>
            <div
              class="inline-flex"
              @click="showDeletePopUpTaskDetail(task.id)"
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
      @saveAddPopUp="saveTaskDetailAlert"
      @redEditAlert="showRedEditAlert"
      @greenEditAlert="showGreenEditAlert"
    ></TaskDetail>
  </teleport>
  <teleport to="body" v-if="showDeleteTaskDetail">
    <DeletePopUp
      @cancelDetail="clearDeletePopUp"
      @confirmDetail="showDelComplete"
      @redAlert="showRedAlertPop"
      :taskId="Id"
    >
    </DeletePopUp>
  </teleport>
</template>
<style scoped></style>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem
} from '../utils/fetchUtils.js'
import { useTaskManager } from '@/stores/TaskManager'
import TaskDetail from '@/TaskDetail.vue'
import { useRoute, useRouter } from 'vue-router'
import DeletePopUp from '@/DeletePopUp.vue'
import AlertPopUp from './../components/AlertPopUp.vue'
import StatusesList from './StatusesList.vue'
import { useStatusManager } from '@/stores/StatusManager'
import StatusLimitSetting from './StatusLimitSetting.vue'
const statusManager = useStatusManager()
const showStatusDetailModal = ref(false)
const showStatusDetailLimit = ref(false)
const router = useRouter()
const route = useRoute()
const showTaskDetailModal = ref(false)
const taskManager = useTaskManager()
const taskDetail = reactive({})
const showDeleteTaskDetail = ref(false)
const operation = ref('')
const greenPopup = reactive({
  add: { state: false, taskTitle: '' },
  edit: { state: false, taskTitle: '' },
  delete: { state: false, taskTitle: '' }
})
const redPopup = reactive({
  edit: { state: false, taskTitle: '' },
  delete: { state: false, taskTitle: '' }
})

onMounted(async () => {
  taskManager.setTasks(await getItems(import.meta.env.VITE_BASE_URL))
  statusManager.setStatuses(await getItems(import.meta.env.VITE_BASE_URL_V2))
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
  taskDetail.value = null
  operation.value = operate
  showTaskDetailModal.value = true
}
const showDeletePopUpTaskDetail = function (obj) {
  router.push({ name: 'DeleteTaskDetail', params: { id: obj.id } })
  taskDetail.value = { id: obj.id, taskTitle: obj.taskTitle, index: obj.index }
  showDeleteTaskDetail.value = true
}

const openRedPopup = function (obj) {
  redPopup[obj.operate].state = true
  redPopup[obj.operate].taskTitle = obj.taskTitle
}

const openGreenPopup = function (obj) {
  greenPopup[obj.operate].state = true
  greenPopup[obj.operate].taskTitle = obj.taskTitle
}

const closeRedPopup = async function (operate) {
  router.push({ name: 'Task' })
  redPopup[operate].state = false
}

const closeGreenPopup = async function (operate) {
  router.push({ name: 'Task' })
  greenPopup[operate].state = false
}
const clearDeletePopUp = async function () {
  router.push({ name: 'Task' })
  showDeleteTaskDetail.value = false
}
const clearLimitStatusPopUp = async function () {
  router.push({ name: 'Task' })
  showStatusDetailLimit.value = false
}

const showDelComplete = async function () {
  router.push({ name: 'Task' })
  showDeleteTaskDetail.value = false
  greenPopup.delete.state = true
}

const showStatusesList = function () {
  router.replace({ name: 'StatusList' })
  showStatusDetailModal.value = true
}

const showStatusesLimit = function () {
  showStatusDetailLimit.value = true
}
</script>

<template>
  <div class="bg-white relative border rounded-lg overflow-auto">
    <h1 class="font-bold text-center">IT-Bangmod Kradan Kanban</h1>
    <AlertPopUp
      v-if="greenPopup.add.state"
      :titles="
        'The task ' + greenPopup.add.taskTitle + ' has been successfully added.'
      "
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :operate="'add'"
    />
    <AlertPopUp
      v-if="redPopup.delete.state"
      :titles="
        'An error has occurred, the task ' +
        redPopup.delete.taskTitle +
        ' does not exist.'
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
      <div class="flex items-center space-x-2">
        <input
          type="text"
          class="itbkk-status-filter bg-gray-50 border text-gray-400 text-sm rounded-lg w-[210px] p-2"
          placeholder="Filter by status(es)"
          required
        />
        <svg
          class="fill-current h-6 w-6 text-gray-500 cursor-pointer"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          @click="$emit('closePopUp')"
        >
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </div>
      <button
        @click="showAddPopUpTaskDetail('add')"
        class="itbkk-button-add bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-3 mt-2"
      >
        ✚ Add New Task
      </button>
      <button
        @click="showStatusesList"
        class="itbkk-manage-status bg-gray-500 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-3 mt-2"
      >
        ⚙️ Manage Status
      </button>
      <button
        @click="showStatusesLimit"
        class="itbkk-manage-status bg-gray-500 w-[80px] flex items-center justify-center text-gray-100 hover:text-gray-200 mr-3 mt-2 rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2rem"
          height="1.2rem"
          viewBox="0 0 24 24"
        >
          <g fill="none" fill-rule="evenodd">
            <path
              d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
            />
            <path
              fill="currentColor"
              d="M18 4a1 1 0 1 0-2 0v1H4a1 1 0 0 0 0 2h12v1a1 1 0 1 0 2 0V7h2a1 1 0 1 0 0-2h-2zM4 11a1 1 0 1 0 0 2h2v1a1 1 0 1 0 2 0v-1h12a1 1 0 1 0 0-2H8v-1a1 1 0 0 0-2 0v1zm-1 7a1 1 0 0 1 1-1h12v-1a1 1 0 1 1 2 0v1h2a1 1 0 1 1 0 2h-2v1a1 1 0 1 1-2 0v-1H4a1 1 0 0 1-1-1"
            />
          </g>
        </svg>
      </button>
    </div>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th class="px-4 py-3"></th>
          <th class="px-4 py-3">Title</th>
          <th class="px-4 py-3">Assignees</th>
          <th class="px-4 py-3">
            Status
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.2rem"
              height="1.2rem"
              viewBox="0 0 48 48"
            >
              <path fill="#afacac" d="M38 33V5h-4v28h-6l8 10l8-10z" />
              <path
                fill="#afacac"
                d="M16.8 17.2h-5.3l-1.1 3H6.9L12.6 5h2.9l5.7 15.2H18zm-4.6-2.7H16l-1.9-5.7zm.2 26H20V43H8.4v-1.9L16 30.3H8.4v-2.5h11.4v1.7z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.2rem"
              height="1.2rem"
              viewBox="0 0 16 16"
              v-if="(click = false)"
            >
              <g fill="#afacac">
                <path
                  fill-rule="evenodd"
                  d="M10.082 5.629L9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z"
                />
                <path
                  d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999l.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z"
                />
              </g>
            </svg>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(task, index) in taskManager.getTasks()"
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
              @click="
                showDeletePopUpTaskDetail({
                  id: task.id,
                  taskTitle: task.title,
                  index: index + 1
                })
              "
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
                  task.status.name === 'TO_DO'
                    ? '#FFC0CB'
                    : task.status.name === 'DOING'
                    ? '#ffff99'
                    : task.status.name === 'NO_STATUS'
                    ? 'lightgray'
                    : '#90EE90'
              }"
            >
              <p>{{ statusManager.transformStatus(task.status.name) }}</p>
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
  <Teleport to="body" v-if="showStatusDetailModal">
    <StatusesList> </StatusesList>
  </Teleport>
  <Teleport to="body" v-if="showStatusDetailLimit">
    <StatusLimitSetting
      @clearLimitPopUp="clearLimitStatusPopUp"
    ></StatusLimitSetting>
  </Teleport>
</template>
<style scoped></style>

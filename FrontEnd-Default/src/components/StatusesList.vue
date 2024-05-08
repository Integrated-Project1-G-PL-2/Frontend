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
import StatusPopUp from './StatusPopUp.vue'
import DeleteStatus from './DeleteStatus.vue'


const deClareemit = defineEmits(['editStatus'])
const router = useRouter()
const route = useRoute()
const showTaskDetailModal = ref(false)
const taskManager = TaskManager
const taskDetail = reactive({})
const showDeleteTaskDetail = ref(false)
const showStatusDetailModal = ref(false)
const operation = ref('')
const showAddStatusModal = ref(false)
const showEditStatusModal = ref(false)
const isDelete = ref(false)
const greenPopup = reactive({
  add: { state: false, taskTitle: '' },
  edit: { state: false, taskTitle: '' },
  delete: { state: false, taskTitle: '' }
})
const redPopup = reactive({
  edit: { state: false, taskTitle: '' },
  delete: { state: false, taskTitle: '' }
})
const showDeleteStatusDetail = ref(false)

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
const goBackToHomePage = function () {
  router.replace({ name: 'Task' })
  showTaskDetailModal.value = true
}
const showDeletePopUpTaskDetail = function () {
  router.push({ name: 'DeleteStatus' })
  // taskDetail.value = { id: obj.id, taskTitle: obj.taskTitle }
  showDeleteStatusDetail.value = true
}
const showAddStatusesModal = function () {
  router.replace({ name: 'StatusAdd' })
  showAddStatusModal.value = true
}

const showEditStatusesModal = function () {
  router.replace({ name: 'StatusEdit' })
  showEditStatusModal.value = true
}

const closeDeleteStatusPopup = function () {
  showDeleteStatusDetail.value = false
}

const closeAddStatusPopup = function () {
  showAddStatusModal.value = false
  showEditStatusModal.value = false
}

</script>

<template>
  <div class="bg-white relative border rounded-lg overflow-auto">
    <h1 class="font-bold text-center">IT-Bangmod Kradan Kanban</h1>
    
    <div class="flex justify-end">
      <button
        @click="showAddStatusesModal"
        class="itbkk-button-add bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-3 mt-2"
      >
        ✚ Add Status
      </button>
    </div>
    <div class="flex justify-start">
      <button
        @click="goBackToHomePage('add')"
        class="itbkk-button-home scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 hover:text-blue-500 mr-3 mt-2 text-blue-400"
      >
        🏠 Home
      </button>
      <div
        class="scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 mr-3 mt-2 font-bold"
      >
        > Task Status
      </div>
    </div>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th class="px-4 py-3"></th>
          <th class="px-4 py-3">Name</th>
          <th class="px-4 py-3">Description</th>
          <th class="px-4 py-3">Action</th>
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
            
          </td>
          <td class="itbkk-status-name px-4 py-3">
            <div
              class="hover:text-sky-500"
              @click="showTaskDetail(task.id, 'show')"
            >
              {{ task.title }}
            </div>
          </td>
          <td
            class="itbkk-status-description px-4 py-3"
            :class="task.assignees == null ? 'italic' : ''"
          >
            {{ task.assignees == null ? 'Unassigned' : task.assignees }}
          </td>
          <td class="itbkk-status px-4 py-3">
            <div
             
            >
              <button class="itbkk-button-edit bg-green-400   font-sans   text-center gap-5 text-gray-100 hover:text-gray-200 mr-5 w-14 rounded-[8px]"
              @click="showEditStatusesModal">
                Edit
              </button>
              <button class="itbkk-button-delete bg-red-400  rounded-[8px] font-sans text-center gap-5 text-gray-100 hover:text-gray-200 w-14 "
              @click="showDeletePopUpTaskDetail">
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <teleport to="body" v-if="showTaskDetailModal">
    <TaskDetail :taskDetail="taskDetail"></TaskDetail>
  </teleport>

  <teleport to="body" v-if="showAddStatusModal">
    <StatusPopUp
    @closeStatusPopUP="closeAddStatusPopup">
  </StatusPopUp>
  </teleport>

  <teleport to="body" v-if="showEditStatusModal">
    <StatusPopUp
    :editStatus = "true"
    @closeStatusPopUP="closeAddStatusPopup">
  </StatusPopUp>
  </teleport>
  
  <teleport to="body" v-if="showDeleteStatusDetail">
    <DeleteStatus
    :isDelete = isDelete
    :isTransfer = !isDelete
    @cancelStatusDetail="closeDeleteStatusPopup"></DeleteStatus>
  </teleport>
</template>
<style scoped></style>

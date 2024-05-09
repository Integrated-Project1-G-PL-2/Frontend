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
import StatusPopUp from './StatusPopUp.vue'
import DeleteStatus from './DeleteStatus.vue'

const deClareemit = defineEmits(['editStatus'])
const router = useRouter()
const route = useRoute()
const showTaskDetailModal = ref(false)
const taskManager = useTaskManager()
const taskDetail = reactive({})
const operation = ref('')
const showStatusModal = ref(false)
const isDelete = ref(false)
const greenPopup = reactive({
  add: { state: false, taskStatus: '' },
  edit: { state: false, taskStatus: '' },
  delete: { state: false, taskStatus: '' }
})
const redPopup = reactive({
  edit: { state: false, taskStatus: '' },
  delete: { state: false, taskStatus: '' }
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
const showAddStatusesModal = function (operate) {
  router.replace({ name: 'StatusAdd' })
  operation.value = operate
  showStatusModal.value = true
}

const showEditStatusesModal = function (operate) {
  router.replace({ name: 'StatusEdit' })
  operation.value = operate
  showStatusModal.value = true
}

const closeDeleteStatusPopup = function () {
  showDeleteStatusDetail.value = false
}

const closeStatusPopup = function () {
  router.replace({ name: 'StatusList' })
  showStatusModal.value = false
}

const closeRedPopup = async function (action) {
  router.push({ name: 'StatusList' })
  redPopup[action].state = false
}

const closeGreenPopup = async function (action) {
  router.push({ name: 'StatusList' })
  greenPopup[action].state = false
}
</script>

<template>
  <div class="bg-white relative border rounded-lg overflow-auto">
    <h1 class="font-bold text-center">IT-Bangmod Kradan Kanban</h1>
    <AlertPopUp
      v-if="greenPopup.add.state"
      :status="
        'The status ' +
        greenPopup.add.taskStatus +
        ' has been successfully added.'
      "
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :action="'add'"
    />
    <AlertPopUp
      v-if="redPopup.delete.state"
      :status="
        'An error has occurred, the status ' +
        redPopup.delete.taskStatus +
        ' could not be added.'
      "
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
      :action="'add'"
    />
    <AlertPopUp
      v-if="redPopup.delete.state"
      :status="
        'An error has occurred, the status ' +
        redPopup.delete.taskStatus +
        ' does not exist.'
      "
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
      :action="'delete'"
    />
    <AlertPopUp
      v-if="greenPopup.delete.state"
      :status="
        'The status ' + greenPopup.delete.taskStatus + ' has been deleted.'
      "
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :action="'delete'"
    />
    <AlertPopUp
      v-if="greenPopup.edit.state"
      :status="
        'The status ' + greenPopup.edit.taskStatus + ' has been updated.'
      "
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :action="'edit'"
    />
    <AlertPopUp
      v-if="redPopup.edit.state"
      :status="
        'An error has occurred, the status ' +
        redPopup.edit.taskStatus +
        ' does not exist.'
      "
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
      :action="'edit'"
    />
    <!-- <AlertPopUp
      v-if="redPopup.transfer.state"
      :status="
        'An error has occurred, the status ' +
        redPopup.transfer.taskStatus +
        ' does not exist.'
      "
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
      :action="'delete'"
    />
    <AlertPopUp
      v-if="greenPopup.transfer.state"
      :status="
        'The tasks' +
        greenPopup.transfer.taskStatus +
        'have been transferred and the status ' +
        greenPopup.delete.taskStatus +
        ' has been deleted.'
      "
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :action="'delete'"
    /> -->
    <div class="flex justify-end">
      <button
        @click="showAddStatusesModal('add')"
        class="itbkk-button-add bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-3 mt-2"
      >
        ✚ Add Status
      </button>
    </div>
    <div class="flex justify-start">
      <button
        @click="goBackToHomePage"
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
            <div>
              <button
                class="itbkk-button-edit bg-green-400 font-sans text-center gap-5 text-gray-100 hover:text-gray-200 mr-5 w-14 rounded-[8px]"
                @click="showEditStatusesModal('edit')"
              >
                Edit
              </button>
              <button
                class="itbkk-button-delete bg-red-400 rounded-[8px] font-sans text-center gap-5 text-gray-100 hover:text-gray-200 w-14"
                @click="showDeletePopUpTaskDetail"
              >
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

  <teleport to="body" v-if="showStatusModal">
    <StatusPopUp :operate="operation" @closeStatusPopUP="closeStatusPopup">
    </StatusPopUp>
  </teleport>

  <teleport to="body" v-if="showDeleteStatusDetail">
    <DeleteStatus
      :isDelete="isDelete"
      :isTransfer="!isDelete"
      @cancelStatusDetail="closeDeleteStatusPopup"
    ></DeleteStatus>
  </teleport>
</template>
<style scoped></style>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem
} from '../utils/fetchUtils.js'
import { useStatusManager } from '@/stores/StatusManager'
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
const statusManager = useStatusManager()
const statusDetail = reactive({})
const operation = ref('')
const showStatusModal = ref(false)
const isDelete = ref(true)
const greenPopup = reactive({
  add: { state: false, taskStatus: '' },
  edit: { state: false, taskStatus: '' },
  delete: { state: false, taskStatus: '' }
})
const redPopup = reactive({
  add: { state: false, taskStatus: '' },
  edit: { state: false, taskStatus: '' },
  delete: { state: false, taskStatus: '' }
})
const showDeleteStatusDetail = ref(false)

onMounted(async () => {
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

const goBackToHomePage = function () {
  router.replace({ name: 'Task' })
  
}
const showDeletePopUpTaskDetail = function (obj) {
  router.push({ name: 'DeleteStatus', params: { id: obj.id } })
  statusDetail.value = { id: obj.id, statusName: obj.statusName, index: obj.index }
  showDeleteStatusDetail.value = true
}

const setDeleteOperate = function(operate){
  operation.value = operate

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

const openRedPopup = function (obj) {
  redPopup[obj.operate].state = true
  redPopup[obj.operate].taskStatus = obj.taskStatus
}

const openGreenPopup = function (obj) {
  greenPopup[obj.operate].state = true
  greenPopup[obj.operate].taskStatus = obj.taskStatus
}

const closeRedPopup = async function (operate) {
  router.push({ name: 'StatusList' })
  redPopup[operate].state = false
}

const closeGreenPopup = async function (operate) {
  router.push({ name: 'StatusList' })
  greenPopup[operate].state = false
}

</script>

<template>
  <div class="bg-white relative border rounded-lg overflow-auto">
    <h1 class="font-bold text-center">IT-Bangmod Kradan Kanban</h1>
    <AlertPopUp
      v-if="greenPopup.add.state"
      :titles="'The status  ' + greenPopup.add.taskStatus + ' has been added.'"
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :operate="'add'"
    />
    <AlertPopUp
      v-if="redPopup.add.state"
      :titles="
        'An error has occurred, the status ' +
        redPopup.add.taskStatus +
        ' could not be added.'
      "
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
      :operate="'add'"
    />
    <AlertPopUp
      v-if="redPopup.delete.state"
      :titles="
        'An error has occurred, the status ' +
        redPopup.delete.taskStatus +
        ' does not exist.'
      "
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
      :operate="'delete'"
    />
    <AlertPopUp
      v-if="greenPopup.delete.state"
      :titles="
        'The task ' + greenPopup.delete.taskStatus + ' has been deleted.'
      "
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :operate="'delete'"
    />
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
          v-for="(statuses, index) in statusManager.getStatuses()"
          :key="statuses.id"
          class="itbkk-item border-b cursor-pointer"
        >
          <td class="px-4 py-3">
            {{ index + 1 }}
          </td>
          <td class="itbkk-status-name px-4 py-3">
            <div class="hover:text-sky-500">
              {{ statuses.name }}
            </div>
          </td>
          <td
            class="itbkk-status-description px-4 py-3"
            :class="statuses.description == null ? 'italic' : ''"
          >
            {{
              statuses.description == null
                ? 'Undescription'
                : statuses.description
            }}
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
                @click="showDeletePopUpTaskDetail({
                  id: statuses.id,
                  statusName: statuses.name,
                  index: index + 1
                }),setDeleteOperate('delete')"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- <teleport to="body" v-if="showTaskDetailModal">
    <TaskDetail></TaskDetail>
  </teleport> ใช้ไหม-->

  <teleport to="body" v-if="showStatusModal">
    <StatusPopUp
      :operate="operation"
      @closeStatusPopUP="closeStatusPopup"
      @showStatusRedPopup="openRedPopup"
      @showStatusGreenPopup="openGreenPopup"
      @showStatusDetailModal="showStatusModal = false"
    >
    </StatusPopUp>
  </teleport>

  <teleport to="body" v-if="showDeleteStatusDetail">
    <DeleteStatus
      :isDelete="isDelete"
      :isTransfer="!isDelete"
      :statusId="statusDetail"
      :operate="operation"
      @redAlert="openRedPopup"
      @greenAlert="openGreenPopup"
      @confirmStatusDetail="closeDeleteStatusPopup"
      @cancelStatusDetail="closeDeleteStatusPopup"
    ></DeleteStatus>
  </teleport>
</template>
<style scoped></style>

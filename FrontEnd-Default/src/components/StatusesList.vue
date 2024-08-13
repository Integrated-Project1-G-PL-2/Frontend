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
import TaskDetail from './../components/TaskDetail.vue'
import { useRoute, useRouter } from 'vue-router'
import DeletePopUp from './../components/DeletePopUp.vue'
import AlertPopUp from './../components/AlertPopUp.vue'
import StatusPopUp from './StatusPopUp.vue'
import DeleteStatus from './DeleteStatus.vue'
import { useTaskManager } from '@/stores/TaskManager'
import ButtonStyle from './ButtonStyle.vue'

const taskManager = useTaskManager()
const deClareemit = defineEmits(['editStatus'])
const router = useRouter()
const statusManager = useStatusManager()
const statusDetail = reactive({})
const operation = ref('')
const showStatusModal = ref(false)
const isDelete = ref()
const editColor = ref('editColor')
const deleteColor = ref('deleteColor')
const route = useRoute()
const greenPopup = reactive({
  add: { state: false, taskStatus: '' },
  edit: { state: false, taskStatus: '' },
  delete: { state: false, taskStatus: '' },
  transfer: { state: false, taskStatus: '' }
})
const redPopup = reactive({
  add: { state: false, taskStatus: '' },
  edit: { state: false, taskStatus: '' },
  delete: { state: false, taskStatus: '' },
  transfer: { state: false, taskStatus: '' }
})
const showDeleteStatusDetail = ref(false)
const transferDelList = ref({})
onMounted(async () => {
  taskManager.setTasks(await getItems(import.meta.env.VITE_BASE_URL))
  statusManager.setStatuses(await getItems(import.meta.env.VITE_BASE_URL_V2))
})

const goBackToHomePage = function () {
  router.replace({ name: 'Task' })
}

const showDeletePopUpTaskDetail = async function (obj) {
  if (taskManager.findStatusById(obj.id)) {
    setDeleteOperate('transfer')
  } else {
    setDeleteOperate('delete')
  }
  transferDelList.value = await getItems(import.meta.env.VITE_BASE_URL_V2)
  isDelete.value = !taskManager.findStatusById(obj.id)
  router.push({ name: 'DeleteStatus', params: { id: obj.id } })
  statusDetail.value = {
    id: obj.id,
    statusName: obj.statusName,
    index: obj.index
  }
  showDeleteStatusDetail.value = true
}

const setDeleteOperate = function (operate) {
  operation.value = operate
}

const showAddStatusesModal = function (operate) {
  router.push({ name: 'StatusAdd' })
  operation.value = operate
  statusDetail.value = null
  showStatusModal.value = true
}

const showEditStatusesModal = function (obj) {
  const status = statusManager.findStatusById(obj.id)
  router.push({ name: 'StatusEdit', params: { id: obj.id } })
  statusDetail.value = status
  operation.value = obj.operate
  showStatusModal.value = true
}

const showEditStatusesModalV2 = async function (obj) {
  const status = await getItemById(import.meta.env.VITE_BASE_URL_V2, obj.id)
  if (status.status == '404' || status.status == '500') {
    redPopup.edit.state = true
    return
  }
  router.push({ name: 'StatusEdit', params: { id: obj.id } })
  statusDetail.value = status
  operation.value = obj.operate
  showStatusModal.value = true
}
if (route.params.id) {
  showEditStatusesModalV2({ id: route.params.id, operate: 'edit' })
}

const closeDeleteStatusPopup = function () {
  showDeleteStatusDetail.value = false
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
    <h1 class="font-bold text-center cursor-default">
      IT-Bangmod Kradan Kanban
    </h1>
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
        'An error has occurred, Can not delete the status ' +
        redPopup.delete.taskStatus
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
    <AlertPopUp
      v-if="greenPopup.transfer.state"
      :titles="
        'The task have been transferred and the status ' +
        greenPopup.transfer.taskStatus +
        ' has been deleted'
      "
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :operate="'transfer'"
    />
    <AlertPopUp
      v-if="redPopup.transfer.state"
      :titles="
        'An error has occurred, the status ' +
        redPopup.transfer.taskStatus +
        ' does not exist.'
      "
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
      :operate="'transfer'"
    />
    <AlertPopUp
      v-if="greenPopup.edit.state"
      :titles="
        'The status ' + greenPopup.edit.taskStatus + ' has been updated.'
      "
      @closePopUp="closeGreenPopup"
      message="Success!!"
      styleType="green"
      :operate="'edit'"
    />
    <AlertPopUp
      v-if="redPopup.edit.state"
      :titles="'An error has occurred, the status does not exist'"
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
      :operate="'edit'"
    />
    <div class="flex justify-start">
      <button
        @click="goBackToHomePage"
        class="itbkk-button-home scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 hover:text-blue-500 mr-3 mt-2 text-blue-400 my-3"
      >
        🏠 Home
      </button>
      <div
        class="scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 mr-3 mt-2 my-3 font-bold"
      >
        > Task Status
      </div>
      <div class="flex ml-auto">
        <button
          @click="showAddStatusesModal('add')"
          class="itbkk-button-add bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-3 mt-2 my-3"
        >
          ✚ Add Status
        </button>
      </div>
    </div>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 cursor-default">
        <tr>
          <th class="text-md px-3 py-3 cursor-default"></th>
          <th class="text-md px-8 py-3 cursor-default">Name</th>
          <th class="text-md px-20 py-3 cursor-default">Description</th>
          <th class="text-md px-30 py-3 text-center cursor-default">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(statuses, index) in statusManager.getStatuses()"
          :key="statuses.id"
          class="itbkk-item border-b px-5 py-3"
        >
          <td class="px-3 py-3 text-center">
            {{ index + 1 }}
          </td>
          <td class="itbkk-status-name px-8 py-3">
            <div class="cursor-default">
              {{ statuses.name }}
            </div>
          </td>
          <td
            class="itbkk-status-description px-20 py-3"
            :class="
              statuses.description == null || statuses.description === ''
                ? 'italic'
                : ''
            "
          >
            {{
              statuses.description == null || statuses.description === ''
                ? 'No description is provided'
                : statuses.description
            }}
          </td>
          <td class="itbkk-status px-30 py-3 text-center">
            <div v-if="statuses.name !== 'No Status'">
              <!-- <button
                class="itbkk-button-edit bg-green-400 font-sans text-center gap-5 text-gray-100 hover:text-gray-200 mr-5 w-14 rounded-[8px]"
                @click="
                  showEditStatusesModal({
                    operate: 'edit',
                    id: statuses.id
                  })
                "
              >
                Edit
              </button> -->

              <ButtonStyle :bgColor="editColor">
                <button
                  class="itbkk-button-edit"
                  @click="
                    showEditStatusesModal({
                      operate: 'edit',
                      id: statuses.id
                    })
                  "
                >
                  Edit
                </button>
              </ButtonStyle>

              <!-- <button
                class="itbkk-button-delete bg-red-400 rounded-[8px] font-sans text-center gap-5 text-gray-100 hover:text-gray-200 w-14 mr-5"
                @click="
                  showDeletePopUpTaskDetail({
                    id: statuses.id,
                    statusName: statuses.name,
                    index: index + 1
                  })
                "
              >
                Delete
              </button> -->
              <ButtonStyle :bgColor="deleteColor">
                <button
                  class="itbkk-button-edit"
                  @click="
                    showEditStatusesModal({
                      operate: 'edit',
                      id: statuses.id
                    })
                  "
                >
                  Delete
                </button>
              </ButtonStyle>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <teleport to="body" v-if="showStatusModal">
    <StatusPopUp
      :operate="operation"
      @showStatusRedPopup="openRedPopup"
      @showStatusGreenPopup="openGreenPopup"
      @showStatusDetailModal="showStatusModal = false"
      :statusDetail="statusDetail"
    >
    </StatusPopUp>
  </teleport>

  <teleport to="body" v-if="showDeleteStatusDetail">
    <DeleteStatus
      :isDelete="isDelete"
      :isTransfer="!isDelete"
      :statusId="statusDetail"
      :operate="operation"
      :transferList="transferDelList"
      @redAlert="openRedPopup"
      @greenAlert="openGreenPopup"
      @redAlertTrans="openRedPopup"
      @greenAlertTrans="openGreenPopup"
      @confirmStatusDetail="closeDeleteStatusPopup"
      @cancelStatusDetail="closeDeleteStatusPopup"
    ></DeleteStatus>
  </teleport>
</template>
<style scoped></style>

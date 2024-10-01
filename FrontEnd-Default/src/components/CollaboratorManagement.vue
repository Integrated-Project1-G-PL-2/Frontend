<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem
} from '../utils/fetchUtils.js'
import { useTaskManager } from '@/stores/TaskManager'
import TaskDetail from './../components/TaskDetail.vue'
import { useRoute, useRouter } from 'vue-router'
import DeletePopUp from './../components/DeletePopUp.vue'
import AlertPopUp from './../components/AlertPopUp.vue'
import StatusesList from './StatusesList.vue'
import { useStatusManager } from '@/stores/StatusManager'
import StatusLimitSetting from './StatusLimitSetting.vue'
import {
  sortByTitle,
  sortByTitleReverse,
  sortByTitleDate,
  searchByStatus
} from '@/stores/SortManager.js'
import { storeToRefs } from 'pinia'
import { userName } from '@/stores/UserManager'
import { logout } from '@/stores/UserManager'
import boardsList from './../components/BoardList.vue'
import { useBoardManager } from '@/stores/BoardManager'
import VisibilityChangedPopUp from './../components/VisibilityChangedPopUP.vue'
const statusManager = useStatusManager()
const showStatusDetailModal = ref(false)
const showStatusDetailLimit = ref(false)
const router = useRouter()
const route = useRoute()
const showTaskDetailModal = ref(false)
const switchSort = ref(false)
const switchSort2 = ref(false)
const switchDate = ref(false)
const taskManager = useTaskManager()
const taskDetail = reactive({})
const showDeleteTaskDetail = ref(false)
const operation = ref('')
const returnPage = ref(false)
const boardVisibility = ref()
const isSwitch = ref(false)
const collectStatus = reactive([])
const boardManager = useBoardManager()
const visibilityToggle = reactive({
  public: { state: false },
  private: { state: false }
})
const greenPopup = reactive({
  add: { state: false, taskTitle: '' },
  edit: { state: false, taskTitle: '' },
  delete: { state: false, taskTitle: '' }
})
const redPopup = reactive({
  edit: { state: false, taskTitle: '' },
  delete: { state: false, taskTitle: '' }
})

const privateTask = ref()
const bName = ref()
const boardOwner = ref()
const thisUser = ref()
const thisTask = ref()
const cannotConfig = ref(false)
onMounted(async () => {
  const tasksItem = await getItems(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/tasks`
  )
  const currentBoard = await getItemById(
    `${import.meta.env.VITE_BASE_URL}/v3/boards`,
    route.params.id
  )

  privateTask.value = tasksItem
  if (tasksItem == 401) {
    router.replace({ name: 'Login' })
    return
  }
  boardManager.setCurrentBoard(currentBoard)
  taskManager.setTasks(tasksItem)
  statusManager.setStatuses(
    await getItems(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/statuses`
    )
  )
  const storedUserName = localStorage.getItem('userName')
  if (storedUserName) {
    userName.value = storedUserName
  }
  const getBoardName = await getItemById(
    `${import.meta.env.VITE_BASE_URL}/v3/boards`,
    `${route.params.id}`
  )
  bName.value = getBoardName.name

  const board = boardManager.getCurrentBoard()
  boardVisibility.value = board.visibility

  boardOwner.value = currentBoard.owner.name

  thisUser.value = storedUserName
  taskGroups.value.forEach((taskGroup) => {
    thisTask.value = taskGroup.id
  })
  if (
    route.fullPath == `/board/${route.params.id}/task/add` ||
    route.fullPath.match(
      new RegExp(`/board/${route.params.id}/task/.+/delete`)
    ) ||
    route.fullPath.match(new RegExp(`/board/${route.params.id}/task/.+/edit`))
  ) {
    cannotConfig.value = true
    router.replace({ name: 'Task' })
  }
})
watch([boardOwner, thisUser], ([newBoardOwner, newThisUser]) => {
  boardOwner.value = newBoardOwner
  thisUser.value = newThisUser
})

const showTaskDetail = async function (id, operate) {
  router.push({ name: 'DetailTask', params: { tid: id } })
  operation.value = operate
  taskDetail.value = await getItemById(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/tasks`,
    id
  )
  if (taskDetail.value.status == '404') {
    alert('The requested task does not exist')
    router.replace({ name: 'Task' })
    return
  }
  showTaskDetailModal.value = true
}

const showEditTaskDetail = async function (id, operate) {
  router.push({ name: 'EditTaskDetail', params: { tid: id } })
  operation.value = operate
  taskDetail.value = await getItemById(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/tasks`,
    id
  )
  if (taskDetail.value.status == '404') {
    alert('The requested task does not exist')
    router.replace({ name: 'Task' })
    return
  }
  showTaskDetailModal.value = true
}

const showAddPopUpTaskDetail = function (operate) {
  router.push({ name: 'AddTaskDetail' })
  taskDetail.value = null
  operation.value = operate
  showTaskDetailModal.value = true
}
const showDeletePopUpTaskDetail = function (obj) {
  router.push({ name: 'DeleteTaskDetail', params: { tid: obj.id } })
  taskDetail.value = { id: obj.id, taskTitle: obj.taskTitle, index: obj.index }
  showDeleteTaskDetail.value = true
}

const openRedPopup = function (obj) {
  const newObj = obj == undefined ? { operate: 'delete', taskTitle: '' } : obj
  redPopup[newObj.operate].state = true
  redPopup[newObj.operate].taskTitle = newObj.taskTitle
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
const error = ref(false)
const permission = ref(false)
const openErrorVisibility = () => {
  console.log('Error visibility triggered') // ตรวจสอบการทำงานของฟังก์ชัน
  router.push({ name: 'Task' })
  error.value = true
}
const openPermissionVisibility = () => {
  router.push({ name: 'Task' })
  permission.value = true
}

const switchDefault = function () {
  switchDate.value = true
  switchSort.value = true
}

const switchSortText = function () {
  switchSort.value = false
  switchSort2.value = true
}

const switchBack = function () {
  switchSort2.value = false
  switchDate.value = false
}

const taskGroups = ref(taskManager.getTasks())

const searchStatus = ref('')

watch(searchStatus, (status) => {
  if (collectStatus.includes(status) || status === null) {
    return
  }
  collectStatus.push(status)
})
watch(collectStatus, async () => {
  taskManager.setTasks(
    await getItems(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${
        route.params.id
      }/tasks?filterStatuses=${collectStatus.join()}`
    )
  )
})
const returnLoginPage = () => {
  logout()
  router.replace({ name: 'Login' })
  returnPage.value = true
}

const goBackToPersonalBoard = () => {
  router.replace({ name: 'Task' })
}
</script>

<template>
  <div class="bg-white relative border rounded-lg overflow-auto">
    <h1 class="font-bold text-center cursor-default text-xl">
      CollaboratorManagement
    </h1>
    <div
      class="flex justify-between items-start w-full font-bold space-y-2 border-b py-2 border-r-slate-500"
    >
      <button
        @click="goBackToHomeBoard"
        class="itbkk-button-home scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 hover:text-blue-500 mr-3 ml-2 mt-2 text-blue-400 my-3"
      >
        🏠 ITB-KK
      </button>
      <div class="flex flex-col items-center space-y-1">
        <h1 class="itbkk-fullname font-bold font-sans cursor-default text-xs">
          {{ userName }}
        </h1>
        <svg
          class="w-6 h-6 text-gray-800 dark:text-gray-700"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <button
          @click="returnLoginPage"
          class="bg-blue-500 text-xs rounded-[4px] font-sans text-gray-100 hover:text-gray-600 px-4 py-1 mt-1"
        >
          Log out
        </button>
      </div>
    </div>

    <div class="flex justify-end">
      <div
        class="flex justify-between items-start w-full font-bold space-y-2 border-b py-2 border-r-slate-500"
      >
        <div class="flex justify-start">
          <button
            @click="goBackToPersonalBoard"
            class="itbkk-board-name scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 hover:text-blue-500 mr-3 ml-2 mt-2 text-blue-400 my-3"
          >
            {{ bName }}
          </button>
          <div
            class="scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 mr-3 mt-2 my-3 font-bold"
          >
            > Collaborator
          </div>
        </div>
      </div>
      <button
        :disabled="boardOwner !== thisUser && isSwitch"
        @click="showAddPopUpTaskDetail('add')"
        class="itbkk-collaborator-add bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-2 my-3"
      >
        ✚ Add Collaborator
      </button>
    </div>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th class="px-4 py-3 cursor-default">No</th>
          <th class="px-4 py-3 cursor-default">Name</th>
          <th class="px-4 py-3 cursor-default">E-mail</th>
          <th class="px-4 py-3 cursor-default">Acess Right</th>
          <th class="px-4 py-3 cursor-default">Action</th>
        </tr>
      </thead>
      <tbody>
        <div
          v-if="boardOwner !== thisUser && cannotConfig"
          class="relative text-center text-xl text-red-600 p-4"
        >
          <div class="flex justify-center items-center">
            <h2>
              Access denied, you do not have permission to view this page.
            </h2>
            <button
              @click="cannotConfig = false"
              class="ml-2 text-red-600 hover:text-red-800 font-bold"
            >
              &times;
            </button>
          </div>
        </div>

        <div
          v-if="privateTask === null"
          class="text-center text-xl text-red-600"
        >
          <h2>Access denied,you do not have permission to view this page.</h2>
        </div>

        <tr
          v-for="(task, index) in taskGroups"
          :key="task.id"
          class="itbkk-item border-b cursor-pointer"
        >
          <td class="itbkk-button-action px-4 py-3">
            {{ index + 1 }}
            <div class="relative group">
              <div
                :disabled="boardOwner !== thisUser && isSwitch"
                class="itbkk-button-edit inline-flex"
                @click="showEditTaskDetail(task.id, 'edit')"
              >
                ⚙️
              </div>
              <div
                v-if="boardOwner !== thisUser && isSwitch"
                class="absolute hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-center text-sm rounded-lg -top-10 left-1/2 transform -translate-x-1/2 py-1"
              >
                You need to be board owner to perform this action.
              </div>
            </div>
            <div class="relative group">
              <button
                :disabled="boardOwner !== thisUser"
                class="itbkk-button-delete inline-flex"
                @click="
                  showDeletePopUpTaskDetail({
                    id: task.id,
                    taskTitle: task.title,
                    index: index + 1
                  })
                "
              >
                🗑️
              </button>
              <div
                v-if="boardOwner !== thisUser && isSwitch"
                class="absolute hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-center text-sm rounded-lg -top-10 left-1/2 transform -translate-x-1/2 py-1"
              >
                You need to be board owner to perform this action.
              </div>
            </div>
          </td>
          <td class="itbkk-title px-4 py-3">
            <div
              class="hover:text-sky-500 cursor-default"
              @click="showTaskDetail(task.id, 'show')"
            >
              {{ task.title }}
            </div>
          </td>
          <td
            class="itbkk-assignees px-4 py-3 cursor-default"
            :class="task.assignees == null ? 'italic' : ''"
          >
            {{ task.assignees == null ? 'Unassigned' : task.assignees }}
          </td>
          <td class="itbkk-status px-4 py-3 cursor-default">
            <div
              class="w-full bg-emerald-500 flex justify-center rounded-md"
              :style="{
                backgroundColor:
                  task.status.name === 'To Do'
                    ? '#FFC0CB'
                    : task.status.name === 'Doing'
                    ? '#ffff99'
                    : task.status.name === 'No Status'
                    ? 'lightgray'
                    : '#90EE90'
              }"
            >
              <p>{{ task.status.name }}</p>
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

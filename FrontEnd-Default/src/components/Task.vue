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
import ChangeRemoveLeaveCollab from './../components/ChangeRemoveLeaveCollab.vue'

const statusManager = useStatusManager()
const showStatusDetailModal = ref(false)
const showCollabDetailModal = ref(false)
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
const storedUserRole = ref()
const limitMostListsFiles = ref(false)
const limitFiles = ref(false)
const largeFiles = ref(false)
const sameFiles = ref(false)
const listsSameFiles = ref(false)
const limitListsFiles = ref(false)
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

const cannotConfig = ref(false)
const leave = ref(false)
onMounted(async () => {
  const currentBoard = await getItemById(
    `${import.meta.env.VITE_BASE_URL}/v3/boards`,
    route.params.id
  )
  console.log(currentBoard)
  const tasksItem = await getItems(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/tasks`
  )
  const boards = await getItems(`${import.meta.env.VITE_BASE_URL}/v3/boards`)
  boardManager.setBoards(boards)

  privateTask.value = tasksItem.status
  if (tasksItem == 401) {
    router.replace({ name: 'Login' })
    return
  }

  boardManager.setCurrentBoard(currentBoard)

  const userRole = [
    ...(boardManager.getBoards().personal || []),
    ...(boardManager.getBoards().collab || [])
  ].find((item) => item.id.boardId === route.params.id)?.role
  sessionStorage.setItem('userRole', userRole)
  storedUserRole.value = sessionStorage.getItem('userRole')

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

  if (
    (storedUserRole.value == 'READ' || storedUserRole.value == null) &&
    (route.fullPath == `/board/${route.params.id}/task/add` ||
      route.fullPath.match(
        new RegExp(`/board/${route.params.id}/task/.+/delete`)
      ) ||
      route.fullPath.match(
        new RegExp(`/board/${route.params.id}/task/.+/edit`)
      ))
  ) {
    cannotConfig.value = true
    router.replace({ name: 'Task' })
  }
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
const showCollabManagement = function () {
  router.replace({ name: 'CollabList' })
  showCollabDetailModal.value = true
}
const closeWrite = ref(false)
const closeOwner = ref(false)
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
const cloneTaskGroups = ref(statusManager.getStatuses())

const closePermissionAlter = function () {
  permission.value = false
}

const closeProblemAlter = () => {
  error.value = false
}

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

// onMounted(() => {
//   const storedUserName = localStorage.getItem('userName')
//   if (storedUserName) {
//     userName.value = storedUserName
//   }
// })

const returnLoginPage = () => {
  logout()
  router.replace({ name: 'Login' })
  returnPage.value = true
}

const goBackToHomeBoard = () => {
  router.replace({ name: 'Board' })
}

// Reactive variable to track checkbox state
watch(boardVisibility, (newVisibility) => {
  isSwitch.value = newVisibility === 'PUBLIC'
})

// Computed label based on checkbox state
const toggleLabel = computed(() => (isSwitch.value ? 'public' : 'private'))
let previousState = ref(false) // Store the previous toggle state
const isPopupOpen = ref(false)
// Function to open visibility settings (trigger the popup)
const openVisibilitySetting = async function () {
  previousState.value = isSwitch.value
  isPopupOpen.value = true
  if (isSwitch.value) {
    // If it's already Public, switch to Private and show private popup
    visibilityToggle.private.state = true
    visibilityToggle.public.state = false
    isSwitch.value = false
  } else {
    // If it's Private, switch to Public and show public popup
    visibilityToggle.public.state = true
    visibilityToggle.private.state = false
    isSwitch.value = true
  }
}

// Function to close visibility pop-up
const closeVisibility = function () {
  visibilityToggle.public.state = false
  visibilityToggle.private.state = false
  isSwitch.value = previousState.value

  router.push({ name: 'Task' })
  isPopupOpen.value = false
}

// Function to confirm visibility change
const confirmVisibility = function () {
  visibilityToggle.public.state = false
  visibilityToggle.private.state = false

  router.push({ name: 'Task' })
  isPopupOpen.value = false
}
const closeOwnerAlter = function () {
  closeOwner.value = false
}
const closeWriteAlter = function () {
  closeWrite.value = false
}
const closeLimitMostListsFilesAlter = function () {
  limitMostListsFiles.value = false
}
const closeLimitFilesAlter = function () {
  limitFiles.value = false
}
const closeLimitListsFilesAlter = function () {
  limitListsFiles.value = false
}
const closeLargeFilesAlter = function () {
  largeFiles.value = false
}
const closeListsSameFilesAlter = function () {
  listsSameFiles.value = false
}
const closeSameFilesAlter = function () {
  sameFiles.value = false
}
</script>

<template>
  <div class="bg-white relative border rounded-lg overflow-auto">
    <h1 class="itbkk-board-name font-bold text-center cursor-default text-xl">
      {{ bName }}
    </h1>
    <div
      class="flex justify-between items-start w-full font-bold space-y-2 border-b py-2 border-r-slate-500"
    >
      <button
        @click="goBackToHomeBoard"
        class="itbkk-home scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 hover:text-blue-500 mr-3 ml-2 mt-2 text-blue-400 my-3"
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
    <VisibilityChangedPopUp
      v-if="visibilityToggle.public.state"
      message="Do you want to change board visibility to public?"
      :operate="'public'"
      @closeVisibilityPopUp="closeVisibility"
      @confirmVisibilityPopUp="confirmVisibility"
      @visibilityError="openErrorVisibility"
      @visibilityPermission="openPermissionVisibility"
    />
    <VisibilityChangedPopUp
      v-if="visibilityToggle.private.state"
      message="Do you want to change board visibility to private?"
      :operate="'private'"
      @closeVisibilityPopUp="closeVisibility"
      @confirmVisibilityPopUp="confirmVisibility"
      @visibilityError="openErrorVisibility"
      @visibilityPermission="openPermissionVisibility"
    />
    <AlertPopUp
      v-if="permission"
      :titles="'You do not have permission to change board visibility mode.'"
      @closePopUp="closePermissionAlter"
      message="Error!!"
      styleType="red"
    />

    <AlertPopUp
      v-if="error"
      :titles="'There is a problem. Please try again later.'"
      @closePopUp="closeProblemAlter"
      message="Error!!"
      styleType="red"
    />

    <!-- <AlertPopUp
      v-if="accessDenied"
      :titles="'Access denied, you do not have permission to view this page.'"
      @closePopUp="closeAccessAlter"
      message="Error!!"
      styleType="red"
    /> -->
    <AlertPopUp
      v-if="closeOwner"
      :titles="'You need to be board owner to perform this action.'"
      @closePopUp="closeOwnerAlter"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="closeWrite"
      :titles="'You need to be board owner or has write access to perform this action.'"
      @closePopUp="closeWriteAlter"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="limitMostListsFiles"
      :titles="'Each task can have at most $MAX_FILES files. The following files are not added:'"
      @closePopUp="closeLimitMostListsFilesAlter"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="limitFiles"
      :titles="'Each task can have at most $MAX_FILES files.'"
      @closePopUp="closeLimitFilesAlter"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="limitListsFiles"
      :titles="'Each file cannot be larger than $MAX_FILE_SIZE MB. The following files are not added:'"
      @closePopUp="closeLimitListsFilesAlter"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="largeFiles"
      :titles="'Each file cannot be larger than $MAX_FILE_SIZE MB.'"
      @closePopUp="closeLargeFilesAlter"
      message="Error!!"
      styleType="red"
    />

    <AlertPopUp
      v-if="sameFiles"
      :titles="'File with the same filename cannot be added or updated to the attachments. Please delete the attachment and add again to update the file. '"
      @closePopUp="closeSameFilesAlter"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="listsSameFiles"
      :titles="'File with the same filename cannot be added or updated to the attachments. Please delete the attachment and add again to update the file, The following files are not added: '"
      @closePopUp="closeListsSameFilesAlter"
      message="Error!!"
      styleType="red"
    />
    <div class="flex justify-end">
      <div
        class="itbkk-status-filter flex items-center space-x-2 mr-auto ml-4 my-3 border"
      >
        <select
          class="text-sm rounded-lg w-[210px] p-2 bg-white"
          placeholder="Filter by status(es)"
          required
          v-model="searchStatus"
        >
          <option
            v-for="(status, index) in cloneTaskGroups"
            :key="index"
            class="itbkk-status-choice"
          >
            {{ status.name }}
          </option>
        </select>

        <svg
          class="itbkk-filter-clear fill-current h-6 w-6 text-gray-400 cursor-pointer"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          @click=";(collectStatus.length = 0), (searchStatus = null)"
        >
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </div>
      <div
        class="container p-4 border rounded-lg mr-2 ml-2 my-3 w-[650px] flex overflow-auto gap-2"
      >
        <div
          v-for="(statusName, index) in collectStatus"
          :key="index"
          class="flex items-center justify-between space-x-2 border w-auto bg-gray-300"
        >
          {{ statusName }}
          <svg
            class="itbkk-filter-clear fill-current h-6 w-6 text-gray-500 cursor-pointer ml-auto"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            @click="collectStatus.splice(index, 1), (searchStatus = null)"
          >
            <path
              d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
            />
          </svg>
        </div>
      </div>
      <div class="relative group">
        <label class="inline-flex items-center cursor-pointer">
          <input
            :disabled="
              !isSwitch && (storedUserRole == 'READ' || storedUserRole == null)
            "
            type="checkbox"
            v-model="isSwitch"
            class="itbkk-board-visibility sr-only peer"
            @click="openVisibilitySetting"
          />
          <div
            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
          ></div>
          <span
            class="visibility ms-3 text-sm font-medium text-gray-600 mr-3 my-3"
          >
            {{ toggleLabel }}
          </span>
        </label>
        <div
          v-if="
            isSwitch &&
            (storedUserRole == 'READ' || storedUserRole == 'undefined')
          "
          class="absolute hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-center text-sm rounded-lg -top-10 left-1/2 transform -translate-x-1/2 py-1"
        >
          You need to be board owner to perform this action.
        </div>
      </div>
      <div class="relative group">
        <button
          @click="showCollabManagement"
          :disabled="storedUserRole !== 'OWNER'"
          class="itbkk-manage-collaborator bg-green-700 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-2 my-3"
        >
          Manage Collabotator
        </button>
        <div
          v-if="storedUserRole !== 'OWNER'"
          class="absolute hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-center text-sm rounded-lg -top-10 left-1/2 transform -translate-x-1/2 py-1"
        >
          You need to be board owner to perform this action.
        </div>
      </div>
      <div class="relative group">
        <button
          :disabled="
            isSwitch &&
            (storedUserRole == 'READ' || storedUserRole == 'undefined')
          "
          @click="showAddPopUpTaskDetail('add')"
          class="itbkk-button-add bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-2 my-3"
        >
          ✚ Add New Task
        </button>
        <!-- <button
          :disabled="
            isSwitch &&
            (storedUserRole == 'READ' || storedUserRole == 'undefined')
          "
          @click="showAddPopUpAttachmentsDetail()"
          class="itbkk-button-add bg-blue-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-2 my-3"
        >
          ✚ Add New Attachments
        </button> -->
        <div
          v-if="
            isSwitch &&
            (storedUserRole == 'READ' || storedUserRole == 'undefined')
          "
          class="absolute hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-center text-sm rounded-lg -top-10 left-1/2 transform -translate-x-1/2 py-1"
        >
          You need to be board owner to perform this action.
        </div>
        <div
          v-if="
            isSwitch &&
            (storedUserRole == 'READ' || storedUserRole == 'undefined')
          "
          class="absolute hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-center text-sm rounded-lg -top-10 left-1/2 transform -translate-x-1/2 py-1"
        >
          You need to be board owner or has write access to perform this action.
        </div>
      </div>
      <button
        @click="showStatusesList"
        class="itbkk-manage-status bg-gray-500 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-3 my-3"
      >
        ⚙️ Manage Status
      </button>
      <!-- <button
        @click="showStatusesLimit"
        class="itbkk-manage-status bg-gray-500 w-[80px] flex items-center justify-center text-gray-100 hover:text-gray-200 mr-3 rounded-md my-3"
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
      </button> -->
    </div>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th class="px-4 py-3 cursor-default"></th>
          <th class="px-4 py-3 cursor-default">Title</th>
          <th class="px-4 py-3 cursor-default">Assignees</th>
          <th class="px-4 py-3 flex items-center space-x-2 cursor-default">
            <span>Status </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="cursor-pointer itbkk-status-sort"
              width="1.2rem"
              height="1.2rem"
              viewBox="0 0 48 48"
              v-if="!switchDate"
              @click=";[(switchDefault(), sortByTitle(taskGroups))]"
            >
              <path fill="#afacac" d="M38 33V5h-4v28h-6l8 10l8-10z" />
              <path
                fill="#afacac"
                d="M16.8 17.2h-5.3l-1.1 3H6.9L12.6 5h2.9l5.7 15.2H18zm-4.6-2.7H16l-1.9-5.7zm.2 26H20V43H8.4v-1.9L16 30.3H8.4v-2.5h11.4v1.7z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="cursor-pointer itbkk-status-sort"
              width="1.2rem"
              height="1.2rem"
              viewBox="0 0 48 48"
              v-if="switchSort"
              @click=";[(switchSortText(), sortByTitleReverse(taskGroups))]"
            >
              <path fill="#1e40af" d="M38 33V5h-4v28h-6l8 10l8-10z" />
              <path
                fill="#1e40af"
                d="M16.8 17.2h-5.3l-1.1 3H6.9L12.6 5h2.9l5.7 15.2H18zm-4.6-2.7H16l-1.9-5.7zm.2 26H20V43H8.4v-1.9L16 30.3H8.4v-2.5h11.4v1.7z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="cursor-pointer itbkk-status-sort"
              width="1.2rem"
              height="1.2rem"
              viewBox="0 0 16 16"
              v-if="switchSort2"
              @click=";[(switchBack(), sortByTitleDate(taskGroups))]"
            >
              <g fill="#1e40af">
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
          <th class="px-8 py-3 space-x-2 cursor-default">Attachments</th>
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

        <div v-if="privateTask == 403" class="text-center text-xl text-red-600">
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
              <button
                :disabled="
                  isSwitch &&
                  (storedUserRole == 'READ' || storedUserRole == 'undefined')
                "
                class="itbkk-button-edit inline-flex"
                :class="{ disabled: boardOwner !== thisUser && isSwitch }"
                @click="showEditTaskDetail(task.id, 'edit')"
              >
                ⚙️
              </button>
              <div
                v-if="
                  isSwitch &&
                  (storedUserRole == 'READ' || storedUserRole == 'undefined')
                "
                class="absolute hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-center text-sm rounded-lg -top-10 left-1/2 transform -translate-x-1/2 py-1"
              >
                You need to be board owner to perform this action.
              </div>
              <div
                v-if="
                  isSwitch &&
                  (storedUserRole == 'READ' || storedUserRole == 'undefined')
                "
                class="absolute hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-center text-sm rounded-lg -top-10 left-1/2 transform -translate-x-1/2 py-1"
              >
                You need to be board owner or has write access to perform this
                action.
              </div>
            </div>
            <div class="relative group">
              <button
                :disabled="
                  isSwitch &&
                  (storedUserRole == 'READ' || storedUserRole == 'undefined')
                "
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
                v-if="
                  isSwitch &&
                  (storedUserRole == 'READ' || storedUserRole == 'undefined')
                "
                class="absolute hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-center text-sm rounded-lg -top-10 left-1/2 transform -translate-x-1/2 py-1"
              >
                You need to be board owner to perform this action.
              </div>
              <div
                v-if="
                  isSwitch &&
                  (storedUserRole == 'READ' || storedUserRole == 'undefined')
                "
                class="absolute hidden group-hover:block w-64 p-2 bg-gray-700 text-white text-center text-sm rounded-lg -top-10 left-1/2 transform -translate-x-1/2 py-1"
              >
                You need to be board owner or has write access to perform this
                action.
              </div>
            </div>
          </td>
          <td class="itbkk-title px-4 py-3">
            <div
              class="itbkk-title hover:text-sky-500 cursor-default"
              @click="showTaskDetail(task.id, 'show')"
            >
              {{ task.title }}
            </div>
          </td>
          <td
            class="itbkk-assignees px-4 py-3 cursor-default"
            :class="task.assignees == null ? 'italic' : 'italic'"
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
          <td class="itbkk-attachments px-4 py-3">
            <div class="h-[43px]">
              <div
                class="cursor-default w-[95%] h-[90%] px-4 py-3 mx-4 my-2 bbg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none italic"
              >
                <!-- {{ task.filesDataList.name }} -->
              </div>
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

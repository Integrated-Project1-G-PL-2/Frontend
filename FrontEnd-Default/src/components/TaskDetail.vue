<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskManager } from '@/stores/TaskManager'
import {
  getItems,
  getItemById,
  addItem,
  editItem,
  editItemWithFile,
  deleteFile
} from '@/utils/fetchUtils'
import { useStatusManager } from '@/stores/StatusManager'
import { useBoardManager } from '@/stores/BoardManager'
import AttachmentsDetail from './AttachmentsDetail.vue'
import DeleteAttachment from './DeleteAttachment.vue'
const emits = defineEmits([
  'showTaskDetailModal',
  'showRedPopup',
  'showGreenPopup',
  'showLoadingScreen',
  'finishLoadingScreen'
])
const MAX_FILE_SIZE = ref()
const taskManager = useTaskManager()
const statusManager = useStatusManager()
const router = useRouter()
const route = useRoute()
const prop = defineProps({
  taskDetail: Object,
  operate: String
})
const supportedTypes = ['pdf', 'image', 'png']
const unSupportedTypes = ['application/x-msdownload']
const boardManager = useBoardManager()
let task
if (prop.taskDetail.value) {
  task = reactive({
    createdOn: new Date(prop.taskDetail.value.createdOn)
      .toLocaleString('en-GB')
      .replace(',', ''),
    id: prop.taskDetail.value.id,
    taskAssignees:
      prop.taskDetail.value.assignees != null
        ? prop.taskDetail.value.assignees
        : '',
    taskDescription:
      prop.taskDetail.value.description != null
        ? prop.taskDetail.value.description
        : '',
    taskStatus: prop.taskDetail.value.status.name,
    taskTitle: prop.taskDetail.value.title,
    updatedOn: new Date(prop.taskDetail.value.updatedOn)
      .toLocaleString('en-GB')
      .replace(',', ''),
    taskAttachments: prop.taskDetail.value.filesDataList
  })
} else {
  task = reactive({
    createdOn: null,
    id: null,
    taskAssignees: 'Unassigned',
    taskDescription: 'No Description Provided',
    taskStatus: {},
    taskAttachments: '-',
    taskTitle: null,
    updatedOn: null
  })
}
console.log(task)
const showAttachmentsDetail = ref(false)
const showDeleteAttachmentsDetail = ref(false)
const taskSet = ref((task.taskStatus = 'No Status'))
const isTitleOverLimit = ref(false)
const isDescriptionOverLimit = ref(false)
const isAssigneesOverLimit = ref(false)
const isAttachmentsOverLimit = ref(false)
const isAttachmentsSizeOverLimit = ref(false)
const clickedIndex = ref([])
const fileInput = ref(null)
const attachmentLoop = task.taskAttachments
const checkTitleLength = () => {
  isTitleOverLimit.value = task.taskTitle.length > 100
}
const checkDescriptionLength = () => {
  isDescriptionOverLimit.value = task.taskDescription.length > 500
}
const checkAssigneesLength = () => {
  isAssigneesOverLimit.value = task.taskAssignees.length > 30
}
const checkAttachmentsLength = () => {
  isAttachmentsOverLimit.value = task.taskAttachments >= 11
}
const checkAttachmentsSizeLength = () => {
  isAttachmentsSizeOverLimit.value = task.taskAttachments >= 20
}

const privateTask = ref()
const boardOwner = ref()
const thisUser = ref()
const userName = ref()
const boardVisibility = ref()
const haveFiles = ref(false)
const removeList = reactive([])

const MAX_FILES = 10
const MAX_FILE_SIZE_MB = 20
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

onMounted(async () => {
  const taskItems = await getItems(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/tasks`
  )
  const currentBoard = await getItemById(
    `${import.meta.env.VITE_BASE_URL}/v3/boards`,
    route.params.id
  )
  privateTask.value = taskItems
  if (taskItems == 401) {
    router.replace({ name: 'Login' })
    return
  }
  boardManager.setCurrentBoard(currentBoard)
  taskManager.setTasks(taskItems)
  statusManager.setStatuses(
    await getItems(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/statuses`
    )
  )
  const storedUserName = localStorage.getItem('userName')
  if (storedUserName) {
    userName.value = storedUserName
  }

  const board = boardManager.getCurrentBoard()
  boardVisibility.value = board.visibility
  boardOwner.value = currentBoard.owner.name
  thisUser.value = storedUserName
  console.log(thisUser.value)
  if (
    boardVisibility.value == 'PUBLIC' &&
    thisUser.value !== boardOwner.value
  ) {
    console.log('test')
  }
})

const handleClick = async () => {
  try {
    emits('showLoadingScreen', true)
    if (prop.operate == 'show') {
      emits('finishLoadingScreen', true) // Stop loading
      emits('showTaskDetailModal', false)
      router.replace({ name: 'Task' })
      return
    }
    const addOrUpdateTaskDetail = {
      title: task.taskTitle?.length > 0 ? task.taskTitle : null,
      assignees: task.taskAssignees?.length > 0 ? task.taskAssignees : null,
      description:
        task.taskDescription?.length > 0 ? task.taskDescription : null
    }
    if (
      isTitleOverLimit.value ||
      isDescriptionOverLimit.value ||
      isAssigneesOverLimit.value
    ) {
      return
    }
    if (prop.operate == 'add') {
      addOrUpdateTaskDetail.status = statusManager.findStatusByName(
        task.taskStatus
      ).id
      const newTask = await addItem(
        `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/tasks`,
        addOrUpdateTaskDetail
      )
      console.log(newTask)
      router.replace({ name: 'Task' })
      if (newTask.status != '500') {
        taskManager.addTask(newTask)
        emits('finishLoadingScreen', true) // Stop loading
        emits('showGreenPopup', {
          taskTitle: newTask.title,
          operate: prop.operate
        })
      }
      emits('finishLoadingScreen', true) // Stop loading
      emits('showTaskDetailModal', false)
    } else if (prop.operate == 'edit') {
      const file = Array.from(attachments.value)
      console.log(file)
      addOrUpdateTaskDetail.status = statusManager.findStatusByName(
        task.taskStatus
      ).id
      console.log(removeList)
      if (removeList.length !== 0) {
        for (const element of removeList) {
          await deleteFile(
            `${import.meta.env.VITE_BASE_URL}/v3/boards/${
              route.params.id
            }/tasks`,
            task.id,
            element
          )
          console.log('delete')
        }
      }
      console.log(file)
      const editTask = await editItemWithFile(
        `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/tasks`,
        task.id,
        file,
        addOrUpdateTaskDetail
      )

      if (editTask.status != '500' && editTask.status != '404') {
        console.log(editTask)
        taskManager.editTask(editTask.id, editTask)
        emits('finishLoadingScreen', true) // Stop loading
        emits('showGreenPopup', {
          taskTitle: editTask.title,
          operate: prop.operate
        })
      } else {
        emits('finishLoadingScreen', true) // Stop loading
        emits('showRedPopup', {
          taskTitle: !editTask.title ? task.taskTitle : editTask.title,
          operate: prop.operate
        })
      }
      router.replace({ name: 'Task' })
      emits('finishLoadingScreen', true) // Stop loading
      emits('showTaskDetailModal', false)
    }
  } finally {
    emits('finishLoadingScreen', true) // Stop loading
  }
}
const showAddPopUpAttachmentsDetail = async function () {
  router.push({ name: 'AddAttachmentsDetail' })
  showAttachmentsDetail.value = true
}
const closeAttachmentDetail = async function () {
  router.push({ name: 'EditTaskDetail' })
  showAttachmentsDetail.value = false
}
const saveAttachmentDetail = async function () {
  router.push({ name: 'EditTaskDetail' })
  showAttachmentsDetail.value = false
}
const showDeletePopUpAttachmentsDetail = async function () {
  router.push({ name: 'DeleteAttachmentsDetail' })
  showDeleteAttachmentsDetail.value = true
}
const closeDeleteAttachmentDetail = async function () {
  router.push({ name: 'EditTaskDetail' })
  showDeleteAttachmentsDetail.value = false
}
const confirmDeleteAttachmentDetail = async function () {
  router.push({ name: 'EditTaskDetail' })
  showDeleteAttachmentsDetail.value = false
}
const attachments = ref([])
const errorMessages = ref([])

// ฟังก์ชันแสดงข้อความ error
const displayErrorMessage = (messages) => {
  errorMessages.value = messages
}

const selectFiles = (event) => {
  const selectedFiles = Array.from(event.target.files)

  // Reset error messages before new selection
  let errors = []

  // Check oversized files in both selected files and task.taskAttachments
  const oversizedFiles = [
    ...selectedFiles.filter((file) => file.size > MAX_FILE_SIZE_BYTES),
    ...task.taskAttachments.filter((file) => file.size > MAX_FILE_SIZE_BYTES)
  ]

  if (oversizedFiles.length > 0) {
    errors.push(
      `Each file must be under ${MAX_FILE_SIZE_MB} MB. The following files exceed the size limit: ${oversizedFiles
        .map((file) => file.name)
        .join(', ')}`
    )
  }

  function removeExtension(fileName) {
    const lastDotIndex = fileName.lastIndexOf('.')
    if (lastDotIndex === -1) return fileName // No dot found, return the original name
    return fileName.slice(0, lastDotIndex) // Return the part before the last dot
  }
  // Filter out duplicate files based on filename in both attachments and task.taskAttachments
  const duplicateFiles = selectedFiles.filter(
    (file) =>
      attachments.value.some(
        (att) => removeExtension(att.name) === removeExtension(file.name)
      ) ||
      task.taskAttachments.some(
        (att) => removeExtension(att.name) === removeExtension(file.name)
      )
  )

  if (duplicateFiles.length > 0) {
    errors.push(
      `File with the same filename cannot be added. Please delete the attachment and add again to update the file: ${duplicateFiles
        .map((file) => file.name)
        .join(', ')}`
    )
  }

  // Unsupported file types check in both selected files and task.taskAttachments
  const unsupportedFiles = [
    ...selectedFiles.filter((file) => unSupportedTypes.includes(file.type)),
    ...task.taskAttachments.filter((file) =>
      unSupportedTypes.includes(file.type)
    )
  ]

  if (unsupportedFiles.length > 0) {
    errors.push(
      `The following files have unsupported types: ${unsupportedFiles
        .map((file) => file.name)
        .join(', ')}`
    )
  }

  // Add valid files to attachments
  const validFiles = selectedFiles.filter(
    (file) =>
      file.size <= MAX_FILE_SIZE_BYTES &&
      !attachments.value.some(
        (att) => removeExtension(att.name) === removeExtension(file.name)
      ) &&
      !task.taskAttachments.some(
        (att) => removeExtension(att.name) === removeExtension(file.name)
      ) &&
      !unSupportedTypes.includes(file.type)
  )

  // Check file count limit
  const currentFileCount =
    attachments.value.length + task.taskAttachments.length
  const remainingSlots = MAX_FILES - currentFileCount

  if (validFiles.length > remainingSlots) {
    const allowedFiles = validFiles.slice(0, remainingSlots)
    const excessFiles = validFiles.slice(remainingSlots)

    attachments.value.push(...allowedFiles)
    errors.push(
      `Each task can have a maximum of ${MAX_FILES} files. The following files were not added due to the file count limit: ${excessFiles
        .map((file) => file.name)
        .join(', ')}`
    )
  } else {
    attachments.value.push(...validFiles)
  }

  // Update error messages reactively
  errorMessages.value = errors

  // Clear messages after 5 seconds
  if (errors.length > 0) {
    setTimeout(() => {
      errorMessages.value = []
    }, 5000)
  }
}

const removeAttachment = function (index) {
  attachments.value.splice(index, 1)
}

const removeAttachmentList = function (id, name, type, indexClick) {
  attachmentLoop.splice(indexClick, 1)
  let pushData = ''
  if (type.length == 0) {
    pushData = id + '_' + name
  } else {
    pushData = id + '_' + name + '.' + type
  }
  console.log(indexClick)
  const index = removeList.indexOf(pushData)
  if (index !== -1) {
    removeList.splice(index, 1)
    clickedIndex.value.splice(index, 1)
    console.log(clickedIndex.value)
    return
  }
  clickedIndex.value.push(indexClick)
  removeList.push(pushData)
  console.log(clickedIndex.value)
}

const downloadFile = function (url) {
  const fileUrl = url
  const link = document.createElement('a')
  link.href = fileUrl
  link.click()
  link.remove()
}
const viewFile = function (url) {
  const fileUrl = url
  const link = document.createElement('a')
  link.href = fileUrl
  link.target = '_blank'
  link.click()
  link.remove()
}
</script>

<template>
  <div
    class="itbkk-modal-task bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px] overflow-auto"
  >
    <div class="w-[90%] m-[auto]">
      <div class="flex flex-col justify-between bg-white p-4">
        <div class="w-full h-[10%] mt-2">
          <div class="pl-4 mt-4">Title</div>
          <textarea
            class="itbkk-title font-bold text-justify w-full breal-all border border-gray-300 rounded-md resize-none"
            :class="{ 'border-red-600 text-red-600': isTitleOverLimit }"
            :disabled="operate == 'show'"
            v-model.trim="task.taskTitle"
            @input="checkTitleLength"
          >
          </textarea>
          <div
            style="display: flex; align-items: center"
            v-if="isTitleOverLimit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="-mt-px h-4 w-[20rem]"
              class="w-[15px] text-red-600"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <div class="text-sm text-red-600">
              Limit text to 100 characters or less.
            </div>
          </div>
        </div>
        <div class="border-b w-full mt-4"></div>
        <div class="flex flex-row">
          <div class="w-[70%] h-[50%]">
            <div class="pl-4 mt-4">Description</div>
            <div class="w-full h-[420px]">
              <textarea
                class="itbkk-description w-[95%] h-[90%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none font-style: italic"
                :disabled="operate == 'show'"
                v-model="task.taskDescription"
                :class="
                  (task.taskDescription == null ? 'italic text-gray-500 ' : '',
                  isDescriptionOverLimit ? 'border-red-600 text-red-600' : '')
                "
                @input="checkDescriptionLength"
                >{{ task.taskDescription }}
            </textarea
              >
              <div
                style="display: flex; align-items: center"
                v-if="isDescriptionOverLimit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="-mt-px h-4 w-[20rem]"
                  class="w-[15px] text-red-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <div class="text-sm text-red-600">
                  Limit text to 500 characters or less.
                </div>
              </div>
            </div>
          </div>
          <div class="w-[30%] h-[50%] flex-col">
            <div class="h-[180px]">
              <div class="pl-4 mt-4">Assignees</div>
              <div class="h-[150px]">
                <textarea
                  :disabled="operate == 'show'"
                  v-model="task.taskAssignees"
                  class="itbkk-assignees w-[95%] h-[90%] px-4 py-2 mx-4 my-2 bbg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none italic"
                  :class="
                    (task.taskAssignees == null ? 'italic text-gray-500 ' : '',
                    isAssigneesOverLimit ? 'border-red-600 text-red-600' : '')
                  "
                  @input="checkAssigneesLength"
                ></textarea>
                <div
                  style="display: flex; align-items: center"
                  v-if="isAssigneesOverLimit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="-mt-px h-4 w-[20rem]"
                    class="w-[15px] text-red-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div class="text-sm text-red-600">
                    Limit text to 30 characters or less.
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full h-[100px]">
              <label class="form-control w-full pl-4">
                <div class="label">
                  <span class="label-text ml-4">Status</span>
                </div>
                <select
                  :disabled="operate == 'show'"
                  v-model="task.taskStatus"
                  class="itbkk-status mt-1 ml-4 select select-bordered w-[95%] h-[40px] px-4 py-2 bg-inherit border-2 border-gray-200 text-gray-400 rounded-md"
                >
                  <option disabled selected>Status</option>
                  <option
                    v-for="status in statusManager.getStatuses()"
                    :value="status.name"
                  >
                    {{ status.name }}
                  </option>
                </select>
              </label>
            </div>
            <div v-if="prop.operate == 'edit'" class="w-full flex-col">
              <div class="flex items-center pl-4 mt-4 space-x-2">
                <span
                  >Attachments :

                  <button
                    @click="$refs.fileInput.click()"
                    class="bg-blue-500 text-white px-4 py-2 rounded"
                    :disabled="
                      attachments.length + task.taskAttachments.length >= 10
                    "
                  >
                    Add Files
                  </button>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    class="hidden"
                    @change="selectFiles"
                  />
                  <ul>
                    <li
                      v-for="(file, index) in attachmentLoop"
                      :key="index"
                      class="flex items-center justify-between"
                    >
                      <span>{{ index + 1 + '.' }} {{ file.name }}</span>
                      <div
                        v-if="file.type == 'jpg' || file.type == 'png'"
                        class="flex items-center space-x-2"
                      >
                        <img
                          :src="file.path"
                          alt="Image preview"
                          class="w-16 h-16 object-cover"
                        />
                      </div>
                      <div
                        v-else-if="file.type === 'pdf'"
                        class="flex items-center space-x-2"
                      >
                        <iframe
                          :src="file.path"
                          alt="File preview"
                          class="w-16 h-16 object-cover"
                        ></iframe>
                      </div>
                      <div
                        @click="
                          removeAttachmentList(
                            file.id,
                            file.name,
                            file.type,
                            index
                          )
                        "
                        class="text-blue-500 cursor-pointer scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
                      >
                        <u>Remove</u>
                      </div>
                      <div
                        v-if="file.type == 'docx' || file.type == 'xlsx'"
                        @click="downloadFile(file.path)"
                        class="text-blue-500 cursor-pointer scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
                      >
                        <u>Download</u>
                      </div>
                      <div
                        v-if="file.type == 'txt'"
                        @click="viewFile(file.path)"
                        class="text-blue-500 cursor-pointer scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
                      >
                        <u>View</u>
                      </div>
                    </li>
                  </ul>
                </span>
              </div>
              <p>New upload file</p>
              <li
                v-for="(file, index) in attachments"
                :key="index"
                class="flex items-center justify-between"
              >
                <span>{{ index + 1 + '.' }} {{ file.name }}</span>
                <div
                  @click="removeAttachment(index)"
                  class="cursor-pointer ml-2"
                >
                  ❌
                </div>
              </li>

              <!-- <div class="mt-4">
                <button
                  @click="$refs.fileInput.click()"
                  class="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Files
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  class="hidden"
                  @change="selectFiles"
                />
              </div> -->

              <!-- แสดงข้อความ Error -->
              <div v-if="errorMessages.length > 0" class="text-red-600 mt-4">
                <li v-for="(message, index) in errorMessages" :key="index">
                  {{ message }}
                </li>

                <!-- <button
                  v-if="prop.operate == 'edit' && haveFiles"
                  :disabled="isAttachmentsOverLimit"
                  @click="showDeletePopUpAttachmentsDetail()"
                  class="itbkk-button-add bg-yellow-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-2 my-3"
                >
                  Delete Attachments
                </button> -->
                <div
                  style="display: flex; align-items: center"
                  v-if="isAttachmentsOverLimit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="-mt-px h-4 w-[20rem]"
                    class="w-[15px] text-red-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div class="text-sm text-red-600">
                    Limit to 10 files or less.
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-10 ml-4 p-2">
              <div class="itbkk-timezone">
                <div>
                  TimeZone :
                  {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
                </div>
                <div></div>
              </div>
              <div class="itbkk-created-on">
                <div>Created On : {{ task.createdOn }}</div>
                <div></div>
              </div>
              <div class="itbkk-updated-on">
                <div>Updated On : {{ task.updatedOn }}</div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
            :class="{ disabled: !task.taskTitle }"
            @click="handleClick"
            :disabled="task.taskTitle == null || errorMessages.length > 0"
          >
            save
          </button>
          <button
            @click="
              ;[
                $emit('showTaskDetailModal', false),
                $router.replace({ name: 'EditTaskDetail' })
              ]
            "
            class="itbkk-button-cancel bg-gray-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
          >
            <div class="btn">cancel</div>
          </button>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body" v-if="showAttachmentsDetail">
    <AttachmentsDetail
      @cancelAttachmentDetail="closeAttachmentDetail"
      @errorMessage="displayErrorMessage"
      @saveAttachmentDetail="saveAttachmentDetail"
    ></AttachmentsDetail>
  </Teleport>
  <Teleport to="body" v-if="showDeleteAttachmentsDetail">
    <DeleteAttachment
      @cancelDeleteAttachmentDetail="closeDeleteAttachmentDetail"
      @confirmDeleteAttachmentDetail="confirmDeleteAttachmentDetail"
    ></DeleteAttachment>
  </Teleport>
</template>

<style scoped></style>

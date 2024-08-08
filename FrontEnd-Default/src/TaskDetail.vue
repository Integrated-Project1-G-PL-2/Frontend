<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskManager } from '@/stores/TaskManager'
import { addItem, editItem } from './utils/fetchUtils'
import { useStatusManager } from '@/stores/StatusManager'
const emits = defineEmits([
  'showTaskDetailModal',
  'showRedPopup',
  'showGreenPopup'
])
const taskManager = useTaskManager()
const statusManager = useStatusManager()
const router = useRouter()
const prop = defineProps({
  taskDetail: Object,
  operate: String
})
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
      .replace(',', '')
  })
} else {
  task = reactive({
    createdOn: null,
    id: null,
    taskAssignees: null,
    taskDescription: null,
    taskStatus: {},
    taskTitle: null,
    updatedOn: null
  })
}
const taskSet = ref((task.taskStatus = 'No Status'))
const isTitleOverLimit = ref(false)
const isDescriptionOverLimit = ref(false)
const isAssigneesOverLimit = ref(false)

const checkTitleLength = () => {
  isTitleOverLimit.value = task.taskTitle.length > 100
}
const checkDescriptionLength = () => {
  isDescriptionOverLimit.value = task.taskDescription.length > 500
}
const checkAssigneesLength = () => {
  isAssigneesOverLimit.value = task.taskAssignees.length > 30
}

const handleClick = async () => {
  if (prop.operate == 'show') {
    emits('showTaskDetailModal', false)
    router.replace({ name: 'Task' })
    return
  }
  const addOrUpdateTaskDetail = {
    title: task.taskTitle?.length > 0 ? task.taskTitle : null,
    assignees: task.taskAssignees?.length > 0 ? task.taskAssignees : null,
    description: task.taskDescription?.length > 0 ? task.taskDescription : null
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
      import.meta.env.VITE_BASE_URL,
      addOrUpdateTaskDetail
    )
    router.replace({ name: 'Task' })
    if (newTask != null) {
      taskManager.addTask(newTask)
      emits('showGreenPopup', {
        taskTitle: newTask.title,
        operate: prop.operate
      })
    }
    emits('showTaskDetailModal', false)
  } else if (prop.operate == 'edit') {
    addOrUpdateTaskDetail.status = statusManager.findStatusByName(
      task.taskStatus
    )
    const editTask = await editItem(
      import.meta.env.VITE_BASE_URL,
      task.id,
      addOrUpdateTaskDetail
    )
    if (editTask != null) {
      console.log(editTask);
      taskManager.editTask(editTask.id, editTask)
      emits('showGreenPopup', {
        taskTitle: editTask.title,
        operate: prop.operate
      })
    } else {
      emits('showRedPopup', {
        taskTitle: task.taskTitle ,
        operate: prop.operate
      })
    }
    router.replace({ name: 'Task' })
    emits('showTaskDetailModal', false)
  }
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
                :disabled="operate == 'show'"
                v-model="task.taskDescription"
                :class="
                  (task.taskAssignees == null ? 'italic text-gray-500 ' : '',
                  isDescriptionOverLimit ? 'border-red-600 text-red-600' : '')
                "
                class="itbkk-description w-[95%] h-[90%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
                placeholder="No Description Provided"
                @input="checkDescriptionLength"
              ></textarea>
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
                  class="itbkk-assignees w-[95%] h-[90%] px-4 py-2 mx-4 my-2 bbg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
                  :class="
                    (task.taskAssigneess == null ? 'italic text-gray-500 ' : '',
                    isAssigneesOverLimit ? 'border-red-600 text-red-600' : '')
                  "
                  placeholder="Unassigned"
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
            <div class="mt-10 ml-4">
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
            :disabled="task.taskTitle == null"
          >
            save
          </button>
          <button
            @click="
              ;[
                $emit('showTaskDetailModal', false),
                $router.replace({ name: 'Task' })
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
</template>

<style scoped></style>

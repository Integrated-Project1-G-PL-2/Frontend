<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskManager } from '@/stores/TaskManager'
import { addItem, editItem } from './utils/fetchUtils'
const emits = defineEmits([
  'showTaskDetailModal',
  'showRedPopup',
  'showGreenPopup'
])
const taskManager = useTaskManager()
const formatStatus = function (status) {
  if (status == null) {
    return 'No status'
  }
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
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
    taskStatus: formatStatus(prop.taskDetail.value.status),
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
    taskStatus: null,
    taskTitle: null,
    updatedOn: null
  })
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
    description: task.taskDescription?.length > 0 ? task.taskDescription : null,
    status: task.taskStatus.toUpperCase().replace(/\s+/g, '_')
  }
  if (prop.operate == 'add') {
    const newTask = await addItem(
      import.meta.env.VITE_BASE_URL,
      addOrUpdateTaskDetail
    )
    router.replace({ name: 'Task' })
    if (newTask.status != '500') {
      taskManager.addTask(newTask)
      emits('showGreenPopup', {
        taskTitle: newTask.title,
        operate: prop.operate
      })
    }
    emits('showTaskDetailModal', false)
  } else if (prop.operate == 'edit') {
    const editTask = await editItem(
      import.meta.env.VITE_BASE_URL,
      task.id,
      addOrUpdateTaskDetail
    )
    if (editTask.status != '500' && editTask.status != '404') {
      editTask.status = formatStatus(editTask.status)
      taskManager.editTask(editTask.id, editTask)
      emits('showGreenPopup', {
        taskTitle: editTask.title,
        operate: prop.operate
      })
    } else {
      emits('showRedPopup', {
        taskTitle: !editTask.title ? task.taskTitle : editTask.title,
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
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px] overflow-auto"
  >
    <div class="w-[90%] m-[auto]">
      <div class="flex flex-col justify-between bg-white p-4">
        <div class="w-full h-[10%] mt-2">
          <div class="pl-4 mt-4">Title</div>
          <textarea
            class="itbkk-title font-bold text-justify w-full breal-all border border-gray-300 rounded-md"
            :disabled="operate == 'show'"
            v-model.trim="task.taskTitle"
          >
          </textarea>
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
                  task.taskAssignees == null ? 'italic text-gray-500 ' : ''
                "
                class="itbkk-description w-[95%] h-[90%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="No Description Provided"
              ></textarea>
            </div>
          </div>
          <div class="w-[30%] h-[50%] flex-col">
            <div class="h-[180px]">
              <div class="pl-4 mt-4">Assignees</div>
              <div class="h-[150px]">
                <textarea
                  :disabled="operate == 'show'"
                  v-model="task.taskAssignees"
                  class="itbkk-assignees w-[95%] h-[90%] px-4 py-2 mx-4 my-2 bbg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  :class="
                    task.taskAssigneess == null ? 'italic text-gray-500 ' : ''
                  "
                  placeholder="Unassigned"
                ></textarea>
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
                  <option value="To Do">To Do</option>
                  <option value="Doing">Doing</option>
                  <option value="Done">Done</option>
                  <option value="No Status">No Status</option>
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

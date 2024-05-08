<script setup>
import { reactive, ref } from 'vue'
defineEmits(['closeStatusPopUP', 'openEditDetail'])
const prop = defineProps({
  editStatus:Boolean
})

const showEditStatusesModal = ref(false)
let task
if (prop.taskDetail?.value) {
  task = reactive({
    createdOn: new Date(prop.taskDetail.value.createdOn)
      .toLocaleString('en-GB')
      .replace(',', ''),
    id: prop.taskDetail.value.id,
    taskAssignees:
      prop.taskDetail.value.assignees != null
        ? prop.taskDetail.value.assignees
        : 'Unassigned',
    taskDescription:
      prop.taskDetail.value.description != null
        ? prop.taskDetail.value.description
        : 'No Description Provided',
    taskStatus: prop.taskDetail.value.status,
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
    status: task.taskStatus != null ? task.taskStatus : 'NO_STATUS'
  }
  if (prop.operate == 'add') {
    const newTask = await addItem(
      import.meta.env.VITE_BASE_URL,
      addOrUpdateTaskDetail
    )
    router.replace({ name: 'Task' })
    if (newTask.status != '500') {
      TaskManagement.addTask(newTask)
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
    router.replace({ name: 'Task' })
    if (editTask.status != '500' && editTask.status != '404') {
      TaskManagement.editTask(editTask.id, editTask)
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
    emits('showTaskDetailModal', false)
  }
}
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px] overflow-auto"
  >
    <div class="w-[90%] m-[auto] border border-gray-500">
      <div class="flex flex-col justify-between bg-white p-4">
        <div class="w-full h-[10%] mt-2">
          <div v-if="prop.editStatus" class="pl-4 mt-4">Edit Status</div>
          <div class="pl-4 mt-4"  v-if="!prop.editStatus">Add Status</div>
        </div>
        <div class="border-b w-full mt-4"></div>
        <div class="itbkk-modal-status w-full h-[10%] mt-2">
          <div class="pl-4 mt-4">Name</div>
          <textarea
            v-model="task.taskStatus"
            class="itbkk-status-name w-[90%] h-[40%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
          >
          </textarea>
        </div>

        <div class="w-[full] h-[50%]">
          <div class="pl-4 mt-4">Description</div>
          <div class="w-full h-[320px] ">
            <textarea
              v-model="task.taskDescription"
              class="itbkk-status-description w-[90%] h-[90%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
              placeholder="No Description Provided"
            ></textarea>
          </div>
        </div>
        <div
          v-if="prop.editStatus"
          class="mt-10 ml-4"
          style="display: flex"
        >
          <div style="display: flex">
            <div class="itbkk-timezone" style="margin-right: 20px">
              TimeZone : {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
            </div>
            <div class="itbkk-created-on" style="margin-right: 20px">
              <div>Created On : {{ task.createdOn }}</div>
            </div>
            <div class="itbkk-updated-on">
              <div>Updated On : {{ task.updatedOn }}</div>
            </div>
          </div>
        </div>

        <div class="flex flex-row w-full justify-end border-t">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
            :class="{ disabled: !task.taskStatus }"
            @click="handleClick"
            :disabled="task.taskStatus == null"
          >
            save
          </button>
          <button
            class="itbkk-button-cancel bg-gray-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
            @click="
              ;[
                $emit('closeStatusPopUP'),
                $router.replace({ name: 'StatusList' })
              ]
            "
          >
            <div class="btn">cancel</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

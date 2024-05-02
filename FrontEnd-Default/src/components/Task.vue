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
import AddTaskDetail from '@/AddTaskDetail.vue'
import DeletePopUp from '@/DeletePopUp.vue'
const router = useRouter()
const route = useRoute()
const showTaskDetailModal = ref(false)
const taskManager = TaskManager
const taskDetail = reactive({})
const path = reactive({})

const showAddTaskDetail = ref(false)
const showDeleteTaskDetail = ref(false)
const showAddAlert = ref(false) // open = true
const showRedAlert = ref(false) // open = true
const showGreenAlert = ref(false) // open = true

onMounted(async () => {
  taskManager.setTasks(await getItems(import.meta.env.VITE_BASE_URL))
})
const showTaskDetail = async function (id) {
  router.push({ name: 'TaskDetail', params: { id: id } })
  taskDetail.value = await getItemById(import.meta.env.VITE_BASE_URL, id)
  if (taskDetail.value.status == '404') {
    alert('The requested task does not exist')
    router.replace({ name: 'Task' })
    return
  }
  showTaskDetailModal.value = true
}

const showEditTaskDetail = async function (id) {
  router.push({ name: 'EditTaskDetail', params: { id: id } })
  taskDetail.value = await getItemById(import.meta.env.VITE_BASE_URL, id)
  if (taskDetail.value.status == '404') {
    alert('The requested task does not exist')
    router.replace({ name: 'Task' })
    return
  }
  showTaskDetailModal.value = true
}
if (route.params.id) {
  showTaskDetail(route.params.id)
}
const showAddPopUpTaskDetail = async function () {
  router.push({ name: 'AddTaskDetail' })
  showAddTaskDetail.value = true
  if (taskDetail.status == '404') {
    alert('The requested task does not exist')
    router.replace({ name: 'Task' })
    return
  }
}
const showDeletePopUpTaskDetail = async function (id) {
  router.push({ name: 'DeleteTaskDetail', params: { id: id } })
  taskDetail.value = await getItemById(import.meta.env.VITE_BASE_URL, id)
  showDeleteTaskDetail.value = true
  if (taskDetail.value.status == '404') {
    alert('The requested task does not exist')
    router.replace({ name: 'Task' })
    return
  }
}
const clearAddPopUp = async function () {
  router.push({ name: 'Task' })
  showAddTaskDetail.value = false
}

const clearDeletePopUp = async function () {
  router.push({ name: 'Task' })
  showDeleteTaskDetail.value = false
}
</script>

<template>
  <div class="bg-white relative border rounded-lg overflow-auto">
    <h1 class="font-bold text-center">IT-Bangmod Kradan Kanban</h1>

    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
      v-show="showRedAlert"
    >
      <strong class="font-bold">Error!!</strong>
      <p>
        <span class="itbkk-message block sm:inline">
          An error occurred deleting the task""</span
        >
      </p>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg
          class="fill-current h-6 w-6 text-red-500"
          role="button"
          viewBox="0 0 20 20"
          @click="showRedAlert = false"
        >
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </span>
    </div>
    <div
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
      role="alert"
      v-show="showGreenAlert"
    >
      <strong class="font-bold">Success!!</strong>
      <p>
        <span class="itbkk-message block sm:inline">
          The task "" has been deleted</span
        >
      </p>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg
          class="fill-current h-6 w-6 text-green-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          @click="showGreenAlert = false"
        >
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </span>
    </div>
    <div class="flex justify-end">
      <button
        @click="showAddPopUpTaskDetail"
        class="itbkk-button-add bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 text-gray-100 hover:text-gray-200 mr-3 mt-2"
      >
        ✚ Add New Task
      </button>
    </div>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th class="px-4 py-3"></th>
          <th class="px-4 py-3">Title</th>
          <th class="px-4 py-3">Assignees</th>
          <th class="px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="task in taskManager.getTasks()"
          :key="task.id"
          class="itbkk-item border-b cursor-pointer"
        >
          <td class="px-4 py-3">
            {{ task.id }}
            <div class="inline-flex" @click="showTaskDetail(task.id)">⚙️</div>
            <div
              class="inline-flex"
              @click="showDeletePopUpTaskDetail(task.id)"
            >
              🗑️
            </div>
          </td>
          <td class="itbkk-title px-4 py-3">
            <div class="hover:text-sky-500" @click="showTaskDetail(task.id)">
              {{ task.title }}
            </div>
          </td>
          <td
            class="itbkk-assignees px-4 py-3"
            :class="task.assignees == null ? 'italic' : ''"
          >
            {{ task.assignees == null ? 'Unassigned' : task.assignees }}
          </td>
          <td class="itbkk-status px-4 py-3">
            <div
              class="w-full bg-emerald-500 flex justify-center rounded-md"
              :style="{
                backgroundColor:
                  task.status === 'To Do'
                    ? '#FFC0CB'
                    : task.status === 'Doing'
                    ? '#ffff99'
                    : task.status === 'No Status'
                    ? 'lightgray'
                    : '#90EE90'
              }"
            >
              <p>{{ task.status }}</p>
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
    ></TaskDetail>
  </teleport>
  <teleport to="body" v-if="showAddTaskDetail">
    <AddTaskDetail @closeAddPopUp="clearAddPopUp" @saveAddDetail="saveTask">
    </AddTaskDetail>
  </teleport>
  <teleport to="body" v-if="showDeleteTaskDetail">
    <DeletePopUp @cancelDetail="clearDeletePopUp"> </DeletePopUp>
  </teleport>
</template>
<style scoped></style>

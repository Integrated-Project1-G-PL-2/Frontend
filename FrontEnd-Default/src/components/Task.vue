<script setup>
import { onMounted, ref } from 'vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem
} from '../utils/fetchUtils.js'
import TaskManager from '../utils/TaskManager.js'
import TaskDetail from '@/TaskDetail.vue'
// import TaskDetail from '../TaskDetail.vue'
const showTaskDetail = ref(false)
const taskManager = new TaskManager()
onMounted(async () => {
  taskManager.setTasks(await getItems(import.meta.env.VITE_BASE_URL))
})
const showPopUp = ref(false)
const editingToAdd = ref({
  id: undefined,
  title: '',
  assignees: '',
  status: ''
})
const openPopUp = (todo) => {
  editingToAdd.value = todo
  showPopUp.value = true
  showTaskDetail.value = false
}
const clearPopUP = (flag) => {
  showTaskDetail.value = flag
}
</script>

<template>
  <div class="bg-white relative border rounded-lg">
    <h1 class="font-bold text-center">IT-Bangmod Kradan Kanban</h1>
    <div class="flex justify-end">
      <button
        @click="openPopUp"
        class="px-2 py-0.5 font-bold text-emerald-500 rounded-lg hover:text-green-500 mr-10"
      >
        Add New Task Details
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
          @click="openPopUp"
        >
          <td class="px-4 py-3">{{ task.id }}</td>
          <td class="itbkk-title px-4 py-3">
            <div class="hover:text-sky-500">{{ task.taskTitle }}</div>
          </td>
          <td class="itbkk-assignees px-4 py-3">{{ task.taskAssignees }}</td>
          <td class="itbkk-status px-4 py-3">
            <div class="w-full bg-emerald-500 flex justify-center rounded-md">
              <p>{{ task.taskStatus }}</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <teleport to="body" v-if="!showTaskDetail">
    <div v-show="showPopUp">
      <TaskDetail @closePopUp="clearPopUP"></TaskDetail>
    </div>
  </teleport>
</template>
<style scoped></style>
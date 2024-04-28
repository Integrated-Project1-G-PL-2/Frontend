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
const router = useRouter()
const route = useRoute()
const showTaskDetailModal = ref(false)
const taskManager = new TaskManager()
const taskDetail = reactive({})
const path = reactive({})
onMounted(async () => {
  taskManager.setTasks(await getItems(import.meta.env.VITE_BASE_URL))
})
const showTaskDetail = async function(id){
  router.push({ name: 'TaskDetail', params: { id: id } })
  taskDetail.value = await getItemById(import.meta.env.VITE_BASE_URL,id)
  if (taskDetail.value.status == '404') {
    alert("The requested task dose not exist");
    router.replace({ name: 'Task'})
    return 
  }
  showTaskDetailModal.value = true
}
if(route.params.id){
  showTaskDetail(route.params.id)
}
</script>

<template>
  <div class="bg-white relative border rounded-lg">
    <h1 class="font-bold text-center">IT-Bangmod Kradan Kanban</h1>
    <div class="flex justify-end">
      <button
        @click="addPopUp"
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
          @click="[showTaskDetail(task.id) , ]"
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
  <teleport to="body" v-if="showTaskDetailModal">
    <TaskDetail :taskDetail="taskDetail" @showTaskDetailModal="showTaskDetailModal = false"></TaskDetail>
  </teleport>
</template>
<style scoped></style>

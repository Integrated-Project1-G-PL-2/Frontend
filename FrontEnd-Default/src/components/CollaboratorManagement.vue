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
import AddNewCollaborator from './../components/AddNewCollaborator.vue'
import { useRoute, useRouter } from 'vue-router'
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

const router = useRouter()

const showAddNewCollaborator = ref(false)

const returnLoginPage = () => {
  logout()
  router.replace({ name: 'Login' })
  returnPage.value = true
}

const goBackToPersonalBoard = () => {
  router.replace({ name: 'Task' })
}

const showAddNewCollaboratorPopUp = function () {
  showAddNewCollaborator.value = true // Set to true when the button is clicked
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
        @click="showAddNewCollaboratorPopUp"
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
  <teleport to="body" v-if="showAddNewCollaborator">
    <AddNewCollaborator></AddNewCollaborator>
  </teleport>
</template>
<style scoped></style>

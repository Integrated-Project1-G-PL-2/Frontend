<script setup>
import { ref } from 'vue'
import AddNewBoard from './../components/AddNewBoard.vue'
import { userName } from '@/stores/UserManager'
import { logout } from '@/stores/UserManager'
import { useRoute, useRouter } from 'vue-router'
import AlertPopUp from './../components/AlertPopUp.vue'
const router = useRouter()
const route = useRoute()
const error = ref(false)

const showAddNewBoard = ref(false) // Initial value is false
const returnPage = ref(false)

const showAddNewBoardPopUp = function () {
  showAddNewBoard.value = true // Set to true when the button is clicked
  router.push({ name: 'AddNewBoard' })
}

const clearDeletePopUp = function () {
  showAddNewBoard.value = false // Close the popup when cancel is clicked
}

const showDelComplete = function () {
  // Add your save logic here
  showAddNewBoard.value = false // Close the popup after saving
}
const returnLoginPage = () => {
  logout()
  router.replace({ name: 'Login' })
  returnPage.value = true
}

const closeProblemAlter = () => {
  error.value = false
}
</script>

<template>
  <div
    class="flex flex-col items-end pr-4 font-bold space-y-2 border-b py-2 border-r-slate-500"
  >
    <div class="flex justify-between items-start w-full">
      <button
        @click="goBackToHomePage"
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
  </div>
  <div class="bg-white relative border rounded-lg overflow-auto">
    <h1 class="font-bold text-center cursor-default text-3xl py-3">
      Board List
    </h1>
    <AlertPopUp
      v-if="error"
      :titles="'There is a problem. Please try again later.'"
      @closePopUp="closeProblemAlter"
      message="Error!!"
      styleType="red"
    />
    <div class="flex flex-col items-end pr-4 font-bold space-y-2">
      <button
        class="itbkk-button-create bg-gray-300 text-sm rounded-[6px] font-sans text-gray-700 hover:text-white px-7 py-2 mr-2 my-3"
        @click="showAddNewBoardPopUp"
      >
        Create personal board
      </button>
    </div>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th class="px-4 py-3 cursor-default"></th>
          <th class="px-4 py-3 cursor-default">No</th>
          <th class="px-4 py-3 cursor-default">Name</th>
          <th class="px-4 py-3 flex items-center space-x-2 cursor-default">
            <span>action</span>
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
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(task, index) in taskGroups"
          :key="task.id"
          class="itbkk-item border-b cursor-pointer"
        >
          <td class="px-4 py-3">
            {{ index + 1 }}
            <div
              class="inline-flex"
              @click="showEditTaskDetail(task.id, 'edit')"
            >
              ⚙️
            </div>
            <div
              class="inline-flex"
              @click="
                showDeletePopUpTaskDetail({
                  id: task.id,
                  taskTitle: task.title,
                  index: index + 1
                })
              "
            >
              🗑️
            </div>
          </td>
          <td class="itbkk-title px-4 py-3">
            <div
              class="hover:text-sky-500 cursor-default"
              @click="showBoardDetail(task.id, 'show')"
            >
              {{ board.name }}
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

  <Teleport to="body" v-if="showStatusDetailLimit">
    <StatusLimitSetting
      @clearLimitPopUp="clearLimitStatusPopUp"
    ></StatusLimitSetting>
  </Teleport>

  <teleport to="body" v-if="showAddNewBoard">
    <AddNewBoard
      @cancelDetail="clearDeletePopUp"
      @saveDetail="showDelComplete"
    ></AddNewBoard>
  </teleport>
</template>

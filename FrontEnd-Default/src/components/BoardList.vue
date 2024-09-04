<script setup>
import { onMounted, ref } from 'vue'
import AddNewBoard from './../components/AddNewBoard.vue'
import { userName } from '@/stores/UserManager'
import { logout } from '@/stores/UserManager'
import { useRoute, useRouter } from 'vue-router'
import { useBoardManager } from '@/stores/BoardManager'
import AlertPopUp from './../components/AlertPopUp.vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem
} from '../utils/fetchUtils.js'
const emits = defineEmits(['NameBoard'])
const router = useRouter()
const route = useRoute()

const boardManager = useBoardManager()

const boardsList = boardManager.getBoards()
const error = ref(false)

const closeProblemAlter = () => {
  error.value = false
}
onMounted(async () => {
  boardManager.setBoards(
    await getItems(`${import.meta.env.VITE_BASE_URL}/v3/boards`)
  )
  const storedUserName = localStorage.getItem('userName')
  if (storedUserName) {
    userName.value = storedUserName
  }
})

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
</script>

<template>
  <!-- <h1>{{ boardsList[0] }}</h1> -->
  <div
    class="flex flex-col items-end pr-4 font-bold space-y-2 border-b py-2 border-r-slate-500"
  >
    <div class="flex justify-between items-start w-full">
      <button
        class="itbkk-button-home scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 mr-3 ml-2 mt-2 text-blue-400 my-3 cursor-default"
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
  <div
    class="bg-white relative border rounded-lg overflow-auto max-h-[calc(100vh-10rem)] p-4"
  >
    <!-- Adjust the height and padding as needed -->
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
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <!-- Grid layout for dashboard-like appearance -->
      <div
        v-for="(board, index) in boardsList"
        :key="board.id.boardId"
        class="bg-white border rounded-lg shadow-md p-4 flex flex-col space-y-2 cursor-pointer hover:bg-gray-100"
        @click="
          ;[
            emits('NameBoard', board.board.name),
            router.replace({ name: 'Task', params: { id: board.id.boardId } })
          ]
        "
      >
        <div class="flex justify-between items-center">
          <span class="font-bold text-lg">{{ index + 1 }}</span>
          <div class="flex space-x-2">
            <span>⚙️</span>
            <span>🗑️</span>
          </div>
        </div>
        <div class="text-xl font-semibold">
          {{ board.board?.name == undefined ? board.name : board.board.name }}
        </div>
        <div class="text-sm text-gray-500">
          <p>{{ board.role == undefined ? 'owner' : board.role }}</p>
        </div>
      </div>
    </div>
  </div>

  <teleport to="body" v-if="showAddNewBoard">
    <AddNewBoard
      @cancelDetail="clearDeletePopUp"
      @saveDetail="showDelComplete"
    ></AddNewBoard>
  </teleport>
</template>

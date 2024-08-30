<script setup>
import { ref } from 'vue'
import AddNewBoard from './../components/AddNewBoard.vue'
import { userName } from '@/stores/UserManager'
import { logout } from '@/stores/UserManager'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

const showAddNewBoard = ref(false) // Initial value is false
const returnPage = ref(false)

const showAddNewBoardPopUp = function () {
  showAddNewBoard.value = true // Set to true when the button is clicked
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
  <div
    class="flex flex-col items-end pr-4 font-bold space-y-2 border-b border-r-slate-500"
  >
    <!-- Align this button to the left -->
    <div class="flex justify-start items-start w-full border border-gray-400">
      <button
        @click="goBackToHomePage"
        class="itbkk-button-home scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 hover:text-blue-500 mr-3 mt-2 text-blue-400 my-3"
      >
        🏠 ITB-KK
      </button>
    </div>
    <h1 class="itbkk-fullname font-bold font-sans cursor-default">
      {{ userName }}
    </h1>
    <div class="grid grid-cols-1 items-center justify-items-center space-y-2">
      <svg
        class="w-8 h-8 text-gray-800 dark:text-gray-700"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
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
        class="bg-blue-500 text-sm rounded-[6px] font-sans text-gray-100 hover:text-gray-600 px-7 py-1"
      >
        Log out
      </button>
    </div>

    <button
      class="bg-gray-300 text-sm rounded-[6px] font-sans text-gray-700 hover:text-white px-7 py-1"
      @click="showAddNewBoardPopUp"
    >
      Create personal board
    </button>
  </div>

  <teleport to="body" v-if="showAddNewBoard">
    <AddNewBoard
      @cancelDetail="clearDeletePopUp"
      @saveDetail="showDelComplete"
    ></AddNewBoard>
  </teleport>
</template>

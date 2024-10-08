<script setup>
import { addItem } from '@/utils/fetchUtils'
import { watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardManager } from '@/stores/BoardManager'
import { userName } from '@/stores/UserManager'

const deClareemit = defineEmits(['saveDetail', 'cancelDetail', 'errorOccurred'])
const router = useRouter()
const isNameOverLimit = ref(false)
const boardManager = useBoardManager()
const MAX_LENGTH = 120
const error = ref(false)

// Define newBoardName with default value
let newBoardName = ref(`${userName.value} personal board`)

// Check length of the board name and enforce the limit
const checkNameLength = () => {
  if (newBoardName.value.length > MAX_LENGTH) {
    isNameOverLimit.value = true
    newBoardName.value = newBoardName.value.substring(0, MAX_LENGTH)
    setTimeout(() => {
      isNameOverLimit.value = false
    }, 1000)
  } else {
    isNameOverLimit.value = false
  }
}

// Handle creating a new board
const newBoard = async () => {
  const newBoards = await addItem(
    `${import.meta.env.VITE_BASE_URL}/v3/boards`,
    {
      name: newBoardName.value // Pass the board name directly
    }
  )

  if (newBoards == 401) {
    router.replace({ name: 'Login' })
  }

  if (!newBoards.id) {
    deClareemit('errorOccurred', (error.value = true))
    return
  }

  boardManager.addBoard(newBoards)
  deClareemit('cancelDetail', true)
  router.replace({ name: 'Task', params: { id: newBoards.id } }) // Use the new board's ID
}
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
  >
    <div
      class="itbkk-modal-new w-[40%] m-[auto] border border-green-700 mt-[20%]"
    >
      <div class="flex flex-col justify-between bg-white p-4 h-[10%]">
        <div class="itbkk-title w-full h-[40px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify text-green-500">
            New Board
          </h1>
        </div>

        <div class="w-[70%] h-[100%]">
          <div class="flex mt-5 my-2">Name</div>
          <textarea
            v-model="newBoardName"
            class="itbkk-board-name font-bold text-justify w-[143%] breal-all border border-gray-300 rounded-md resize-none"
            @input="checkNameLength"
            :class="{ 'border-red-600 text-red-600': isNameOverLimit }"
          >
          </textarea>
          <div
            style="display: flex; align-items: center"
            v-if="isNameOverLimit"
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
              Limit text to 120 characters or less.
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row w-full justify-end border-t h-[60%]">
        <button
          class="itbkk-button-ok bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="newBoard(newBoardName)"
          :disabled="newBoardName == '' || isNameOverLimit"
        >
          <div class="btn text-center">Confirm</div>
        </button>
        <button
          class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="
            ;[$emit('cancelDetail', true), $router.replace({ name: 'Board' })]
          "
        >
          <div class="btn text-center">Cancel</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

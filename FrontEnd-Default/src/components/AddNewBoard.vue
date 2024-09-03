<script setup>
import { watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem
} from '../utils/fetchUtils.js'
import { useBoardManager } from '@/stores/BoardManager'
const deClareemit = defineEmits(['saveDetail', 'cancelDetail'])
const router = useRouter()
const name = ref('')
const isNameOverLimit = ref(false)
const isNameEmpty = ref(false)
const error = ref(false)
const MAX_LENGTH = 120

const checkNameLength = () => {
  isNameOverLimit.value = name.value.length > MAX_LENGTH
  isNameEmpty.value = name.value.trim() === ''
}

const saveClick = async () => {
  checkNameLength() // ตรวจสอบความยาวของชื่ออีกครั้ง

  // ตรวจสอบว่าไม่มีข้อผิดพลาดในการกรอกชื่อบอร์ด
  if (isNameOverLimit.value || isNameEmpty.value) {
    return
  }

  // สร้างบอร์ดใหม่ด้วยชื่อที่กำหนด
  const newBoard = {
    id: Date.now(), // สามารถเปลี่ยนให้เป็นการสร้าง id ที่เหมาะสมได้
    name: name.value
  }

  try {
    // เพิ่มบอร์ดใหม่ใน `useBoardManager`
    const boardManager = useBoardManager()
    boardManager.addBoard(newBoard)

    // เปลี่ยนเส้นทางไปยังหน้า 'Board'
    router.replace({ name: 'Board' })
  } catch (err) {
    console.error('Error saving board:', err)
    error.value = true
  }
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
            v-model="name"
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
          @click="saveClick"
          :disabled="isNameOverLimit || name.length == 0"
        >
          <div class="btn text-center">save</div>
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

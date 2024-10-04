<script setup>
import { watch, ref } from 'vue'
import { useRouter } from 'vue-router'

const deClareemit = defineEmits(['saveCollab', 'cancelCollab', 'errorCollab'])
const isNameOverLimit = ref(false)

const MAX_LENGTH = 50
// Initialize selectedAccessLevel with "READ"
const selectedAccessLevel = ref('READ')
// Define newBoardName with default value
let newBoardName = ref('')

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
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
  >
    <div
      class="itbkk-modal-alert w-[40%] m-[auto] border border-green-700 mt-[20%]"
    >
      <div class="flex flex-col justify-between bg-white p-4 h-[10%]">
        <div class="itbkk-title w-full h-[40px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify text-green-500">
            Add Collaborator
          </h1>
        </div>

        <div class="w-[100%] h-[100%]">
          <!-- Flex container for email and access right on the same line -->
          <div class="flex items-center gap-4 mt-5 my-2">
            <!-- Collaborator e-mail -->
            <div class="w-[80%]">
              <label for="collabEmail" class="block mb-1"
                >Collaborator e-mail</label
              >
              <textarea
                id="collabEmail"
                v-model="newCollabEmailName"
                @input="checkNameLength"
                :class="{ 'border-red-600 text-red-600': isNameOverLimit }"
                class="itbkk-collaborator-email font-bold text-justify w-full break-all border border-gray-300 rounded-md resize-none"
              ></textarea>
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
                  Limit text to 50 characters or less.
                </div>
              </div>
            </div>

            <!-- Dropdown for READ/WRITE selection -->
            <div class="w-[20%]">
              <label for="accessLevel" class="block mb-1">Access Right:</label>
              <select
                v-model="selectedAccessLevel"
                id="accessLevel"
                class="itbkk-access-right w-full border border-gray-300 rounded-md p-2"
              >
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row w-full justify-end border-t h-[60%]">
        <button
          class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="
            ;[
              $emit('cancelCollab', true),
              $router.replace({ name: 'CollabList' })
            ]
          "
        >
          <div class="btn text-center">Add</div>
        </button>
        <button
          class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="
            ;[
              $emit('cancelCollab', true),
              $router.replace({ name: 'CollabList' })
            ]
          "
        >
          <div class="btn text-center">Cancel</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

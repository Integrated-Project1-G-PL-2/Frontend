<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { userName } from '@/stores/UserManager'

const deClareemit = defineEmits([
  'saveAttachmentDetail',
  'cancelAttachmentDetail'
])

const router = useRouter()

const MAX_FILES = 5 // Maximum allowed attachments per task

const isNameOverLimit = ref(false)

const newBoardName = ref(`${userName.value} personal board`)
const attachments = ref([]) // Store selected files
const errorMessage = ref('') // Error message for excess files

// Handle file selection
const selectFiles = (event) => {
  const selectedFiles = Array.from(event.target.files)
  const totalFiles = attachments.value.length + selectedFiles.length

  if (totalFiles > MAX_FILES) {
    const allowedFiles = selectedFiles.slice(
      0,
      MAX_FILES - attachments.value.length
    )
    const excessFiles = selectedFiles.slice(
      MAX_FILES - attachments.value.length
    )

    attachments.value.push(...allowedFiles)
    errorMessage.value = `Each task can have at most ${MAX_FILES} files. The following files are not added: ${excessFiles
      .map((file) => file.name)
      .join(', ')}`
  } else {
    attachments.value.push(...selectedFiles)
    errorMessage.value = ''
  }
}
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px] overflow-auto"
  >
    <div
      class="itbkk-modal-new w-[40%] m-[auto] border border-green-700 mt-[20%]"
    >
      <div class="flex flex-col justify-between bg-white p-4 h-[10%]">
        <div class="itbkk-title w-full h-[40px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify text-green-500">
            New Attachments
          </h1>
        </div>

        <div class="w-[70%] h-[100%]">
          <div class="flex mt-5 my-2">
            The user can select more than one file to add.
          </div>

          <!-- File selection button -->
          <div class="mt-4">
            <button
              @click="$refs.fileInput.click()"
              class="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Files
            </button>
            <input
              ref="fileInput"
              type="file"
              multiple
              class="hidden"
              @change="selectFiles"
            />
          </div>

          <!-- Display selected files -->
          <ul class="mt-2">
            <li v-for="(file, index) in attachments" :key="index">
              {{ file.name }}
            </li>
          </ul>

          <!-- Display error message for excess files -->
          <div v-if="errorMessage" class="text-red-600 mt-2">
            {{ errorMessage }}
          </div>
        </div>
      </div>

      <div class="flex flex-row w-full justify-end border-t h-[60%]">
        <button
          class="itbkk-button-ok bg-green-400 rounded-[2px] w-[60px] h-[25px] font-sans btn-xs text-center flex gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="newAttachment"
          :disabled="MAX_FILES > 5"
        >
          <div class="btn text-center">Confirm</div>
        </button>
        <button
          class="itbkk-button-cancel bg-red-400 rounded-[2px] w-[50px] h-[25px] font-sans btn-xs text-center flex gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="
            ;[
              $emit('cancelAttachmentDetail', true),
              $router.replace({ name: 'EditTaskDetail' })
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

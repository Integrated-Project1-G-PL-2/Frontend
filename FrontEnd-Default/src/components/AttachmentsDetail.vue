<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { userName } from '@/stores/UserManager'

const deClareemit = defineEmits([
  'saveAttachmentDetail',
  'cancelAttachmentDetail'
])

const router = useRouter()

const MAX_FILES = 10 // Maximum allowed attachments per task
const MAX_FILE_SIZE_MB = 20 // Maximum file size in MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024 // Convert to bytes

const newBoardName = ref(`${userName.value} personal board`)
const attachments = ref([]) // Store selected files
const errorFileCountMessage = ref('') // Error message for excess files
const errorFileSizeMessage = ref('') // Error message for oversized files

// Handle file selection
const selectFiles = (event) => {
  const selectedFiles = Array.from(event.target.files)

  // Reset error messages before new selection
  errorFileCountMessage.value = ''
  errorFileSizeMessage.value = ''

  // Check for file count limit
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
    errorFileCountMessage.value = `Each task can have a maximum of ${MAX_FILES} files. The following files were not added: ${excessFiles
      .map((file) => file.name)
      .join(', ')}`
  } else {
    attachments.value.push(...selectedFiles)
  }

  // Check for file size limit
  const oversizedFiles = selectedFiles.filter(
    (file) => file.size > MAX_FILE_SIZE_BYTES
  )
  if (oversizedFiles.length > 0) {
    errorFileSizeMessage.value = `Each file must be under ${MAX_FILE_SIZE_MB} MB. The following files exceed the size limit: ${oversizedFiles
      .map((file) => file.name)
      .join(', ')}`
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

          <!-- Display error message for excess file count -->
          <div v-if="errorFileCountMessage" class="text-red-600 mt-2">
            {{ errorFileCountMessage }}
          </div>

          <!-- Display error message for oversized files -->
          <div v-if="errorFileSizeMessage" class="text-red-600 mt-2">
            {{ errorFileSizeMessage }}
          </div>
        </div>
      </div>

      <div class="flex flex-row w-full justify-end border-t h-[60%]">
        <button
          class="itbkk-button-ok bg-green-400 rounded-[2px] w-[60px] h-[25px] font-sans btn-xs text-center flex gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="newAttachment"
        >
          <div class="btn text-center">Confirm</div>
        </button>
        <button
          class="itbkk-button-cancel bg-red-400 rounded-[2px] w-[50px] h-[25px] font-sans btn-xs text-center flex gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="
            ;[
              $emit('cancelAttachmentDetail', true),
              router.replace({ name: 'EditTaskDetail' })
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

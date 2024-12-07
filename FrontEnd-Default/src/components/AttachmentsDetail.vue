<script setup>
// Import required dependencies and setup
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userName } from '@/stores/UserManager'

const deClareemit = defineEmits([
  'saveAttachmentDetail',
  'cancelAttachmentDetail',
  'limitMostListsFilesDetail',
  'limitFilesDetail',
  'limitListsFilesDetail',
  'largeFilesDetail',
  'sameFilesDetail',
  'listsSameFilesDetail',
  'errorMessage'
])
const router = useRouter()

// Constants for file limits
const MAX_FILES = 10
const MAX_FILE_SIZE_MB = 20
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

// Reactive variables
const newBoardName = ref(`${userName.value} personal board`)
const attachments = ref([])
const errorFileCountMessage = ref('')
const errorFileSizeMessage = ref('')
const errorFileDuplicateMessage = ref('')
const errorMessages = ref([])

const selectFiles = (event) => {
  const selectedFiles = Array.from(event.target.files)

  // Reset error messages before new selection
  let errors = []

  // Check for oversized files and filter them out
  const validFiles = selectedFiles.filter(
    (file) => file.size <= MAX_FILE_SIZE_BYTES
  )
  const oversizedFiles = selectedFiles.filter(
    (file) => file.size > MAX_FILE_SIZE_BYTES
  )

  if (oversizedFiles.length > 0) {
    errors.push(
      `Each file must be under ${MAX_FILE_SIZE_MB} MB. The following files exceed the size limit and were not added: ${oversizedFiles
        .map((file) => file.name)
        .join(', ')}`
    )
  }

  // Filter out duplicate files based on filename
  const newFiles = validFiles.filter(
    (file) => !attachments.value.some((att) => att.name === file.name)
  )
  const duplicateFiles = validFiles.filter((file) =>
    attachments.value.some((att) => att.name === file.name)
  )

  if (duplicateFiles.length > 0) {
    errors.push(
      `File with the same filename cannot be added or updated to the attachments. Please delete the attachment and add again to update the file: ${duplicateFiles
        .map((file) => file.name)
        .join(', ')}`
    )
  }

  // Check file count limit
  const totalFiles = attachments.value.length + newFiles.length
  if (totalFiles > MAX_FILES) {
    const allowedFiles = newFiles.slice(0, MAX_FILES - attachments.value.length)
    const excessFiles = newFiles.slice(MAX_FILES - attachments.value.length)

    attachments.value.push(...allowedFiles)
    errors.push(
      `Each task can have a maximum of ${MAX_FILES} files. The following files were not added due to the file count limit: ${excessFiles
        .map((file) => file.name)
        .join(', ')}`
    )
  } else {
    attachments.value.push(...newFiles)
  }

  // Update error messages reactively
  errorMessages.value = errors
  deClareemit('errorMessage', errors)
  // Clear messages after 3 seconds
  if (errors.length > 0) {
    setTimeout(() => {
      errorMessages.value = []
    }, 3000)
  }
}

// Function to remove file
const removeFile = (index) => {
  attachments.value.splice(index, 1)
}
const isAttachmentsNull = computed(() => {
  return !attachments.value || attachments.value.length === 0
})

const isAttachmentsFiles = computed(() => {
  return attachments.value.length >= MAX_FILES
})
const newAttachment = async () => {
  try {
    const formData = new FormData()
    attachments.value.forEach((file) => formData.append('attachments', file))

    const response = await axios.post('/api/tasks/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (response.status === 200) {
      deClareemit('saveAttachmentDetail', attachments.value)
      alert('Attachments saved successfully!')
      router.replace({ name: 'EditTaskDetail' })
    } else {
      throw new Error('Failed to save attachments.')
    }
  } catch (error) {
    const errorMessage = `Error saving attachments: ${error.message}`
    deClareemit('errorMessage', [errorMessage]) // ส่ง error message ไปยัง parent component
    alert(errorMessage) // แสดง error message ใน alert
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
              {{ index + 1 }}. {{ file.name }}
              <button
                @click="removeFile(index)"
                class="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete File
              </button>
            </li>
          </ul>

          <div v-if="errorMessages.length > 0" class="text-red-600 mt-2">
            <ul>
              <li v-for="(message, index) in errorMessages" :key="index">
                {{ index + 1 }}. {{ message }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex flex-row w-full justify-end border-t h-[60%]">
        <button
          :disabled="isAttachmentsNull"
          class="itbkk-button-ok bg-green-400 rounded-[2px] w-[60px] h-[25px] font-sans btn-xs text-center flex gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="newAttachment"
        >
          <div class="btn text-center">Save</div>
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

<script setup>
import { ref, reactive } from 'vue'
import { deleteItemById, deleteAndTransferItem } from '@/utils/fetchUtils'
import { useStatusManager } from '@/stores/StatusManager'
import { useRoute, useRouter } from 'vue-router'
const deClareemit = defineEmits(['cancelPopUp', 'confirmPopUp'])
const props = defineProps(['isChange', 'isRemove', 'isLeave', 'operate'])

const router = useRouter()
const deletedStatuses = reactive({})
const statusSelect = ref() //ชั่วคราว
const statusManager = useStatusManager()
const route = useRoute()
const confirmLeaveCollab = async function () {
  try {
    const { boardId, collabOid } = operation.value
    const response = await deleteItemById(
      `/boards/${boardId}/collabs/${collabOid}`
    )

    if (response.status === 200) {
      router.replace({ name: 'Board' }) // Redirect to the board page after successful delete
    } else if (response.status === 401) {
      router.replace({ name: 'Login' }) // Unauthorized, redirect to login
    } else if (response.status === 403 || response.status === 404) {
      router.replace({ name: 'Board' }) // Forbidden or Not Found, redirect to board page
    } else {
      error.value = true // Show error popup for other issues
    }
  } catch (err) {
    error.value = true // Handle unexpected errors
  }
  leaveCollab.value = false // Close the confirmation modal
}
const saveClick = async () => {
  if (isNameOverLimit.value || isDescriptionOverLimit.value) {
    return
  }
  if (prop.operate === 'change') {
    const addedStatus = await addItem(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/statuses`,
      status
    )
    if (addedStatus != null) {
      statusManager.addStatuses(addedStatus)
      emits('showStatusGreenPopup', {
        taskStatus: addedStatus.name,
        operate: prop.operate
      })
    } else {
      emits('showStatusRedPopup', {
        taskStatus: status.name,
        operate: prop.operate
      })
    }
  } else if (prop.operate === 'delete') {
    status.description =
      status.description == null
        ? status.description
        : status.description.trim()
    const editedStatus = await editItem(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/statuses`,
      prop.statusDetail.value.id,
      { name: status.name, description: status.description }
    )
    if (editedStatus != null) {
      statusManager.editStatues(
        prop.statusDetail.value.id,
        editedStatus.id,
        editedStatus
      )
      emits('showStatusGreenPopup', {
        taskStatus: editedStatus.name,
        operate: prop.operate
      })
    } else {
      emits('showStatusRedPopup', {
        taskStatus: '',
        operate: prop.operate
      })
    }
  }
  router.replace({ name: 'StatusList' })
  emits('showStatusDetailModal')
}
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
    v-if="props.isLeave"
  >
    <div class="w-[30%] m-[auto] mt-[20%] border border-gray-600 h-[200px]">
      <div class="flex flex-col justify-between bg-white p-4 h-[100px]">
        <div class="itbkk-title w-full h-[70px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify">Leave Board</h1>
        </div>

        <div class="w-[70%] h-[100%]">
          <div class="itbkk-message pl-4 mt-4">
            Do you want to leave this "" board?
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="confirmLeaveCollab"
          >
            <div class="btn text-center">Confirm</div>
          </button>

          <button
            class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click=";[$emit('cancelPopUp', true)]"
          >
            <div class="btn text-center">Cancel</div>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
    v-if="props.isChange"
  >
    <div class="w-[30%] m-[auto] mt-[20%] border border-gray-600 h-[200px]">
      <div class="flex flex-col justify-between bg-white p-4 h-[100px]">
        <div class="itbkk-title w-full h-[70px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify">Change Access Right</h1>
        </div>

        <div class="w-[70%] h-[100%]">
          <div class="itbkk-message pl-4 mt-4">
            Do you want to change access right of " " to ""
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click=""
          >
            <div class="btn text-center">Confirm</div>
          </button>

          <button
            class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click=";[$emit('cancelPopUp', true)]"
          >
            <div class="btn text-center">Cancel</div>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
    v-if="props.isRemove"
  >
    <div class="w-[30%] m-[auto] mt-[20%] border border-gray-600 h-[200px]">
      <div class="flex flex-col justify-between bg-white p-4 h-[100px]">
        <div class="itbkk-title w-full h-[70px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify">Remove Collaborator</h1>
        </div>

        <div class="w-[70%] h-[100%]">
          <div class="itbkk-message pl-4 mt-4">
            Do you want to remove "" from the board?
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click=""
          >
            <div class="btn text-center">Confirm</div>
          </button>

          <button
            class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click=";[$emit('cancelPopUp', true)]"
          >
            <div class="btn text-center">Cancel</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

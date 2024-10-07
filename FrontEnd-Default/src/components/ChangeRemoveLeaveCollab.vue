<script setup>
import { ref, reactive } from 'vue'
import { deleteItemById } from '@/utils/fetchUtils'
import { useStatusManager } from '@/stores/StatusManager'
import { useRoute, useRouter } from 'vue-router'
import { useCollaboratorManager } from '@/stores/CollaboratorManager'
const deClareemit = defineEmits([
  'cancelPopUp',
  'confirmDeletePopUp',
  'confirmChangePopUp',
  'confirmLeavePopUp',
  'collabId',
  'permissionRemovePopUp',
  'errorCollabs',
  'notCollabPopUp',
  'confirmLeaveErrorPopUp',
  'permissionAccessPopUp'
])

const props = defineProps([
  'isChange',
  'isRemove',
  'isLeave',
  'operate',
  'NameLeaveCollabBoard',
  'NameRemoveCollabBoard',
  'NameChangeCollabBoard'
])
const error = ref(false)
const router = useRouter()
const collaboratorManager = useCollaboratorManager()
const route = useRoute()
const deletedCollab = reactive({})
const leaveCollab = reactive({})
const collaborators = collaboratorManager.changeCollaboratorAccessRight()
const confirmLeaveCollab = async function (leaveId) {
  leaveCollab.value = await deleteItemById(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/collabs`,
    leaveId
  )
  if (leaveCollab.value == '401') {
    router.replace({ name: 'Login' })
    deClareemit('confirmDeletePopUp', true)
    return
  } // else if (
  //   deletedCollab.value !== '200' &&
  //   deletedCollab.value !== '200' &&
  //   deletedCollab.value !== '401' &&
  //   deletedCollab.value !== '403' &&
  //   deletedCollab.value !== '404''
  // ) {
  //   deClareemit('errorCollabs', true)
  //   deClareemit('confirmDeletePopUp', true)
  //   return
  // }
  else {
    collaboratorManager.deleteCollaborator(leaveId)
    deClareemit('confirmDeletePopUp', true)
  }
}
const removeCollaborator = async (deleteId) => {
  deletedCollab.value = await deleteItemById(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/collabs`,
    deleteId
  )
  if (deletedCollab.value == '401') {
    router.replace({ name: 'Login' })
    deClareemit('confirmDeletePopUp', true)
    return
  } else if (deletedCollab.value == '403') {
    deClareemit('permissionRemovePopUp', true)
    deClareemit('confirmDeletePopUp', true)
    return
  } else if (deletedCollab.value == '404') {
    deClareemit('notCollabPopUp', true)
    deClareemit('confirmDeletePopUp', true)
    return
  } // else if (
  //   deletedCollab.value !== '200' &&
  //   deletedCollab.value !== '201' &&
  //   deletedCollab.value !== '401' &&
  //   deletedCollab.value !== '403' &&
  //   deletedCollab.value !== '404''
  // ) {
  //   deClareemit('errorCollabs', true)
  //   deClareemit('confirmDeletePopUp', true)
  //   return
  // }
  else {
    collaboratorManager.deleteCollaborator(deleteId)
    deClareemit('confirmDeletePopUp', true)
  }
}

const updateCollaboratorAccessRight = (collabOid) => {
  const collaborator = collaborators.findIndexById(
    (collab) => collab.id === collabOid
  )
  if (collaborator.value == 401) {
    router.replace({ name: 'Login' })
    deClareemit('confirmChangePopUp', true)
    return
  } else if (collaborator.value == 403) {
    deClareemit('permissionAccessPopUp', true)
    deClareemit('confirmChangePopUp', true)
    return
    // } else if ( collaborator.value !== '200' && collaborator.value !== 200 && collaborator.value !== 401 &&collaborator.value !== 403 ) {
    //   deClareemit('errorCollabs', true)
    //   deClareemit('confirmChangePopUp', true)
    //   return
    //
  } else {
    collaborator.accessRight =
      collaborator.accessRight === 'READ' ? 'WRITE' : 'READ'
    deClareemit('confirmChangePopUp', true)
  }
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
            Do you want to leave this "{{ props.NameLeaveCollabBoard.value }}"
            board?
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="confirmLeaveCollab()"
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
            Do you want to change access right of "
            {{ props.NameChangeCollabBoard.value }}" to "{{
              props.NameChangeCollabBoard.value
            }}"
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="updateCollaboratorAccessRight()"
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
            Do you want to remove "{{ props.NameRemoveCollabBoard.value }}" from
            the board?
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="removeCollaborator()"
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

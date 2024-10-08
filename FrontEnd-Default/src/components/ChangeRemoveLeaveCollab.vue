<script setup>
import { ref, reactive } from 'vue'
import { deleteItemById, editReadWrite } from '@/utils/fetchUtils'
import { useStatusManager } from '@/stores/StatusManager'
import { useRoute, useRouter } from 'vue-router'
import { useCollaboratorManager } from '@/stores/CollaboratorManager'
import { useBoardManager } from '@/stores/BoardManager'
const deClareemit = defineEmits([
  'cancelPopUp',
  'confirmDeletePopUp',
  'confirmChangePopUp',
  'confirmLeavePopUp',
  'collabId',
  'permissionRemovePopUp',
  'errorRemoveCollabs',
  'errorChangeCollabs',
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
const boardManager = useBoardManager()
const collaboratorManager = useCollaboratorManager()
const route = useRoute()
const deletedCollab = reactive({})
const editCollab = reactive({})
const leaveCollab = reactive({})
const collaborators = collaboratorManager.changeCollaboratorAccessRight()
const confirmLeaveCollab = async function (leaveId) {
  leaveCollab.value = await deleteItemById(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${
      props.NameLeaveCollabBoard.value.id
    }/collabs`,
    props.NameLeaveCollabBoard.value.userId
  )

  if (leaveCollab.value == '401') {
    router.replace({ name: 'Login' })
    deClareemit('confirmDeletePopUp', true)
    return
  }
  // else if (
  //   leaveCollab.value !== '200' &&
  //   leaveCollab.value !== '201' &&
  //   leaveCollab.value !== '401' &&
  //   leaveCollab.value !== '403' &&
  //   leaveCollab.value !== '404'
  // ) {
  //   deClareemit('errorLeaveCollabs', true)
  //   deClareemit('confirmDeletePopUp', true)
  //   return
  // }
  else {
    boardManager.deleteBoard(leaveId)
    deClareemit('confirmLeavePopUp', true)
  }
}
const removeCollaborator = async (removeId) => {
  deletedCollab.value = await deleteItemById(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/collabs`,
    removeId
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
    collaboratorManager.deleteCollaborator(removeId)
    deClareemit('confirmDeletePopUp', true)
    return
  } // else if (
  //   deletedCollab.value !== '200' &&
  //   deletedCollab.value !== '201' &&
  //   deletedCollab.value !== '401' &&
  //   deletedCollab.value !== '403' &&
  //   deletedCollab.value !== '404''
  // ) {
  //   deClareemit('errorRemoveCollabs', true)
  //   deClareemit('confirmDeletePopUp', true)
  //   return
  // }
  else {
    collaboratorManager.deleteCollaborator(removeId)
    deClareemit('confirmDeletePopUp', true)
  }
}

const updateCollaboratorAccessRight = async function () {
  editCollab.value = await editReadWrite(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/collabs`,
    props.NameChangeCollabBoard.value.id,
    props.NameChangeCollabBoard.value.accessChange
  )

  if (editCollab.value == '401') {
    router.replace({ name: 'Login' })
    deClareemit('errorChangeCollabs', true)
    return
  }
  // else if ( editCollab.value !== '200' && editCollab.value !== 201 && editCollab.value !== 401 && editCollab.value !== 403 ) {
  //     //   deClareemit('errorChangeCollabs', true)
  //     //   deClareemit('confirmChangePopUp', true)
  //     //   return
  else {
    collaboratorManager.editCollaborator(editCollab.value.oid, editCollab.value)
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
            Do you want to leave this "{{
              props.NameLeaveCollabBoard.value.name
            }}" board?
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="confirmLeaveCollab(props.NameLeaveCollabBoard.value.id)"
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
            {{ props.NameChangeCollabBoard.value.name }}" to "{{
              props.NameChangeCollabBoard.value.accessChange
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
            Do you want to remove "{{ props.NameRemoveCollabBoard.value.name }}"
            from the board?
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="removeCollaborator(props.NameRemoveCollabBoard.value.id)"
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

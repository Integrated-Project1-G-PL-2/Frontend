<script setup>
import { ref, reactive } from 'vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
  acceptInvite,
  cancelInvite
} from '../utils/fetchUtils.js'
import { useRoute, useRouter } from 'vue-router'
import { useCollaboratorManager } from '@/stores/CollaboratorManager'
import { useBoardManager } from '@/stores/BoardManager'
const collaboratorManager = useCollaboratorManager()
const router = useRouter()
const boardManager = useBoardManager()
const deClareemit = defineEmits([
  'cancelInvitationPopUp',
  'openAccept',
  'openDecline',
  'confirmAcceptInvatation',
  'confirmRemoveInvatation'
])

const route = useRoute()
const props = defineProps([
  'isDecline',
  'isAccept',
  'operate',
  'boardAcceptDetail',
  'boardDeclineDetail'
])

const confirmAcceptInvatationCollab = async function (boardAcceptId) {
  const accept = await acceptInvite(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${
      props.boardAcceptDetail.value.boardId
    }/invitation`
  )
  boardManager.addBoard(boardAcceptId, 'collab')
  deClareemit('confirmAcceptInvatation', true)
  console.log(accept)
}
const confirmRemoveInvatationCollab = async function (boardDeclineId) {
  const cancel = await cancelInvite(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${
      props.boardDeclineDetail.value.boardId
    }/invitation`
  )
  boardManager.deleteBoard(boardDeclineId, 'collab')
  deClareemit('confirmRemoveInvatation', true)
  console.log(cancel)
}
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
    v-if="props.isAccept"
  >
    <div
      class="itbkk-modal-alert w-[30%] m-[auto] mt-[20%] border border-gray-600 h-[200px]"
    >
      <div class="flex flex-col justify-between bg-white p-4 h-[100px]">
        <div class="itbkk-title w-full h-[70px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify">Accept Invitation</h1>
        </div>

        <div class="w-[70%] h-[100%]">
          <div class="itbkk-message pl-4 mt-4">
            Do you want to accept this
            {{ props.boardAcceptDetail.value.boardName }} to become collaborator
            of the board?
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="
              confirmAcceptInvatationCollab(
                props.boardAcceptDetail.value.boardId
              )
            "
          >
            <div class="btn text-center">Confirm</div>
          </button>

          <button
            class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click=";[$emit('cancelInvitationPopUp', true)]"
          >
            <div class="btn text-center">Cancel</div>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
    v-if="props.isDecline"
  >
    <div
      class="itbkk-modal-alert w-[30%] m-[auto] mt-[20%] border border-gray-600 h-[200px]"
    >
      <div class="flex flex-col justify-between bg-white p-4 h-[100px]">
        <div class="itbkk-title w-full h-[70px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify">Decline Invitation</h1>
        </div>

        <div class="w-[70%] h-[100%]">
          <div class="itbkk-message pl-4 mt-4">
            Do you want this {{ props.boardDeclineDetail.value.boardName }} to
            be remove from board's collaborator
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="
              confirmRemoveInvatationCollab(
                props.boardDeclineDetail.value.boardId
              )
            "
          >
            <div class="btn text-center">Confirm</div>
          </button>

          <button
            class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click=";[$emit('cancelInvitationPopUp', true)]"
          >
            <div class="btn text-center">Cancel</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cancelInvite } from '../utils/fetchUtils.js'
import { useCollaboratorManager } from '@/stores/CollaboratorManager'
import { useBoardManager } from '@/stores/BoardManager'
const deClareemit = defineEmits([
  'confirmCancelInvatation',
  'cancelDetail',
  'redAlert'
])
const props = defineProps(['boardCancelDetail'])
const router = useRouter()
const route = useRoute()
const collaboratorManager = useCollaboratorManager()
const boardManager = useBoardManager()
const confirmCancelInvatationCollab = async function (boardCancelId) {
  const cancel = await cancelInvite(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/invitation`,props.boardCancelDetail.value.id
  )

  collaboratorManager.deleteCollaborator(boardCancelId, 'pending')
  deClareemit('confirmCancelInvatation', true)
}

console.log(props.boardCancelDetail.value)
</script>

<template>
  <div
    class="itbkk-message bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
  >
    <div class="w-[59%] m-[auto] border border-green-700 mt-[20%]">
      <div class="flex flex-col justify-between bg-white p-4 h-[10%]">
        <div class="itbkk-title w-full h-[40px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify">Cancel Invitation</h1>
        </div>

        <div class="w-[70%] h-[100%]">
          <div class="flex pl-4 mt-5">
            Do you want to cancel invitation to
            {{ props.boardCancelDetail.value.boardName }}?
          </div>
        </div>
      </div>
      <div class="flex flex-row w-full justify-end border-t h-[60%]">
        <button
          class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="
            confirmCancelInvatationCollab(props.boardCancelDetail.value.id)
          "
        >
          <div class="btn text-center">Confirm</div>
        </button>
        <button
          class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="
            ;[
              $emit('cancelDetail', true),
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

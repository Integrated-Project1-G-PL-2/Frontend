<script setup>
import { ref, reactive } from 'vue'
import { deleteItemById } from '@/utils/fetchUtils'
import { useStatusManager } from '@/stores/StatusManager'
import { useRoute, useRouter } from 'vue-router'
const deClareemit = defineEmits(['cancelStatusDetail','confirmStatusDetail','redAlert','greenAlert'])
const props = defineProps(['statusId', 'isDelete', 'isTransfer','operate'])
const router = useRouter()
const deletedStatuses = reactive({})
const statusSelect = ref() //ชั่วคราว
const statusManager = useStatusManager()

const deleteStatus = async (deleteId) => {
  deletedStatuses.value = await deleteItemById(
    import.meta.env.VITE_BASE_URL_V2,
    deleteId
  )
  if (deletedStatuses.value == '404') {
    deClareemit('redAlert', {
      taskStatus: props.statusId.value.statusName,
      operate: props.operate
    })
    deClareemit('cancelStatusDetail', true)
    router.replace({ name: 'StatusList' })
    return
  }
  statusManager.deleteStatuses(deleteId)
  router.replace({ name: 'StatusList' })
  deClareemit('greenAlert',{
      taskStatus: props.statusId.value.statusName,
      operate: props.operate
    })
  deClareemit('confirmStatusDetail', true)
}
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
    v-if="props.isDelete"
  >
    <div class="w-[30%] m-[auto] mt-[20%] border border-gray-600 h-[200px]">
      <div class="flex flex-col justify-between bg-white p-4 h-[100px]">
        <div class="itbkk-title w-full h-[70px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify">Delete a Task</h1>
        </div>

        <div class="w-[70%] h-[100%]">
          <div class="itbkk-message pl-4 mt-4">
            Do you want to delete the task " {{ props.statusId.value.statusName }}" ?
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="deleteStatus(props.statusId.value.id)"
          >
            <div class="btn text-center">Confirm</div>
          </button>

          <button
            class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="
              ;[
                $emit('cancelStatusDetail', true),
                $router.replace({ name: 'StatusList' })
              ]
            "
          >
            <div class="btn text-center">Cancel</div>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
    v-if="props.isTransfer"
  >
    <div
      class="max-w-[500px] mx-auto mt-[20%] border border-gray-600 h-[200px]"
    >
      <div class="flex flex-col justify-between bg-white p-4 h-[100px]">
        <div class="itbkk-title w-full h-[70px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify">Transfer a Status</h1>
        </div>

        <div
          class="flex flex-row items-center justify-between w-[70%] h-[100%]"
        >
          <div class="itbkk-message pl-4 mt-4">
            There is some task associated with the "{{ props.statusId.value.statusName }}" status. Transfer to
            <select
              v-model="statusSelect"
              class="itbkk-status mt-1 ml-4 select select-bordered w-[150px] h-[30px] px-2 py-1 bg-inherit border-2 border-gray-200 text-gray-400 rounded-md text-sm text-justify"
            >
              <option value="NO_STATUS">No Status</option>
              <option value="TO_DO">To Do</option>
              <option value="DOING">Doing</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="deleteStatus( props.statusId.value.id)"
          >
            <div class="btn text-center">Confirm</div>
          </button>

          <button
            class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="
              ;[
                $emit('cancelStatusDetail', true),
                $router.replace({ name: 'StatusList' })
              ]
            "
          >
            <div class="btn text-center">Cancel</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

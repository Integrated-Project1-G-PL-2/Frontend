<script setup>
import { reactive, ref } from 'vue'
defineEmits(['closeStatusPopUP'])
const prop = defineProps({
  taskDetail: Object,
  operate: String
})
let task
if (prop.taskDetail?.value) {
  task = reactive({
    createdOn: new Date(prop.taskDetail.value.createdOn)
      .toLocaleString('en-GB')
      .replace(',', ''),
    id: prop.taskDetail.value.id,
    taskAssignees:
      prop.taskDetail.value.assignees != null
        ? prop.taskDetail.value.assignees
        : 'Unassigned',
    taskDescription:
      prop.taskDetail.value.description != null
        ? prop.taskDetail.value.description
        : 'No Description Provided',
    taskStatus: prop.taskDetail.value.status,
    taskTitle: prop.taskDetail.value.title,
    updatedOn: new Date(prop.taskDetail.value.updatedOn)
      .toLocaleString('en-GB')
      .replace(',', '')
  })
} else {
  task = reactive({
    createdOn: null,
    id: null,
    taskAssignees: null,
    taskDescription: null,
    taskStatus: null,
    taskTitle: null,
    updatedOn: null
  })
}
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px] overflow-auto"
  >
    <div class="w-[90%] m-[auto]">
      <div class="flex flex-col justify-between bg-white p-4">
        <div class="w-full h-[10%] mt-2">
          <div class="pl-4 mt-4">Add Status</div>
        </div>
        <div class="border-b w-full mt-4"></div>
        <div class="itbkk-modal-status w-full h-[10%] mt-2">
          <div class="pl-4 mt-4">Name</div>
          <textarea
            class="itbkk-status-name w-[1090px] h-[40%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
          >
          </textarea>
        </div>

        <div class="w-[70%] h-[50%]">
          <div class="pl-4 mt-4">Description</div>
          <div class="w-full h-[320px]">
            <textarea
              class="itbkk-status-description w-[1090px] h-[90%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="No Description Provided"
            ></textarea>
          </div>
        </div>
        <div class="mt-10 ml-4" style="display: flex">
          <div class="itbkk-timezone" style="display: flex">
            <div style="margin-right: 20px">
              TimeZone : {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
            </div>
            <div class="itbkk-created-on" style="margin-right: 20px">
              <div>Created On : {{ task.createdOn }}</div>
            </div>
            <div class="itbkk-updated-on">
              <div>Updated On : {{ task.updatedOn }}</div>
            </div>
          </div>
        </div>

        <div class="flex flex-row w-full justify-end border-t">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
          >
            save
          </button>
          <button
            class="itbkk-button-cancel bg-gray-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
            @click="
              ;[
                $emit('closeStatusPopUP', true),
                $router.replace({ name: 'StatusList' })
              ]
            "
          >
            <div class="btn">cancel</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

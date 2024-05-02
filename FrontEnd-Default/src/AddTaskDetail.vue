<script setup>
import {reactive,ref } from 'vue'
import TaskManagement from './utils/TaskManager';
import { addItem } from './utils/fetchUtils';
const taskManager = TaskManagement

defineEmits(['closeAddPopUp'])
const taskDetailForm = reactive({
  taskTitle: '',
  taskAssignees: '',
  taskDetail: '',
  taskStatus: ''
})

const showAddAlert = ref(false)
const saveTask = async (newDetail) => {
  //ADD Mode
  if (newDetail.id === undefined) {
    const addedTask = await addItem(import.meta.env.VITE_BASE_URL,taskDetailForm) 
    taskManager.addTask(addedTask)
  }
  showAddAlert.value = true
}
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]   "
  >
  <div
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
      role="alert"
      v-show="showAddAlert"
    >
      <strong class="font-bold">Success!!</strong>
      <p>
        <span class="itbkk-message block sm:inline">
          The task "{{ taskDetailForm.title }}" is added successfully</span
        >
      </p>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg
          class="fill-current h-6 w-6 text-green-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          @click="showAddAlert = false"
        >
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </span>
    </div>
    <div class="w-[90%]  m-[auto] " >
      <div class="flex flex-col justify-between bg-white p-4">
        <div class="itbkk-title w-full h-[10%] mt-2">
          <h1 class="text-xl font-bold text-justify">New Task</h1>
        </div>
        <div class="border-b w-full mt-4"></div>
     <div class="w-[70%] h-[40%]">
          <div class="pl-4 mt-4">Title</div> 
      <div class="w-full h-[20px] mb-8">
            <input
              v-model.trim="taskDetailForm.title"
              class="itbkk-description w-[900px] h-[35px] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your text here..."
            ></input>
          </div> 
       </div>
        <div class="flex flex-row">
          <div class="w-[70%] h-[50%]">
            <div class="pl-4 mt-4">Description</div>
            <div class="w-full h-[420px]">
              <textarea
              v-model.trim="taskDetailForm.description"
                class="itbkk-description w-[95%] h-[90%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter your text here..."
              ></textarea>
            </div>
          </div>
          <div class="w-[30%] h-[50%] flex-col">
            <div class="h-[180px]">
              <div class="pl-4 mt-4">Assignees</div>
              <div class="h-[150px]">
                <textarea
                  v-model.trim="taskDetailForm.assignees"
                  class="itbkk-assignees w-[95%] h-[90%] px-4 py-2 mx-4 my-2 bbg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Enter your text here..."
                ></textarea>
              </div>
            </div>
            <div class="w-full h-[100px]">
              <label class="form-control w-full pl-4">
                <div class="label">
                  <span class="label-text ml-4">Status</span>
                </div>
                <select
                  v-model="taskDetailForm.status"
                  class="itbkk-status mt-1 ml-4 select select-bordered w-[95%] h-[40px] px-4 py-2 bg-inherit border-2 border-gray-200 text-gray-400 rounded-md"
                >
                  <option disabled selected>Status</option>
                  <option value="TO_DO">To Do</option>
                  <option value="DOING">Doing</option>
                  <option value="DONE">Done</option>
                  <option value="NO_STATUS">No Status</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-2"
            :style="{
                backgroundColor:
                !taskDetailForm.title 
                    ? '#cbd5e1' :  '#4ade80'
              }"
            :disabled="!taskDetailForm.title "
           @click="saveTask"
          >
            <div class="btn text-center">Ok</div>
          </button>
          <button
            class="itbkk-button-cancel bg-gray-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-2"
            @click="
              ;[$emit('closeAddPopUp', true), $router.replace({ name: 'Task' })]
            "
          >
            <div class="btn text-center">Close</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

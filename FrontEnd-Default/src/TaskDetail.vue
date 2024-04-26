<script setup>
defineProps({ id: String })
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px]"
  >
    <div class="w-[90%] m-[auto]">
      <div class="flex flex-col justify-between bg-white p-4">
        <div class="itbkk-title w-full h-[10%] mt-2">
          <h1 class="text-xl font-bold text-justify">
            Design Backend API for PBI 1,2
          </h1>
        </div>
        <div class="border-b w-full mt-4"></div>
        <div class="flex flex-row">
          <div class="w-[70%] h-[50%]">
            <div class="pl-4 mt-4">Description</div>
            <div class="w-full h-[420px]">
              <textarea
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
                  class="itbkk-status mt-1 ml-4 select select-bordered w-[95%] h-[40px] px-4 py-2 bg-inherit border-2 border-gray-200 text-gray-400 rounded-md"
                >
                  <option disabled selected>Status</option>
                  <option>To do</option>
                  <option>Doing</option>
                  <option>Done</option>
                </select>
              </label>
            </div>
            <div class="mt-10 ml-4">
              <div class="itbkk-timezone">
                <div>TimeZone :</div>
                <div></div>
              </div>
              <div class="itbkk-created-on">
                <div>Created On :</div>
                <div></div>
              </div>
              <div class="itbkk-updated-on">
                <div>Updated On :</div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t">
          <button
            class="itbkk-button bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-2"
            @click="$emit('setDetail', false)"
          >
            <div class="btn text-center">Ok</div>
          </button>
          <button
            class="itbkk-button bg-gray-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-2"
            @click="$emit('setDetail', false)"
          >
            <div class="btn text-center">Close</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

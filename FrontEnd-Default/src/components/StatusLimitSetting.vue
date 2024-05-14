<script setup>
defineEmits(['clearLimitPopUp'])
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
  >
    <div
      class="itbkk-modal-setting max-w-[500px] mx-auto mt-[20%] border border-gray-600 h-[200px]"
    >
      <div class="flex flex-col justify-between bg-white p-4 h-[100px]">
        <div class="itbkk-title w-full h-[70px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify">Status Settings</h1>
        </div>

        <div
          class="flex flex-row items-center justify-between w-[70%] h-[100%]"
        >
          <div class="pl-4 mt-4">
            Users can limit the number of task in a status by setting the
            Maximum tasks in each status(except "No Status" and "Done"
            statuses).
            <label
              class="itbkk-limit-task inline-flex items-center cursor-pointer"
            >
              <input type="checkbox" value="" class="sr-only peer" checked />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
              <span
                class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Limit tasks in this status</span
              >
            </label>
            <p>Maximum tasks</p>
            <input
              type="text"
              class="itbkk-max-task bg-gray-50 border text-gray-400 text-sm rounded-lg w-[210px]"
              placeholder="Write your Number tasks "
              required
            />
          </div>
        </div>
        <div class="flex flex-row w-full justify-end border-t h-[60%] mt-6">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
          >
            <div class="btn text-center">Save</div>
          </button>

          <button
            class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4"
            @click="
              ;[
                $emit('clearLimitPopUp', true),
                $router.replace({ name: 'Task' })
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

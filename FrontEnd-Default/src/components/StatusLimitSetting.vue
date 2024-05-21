<script setup>
defineEmits(['clearLimitPopUp'])
</script>

<template>
  <div
    class="itbkk-modal-setting fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
  >
    <div class="max-w-lg w-full bg-white border border-gray-600 p-4">
      <div class="border-b pb-2 mb-4">
        <h1 class="text-xl font-bold">Status Settings</h1>
      </div>
      <div class="flex flex-col space-y-4">
        <p>
          Users can limit the number of tasks in a status by setting the maximum
          tasks in each status (except "No Status" and "Done" statuses).
        </p>

        <label class="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            class="itbkk-limit-task sr-only peer"
            checked
          />
          <div
            class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
          ></div>
          <span
            class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Limit tasks in this status</span
          >
        </label>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Maximum tasks</label
          >
          <input
            type="text"
            class="itbkk-max-task mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg text-sm p-2.5"
            placeholder="Write your Number tasks"
            required
          />
        </div>
      </div>
      <div class="flex justify-end space-x-2 mt-4 border-t pt-4">
        <button
          class="bg-green-400 text-white py-1 px-3 rounded hover:bg-green-500"
        >
          Save
        </button>
        <button
          class="bg-red-400 text-white py-1 px-3 rounded hover:bg-red-500"
          @click="
            $emit('clearLimitPopUp', true), $router.replace({ name: 'Task' })
          "
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

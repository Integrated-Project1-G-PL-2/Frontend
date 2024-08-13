<script setup>
import { ref } from 'vue'
import Task from './../components/Task.vue'
import AlertPopUp from './../components/AlertPopUp.vue'
import { useRouter } from 'vue-router'

const showTaskModal = ref(false)
const showMessage = ref(false)
const username = ref('')
const password = ref('')
const router = useRouter()

const TaskModal = () => {
  router.replace({ name: 'Task' })
  showTaskModal.value = true
}

const redPopup = () => {
  showMessage.value = true
}

const closeRedPopup = () => {
  showMessage.value = false
}
</script>

<template>
  <div
    class="main flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <AlertPopUp
      v-if="showMessage"
      :titles="'Username or Password is incorrect.'"
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
      :operate="'delete'"
    />
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Welcome To ITB-KK</h1>
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="mb-4">
        <label for="first" class="block text-gray-700 font-semibold mb-2">
          Username
        </label>
        <input
          itbkk-username
          type="text"
          id="first"
          name="first"
          placeholder="Enter your Username"
          v-model.trim="username"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-gray-700 font-semibold mb-2">
          Password
        </label>
        <input
          itbkk-password
          type="password"
          id="password"
          name="password"
          placeholder="Enter your Password"
          v-model.trim="password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="wrap">
        <button
          itbkk-button-signin
          type="button"
          @click="TaskModal"
          :disabled="!username || !password"
          :class="{
            'bg-gray-400 cursor-not-allowed': !username || !password,
            'bg-purple-500 hover:bg-purple-600': username && password
          }"
          class="w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
        >
          Sign in
        </button>
      </div>
    </div>
  </div>
  <Teleport to="body" v-if="showTaskModal">
    <Task></Task>
  </Teleport>
</template>

<style scoped></style>

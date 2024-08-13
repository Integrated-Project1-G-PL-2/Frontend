<script setup>
import { ref, computed } from 'vue'
import Task from './../components/Task.vue'
import AlertPopUp from './../components/AlertPopUp.vue'
import { useRouter } from 'vue-router'

const showTaskModal = ref(false)
const showMessage = ref(false)
const username = ref('')
const password = ref('')
const router = useRouter()
const isUserNameOverLimit = ref(false)
const isPasswordOverLimit = ref(false)

// Computed properties for trimmed values
const trimmedUsername = computed(() => username.value.trim())
const trimmedPassword = computed(() => password.value.trim())

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

const checkUserNameLength = () => {
  isUserNameOverLimit.value = trimmedUsername.value.length > 50
}

const checkPasswordLength = () => {
  isPasswordOverLimit.value = trimmedPassword.value.length > 14
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
          v-model="username"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="checkUserNameLength"
          :class="{ 'border-red-600 text-red-600': isUserNameOverLimit }"
        />
        <div
          style="display: flex; align-items: center"
          v-if="isUserNameOverLimit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="-mt-px h-4 w-[20rem]"
            class="w-[15px] text-red-600"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
          <div class="text-sm text-red-600">
            Limit username to 50 characters or less.
          </div>
        </div>
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
          v-model="password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="checkPasswordLength"
          :class="{ 'border-red-600 text-red-600': isPasswordOverLimit }"
        />
        <div
          style="display: flex; align-items: center"
          v-if="isPasswordOverLimit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="-mt-px h-4 w-[20rem]"
            class="w-[15px] text-red-600"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
          <div class="text-sm text-red-600">
            Limit password to 14 characters or less.
          </div>
        </div>
      </div>

      <div class="wrap">
        <button
          itbkk-button-signin
          type="button"
          @click="TaskModal"
          :disabled="
            !trimmedUsername ||
            !trimmedPassword ||
            isUserNameOverLimit ||
            isPasswordOverLimit
          "
          :class="{
            'bg-gray-400 cursor-not-allowed':
              !trimmedUsername || !trimmedPassword,
            'bg-purple-500 hover:bg-purple-600':
              trimmedUsername && trimmedPassword
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

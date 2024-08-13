<script setup>
import { reactive, ref, computed } from 'vue'
import Task from './../components/Task.vue'
import AlertPopUp from './../components/AlertPopUp.vue'
import { useRouter } from 'vue-router'

const showTaskModal = ref(false)
const username = ref('')
const password = ref('')
const isPasswordVisible = ref(false) // State to toggle password visibility
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

const redPopup = reactive({
  incorrect: { state: false, taskTitle: '' },
  error: { state: false, taskTitle: '' }
})

const closeRedPopup = async function (operate) {
  router.push({ name: 'Login' })
  redPopup[operate].state = false
}

const checkUserNameLength = () => {
  isUserNameOverLimit.value = trimmedUsername.value.length > 50
}

const checkPasswordLength = () => {
  isPasswordOverLimit.value = trimmedPassword.value.length > 14
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<template>
  <div
    class="main flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <AlertPopUp
      v-if="redPopup.incorrect.state"
      :titles="'Username or Password is incorrect.'"
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="redPopup.error.state"
      :titles="'There is a problem. Please try again later.'"
      @closePopUp="closeRedPopup"
      message="Error!!"
      styleType="red"
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
        <div class="relative">
          <input
            itbkk-password
            :type="isPasswordVisible ? 'text' : 'password'"
            id="password"
            name="password"
            placeholder="Enter your Password"
            v-model="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="checkPasswordLength"
            :class="{ 'border-red-600 text-red-600': isPasswordOverLimit }"
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              v-if="isPasswordVisible"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              class="h-5 w-5 text-gray-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm0 4a4 4 0 00-4 4 4 4 0 008 0 4 4 0 00-4-4z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              class="h-5 w-5 text-gray-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.828a4 4 0 10-5.656 5.656M12 5c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z"
              />
            </svg>
          </button>
        </div>
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

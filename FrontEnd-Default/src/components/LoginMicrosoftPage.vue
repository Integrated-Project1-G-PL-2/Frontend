<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const keepSignedIn = ref(false)
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = () => {
  // Placeholder function for handling form submission
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-sm">
      <!-- Microsoft Logo -->
      <div class="flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          viewBox="0 0 21 21"
        >
          <rect x="1" y="1" width="9" height="9" fill="#f25022" />
          <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
          <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
          <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
        </svg>
        <h1 class="text-xl font-bold text-blue-600 ml-2">Microsoft</h1>
      </div>
      <h2 class="text-lg font-semibold mb-6 text-center">Sign in</h2>

      <!-- Email Input -->
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          required
        />
      </div>

      <!-- Password Input -->
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium mb-1"
          >Password</label
        >
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
          <div
            @click="togglePassword"
            class="absolute right-3 top-2 cursor-pointer"
          >
            <svg
              v-if="showPassword"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              class="h-5 w-5 text-gray-500"
            >
              <path
                d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              class="h-5 w-5 text-gray-500"
            >
              <path
                d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        @click="handleSubmit"
        :disabled="!email || !password"
        class="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Sign In
      </button>

      <!-- Go Back to Home Page -->
      <p class="text-center mt-4 text-sm text-gray-500">
        <a href="/" class="text-blue-500 hover:underline"
          >Go back to the home page</a
        >
      </p>
    </div>
  </div>
</template>

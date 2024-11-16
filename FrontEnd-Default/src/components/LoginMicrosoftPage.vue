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
          <button
            type="button"
            @click="togglePassword"
            class="absolute right-3 top-2 text-blue-500 text-sm font-semibold focus:outline-none"
          >
            {{ showPassword ? 'Hide' : 'Show' }}
          </button>
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

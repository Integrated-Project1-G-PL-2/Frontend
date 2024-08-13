<script setup>
import Task from './../components/Task.vue'
</script>

<template>
  <div
    class="main flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Welcome To ITB-KK</h1>
    <form class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="mb-4">
        <label for="first" class="block text-gray-700 font-semibold mb-2"
          >Username</label
        >
        <input
          itbkk-username
          type="text"
          id="first"
          name="first"
          placeholder="Enter your Username"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-gray-700 font-semibold mb-2"
          >Password</label
        >
        <input
          itbkk-password
          type="password"
          id="password"
          name="password"
          placeholder="Enter your Password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="wrap">
        <button
          itbkk-button-signin
          type="signIn"
          @click="showTaskModal = true"
          class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
        >
          Sign in
        </button>
      </div>
    </form>
  </div>
  <Teleport to="body" v-if="showTaskModal">
    <Task @showTaskModal="showTaskModal = true"></Task>
  </Teleport>
</template>

<style scoped></style>

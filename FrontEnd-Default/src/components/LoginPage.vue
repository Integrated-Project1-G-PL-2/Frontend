<script setup>
import { useRoute, useRouter } from 'vue-router'
</script>

<template>
  <div class="main">
    <h1>Welcome To ITB-KK</h1>
    <form action="">
      <label for="first"> Username: </label>
      <input
        type="text"
        id="first"
        name="first"
        placeholder="Enter your Username"
        required
      />

      <label for="password"> Password: </label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Enter your Password"
        required
      />

      <div class="wrap">
        <button type="signIn" onclick="solve()">Sign in</button>
      </div>
    </form>
  </div>
</template>
<style scoped></style>

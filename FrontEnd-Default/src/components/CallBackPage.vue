<template></template>

<script setup>
import { onMounted } from "vue";
onMounted(() => {
  const fragment = new URL(window.location.href).hash.substring(1);
  if (fragment) {
    const params = new URLSearchParams(fragment);
    const code = params.get("code");
    console.log(code);

    if (code) {
      window.history.replaceState(null, null, window.location.pathname);

      fetch(`http://localhost:8080/callback/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const error = await response.text();
            throw new Error(`Server error: ${error}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Token received:", data);
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error handling code:", error);
        });
    }
  }
});
</script>

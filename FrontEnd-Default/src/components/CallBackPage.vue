<template>callback</template>

<script setup>
import { msalService } from "../utils/msalService.js";
import { useRouter } from 'vue-router'
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const router = useRouter()

const accessToken = getCookie("access_token");
const refreshToken = getCookie("refresh_token");

localStorage.setItem('jwt', accessToken);
localStorage.setItem('refresh_token', refreshToken);
localStorage.setItem('loginFormMicrosoft', true);
router.replace({ name: 'Board' })

console.log(accessToken);
console.log(refreshToken);

// const handleRedirect = async () => {
//   const urlFragment = window.location.hash.substring(1); // Remove the leading #
//   const fragmentParams = new URLSearchParams(urlFragment);
//   const code = fragmentParams.get("code");
//   console.log(code);

//   if (code) {
//     console.log("test");

//     try {
//       // Send the code to the backend for token exchange
//       const response = await fetch("http://localhost:8080/callback/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ code }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to exchange authorization code");
//       }

//       console.log("Tokens received from backend:", await response.json());
//     } catch (error) {
//       console.error("Error during token exchange:", error);
//     }
//   }
// };

// handleRedirect();
</script>

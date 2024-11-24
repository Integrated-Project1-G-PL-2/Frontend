<script setup>
import { reactive, ref, computed } from 'vue'
import AlertPopUp from './../components/AlertPopUp.vue'
import { useRouter } from 'vue-router'
import {
  login,
  decodeJWT,
  useAuthGuard,
  refreshToken
} from '@/stores/UserManager'
import msalInstance from '@/stores/Mlogin'
const showTaskModal = ref(false)
const username = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const router = useRouter()
const isUserNameOverLimit = ref(false)
const isPasswordOverLimit = ref(false)
const incorrect = ref(false)
const error = ref(false)
const trimmedUsername = computed(() => username.value.trim())
const trimmedPassword = computed(() => password.value.trim())
const MAX_USERNAME_LENGTH = 50
const MAX_PASSWORD_LENGTH = 14

const handleLogin = async () => {
  const data = await login(
    {
      userName: trimmedUsername.value,
      password: trimmedPassword.value
    },
    router
  )

  if (data == '400' || data == '401') {
    incorrect.value = true
  } else if ((data != '400', data != '401')) {
    error.value = true
  }
  // ตรวจสอบเงื่อนไขว่ามีโทเค็นหรือไม่
  if (data && data.access_token) {
    const decodedToken = decodeJWT(data.access_token) // ถอดรหัส JWT เพื่อตรวจสอบข้อมูล
    // console.log('Decoded JWT:', decodedToken) // แสดงข้อมูล JWT ที่ถอดรหัสใน console

    // ตรวจสอบว่าค่าที่กรอกมาตรงกับข้อมูลใน JWT หรือไม่
    if (decodedToken.payload.sub === trimmedUsername.value) {
      // เปลี่ยนเส้นทางไปยังหน้า 'Task' และแสดง modal
      // เรียก useAuthGuard เพื่อเริ่มต้นการตรวจสอบ token
      useAuthGuard(router)
      router.replace({ name: 'Board' })
      showTaskModal.value = true
    } else {
      // If no access token is present, try refreshing the token
      const newAccessToken = await refreshToken(router)

      if (newAccessToken) {
        const decodedToken = decodeJWT(newAccessToken) // ถอดรหัส JWT เพื่อตรวจสอบข้อมูล

        if (decodedToken.payload.sub === trimmedUsername.value) {
          // เปลี่ยนเส้นทางไปยังหน้า 'Task' และแสดง modal
          useAuthGuard(router)
          router.replace({ name: 'Board' })
          showTaskModal.value = true
        }
      } else {
        // Handle the case where refreshing the token fails
        error.value = true
      }
    }
  }
}
const closeIncorrectAlter = () => {
  incorrect.value = false
}
const closeProblemAlter = () => {
  error.value = false
}

const checkUserNameLength = () => {
  if (trimmedUsername.value.length > MAX_USERNAME_LENGTH) {
    isUserNameOverLimit.value = true
    username.value = trimmedUsername.value.substring(0, MAX_USERNAME_LENGTH)
    setTimeout(() => {
      isUserNameOverLimit.value = false
    }, 1000)
  } else {
    isUserNameOverLimit.value = false
  }
}

const checkPasswordLength = () => {
  if (trimmedPassword.value.length > MAX_PASSWORD_LENGTH) {
    isPasswordOverLimit.value = true
    password.value = trimmedPassword.value.substring(0, MAX_PASSWORD_LENGTH)
    setTimeout(() => {
      isPasswordOverLimit.value = false
    }, 1000)
  } else {
    isPasswordOverLimit.value = false
  }
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
const initializeMSAL = async () => {
  try {
    await msalInstance.initialize()
    console.log('MSAL initialized successfully')
  } catch (error) {
    console.error('Error initializing MSAL:', error)
  }
}

// Call the initialization function during app startup
initializeMSAL()
const handleMSIPLogin = async () => {
  const router = useRouter()
  try {
    const loginResponse = await msalInstance.loginPopup({
      scopes: ['User.Read']
    })
    console.log('Login successful:', loginResponse)

    const account = msalInstance.getActiveAccount()
    if (account) {
      console.log('Account info:', account)
      router.replace({ name: 'Board' })
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}
// const handleMicrosoftLogin = async (authorizationCode) => {
//   try {
//     const response = await fetch('http://localhost:8080/callback/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: new URLSearchParams({ code: authorizationCode })
//     })

//     if (!response.ok) {
//       throw new Error('Failed to retrieve token from backend')
//     }

//     const tokens = await response.json()
//     console.log('Access Token:', tokens.access_token)

//     // เก็บ Access Token สำหรับใช้ใน API อื่นๆ
//     localStorage.setItem('accessToken', tokens.access_token)

//     // นำไปใช้งาน เช่น Redirect ไปยังหน้า Dashboard
//     router.replace({ name: 'Board' })
//   } catch (error) {
//     console.error('Login failed:', error)
//   }
// }
</script>

<template>
  <div
    class="main flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <AlertPopUp
      v-if="incorrect"
      :titles="'Username or Password is incorrect.'"
      @closePopUp="closeIncorrectAlter"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="error"
      :titles="'There is a problem. Please try again later.'"
      @closePopUp="closeProblemAlter"
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
          type="text"
          id="first"
          name="first"
          placeholder="Enter your Username"
          v-model="username"
          required
          class="itbkk-username w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            :type="isPasswordVisible ? 'text' : 'password'"
            id="password"
            name="password"
            placeholder="Enter your Password"
            v-model="password"
            required
            class="itbkk-password w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            class="w-[15px] text-red-600"
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="text-sm text-red-600">
            Limit password to 14 characters or less.
          </div>
        </div>
      </div>

      <div class="mb-4">
        <button
          @click="handleMSIPLogin"
          :disabled="
            trimmedUsername.length === 0 || trimmedPassword.length === 0
          "
          :class="{
            'disabled bg-gray-400 text-gray-200 cursor-not-allowed':
              trimmedUsername.length === 0 || trimmedPassword.length === 0,
            'bg-purple-500 hover:bg-purple-600 text-white':
              trimmedUsername.length > 0 && trimmedPassword.length > 0
          }"
          class="itbkk-button-signin w-full py-2 rounded-md"
        >
          Sign In
        </button>
        <div class="flex items-center my-4">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="mx-4 text-gray-500">Or</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          @click="handleMicrosoftLogin"
          class="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary-600 transition-colors text-sm dark:border-gray-700 dark:focus:ring-offset-gray-800"
        >
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
          Sign in with Microsoft
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

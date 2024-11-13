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
const handleMSIPLogin = () => {
  // logic for MSIP login
}
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
          @click="handleLogin"
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
          @click="handleMSIPLogin"
          class="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="111.71"
            height="24"
            viewBox="0 0 512 110"
          >
            <path
              fill="#706d6e"
              d="M512 49.449v-9.005h-11.182V26.446l-.376.115l-10.503 3.214l-.206.063v10.606h-16.577v-5.908c0-2.751.615-4.857 1.828-6.26c1.204-1.388 2.926-2.093 5.122-2.093c1.58 0 3.214.372 4.86 1.105l.412.184V17.99l-.194-.07c-1.535-.553-3.623-.83-6.21-.83c-3.262 0-6.225.709-8.81 2.116s-4.62 3.419-6.045 5.976c-1.42 2.554-2.14 5.503-2.14 8.767v6.496h-7.786v9.005h7.786v37.933h11.177V49.449h16.577v24.106c0 9.928 4.682 14.96 13.918 14.96a22.8 22.8 0 0 0 4.746-.528c1.66-.357 2.79-.714 3.456-1.095l.147-.087v-9.088l-.454.301c-.607.405-1.362.735-2.248.98c-.89.25-1.633.376-2.208.376c-2.164 0-3.764-.583-4.758-1.734c-1.004-1.16-1.514-3.191-1.514-6.031v-22.16zm-82.768 29.926c-4.057 0-7.255-1.346-9.51-3.995c-2.267-2.664-3.417-6.46-3.417-11.285c0-4.977 1.15-8.872 3.419-11.583c2.255-2.692 5.423-4.059 9.417-4.059c3.875 0 6.96 1.305 9.17 3.882c2.221 2.589 3.348 6.453 3.348 11.488c0 5.097-1.06 9.013-3.15 11.632c-2.075 2.6-5.196 3.92-9.277 3.92m.498-40.062c-7.74 0-13.888 2.268-18.27 6.741c-4.381 4.474-6.602 10.664-6.602 18.402c0 7.349 2.168 13.26 6.444 17.567s10.096 6.49 17.295 6.49c7.503 0 13.528-2.299 17.91-6.834c4.38-4.53 6.6-10.662 6.6-18.22c0-7.463-2.083-13.418-6.192-17.696c-4.112-4.28-9.895-6.45-17.185-6.45m-42.894 0c-5.265 0-9.62 1.347-12.947 4.002c-3.346 2.671-5.044 6.175-5.044 10.414c0 2.203.366 4.16 1.088 5.82c.725 1.666 1.848 3.132 3.34 4.363c1.48 1.221 3.765 2.5 6.794 3.8c2.545 1.048 4.444 1.935 5.65 2.633c1.179.685 2.016 1.373 2.488 2.043c.459.655.692 1.553.692 2.66c0 3.154-2.361 4.688-7.22 4.688c-1.803 0-3.859-.376-6.111-1.118a23 23 0 0 1-6.257-3.173l-.464-.332v10.76l.17.08c1.582.73 3.576 1.345 5.926 1.83c2.346.484 4.476.731 6.328.731c5.713 0 10.314-1.353 13.67-4.024c3.38-2.69 5.092-6.275 5.092-10.662c0-3.163-.922-5.877-2.74-8.065c-1.803-2.17-4.935-4.163-9.303-5.924c-3.48-1.397-5.71-2.556-6.629-3.446c-.887-.86-1.337-2.076-1.337-3.615c0-1.366.556-2.459 1.697-3.345c1.15-.89 2.75-1.343 4.756-1.343c1.863 0 3.768.294 5.663.87c1.894.577 3.556 1.35 4.945 2.294l.456.312V41.358l-.175-.075c-1.28-.55-2.97-1.02-5.02-1.4c-2.044-.378-3.897-.57-5.508-.57m-47.13 40.062c-4.056 0-7.255-1.346-9.509-3.995c-2.268-2.664-3.415-6.46-3.415-11.285c0-4.977 1.148-8.872 3.418-11.583c2.253-2.692 5.42-4.059 9.416-4.059c3.875 0 6.96 1.305 9.17 3.882c2.221 2.589 3.348 6.453 3.348 11.488c0 5.097-1.06 9.013-3.15 11.632c-2.076 2.6-5.196 3.92-9.278 3.92m.499-40.062c-7.742 0-13.89 2.268-18.27 6.741c-4.38 4.474-6.603 10.664-6.603 18.402c0 7.352 2.17 13.26 6.445 17.567s10.095 6.49 17.296 6.49c7.5 0 13.528-2.299 17.91-6.834c4.379-4.53 6.6-10.662 6.6-18.22c0-7.463-2.084-13.418-6.194-17.696c-4.113-4.28-9.895-6.45-17.184-6.45m-41.84 9.26v-8.129h-11.041v46.937h11.04V63.37c0-4.083.926-7.437 2.753-9.97c1.803-2.503 4.207-3.772 7.14-3.772c.995 0 2.111.164 3.32.489c1.197.322 2.064.672 2.575 1.04l.464.337v-11.13l-.18-.077c-1.027-.437-2.482-.657-4.322-.657c-2.775 0-5.258.891-7.384 2.646c-1.867 1.543-3.217 3.659-4.248 6.297zm-30.813-9.26c-5.065 0-9.584 1.087-13.427 3.228c-3.85 2.145-6.829 5.21-8.855 9.105c-2.017 3.887-3.041 8.427-3.041 13.49c0 4.434.993 8.504 2.955 12.09c1.964 3.593 4.744 6.404 8.262 8.354c3.514 1.947 7.575 2.934 12.07 2.934c5.247 0 9.727-1.049 13.32-3.117l.144-.084V75.198l-.463.339a20.8 20.8 0 0 1-5.402 2.812c-1.952.681-3.73 1.025-5.29 1.025c-4.333 0-7.81-1.355-10.335-4.027c-2.53-2.677-3.813-6.434-3.813-11.163c0-4.758 1.338-8.612 3.974-11.457c2.629-2.835 6.113-4.273 10.356-4.273c3.629 0 7.165 1.229 10.51 3.656l.463.336V41.788l-.149-.084c-1.26-.705-2.976-1.287-5.108-1.728c-2.122-.44-4.198-.663-6.171-.663m-32.927 1.131h-11.042v46.937h11.042zm-5.408-19.995c-1.817 0-3.402.619-4.704 1.844c-1.308 1.23-1.972 2.778-1.972 4.604c0 1.798.656 3.317 1.95 4.514c1.287 1.193 2.877 1.798 4.726 1.798c1.848 0 3.444-.605 4.746-1.796c1.31-1.199 1.975-2.718 1.975-4.516c0-1.762-.647-3.295-1.921-4.554c-1.273-1.257-2.889-1.894-4.8-1.894m-27.548 16.533V87.38h11.268V21.886h-15.595l-19.823 48.647l-19.236-48.647h-16.23v65.495h10.589V36.977h.364l20.313 50.404h7.99l19.996-50.4z"
            />
            <path fill="#f1511b" d="M51.939 51.939H0V0h51.939z" />
            <path fill="#80cc28" d="M109.287 51.939H57.348V0h51.939z" />
            <path fill="#00adef" d="M51.938 109.307H0V57.368h51.938z" />
            <path fill="#fbbc09" d="M109.287 109.307H57.348V57.368h51.939z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
  acceptInvite,
  cancelInvite
} from '../utils/fetchUtils.js'

import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { userName } from '@/stores/UserManager'
import AlertPopUp from './../components/AlertPopUp.vue'
import { logout } from '@/stores/UserManager'
import AcceptAndDeclineInvitation from './AcceptAndDeclineInvitation.vue'
import { useCollaboratorManager } from '@/stores/CollaboratorManager'
const router = useRouter()
const acceptInvitation = ref(false)
const declineInvitation = ref(false)
const returnPage = ref(false)
const closeNotLogin = ref(false)
const closeNotFound = ref(false)
const wrongToken = ref(false)
const closeNotPermission = ref(false)
const route = useRoute()
const collaboratorManager = useCollaboratorManager()
const boardCollabList = ref(collaboratorManager.getCollaborators())
const isAccept = ref()
const isDecline = ref()
const inviteDetail = reactive({})
const boardDetail = reactive([])
const notInvitation = ref(false)
// const boardCollabList = ref()

const returnLoginPage = () => {
  logout()
  router.replace({ name: 'Login' })
  returnPage.value = true
}

const goBackToPersonalBoard = () => {
  router.replace({ name: 'Task' })
}

const goBackToHomeBoard = () => {
  router.replace({ name: 'Board' })
}

onMounted(async () => {
  const getDetail = await getItems(
    `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/invitation`
  )
  // 401 tokken มั่ว 403 ไม่มีสิทธิ์ 404 หาไม่เจอ
  console.log(getDetail)
  if (getDetail.status == 401) {
    wrongToken.value = true
  }
  if (getDetail.status == 403) {
    closeNotPermission.value = true
  }
  if (getDetail.status == 404) {
    closeNotFound.value = true
  }
  if (getDetail.status == 404) {
    // Display alert message
    window.alert('You are not logged in.')

    // Set a timeout of 5 seconds (5000 milliseconds) before redirecting
    setTimeout(() => {
      closeNotLogin.value = true
      router.replace({ name: 'Board' })
    }, 5000) // 5000 milliseconds = 5 seconds
  } else if (getDetail.status == 400) {
    router.replace({ name: 'Login' })
  }
  Object.assign(inviteDetail, getDetail)
})

console.log(inviteDetail)

const closeNotLoginAlter = function () {
  closeNotLogin.value = false
}
const closeWrongTokenAlter = function () {
  wrongToken.value = false
}
const closeNotFoundAlter = function () {
  closeNotFound.value = false
}
const closeNotPermissionAlter = function () {
  closeNotPermission.value = false
}
const openAcceptPopUp = function (boardId, boardName) {
  isAccept.value = true
  boardDetail.value = { boardId: boardId, boardName: boardName }
  acceptInvitation.value = true
}
const openDeclinePopUp = function (boardId, boardName) {
  isDecline.value = true
  boardDetail.value = { boardId: boardId, boardName: boardName }
  declineInvitation.value = true
}
const closeAcceptInvitationCollab = function () {
  acceptInvitation.value = false
}
const closeConfirmAcceptInvitationCollab = function () {
  acceptInvitation.value = false
}
const closeDeclineInvitationCollab = function () {
  declineInvitation.value = false
}
const closeConfirmDeclineInvitationCollab = function () {
  declineInvitation.value = false
}
onMounted(async () => {
  const storedUserName = localStorage.getItem('userName')
  if (storedUserName) {
    userName.value = storedUserName
  }
})
</script>

<template>
  <div class="bg-white relative border rounded-lg overflow-auto">
    <h1 class="font-bold text-center cursor-default text-xl">
      Invitation Lists
    </h1>
    <div
      class="flex justify-between items-start w-full font-bold space-y-2 border-b py-2 border-r-slate-500"
    >
      <button
        @click="goBackToHomeBoard"
        class="itbkk-home scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 hover:text-blue-500 mr-3 ml-2 mt-2 text-blue-400 my-3"
      >
        🏠 ITB-KK
      </button>
      <div class="flex flex-col items-center space-y-1">
        <h1 class="itbkk-board-name font-bold font-sans cursor-default text-xs">
          {{ userName }}
        </h1>
        <svg
          class="w-6 h-6 text-gray-800 dark:text-gray-700"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <button
          @click="returnLoginPage"
          class="bg-blue-500 text-xs rounded-[4px] font-sans text-gray-100 hover:text-gray-600 px-4 py-1 mt-1"
        >
          Log out
        </button>
      </div>
    </div>

    <div class="flex justify-end">
      <div
        class="flex justify-between items-start w-full font-bold space-y-2 border-b py-2 border-r-slate-500"
      >
        <div class="flex justify-start">
          <button
            @click="goBackToPersonalBoard"
            class="itbkk-board-name scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 hover:text-blue-500 mr-3 ml-2 mt-2 text-blue-400 my-3"
          >
            {{ userName }}
          </button>
          <div
            class="scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 mr-3 mt-2 my-3 font-bold"
          >
            > Collaborator
          </div>
        </div>
      </div>
    </div>
    <AlertPopUp
      v-if="wrongToken"
      :titles="'Sorry, You do not have access rights to this board, User Token is incorrect. '"
      @closePopUp="closeWrongTokenAlter"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="closeNotPermission"
      :titles="'Sorry, You do not have access rights to this board, User do not have permission to do this. '"
      @closePopUp="closeNotPermissionAlter"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="closeNotFound"
      :titles="'Sorry, You do not have access rights to this board, We could not found your Invitation Collab. '"
      @closePopUp="closeNotFoundAlter"
      message="Error!!"
      styleType="red"
    />
    <AlertPopUp
      v-if="closeNotLogin"
      :titles="'Sorry, You do not have access rights to this board, User should sign-in first. '"
      @closePopUp="closeNotLoginAlter"
      message="Error!!"
      styleType="red"
    />
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th class="px-4 py-3 cursor-default">Inviter Detail</th>
        </tr>
      </thead>
      <tbody>
        <div
          v-if="notInvitation"
          class="relative text-center text-xl text-red-600 p-4"
        >
          <div class="flex justify-center items-center">
            <h2>
              Sorry, we couldn't find your active invitation to this board.
            </h2>
            <button
              @click="notInvitation = false"
              class="ml-2 text-red-600 hover:text-red-800 font-bold"
            >
              &times;
            </button>
          </div>
        </div>

        <tr>
          <td class="px-4 py-3">
            <div class="itbkk-name cursor-default">
              {{ inviteDetail.owner }} has invited you to collaborate with
              {{ inviteDetail.accessRight }} access right on
              {{ inviteDetail.boardName }} board, with
              <button
                @click="
                  openAcceptPopUp(route.params.id, inviteDetail.boardName)
                "
                class="ml-2 px-3 py-1 text-white bg-green-500 hover:bg-green-600 rounded-md"
              >
                Accept invitation
              </button>
              or
              <button
                @click="
                  openDeclinePopUp(route.params.id, inviteDetail.boardName)
                "
                class="ml-2 px-3 py-1 text-white bg-red-500 hover:bg-red-600 rounded-md"
              >
                Decline
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <teleport to="body" v-if="acceptInvitation">
        <AcceptAndDeclineInvitation
          :isAccept="isAccept"
          :boardAcceptDetail="boardDetail"
          @openAccept="openAcceptPopUp"
          @cancelInvitationPopUp="closeAcceptInvitationCollab"
          @confirmAcceptInvatation="closeConfirmAcceptInvitationCollab"
        ></AcceptAndDeclineInvitation>
      </teleport>
      <teleport to="body" v-if="declineInvitation">
        <AcceptAndDeclineInvitation
          :isDecline="isDecline"
          :boardDeclineDetail="boardDetail"
          @openDecline="openDeclinePopUp"
          @cancelInvitationPopUp="closeDeclineInvitationCollab"
          @confirmRemoveInvatation="closeConfirmDeclineInvitationCollab"
        ></AcceptAndDeclineInvitation>
      </teleport>
    </table>
  </div>
</template>
<style scoped></style>

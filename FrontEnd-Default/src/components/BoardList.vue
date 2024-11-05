<script setup>
import { onMounted, ref, reactive } from 'vue'
import AddNewBoard from './../components/AddNewBoard.vue'
import { userName } from '@/stores/UserManager'
import { logout } from '@/stores/UserManager'
import { useRoute, useRouter } from 'vue-router'
import { useBoardManager } from '@/stores/BoardManager'
import { useCollaboratorManager } from '@/stores/CollaboratorManager'
import AlertPopUp from './../components/AlertPopUp.vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem
} from '../utils/fetchUtils.js'
import ChangeRemoveLeaveCollab from './../components/ChangeRemoveLeaveCollab.vue'
import AcceptAndDeclineInvitation from './AcceptAndDeclineInvitation.vue'
const emits = defineEmits(['NameBoard', 'errorOccurred', 'NameCollabBoard'])
const router = useRouter()
const route = useRoute()
const isLeave = ref()
const boardManager = useBoardManager()
const collaboratorManager = useCollaboratorManager()
const operation = ref('')
const boardsList = boardManager.getBoards()
const boardCollabList = collaboratorManager.getCollaborators()
const error = ref(false)
const collabDetail = reactive({})
const errorPrivate = ref(false)
const errorLeave = ref(false)
const acceptInvitation = ref(false)
const declineInvitation = ref(false)
const isAccept = ref()
const isDecline = ref()
const closeProblemAlter = () => {
  error.value = false
}
const closePrivateAlter = () => {
  errorPrivate.value = false
}
const boardDetail = reactive([])
const invited = ref(true)
onMounted(async () => {
  const boards = await getItems(`${import.meta.env.VITE_BASE_URL}/v3/boards`)
  if (boards == 401) {
    router.replace({ name: 'Login' })
    return
  }
  console.log(boards)

  // if (boards.length > 0) {
  //   router.replace({ name: 'Task', params: { id: boards[0].board.id } })
  // }

  boardManager.setBoards(boards)
  console.log(boardsList)
  const storedUserName = localStorage.getItem('userName')
  if (storedUserName) {
    userName.value = storedUserName
  }

  //Redirects to personal board when there is only one personal board and no collab board
  // Separate personal and collaboration boards

  // Redirect to 'Task' page if there's only one personal board and no collab boards
  // if (personalBoards.length === 1 && collabBoards.length === 0) {
  //   router.replace({
  //     name: 'Task',
  //     params: { id: personalBoards[0].board.id } // Redirect to the specific board
  //   })
  // }
})
const leaveCollab = ref(false)
const showAddNewBoard = ref(false) // Initial value is false
const returnPage = ref(false)

const showAddNewBoardPopUp = function () {
  showAddNewBoard.value = true // Set to true when the button is clicked
  router.push({ name: 'AddNewBoard' })
}

const clearDeletePopUp = function () {
  showAddNewBoard.value = false // Close the popup when cancel is clicked
}

const showDelComplete = function () {
  // Add your save logic here
  showAddNewBoard.value = false // Close the popup after saving
}
const showErrorMessage = function () {
  error.value = true
  showAddNewBoard.value = false
}
const returnLoginPage = () => {
  logout()
  router.replace({ name: 'Login' })
  returnPage.value = true
}
const openLeaveCollab = async function (boardName, boardId, localUserId) {
  collabDetail.value = { name: boardName, id: boardId, userId: localUserId } // Assign the names to collabDetail
  isLeave.value = true
  leaveCollab.value = true
}

const closeLeaveCollab = function () {
  leaveCollab.value = false
  isLeave.value = false
}
const errorLeavePopup = function () {
  errorLeave.value = true
}
const closeProblemLeaveAlter = function () {
  errorLeave.value = false
}
const openAcceptPopUp = function (boardId, boardName) {
  boardDetail.value = { boardId: boardId, boardName: boardName }
  isAccept.value = true
  acceptInvitation.value = true
}
const openDeclinePopUp = function (boardId, boardName) {
  boardDetail.value = { boardId: boardId, boardName: boardName }
  isDecline.value = true
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
</script>

<template>
  <div>
    <div
      class="flex flex-col items-end pr-4 font-bold space-y-2 border-b py-2 border-r-slate-500"
    >
      <div class="flex justify-between items-start w-full">
        <button
          class="itbkk-home scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] font-sans btn-xs scr-l:btn-m text-center gap-5 mr-3 ml-2 mt-2 text-blue-400 my-3 cursor-default"
        >
          🏠 ITB-KK
        </button>
        <h1 class="font-bold text-center cursor-default text-3xl py-3">
          Board List
        </h1>
        <div class="flex flex-col items-center space-y-1">
          <h1 class="itbkk-fullname font-bold font-sans cursor-default text-xs">
            {{ userName }}
          </h1>
          <svg
            class="w-6 h-6 text-gray-800 dark:text-gray-700"
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
    </div>

    <!-- New wrapper for both sections -->
    <div class="my-8 space-y-10">
      <!-- Personal Board Section -->
      <div
        class="bg-white relative border rounded-lg overflow-auto max-h-[calc(100vh-10rem)] p-4"
      >
        <AlertPopUp
          v-if="error"
          :titles="'There is a problem. Please try again later.'"
          @closePopUp="closeProblemAlter"
          message="Error!!"
          styleType="red"
        />
        <AlertPopUp
          v-if="errorLeave"
          :titles="'There is a problem. Please try again later.'"
          @closePopUp="closeProblemLeaveAlter"
          message="Error!!"
          styleType="red"
        />
        <AlertPopUp
          v-if="errorPrivate"
          :titles="'Access denied, you do not have permission to view this page.'"
          @closePopUp="closePrivateAlter"
          message="Error!!"
          styleType="red"
        />
        <div class="flex justify-end">
          <div
            class="flex flex-row items-center pr-4 font-bold space-x-2 ml-auto"
          >
            <button
              class="itbkk-button-create bg-gray-300 text-sm rounded-[6px] font-sans text-gray-700 hover:text-white px-7 py-2"
              @click="showAddNewBoardPopUp"
            >
              Create personal board
            </button>
          </div>
        </div>
        <div class="itbkk-personal-board flex justify-center font-bold">
          <h1 class="font-bold text-center cursor-default text-3xl py-3">
            Personal Boards
          </h1>
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="(board, index) in boardsList.personal"
            :key="board.id.boardId"
            class="itbkk-personal-item bg-white border rounded-lg shadow-md p-4 flex flex-col space-y-2 hover:bg-gray-100 hover:text-sky-500"
          >
            <div class="flex justify-between items-center">
              <span class="font-bold text-lg">No : {{ index + 1 }}</span>
            </div>
            <div
              class="itbkk-board-name text-xl font-semibold cursor-pointer"
              @click="
                ;[
                  emits('NameBoard', board.board.name),
                  router.replace({
                    name: 'Task',
                    params: { id: board.id.boardId }
                  })
                ]
              "
            >
              Name :
              {{
                board.board?.name == undefined ? board.name : board.board.name
              }}
            </div>
            <div class="text-sm text-gray-500">
              <p>
                Action : {{ board.role == undefined ? 'owner' : board.role }}
              </p>
            </div>
            <div class="itbkk-board-visibility text-sm text-gray-500">
              <p>
                Visibility :
                {{
                  board.board.visibility == undefined
                    ? 'Private'
                    : board.board.visibility
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Collab Board Section -->
      <div
        class="bg-white relative border rounded-lg overflow-auto max-h-[calc(100vh-10rem)] p-4"
      >
        <div class="itbkk-collab-board flex justify-center font-bold">
          <h1 class="font-bold text-center cursor-default text-3xl py-3">
            Collab Boards + Collab Pending Invitation Boards
          </h1>
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="(collab, index) in boardsList.collab"
            :key="collab.id.collabId"
            class="itbkk-collab-item bg-white border rounded-lg shadow-md p-4 flex flex-col space-y-2 hover:bg-gray-100 hover:text-sky-500"
          >
            <div class="flex justify-between items-center">
              <span class="font-bold text-lg">No : {{ index + 1 }}</span>
            </div>
            <div
              class="itbkk-board-name text-xl font-semibold cursor-pointer"
              @click="
                ;[
                  emits('NameCollabBoard', collab.board.name),
                  router.replace({
                    name: 'Task',
                    params: { id: collab.id.boardId }
                  })
                ]
              "
            >
              Name :
              {{
                collab.board?.name == undefined
                  ? collab.name
                  : collab.board.name
              }}
            </div>
            <div class="itbkk-owner-name text-sm text-gray-500">
              <p>
                Owner :
                {{
                  collab.localUser?.username == undefined
                    ? "can't find owner"
                    : collab.localUser.username
                }}
              </p>
            </div>
            <div class="itbkk-access-right text-sm text-gray-500">
              <p>
                Access Right :
                {{ collab.role == undefined ? 'owner' : collab.role }}
              </p>
            </div>
            <div class="itbkk-leave-board text-sm text-gray-500">
              <p>
                Action :
                <button
                  class="itbkk-button-create bg-gray-300 text-sm rounded-[6px] font-sans text-gray-700 hover:text-white px-4 py-1"
                  @click="
                    openLeaveCollab(
                      collab.board.name,
                      collab.id.boardId,
                      collab.id.localUserId
                    )
                  "
                >
                  Leave
                </button>
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="invited"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"
        >
          <div
            v-for="(pending, index) in boardsList.pending"
            :key="pending.id.collabId"
            class="itbkk-collab-item bg-white border rounded-lg shadow-md p-4 flex flex-col space-y-2 hover:bg-gray-100 hover:text-sky-500"
          >
            <div class="flex justify-between items-center">
              <span class="font-bold text-lg">No : {{ index + 1 }}</span>
            </div>
            <div
              class="itbkk-board-name text-xl font-semibold cursor-pointer"
              @click="
                ;[
                  emits('NameCollabBoard', pending.board.name),
                  router.replace({
                    name: 'Task',
                    params: { id: pending.id.boardId }
                  })
                ]
              "
            >
              Name :
              {{
                pending.board?.name == undefined
                  ? pending.name
                  : pending.board.name
              }}
              <div class="text-sm text-gray-500">
                <h1>: "Pending Invite"</h1>
              </div>
            </div>
            <div class="itbkk-owner-name text-sm text-gray-500">
              <p>Owner : {{ pending.localUser.username }}</p>
            </div>
            <div class="itbkk-access-right text-sm text-gray-500">
              <p>
                Access Right :
                {{ pending.role == undefined ? 'owner' : pending.role }}
              </p>
            </div>
            <div class="itbkk-leave-board text-sm text-gray-500">
              <p>
                Action :

                <button
                  @click="
                    openAcceptPopUp(pending.id.boardId, pending.board.name)
                  "
                  class="ml-2 px-3 py-1 text-white bg-green-500 hover:bg-green-600 rounded-md"
                >
                  Accept
                </button>
                <button
                  @click="
                    openDeclinePopUp(pending.id.boardId, pending.board.name)
                  "
                  class="ml-2 px-3 py-1 text-white bg-red-500 hover:bg-red-600 rounded-md"
                >
                  Decline
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <teleport to="body" v-if="leaveCollab">
      <ChangeRemoveLeaveCollab
        :NameLeaveCollabBoard="collabDetail"
        @confirmLeavePopUp="closeLeaveCollab"
        @cancelPopUp="closeLeaveCollab"
        @errorLeaveCollabs="errorLeavePopup"
        :isLeave="isLeave"
        :operate="operation"
      ></ChangeRemoveLeaveCollab>
    </teleport>

    <teleport to="body" v-if="showAddNewBoard">
      <AddNewBoard
        @cancelDetail="clearDeletePopUp"
        @saveDetail="showDelComplete"
        @errorOccurred="showErrorMessage"
      ></AddNewBoard>
    </teleport>
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
  </div>
</template>

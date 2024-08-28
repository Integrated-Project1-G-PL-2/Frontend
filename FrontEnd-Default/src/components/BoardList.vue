<script>
import AddNewBoard from './../components/AddNewBoard.vue'
const showAddNewBoard = ref(true)
const showAddNewBoardPopUp = function () {
  showAddNewBoard.value = true
}
</script>
<template>
  <button
    class="bg-gray-300 text-sm rounded-[6px] font-sans text-gray-700 hover:text-white px-7 py-1"
  >
    Create personal board
  </button>

  <teleport to="body" v-if="showAddNewBoardPopUp">
    <AddNewBoard
      @cancelDetail="clearDeletePopUp"
      @saveDetail="showDelComplete"
    ></AddNewBoard>
  </teleport>
</template>

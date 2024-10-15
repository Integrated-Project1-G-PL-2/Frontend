import { reactive, ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useBoardManager = defineStore('boardManager', () => {
  const boards = reactive([])
  let currentBoard = reactive({})
  const getBoards = function () {
    return boards
  }
  const setBoards = function (boardsList = []) {
    boards.length = 0
    if (boardsList != null) {
      boards.push(...boardsList.collab);  // Push all items from the collab array
        boards.push(...boardsList.personal);  // Push all items from the personal array
        console.log(boards)
      }
    }
  
  const addBoard = function (newBoard) {
    boards.push(newBoard)
  }
  const findIndexById = function (id) {
    return boards.findIndex((el) => el.id === id)
  }
  const setCurrentBoard = function (board) {
    currentBoard = board
  }
  const getCurrentBoard = function () {
    return currentBoard
  }
  const deleteBoard = function (id) {
    const index = boards.findIndex((el) => {
      return el.id == id
    })
    boards.splice(index, 1)
  }

  return {
    setCurrentBoard,
    getBoards,
    setBoards,
    addBoard,
    findIndexById,
    getCurrentBoard,
    deleteBoard
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardManager, import.meta.hot))
}

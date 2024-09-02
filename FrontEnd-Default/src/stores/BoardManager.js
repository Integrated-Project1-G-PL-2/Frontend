import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useBoardManager = defineStore('boardManager', () => {
  const boards = reactive([])
  const getBoards = function () {
    return boards
  }
  const setBoards = function (boardsList = []) {
    boards.length = 0
    if (boardsList != null) {
      boardsList.forEach((board) => {
        boards.push(board)
      })
    }
    console.log(boards)
  }
  const addBoard = function (newBoard) {
    boards.push(newBoard)
  }
  const findIndexById = function (id) {
    return boards.findIndex((el) => el.id === id)
  }
  // const editBoard = function (id, newBoard) {
  //   const index = findIndexById(id)
  //   boards[index] = newBoard
  // }

  // const deleteBoard = function (id) {
  //   const index = boards.findIndex((el) => {
  //     return el.id == id
  //   })
  //   boards.splice(index, 1)
  // }

  return {
    getBoards,
    setBoards,
    addBoard,
    findIndexById
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardManager, import.meta.hot))
}

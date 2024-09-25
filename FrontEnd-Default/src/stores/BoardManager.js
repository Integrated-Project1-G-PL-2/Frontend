import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'


export const useBoardManager = defineStore('boardManager', () => {
    const boards = reactive([])
    const currentBoard = reactive({})
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

    }
    const addBoard = function (newBoard) {
      boards.push(newBoard)
    }
    const findIndexById = function (id) {
      return boards.findIndex((el) => el.id === id)
    }
    const findByBoardByID = function(boardId){
      return currentBoard.find((el) => {
        return el.id == boardId})
    }
    const setCurrentBoard = function(board){
      currentBoard = board
    }
  
    
    return {
      setCurrentBoard,
      getBoards,
      setBoards,
      addBoard,
      findIndexById,
      findByBoardByID
    }
  })
  
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBoardManager, import.meta.hot))
  }
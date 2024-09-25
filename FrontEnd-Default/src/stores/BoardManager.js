import { reactive,ref } from 'vue'
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
    const setCurrentBoard = function(board){
      console.log(board)
      currentBoard = board
    }
  const getCurrentBoard = function(){
      return currentBoard
    }
    
    return {
      setCurrentBoard,
      getBoards,
      setBoards,
      addBoard,
      findIndexById,
      getCurrentBoard
    }
  })
  
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBoardManager, import.meta.hot))
  }
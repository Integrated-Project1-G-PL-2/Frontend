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

    }
    const addBoard = function (newBoard) {
      boards.push(newBoard)
    }
    const findIndexById = function (id) {
      return boards.findIndex((el) => el.id === id)
    }
    // const editTask = function (id, newTask) {
    //   const index = findIndexById(id)
    //   tasks[index] = newTask
    // }
  
    // const deleteTask = function (id) {
    //   const index = tasks.findIndex((el) => {
    //     return el.id == id
    //   })
    //   tasks.splice(index, 1)
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
import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
export const useBoardManager = defineStore('boardManager', () => {
  const boards = reactive([])
  const getBoards = function () {
    return boards
  }
  const setBoards = function (BoardList = []) {
    boards.length = 0
    console.log(BoardList)
    if (BoardList != null) {
      BoardList.forEach((task) => {
        boards.push(task)
      })
    }
  }
  const addBoard = function (newBoard) {
    boards.push(newBoard)
  }
  const findIndexById = function (id) {
    return boards.findIndex((el) => el.id === id)
  }
  const editBoard = function (id, newBoard) {
    const index = findIndexById(id)
    boards[index] = newBoard
  }

  const deleteTask = function (id) {
    const index = tasks.findIndex((el) => {
      return el.id == id
    })
    tasks.splice(index, 1)
  }

  const findStatusById = function (id) {
    return tasks.find((el) => el.status.id == id)
  }
  return {
    getBoards,
    setBoards,
    addBoard,
    editBoard,
    deleteTask,
    findStatusById
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardManager, import.meta.hot))
}

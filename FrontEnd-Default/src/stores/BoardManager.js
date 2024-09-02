import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
export const useTaskManager = defineStore('boardManager', () => {
  const boards = reactive([])
  const getBoards = function () {
    return boards
  }
  const setTasks = function (taskList = []) {
    boards.length = 0
    console.log(taskList)
    if (taskList != null) {
      taskList.forEach((task) => {
        boards.push(task)
      })
    }
  }
  const addTask = function (newTask) {
    boards.push(newTask)
  }
  const findIndexById = function (id) {
    return boards.findIndex((el) => el.id === id)
  }
  const editTask = function (id, newTask) {
    const index = findIndexById(id)
    boards[index] = newTask
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
    getTasks,
    setTasks,
    addTask,
    editTask,
    deleteTask,
    findStatusById
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskManager, import.meta.hot))
}

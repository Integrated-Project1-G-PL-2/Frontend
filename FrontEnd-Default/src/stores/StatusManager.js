import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
export const useStatusManager = defineStore('statusManager', () => {
  const statuses = reactive([])
  const getStatuses = function () {
    return statuses
  }
  const setStatuses = function (statusesList = []) {
    statuses.length = 0
    statusesList.forEach((status) => {
      status.name = status.name
        .toLowerCase()
        .replace('_', ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
      statuses.push(status)
    })
  }
  const addStatuses = function (newStatus) {
    statuses.push(newStatus)
  }

  const findIndexById = function (id) {
    return statuses.findIndex((el) => el.id === id)
  }
  const editStatues = function (id, newStatus) {
    const index = findIndexById(id)
    statuses[index] = newStatus
  }

  const deleteStatuses = function (id) {
    const index = statuses.findIndex((el) => {
      return el.id == id
    })
    statuses.splice(index, 1)
  }
  return {
    getStatuses,
    setStatuses,
    addStatuses,
    editStatues,
    deleteStatuses
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStatusManager, import.meta.hot))
}

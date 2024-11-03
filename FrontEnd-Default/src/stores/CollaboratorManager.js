import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
export const useCollaboratorManager = defineStore('collaboratorManager', () => {
  const collaborators = reactive([])
  let collaboratorBoard = reactive({})
  const getCollaborators = function () {
    return collaborators
  }
  const setCollaborators = function (collaboratorList = []) {
    collaborators.length = 0
    if (!collaboratorList) {
      collaboratorList.forEach((collaborator) => {
        collaborators.push(collaborator)
      })
    }else{
      console.log('No collaborator')
    }
  }
  const addCollaborator = function (newCollaborator) {
    collaborators.push(newCollaborator)
  }
  const findIndexById = function (id) {
    return collaborators.findIndex((el) => el.oid === id)
  }

  const editCollaborator = function (id, newCollaborator) {
    const index = findIndexById(id)
    collaborators[index] = newCollaborator
  }

  const setCurrentCollaboratorBoard = function (board) {
    collaboratorBoard = board
  }
  const getCurrentCollaboratorBoard = function () {
    return collaboratorBoard
  }

  const deleteCollaborator = function (id) {
    const index = collaborators.findIndex((el) => {
      return el.id == id
    })
    collaborators.splice(index, 1)
  }
  // Function to change access rights
  const changeCollaboratorAccessRight = function () {}

  return {
    getCollaborators,
    setCollaborators,
    addCollaborator,
    findIndexById,
    deleteCollaborator,
    setCurrentCollaboratorBoard,
    getCurrentCollaboratorBoard,
    changeCollaboratorAccessRight,
    editCollaborator
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCollaboratorManager, import.meta.hot)
  )
}

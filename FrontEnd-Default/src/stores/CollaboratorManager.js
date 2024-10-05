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
    if (collaboratorList != null) {
      collaboratorList.forEach((collaborator) => {
        collaborators.push(collaborator)
      })
    }
  }
  const addCollaborator = function (newCollaborator) {
    collaborators.push(newCollaborator)
  }
  const findIndexById = function (id) {
    return collaborators.findIndex((el) => el.id === id)
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
  const changeCollaboratorAccessRight = async function (
    collab_oid,
    board_id,
    newAccessRight
  ) {
    try {
      const response = await fetch(
        `/boards/${board_id}/collabs/${collab_oid}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ accessRight: newAccessRight })
        }
      )
      if (!response.ok) {
        throw new Error('Failed to update access right')
      }
      const updatedCollaborator = await response.json()

      // Optionally update the local state
      const index = findIndexById(collab_oid)
      if (index !== -1) {
        collaborators[index].accessRight = updatedCollaborator.accessRight
      }
      return updatedCollaborator
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getCollaborators,
    setCollaborators,
    addCollaborator,
    findIndexById,
    deleteCollaborator,
    setCurrentCollaboratorBoard,
    getCurrentCollaboratorBoard,
    changeCollaboratorAccessRight
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCollaboratorManager, import.meta.hot)
  )
}

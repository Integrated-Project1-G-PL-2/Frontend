import { reactive } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
export const useCollaboratorManager = defineStore("collaboratorManager", () => {
  const collaborators = reactive({
    collab: [],
    pending: [],
  });
  let collaboratorBoard = reactive({});
  const getCollaborators = function () {
    return collaborators;
  };
  const setCollaborators = function (collaboratorList = {}) {
    Object.keys(collaborators).forEach((key) => delete collaborators[key]);
    Object.keys(collaboratorList).forEach((key) => {
      collaborators[key] = Array.isArray(collaboratorList[key])
        ? [...collaboratorList[key]]
        : collaboratorList[key];
    });
    console.log(collaborators)
  };
  const addCollaborator = function (newCollaborator, addTo) {
    collaborators[addTo].push(newCollaborator);
    console.log(collaborators)
  };
  const findIndexById = function (oid, findOn) {
    console.log(collaborators)
    return collaborators[findOn].findIndex((el) => el.oid == oid);
  };

  const editCollaborator = function (id, editOn, newCollaborator) {
    const index = findIndexById(id, editOn);
    collaborators[editOn][index] = newCollaborator;
    console.log(index)
  };

  const setCurrentCollaboratorBoard = function (board) {
    collaboratorBoard = board;
  };
  const getCurrentCollaboratorBoard = function () {
    return collaboratorBoard;
  };

  const deleteCollaborator = function (id, findOn) {
    const index = collaborators[findOn].findIndex((el) => {
      return el.id == id;
    });
    collaborators[findOn].splice(index, 1);
  };
  // Function to change access rights
  const changeCollaboratorAccessRight = function () {};

  return {
    getCollaborators,
    setCollaborators,
    addCollaborator,
    findIndexById,
    deleteCollaborator,
    setCurrentCollaboratorBoard,
    getCurrentCollaboratorBoard,
    changeCollaboratorAccessRight,
    editCollaborator,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCollaboratorManager, import.meta.hot)
  );
}

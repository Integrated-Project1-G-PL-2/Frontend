import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
export const useTaskManager = defineStore("taskManager", () => {
  const tasks = reactive([])
  const getTasks = function() {
    return tasks
  }
  const setTasks = function(taskList = []) {
    tasks.length = 0
    taskList.forEach((task) => {
      tasks.push(task)
    })
    console.log(tasks);
  }
  const addTask = function(newTask) {
    tasks.push(newTask)
  }
  const findIndexById = function(id){
    return tasks.findIndex(el => el.id === id)
  }
  const editTask = function(id , newTask){
    const index = findIndexById(id)
    tasks[index] = newTask
  }

  const deleteTask = function(id){
    const index =  tasks.findIndex(el=>{ 
     return el.id == id
    })
    tasks.splice(index,1)
  }
  return{
    getTasks , setTasks ,addTask,editTask,deleteTask
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskManager, import.meta.hot));
}
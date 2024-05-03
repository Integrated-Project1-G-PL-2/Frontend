import { findIndex } from 'cypress/types/lodash'
import { reactive } from 'vue'
class TaskManagement {
  constructor() {
    this.tasks = reactive([])
    // this.detailTask = previousTask
  }
  getTasks() {
    return this.tasks
  }
  setTasks(tasks = []) {
    this.tasks.length = 0
    tasks.forEach((task) => {
      task.status = task.status
        .toLowerCase()
        .replace('_', ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
      this.tasks.push(task)
    })
  }

  //actions

  addTask(newTask) {
    this.tasks.push(newTask)
  }

  deleteTask(id){
    const index =  this.tasks.findIndex(el=>{el.id == id})
    this.tasks.splice(index,1)
  }
}
export default new TaskManagement()

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
}
export default new TaskManagement()

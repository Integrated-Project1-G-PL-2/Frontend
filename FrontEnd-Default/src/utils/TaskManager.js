import { reactive } from 'vue'
export default class TaskManagement {
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
  addTasks(newTasks) {
    newTasks.forEach((newTask) =>
      addTodo(newTask.id, newTask.title, newTask.description, newTask.status)
    )
  }
  addTask(id, title, status) {
    tasks.value.push({
      id: id,
      title: title,
      status: status
    })
  }
  updateTask(id, title, status) {
    tasks.value = tasks.value.map((detail) => {
      return detail.id === id
        ? { ...detail, title: title, assignees: assignees, status: status }
        : detail
    })
  }
}

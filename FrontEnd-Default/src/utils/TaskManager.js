import { reactive } from 'vue'
export default class TaskManagement {
  _taskStorage = []
  constructor() {
    this.tasks = reactive([])
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

  addItem(typeItem) {
    if (this._taskStorage.length < 0) this._taskStorage.push(new Item(typeItem))
  }

  getAllItemUsed() {
    return this._taskStorage.filter(({ isUsed }) => isUsed)
  }
}

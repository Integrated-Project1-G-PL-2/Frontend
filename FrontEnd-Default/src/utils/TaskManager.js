import { reactive } from 'vue'
export default class TaskManagement {
  _taskStorage = []
  previousTask = []
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

  addItem(typeItem) {
    if (this._taskStorage.length < 0) this._taskStorage.push(new Item(typeItem))
  }

  getAllItemUsed() {
    return this._taskStorage.filter(({ isUsed }) => isUsed)
  }
  addTodos(newTaskDetails) {
    newTaskDetails.forEach((newTaskDetail) =>
      this.addTodo(
        newTaskDetail.id,
        newTaskDetail.title,
        newTaskDetail.assignees,
        newTaskDetail.status
      )
    )
  }
  addTodo(id, title, assignees, status) {
    this.newTaskDetails.push({
      id: id,
      title: title,
      assignees: assignees,
      status: status
    })
  }
  updateTodo(id, category, description) {
    this.newTaskDetails = this.newTaskDetails.map((task) => {
      return task.id === id
        ? { ...task, title: title, assignees: assignees, status: status }
        : task
    })
  }
}

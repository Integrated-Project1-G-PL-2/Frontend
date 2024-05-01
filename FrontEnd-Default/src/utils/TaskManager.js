import { reactive } from 'vue'
export default class TaskManagement {
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
  _taskDetails = [];
  constructor(title, assignees, status) {
    this.title = title;
    this.assignees = assignees;
    this.status = status;
  }
  addItem(typeItem) {
    if (this._items.length < this.limitItem)
      this._items.push(new Item(typeItem));
  }
}

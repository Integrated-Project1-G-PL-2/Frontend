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
  findTask(id) {
    return this._taskDetails.find((detail) => detail.id === id);
  }
  findIndexItem(id) {
    return this._taskDetails.findIndex((detail) => detail.id === id);
  }
  toggleUsedItem(id) {
    this.findTask(id).toggleUsed();
  }
  UnusedAllItem() {
    this._items.forEach((item) => (item.isUsed = false));
  }

  removeItembyUsedItem() {
    this.getAllItemUsed().forEach(({ id }) => this.removeItem(id));
  }
  removeItem(id) {
    this.__taskDetails.splice(this.findIndexItem(id), 1);
  }
  clearAll() {
    this.__taskDetails = [];
  }
  getAllTask() {
    return this.__taskDetails;
  }
  addItem(typeItem) {
    if (this._taskDetails.length < 0)
      this._taskDetails.push(new Item(typeItem));
  }
  
  getAllItemUsed() {
    return this._taskDetails.filter(({ isUsed }) => isUsed);
  }

  
}

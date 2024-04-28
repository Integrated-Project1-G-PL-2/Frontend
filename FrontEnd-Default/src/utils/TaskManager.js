import { reactive } from "vue";
export default class TaskManagement {
  constructor() {
    this.tasks = reactive([]);
  }
  getTasks() {
    return this.tasks;
  }
  setTasks(tasks = []) {
    this.tasks.length = 0
    tasks.forEach(task => {
        task.taskStatus = task.taskStatus.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());;
        this.tasks.push(task)}
    );
  }
}

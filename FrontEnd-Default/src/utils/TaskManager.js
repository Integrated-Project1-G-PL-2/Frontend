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
        task.taskStatus = task.taskStatus.charAt(0).toUpperCase() + task.taskStatus.slice(1).replace(/_/g, " ");
        this.tasks.push(task)}
    );
  }
}

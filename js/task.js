export default class Task {
  constructor(todo) {
    this.id = generateId();
    this.todo = todo;
    this.completed = false;
  }
}

function generateId() {
  return new Date().getTime();
}

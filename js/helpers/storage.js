export class StorageService {
  alias = {
    todos: "todos",
  };
  get todos() {
    console.log("getter");
    const data = localStorage.getItem(this.alias.todos);
    if (typeof data === "string") {
      return JSON.parse(data);
    }
  }
  set todos(todos) {
    console.log("setter", todos);
    if (todos) {
      localStorage.setItem(this.alias.todos, JSON.stringify(todos));
    } else {
      localStorage.removeItem(this.alias.todos);
    }
  }
}

export const storageService = new StorageService();

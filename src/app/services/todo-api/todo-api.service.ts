import { Injectable, signal } from '@angular/core';
import { CreateTodoPayload, Todo } from '../../types/todo.type';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoApiService {
  private todos = signal<Todo[]>([]);

  constructor() {
    this.seedTodos();
  }

  getTodos(): Observable<Todo[]> {
    return this.simulateApiCall(this.todos());
  }

  getTodoById(id: number): Observable<Todo> {
    const todo = this.todos().find((todo) => todo.id === id);
    if (!todo) {
      return throwError(() => new Error(`Todo with id ${id} not found`));
    }

    return this.simulateApiCall(todo);
  }

  createTodo(payload: CreateTodoPayload): Observable<Todo> {
    const newTodo: Todo = {
      id: this.todos().length + 1,
      title: payload.title,
      completed: false,
    };

    this.todos.update((todos) => [...todos, newTodo]);
    return this.simulateApiCall(newTodo);
  }

  deleteTodoById(id: Todo['id']): Observable<null> {
    const todo = this.todos().find((todo) => todo.id === id);
    if (!todo) {
      return throwError(() => new Error(`Todo with id ${id} not found`));
    }

    this.todos.update((todos) => todos.filter((todo) => todo.id !== id));

    return this.simulateApiCall(null);
  }

  private seedTodos(): void {
    this.todos.set([
      { id: 1, title: 'Buy milk', completed: false },
      { id: 2, title: 'Buy eggs', completed: true },
      { id: 3, title: 'Buy bread', completed: false },
    ]);
  }

  private simulateApiCall<TReturn = null>(
    returnValue: TReturn,
  ): Observable<TReturn> {
    // Random delay between 500ms and 1500ms
    const randomDelay = Math.floor(Math.random() * 1000) + 500;
    return of(returnValue).pipe(delay(randomDelay));
  }
}

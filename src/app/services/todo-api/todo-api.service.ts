import { effect, Injectable, signal } from '@angular/core';
import { CreateTodoPayload, SlimTodo, Todo } from '../../types/todo.type';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';
import { mockTodos } from '../../constants/mock-todos.constant';

@Injectable({
  providedIn: 'root',
})
export class TodoApiService {
  private readonly storageKey = 'todos';

  private todos = signal<Todo[]>([]);

  #syncTodosToLocalStorage = effect(() => {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos()));
  });

  constructor() {
    this.seedTodosFromLocalStorage();
  }

  getTodos(): Observable<SlimTodo[]> {
    return this.simulateApiCall(this.todos());
  }

  getTodoById(id: Todo['id']): Observable<Todo> {
    const todo = this.todos().find((todo) => todo.id === id);
    if (!todo) {
      return throwError(() => new Error(`Todo with id ${id} not found`));
    }

    return this.simulateApiCall(todo);
  }

  createTodo(payload: CreateTodoPayload): Observable<Todo> {
    const newTodo: Todo = {
      id: this.generateTodoId(),
      title: payload.title,
      completed: false,
      description: payload.description,
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

  markTodoAsCompleted(id: Todo['id']): Observable<Todo> {
    const todo = this.todos().find((todo) => todo.id === id);
    if (!todo) {
      return throwError(() => new Error(`Todo with id ${id} not found`));
    }

    const updatedTodo = {
      ...todo,
      completed: true,
    };

    this.todos.update((todos) =>
      todos.map((todo) => (todo.id === id ? updatedTodo : todo)),
    );

    return this.simulateApiCall(updatedTodo);
  }

  markTodoAsIncomplete(id: Todo['id']): Observable<Todo> {
    const todo = this.todos().find((todo) => todo.id === id);
    if (!todo) {
      return throwError(() => new Error(`Todo with id ${id} not found`));
    }

    const updatedTodo = {
      ...todo,
      completed: false,
    };

    this.todos.update((todos) =>
      todos.map((todo) => (todo.id === id ? updatedTodo : todo)),
    );

    return this.simulateApiCall(updatedTodo);
  }

  private seedTodosFromLocalStorage(): void {
    const todosString = localStorage.getItem(this.storageKey);

    if (!todosString) {
      return this.todos.set(mockTodos);
    }

    try {
      const todos = JSON.parse(todosString);
      this.todos.set(todos);
    } catch (error) {
      console.error('Failed to parse todos from local storage', error);
      this.todos.set(mockTodos);
    }
  }

  private simulateApiCall<TReturn = null>(
    returnValue: TReturn,
  ): Observable<TReturn> {
    // Random delay between 500ms and 1500ms
    const randomDelay = Math.floor(Math.random() * 1000) + 500;
    return of(returnValue).pipe(
      delay(randomDelay),
      switchMap((result) => {
        const shouldFail = Math.random() < 0.1;
        if (shouldFail) {
          return throwError(() => new Error('API call failed'));
        }

        return of(result);
      }),
    );
  }

  private generateTodoId(): Todo['id'] {
    const existingIds = this.todos().map((todo) => parseInt(todo.id, 10));
    if (!existingIds.length) {
      return '1';
    }

    const maxId = Math.max(...existingIds);
    return `${maxId + 1}`;
  }
}

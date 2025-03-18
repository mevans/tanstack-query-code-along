import { Injectable, signal } from '@angular/core';
import { CreateTodoPayload, SlimTodo, Todo } from '../../types/todo.type';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoApiService {
  private todos = signal<Todo[]>([]);

  constructor() {
    this.seedTodos();
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
      id: `${Date.now()}`,
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

  private seedTodos(): void {
    this.todos.set([
      {
        id: '1',
        title: 'Buy milk',
        completed: false,
        description: 'Need to buy milk from the store',
      },
      {
        id: '2',
        title: 'Buy eggs',
        completed: true,
        description: 'Need to buy eggs from the store',
      },
      {
        id: '3',
        title: 'Buy bread',
        completed: false,
        description: 'Need to buy bread from the store',
      },
    ]);
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
}

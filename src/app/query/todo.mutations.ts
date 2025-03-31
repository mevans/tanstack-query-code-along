import { inject, Injectable } from '@angular/core';
import {
  injectMutation,
  mutationOptions,
} from '@tanstack/angular-query-experimental';
import { CreateTodoPayload, Todo } from '../types/todo.type';
import { lastValueFrom } from 'rxjs';
import { TodoApiService } from '../services/todo-api/todo-api.service';

@Injectable({
  providedIn: 'root',
})
export class TodoMutations {
  private readonly apiService = inject(TodoApiService);

  submitNew() {
    return mutationOptions({
      mutationFn: (payload: CreateTodoPayload) =>
        lastValueFrom(this.apiService.createTodo(payload)),
    });
  }

  markAsCompleted() {
    return mutationOptions({
      mutationFn: ({ id }: { id: Todo['id'] }) =>
        lastValueFrom(this.apiService.markTodoAsCompleted(id)),
    });
  }

  markAsIncomplete() {
    return mutationOptions({
      mutationFn: ({ id }: { id: Todo['id'] }) =>
        lastValueFrom(this.apiService.markTodoAsIncomplete(id)),
    });
  }

  deleteTodo() {
    return mutationOptions({
      mutationFn: ({ id }: { id: Todo['id'] }) =>
        lastValueFrom(this.apiService.deleteTodoById(id)),
    });
  }
}

import { inject, Injectable } from '@angular/core';
import {
  mutationOptions,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { CreateTodoPayload, Todo } from '../types/todo.type';
import { lastValueFrom } from 'rxjs';
import { TodoApiService } from '../services/todo-api/todo-api.service';
import { TodoQueries } from './todo.queries';

@Injectable({
  providedIn: 'root',
})
export class TodoMutations {
  private readonly apiService = inject(TodoApiService);
  private readonly queryClient = inject(QueryClient);
  private readonly queries = inject(TodoQueries);

  submitNew() {
    return mutationOptions({
      mutationFn: (payload: CreateTodoPayload) =>
        lastValueFrom(this.apiService.createTodo(payload)),
      onSuccess: (newTodo) => {
        this.queryClient.setQueryData(
          this.queries.todoList().queryKey,
          (todos) => [...(todos ?? []), newTodo],
        );

        this.queryClient.setQueryData(
          this.queries.todoDetail({ id: newTodo.id }).queryKey,
          newTodo,
        );
      },
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
      onSuccess: (_, { id }) => {
        this.queryClient.setQueryData(
          this.queries.todoList().queryKey,
          (todos) => todos?.filter((todo) => todo.id !== id),
        );
      },
    });
  }
}

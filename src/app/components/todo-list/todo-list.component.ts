import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CreateTodoPayload, Todo } from '../../types/todo.type';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { TodoApiService } from '../../services/todo-api/todo-api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  private readonly apiService = inject(TodoApiService);
  private readonly queryClient = inject(QueryClient);

  todosQuery = injectQuery(() => ({
    queryFn: () => lastValueFrom(this.apiService.getTodos()),
    queryKey: ['todos'],
  }));

  submitNewTodoMutation = injectMutation(() => ({
    mutationFn: (payload: CreateTodoPayload) =>
      lastValueFrom(this.apiService.createTodo(payload)),
    onSuccess: (todo: Todo) => {
      this.newTodoForm.reset();
      this.queryClient.setQueryData(['todos'], (todos: Todo[]) => [
        ...todos,
        todo,
      ]);
    },
  }));

  newTodoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  onSubmitNewTodo(): void {
    if (!this.newTodoForm.valid) {
      return;
    }

    const { title, description } = this.newTodoForm.value;

    if (!title || !description) {
      return;
    }

    this.submitNewTodoMutation.mutate({ title, description });
  }

  onToggle(id: Todo['id'], $event: Event): void {
    const checked = ($event.target as HTMLInputElement).checked;

    // TODO - Mutate and toggle the todo
    console.log('Toggle todo:', { id, checked });
  }
}

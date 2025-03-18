import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { SlimTodo, Todo } from '../../types/todo.type';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { TodoApiService } from '../../services/todo-api/todo-api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-todo-detail',
  imports: [],
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDetailComponent {
  private readonly apiService = inject(TodoApiService);
  private readonly queryClient = inject(QueryClient);

  id = input.required<Todo['id']>();

  todoQuery = injectQuery(() => ({
    queryKey: ['todo', this.id()],
    queryFn: () => lastValueFrom(this.apiService.getTodoById(this.id())),
    placeholderData: () => {
      const slimTodos = this.queryClient.getQueryData<SlimTodo[]>(['todos']);
      const matchingTodo = slimTodos?.find((todo) => todo.id === this.id());

      if (!matchingTodo) {
        return undefined;
      }

      return {
        ...matchingTodo,
        description: '',
      };
    },
  }));

  onDelete(): void {
    // TODO - Mutate and delete the todo
    console.log('Delete todo:', this.id());
  }

  onToggle($event: Event): void {
    const checked = ($event.target as HTMLInputElement).checked;

    // TODO - Mutate and toggle the todo
    console.log('Toggle todo:', { id: this.id(), checked });
  }
}

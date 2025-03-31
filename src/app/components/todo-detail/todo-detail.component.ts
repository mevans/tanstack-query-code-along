import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Todo } from '../../types/todo.type';
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { TodoApiService } from '../../services/todo-api/todo-api.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-todo-detail',
  imports: [],
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDetailComponent {
  private readonly apiService = inject(TodoApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id = input.required<Todo['id']>();

  todoQuery = injectQuery(() => ({
    queryKey: ['todo', this.id()],
    queryFn: () => lastValueFrom(this.apiService.getTodoById(this.id())),
  }));

  deleteMutation = injectMutation(() => ({
    mutationFn: ({ id }: { id: Todo['id'] }) =>
      lastValueFrom(this.apiService.deleteTodoById(id)),
  }));

  markAsCompletedMutation = injectMutation(() => ({
    mutationFn: ({ id }: { id: Todo['id'] }) =>
      lastValueFrom(this.apiService.markTodoAsCompleted(id)),
  }));

  markAsIncompleteMutation = injectMutation(() => ({
    mutationFn: ({ id }: { id: Todo['id'] }) =>
      lastValueFrom(this.apiService.markTodoAsIncomplete(id)),
  }));

  async onDelete(): Promise<void> {
    const sure = confirm(
      'Are you sure you want to delete this todo? This action cannot be undone.',
    );

    if (!sure) {
      return;
    }

    await this.deleteMutation.mutateAsync({ id: this.id() });

    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onToggle($event: Event): void {
    const checked = ($event.target as HTMLInputElement).checked;

    if (checked) {
      this.markAsCompletedMutation.mutate({ id: this.id() });
    } else {
      this.markAsIncompleteMutation.mutate({ id: this.id() });
    }
  }
}

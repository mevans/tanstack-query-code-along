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
import { ActivatedRoute, Router } from '@angular/router';
import { TodoMutations } from '../../query/todo.mutations';
import { TodoQueries } from '../../query/todo.queries';

@Component({
  selector: 'app-todo-detail',
  imports: [],
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDetailComponent {
  private readonly queries = inject(TodoQueries);
  private readonly mutations = inject(TodoMutations);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id = input.required<Todo['id']>();

  todoQuery = injectQuery(() => this.queries.todoDetail({ id: this.id() }));
  deleteMutation = injectMutation(() => this.mutations.deleteTodo());
  markAsCompletedMutation = injectMutation(() =>
    this.mutations.markAsCompleted(),
  );
  markAsIncompleteMutation = injectMutation(() =>
    this.mutations.markAsIncomplete(),
  );

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

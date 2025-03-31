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
import { CheckboxValueDirective } from '../../directives/checkbox-value/checkbox-value.directive';

@Component({
  selector: 'app-todo-detail',
  imports: [CheckboxValueDirective],
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

    try {
      await this.deleteMutation.mutateAsync({ id: this.id() });
      await this.router.navigate(['..'], { relativeTo: this.route });
    } catch (error) {
      alert('Failed to delete todo. Please try again.');
    }
  }

  onToggle($event: Event): void {
    const currentlyChecked = ($event.target as HTMLInputElement).checked;

    if (currentlyChecked) {
      this.markAsIncompleteMutation.mutate({ id: this.id() });
    } else {
      this.markAsCompletedMutation.mutate({ id: this.id() });
    }
  }
}

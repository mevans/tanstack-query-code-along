import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Todo } from '../../types/todo.type';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { TodoQueries } from '../../query/todo.queries';
import { TodoMutations } from '../../query/todo.mutations';
import { CheckboxValueDirective } from '../../directives/checkbox-value/checkbox-value.directive';

@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule, RouterLink, CheckboxValueDirective],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  private readonly queries = inject(TodoQueries);
  private readonly mutations = inject(TodoMutations);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  todosQuery = injectQuery(() => this.queries.todoList());
  submitNewTodoMutation = injectMutation(() => this.mutations.submitNew());
  markAsCompletedMutation = injectMutation(() =>
    this.mutations.markAsCompleted(),
  );
  markAsIncompleteMutation = injectMutation(() =>
    this.mutations.markAsIncomplete(),
  );

  newTodoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  async onSubmitNewTodo(): Promise<void> {
    if (!this.newTodoForm.valid) {
      return;
    }

    const { title, description } = this.newTodoForm.value;

    if (!title || !description) {
      return;
    }

    try {
      const newTodo = await this.submitNewTodoMutation.mutateAsync({
        title,
        description,
      });

      await this.router.navigate(['./', newTodo.id], {
        relativeTo: this.activatedRoute,
      });
    } catch (error) {
      alert('Failed to create todo. Please try again.');
    }
  }

  onToggle(id: Todo['id'], $event: Event): void {
    const currentlyChecked = ($event.target as HTMLInputElement).checked;

    if (currentlyChecked) {
      this.markAsIncompleteMutation.mutate({ id });
    } else {
      this.markAsCompletedMutation.mutate({ id });
    }
  }
}

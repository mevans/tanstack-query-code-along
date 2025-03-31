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
import { TodoQueries } from '../../query/todo.queries';
import { TodoMutations } from '../../query/todo.mutations';

@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  private readonly queries = inject(TodoQueries);
  private readonly mutations = inject(TodoMutations);

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

    if (checked) {
      this.markAsCompletedMutation.mutate({ id });
    } else {
      this.markAsIncompleteMutation.mutate({ id });
    }
  }
}

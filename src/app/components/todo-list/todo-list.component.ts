import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Todo } from '../../types/todo.type';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  // TODO - Query the todos
  todos: Todo[] = [
    { id: 1, title: 'Buy milk', completed: false },
    { id: 2, title: 'Buy eggs', completed: true },
    { id: 3, title: 'Buy bread', completed: false },
  ];

  newTodoForm = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  onSubmitNewTodo(): void {
    if (!this.newTodoForm.valid) {
      this.newTodoForm.markAllAsTouched();
      return;
    }

    const { title } = this.newTodoForm.value;

    // TODO - Mutate and add a new todo
  }

  onDelete(id: Todo['id']): void {
    // TODO - Mutate and delete the todo
  }

  onToggle(id: Todo['id'], $event: Event): void {
    const checked = ($event.target as HTMLInputElement).checked;

    // TODO - Mutate and toggle the todo
  }
}

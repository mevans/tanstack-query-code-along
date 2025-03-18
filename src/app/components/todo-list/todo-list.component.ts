import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Todo } from '../../types/todo.type';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { mockTodos } from '../../constants/mock-todos.constant';

@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  // TODO - Query the todos
  todos = signal(mockTodos);

  newTodoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  onSubmitNewTodo(): void {
    if (!this.newTodoForm.valid) {
      return;
    }

    const { title, description } = this.newTodoForm.value;

    // TODO - Mutate and add a new todo
    console.log('New todo:', { title, description });
  }

  onToggle(id: Todo['id'], $event: Event): void {
    const checked = ($event.target as HTMLInputElement).checked;

    // TODO - Mutate and toggle the todo
    console.log('Toggle todo:', { id, checked });
  }
}

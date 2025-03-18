import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
  todos = signal([
    {
      id: '1',
      title: 'Buy milk',
      completed: false,
      description: 'Need to buy milk from the store',
    },
    {
      id: '2',
      title: 'Buy eggs',
      completed: true,
      description: 'Need to buy eggs from the store',
    },
    {
      id: '3',
      title: 'Buy bread',
      completed: false,
      description: 'Need to buy bread from the store',
    },
  ]);

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

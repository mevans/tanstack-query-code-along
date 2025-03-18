import {
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
} from '@angular/core';
import { Todo } from '../../types/todo.type';

@Component({
  selector: 'app-todo-detail',
  imports: [],
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDetailComponent {
  id = input.required<Todo['id']>();
  // TODO - Query and get the todo by the id

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

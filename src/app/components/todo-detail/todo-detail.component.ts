import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-todo-detail',
  imports: [],
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDetailComponent {
  id = input.required<number>();
  // TODO - Query and get the todo by the id

  onDelete(): void {
    // TODO - Mutate and delete the todo
  }

  onToggle($event: Event): void {
    const checked = ($event.target as HTMLInputElement).checked;

    // TODO - Mutate and toggle the todo
  }
}

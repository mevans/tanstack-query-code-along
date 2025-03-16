import { Component, input } from '@angular/core';

@Component({
  selector: 'app-todo-detail',
  imports: [],
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.css',
})
export class TodoDetailComponent {
  id = input.required<number>();
}

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export type CreateTodoPayload = Pick<Todo, 'title'>;

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
};

export type CreateTodoPayload = Pick<Todo, 'title' | 'description'>;

export type SlimTodo = Pick<Todo, 'id' | 'title' | 'completed'>;

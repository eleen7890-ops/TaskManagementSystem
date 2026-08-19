export interface TaskDetails {
  taskId: number;
  title: string;
  dueDate: string | null;
  fullName: string | null;
  status: number;
  priority: number;
}

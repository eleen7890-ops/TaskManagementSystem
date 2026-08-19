export interface TaskDetails {
  taskId: number;
  title: string;
  description: string;
  status: number | null;
  priority: number | null;
  dueDate: string | null;
  fullName: string | null;
}

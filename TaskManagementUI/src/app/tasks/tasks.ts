import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';
import { TaskDetails } from '../models/task-details';
import { CreateTask } from '../models/create-task';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tasks',
  imports: [DatePipe, NgClass, NgFor, NgIf, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements OnInit {
  isDarkMode = false;
  tasks: Task[] = [];
  users: User[] = [];
   showAddTask = false;

  newTask: CreateTask = {
    title: '',
    description: '',
    dueDate: '',
    status:0,
    priority: 0,
    userId: 0
  };
  addTaskError = '';

openAddTask(): void {
  this.addTaskError = '';
  this.showAddTask = true;
}
closeAddTask(): void {
  this.showAddTask = false;
}
addTask(): void {
  const title = this.newTask.title.trim();
  const status = Number(this.newTask.status);
  const priority = Number(this.newTask.priority);
  const userId = Number(this.newTask.userId);

  if (title.length < 3) {
    this.addTaskError = 'The title must be at least 3 characters.';
    return;
  }

  if (!this.newTask.dueDate) {
    this.addTaskError = 'Please select a due date.';
    return;
  }

  if (!Number.isInteger(status) || status < 1) {
    this.addTaskError = 'Please select a status.';
    return;
  }

  if (!Number.isInteger(priority) || priority < 1) {
    this.addTaskError = 'Please select a priority.';
    return;
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    this.addTaskError = 'Please select a user.';
    return;
  }

  this.addTaskError = '';
  this.taskService.createTask({
    ...this.newTask,
    title,
    status,
    priority,
    userId
  }).subscribe({
    next: () => {
      console.log('Task created successfully');
      this.closeAddTask();
      this.loadTasks();
    },
    error: (error) => {
      const validationErrors = error.error?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(' ')
        : '';

      this.addTaskError = validationMessage || error.error?.message || 'The task could not be created.';
      console.error('Error creating task:', JSON.stringify(error.error || error));
    }
  });
}
  selectedTask: TaskDetails | null = null;
  viewTask(id: number): void {
  const task = this.tasks.find(item => item.taskId === id);
  if (task) {
    this.selectedTask = {
      ...task,
      description: ''
    };
  }

  this.taskService.getTaskById(id).subscribe({
    next: (task) => {
      this.selectedTask = task;
      console.log('Selected task:', task);
    },
    
    error: (error) => {
      console.error('Error loading task details:', error);
    }
  });
}

  closeDetails(): void {
    this.selectedTask = null;
  }

get totalTasks(): number {
  return this.tasks.length;
}


get lowPriorityTasks(): number {
  return this.tasks.filter(task => task.priority === 1).length;
}

get mediumPriorityTasks(): number {
  return this.tasks.filter(task => task.priority === 2).length;
}

get highPriorityTasks(): number {
  return this.tasks.filter(task => task.priority === 3).length;
}
  constructor(
    private readonly taskService: TaskService,
  private readonly userService: UserService,
  private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
      this.loadUsers();

  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.changeDetector.detectChanges();
        console.log(this.tasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      },
    });
  }
  loadUsers(): void {
  this.userService.getUsers().subscribe({
    next: (data) => {
      this.users = data;
      console.log('Users:', this.users);
    },
    error: (error) => {
      console.error('Error loading users:', error);
    }
  });
}


  isOverdue(dueDate: string): boolean {
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return due < today;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }

}


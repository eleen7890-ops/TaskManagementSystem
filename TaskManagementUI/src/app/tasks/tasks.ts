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
  isEditingTask = false;
  editingTaskId: number | null = null;
  taskToDelete: Task | null = null;
  showUserForm = false;
  isEditingUser = false;
  editingUserId: number | null = null;
  selectedUser: User | null = null;
  userToDelete: User | null = null;
  userForm = { fullName: '', email: '' };
  userError = '';

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
  this.showUserForm = false;
  this.selectedUser = null;
  this.userToDelete = null;
  this.addTaskError = '';
  this.isEditingTask = false;
  this.editingTaskId = null;
  this.resetTaskForm();
  this.showAddTask = true;
}
closeAddTask(): void {
  this.showAddTask = false;
  this.isEditingTask = false;
  this.editingTaskId = null;
  this.resetTaskForm();
  this.addTaskError = '';
}
resetTaskForm(): void {
  this.newTask = {
    title: '',
    description: '',
    dueDate: '',
    status: 0,
    priority: 0,
    userId: 0
  };
}
openEditTask(task: Task): void {
  this.addTaskError = '';
  this.isEditingTask = true;
  this.editingTaskId = task.taskId;
  const user = this.users.find(item => item.fullName === task.fullName);

  this.newTask = {
    title: task.title,
    description: '',
    dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
    status: task.status,
    priority: task.priority,
    userId: user?.userId ?? 0
  };

  this.taskService.getTaskById(task.taskId).subscribe({
    next: (details) => {
      this.newTask.description = details.description || '';
      this.showAddTask = true;
      this.changeDetector.detectChanges();
    },
    error: () => {
      this.addTaskError = 'Unable to load the task for editing.';
    }
  });
}

openAddUser(): void {
  this.showAddTask = false;
  this.selectedTask = null;
  this.taskToDelete = null;
  this.selectedUser = null;
  this.userToDelete = null;
  this.userForm = { fullName: '', email: '' };
  this.userError = '';
  this.isEditingUser = false;
  this.editingUserId = null;
  this.showUserForm = true;
  this.changeDetector.detectChanges();
}

openEditUser(user: User): void {
  this.showAddTask = false;
  this.selectedTask = null;
  this.taskToDelete = null;
  this.selectedUser = null;
  this.userToDelete = null;
  this.userForm = { fullName: user.fullName, email: user.email };
  this.userError = '';
  this.isEditingUser = true;
  this.editingUserId = user.userId;
  this.showUserForm = true;
  this.changeDetector.detectChanges();
}

closeUserForm(): void {
  this.showUserForm = false;
  this.isEditingUser = false;
  this.editingUserId = null;
  this.userForm = { fullName: '', email: '' };
  this.userError = '';
}

saveUser(): void {
  const user = {
    fullName: this.userForm.fullName.trim(),
    email: this.userForm.email.trim()
  };

  if (!user.fullName) {
    this.userError = 'Full Name Is Required';
    return;
  }

  if (!user.email) {
    this.userError = 'Email Is Required';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    this.userError = 'Invalid Email Address';
    return;
  }

  const handleError = (error: any): void => {
    const validationErrors = error.error?.errors;
    this.userError = validationErrors
      ? Object.values(validationErrors).flat().join(' ')
      : error.error?.message || 'The user could not be saved.';
  };

  if (this.isEditingUser && this.editingUserId !== null) {
    this.userService.updateUser(this.editingUserId, user).subscribe({
      next: () => {
        this.closeUserForm();
        this.loadUsers();
      },
      error: handleError
    });
    return;
  }

  this.userService.createUser(user).subscribe({
    next: () => {
      this.closeUserForm();
      this.loadUsers();
    },
    error: handleError
  });
}

viewUser(user: User): void {
  this.showAddTask = false;
  this.showUserForm = false;
  this.selectedTask = null;
  this.taskToDelete = null;
  this.userToDelete = null;
  this.selectedUser = user;
  this.changeDetector.detectChanges();
}

closeUserDetails(): void {
  this.selectedUser = null;
}

requestDeleteUser(user: User): void {
  this.showAddTask = false;
  this.showUserForm = false;
  this.selectedTask = null;
  this.taskToDelete = null;
  this.selectedUser = null;
  this.userToDelete = user;
  this.changeDetector.detectChanges();
}

cancelDeleteUser(): void {
  this.userToDelete = null;
}

deleteUser(userId: number): void {
  this.userService.deleteUser(userId).subscribe({
    next: () => {
      this.users = this.users.filter(user => user.userId !== userId);
      this.userToDelete = null;
    },
    error: (error) => {
      console.error('Failed to delete user:', error);
    }
  });
}

addTask(): void {
  const title = this.newTask.title.trim();
  const description = this.newTask.description.trim();
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
  const taskPayload = {
    title,
    description,
    dueDate: this.newTask.dueDate,
    status,
    priority,
    userId
  };

  if (this.isEditingTask && this.editingTaskId !== null) {
    const updatedTaskId = this.editingTaskId;
    this.taskService.updateTask(updatedTaskId, taskPayload).subscribe({
      next: () => {
        this.closeAddTask();
        this.loadTasks();
        if (this.selectedTask?.taskId === updatedTaskId) {
          this.selectedTask = {
            ...this.selectedTask,
            title: taskPayload.title,
            description: taskPayload.description,
            dueDate: taskPayload.dueDate,
            status: taskPayload.status,
            priority: taskPayload.priority
          };
          this.changeDetector.detectChanges();
        }
        this.taskService.getTaskById(updatedTaskId).subscribe({
          next: (details) => {
            this.selectedTask = details;
            this.changeDetector.detectChanges();
          }
        });
      },
      error: (error) => {
        const validationErrors = error.error?.errors;
        const validationMessage = validationErrors
          ? Object.values(validationErrors).flat().join(' ')
          : '';
        this.addTaskError = validationMessage || error.error?.message || 'The task could not be updated.';
      }
    });
    return;
  }

  this.taskService.createTask(taskPayload).subscribe({
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
      this.changeDetector.detectChanges();
      console.log('Selected task:', task);
    },
    
    error: (error) => {
      console.error('Error loading task details:', error);
    }
  });
}
requestDeleteTask(task: Task): void {
    this.taskToDelete = task;
  }

cancelDelete(): void {
    this.taskToDelete = null;
  }

deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.taskId !== taskId);
        this.taskToDelete = null;
      },
      error: (err) => {
        console.error("Failed to delete task", err);
      },
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
  this.userService.getAllUsers().subscribe({
    next: (data) => {
      this.users = data;
      this.changeDetector.detectChanges();
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


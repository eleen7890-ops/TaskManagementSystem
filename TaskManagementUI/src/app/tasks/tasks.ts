import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';
import { TaskDetails } from '../models/task-details';
import { CreateTask } from '../models/create-task';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-tasks',
  imports: [DatePipe, NgClass, NgFor, NgIf, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements OnInit {
  tasks: Task[] = [];
  users: User[] = [];
    get isDarkMode(): boolean {
  return this.themeService.isDarkMode;
}
  searchTerm = '';
  statusFilter = 0;
  priorityFilter = 0;
  showFilters = false;
  readonly pageSize = 5;

  todoPage = 1;
  inProgressPage = 1;
  completedPage = 1;
  showAddTask = false;
  isEditingTask = false;
  editingTaskId: number | null = null;
  taskToDelete: Task | null = null;
  draggedTask: Task | null = null;
  dragOverStatus: number | null = null;
  showUserForm = false;
  isEditingUser = false;
  editingUserId: number | null = null;
  selectedUser: User | null = null;
  userToDelete: User | null = null;
  userDeleteError = '';
  private readonly formBuilder = inject(FormBuilder);
  taskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    dueDate: ['', Validators.required],
    status: [0, Validators.min(1)],
    priority: [0, Validators.min(1)],
    userId: [0, Validators.min(1)]
  });
  userForm = this.formBuilder.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  userError = '';
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
  this.taskForm.reset({ title: '', description: '', dueDate: '', status: 0, priority: 0, userId: 0 });
}
openEditTask(task: Task): void {
  this.addTaskError = '';
  this.isEditingTask = true;
  this.editingTaskId = task.taskId;
  const user = this.users.find(item => item.fullName === task.fullName);

  this.taskForm.patchValue({
    title: task.title,
    dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
    status: task.status,
    priority: task.priority,
    userId: user?.userId ?? 0
  });

  this.taskService.getTaskById(task.taskId).subscribe({
    next: (details) => {
      this.taskForm.patchValue({ description: details.description || '' });
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
  this.userForm.reset({ fullName: '', email: '' });
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
  this.userForm.patchValue({ fullName: user.fullName, email: user.email });
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
  this.userForm.reset({ fullName: '', email: '' });
  this.userError = '';
}

saveUser(): void {
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    this.userError = this.userForm.controls.email.hasError('email')
      ? 'Invalid Email Address'
      : 'Full name and email are required.';
    return;
  }

  const user = {
    fullName: this.userForm.controls.fullName.value?.trim() ?? '',
    email: this.userForm.controls.email.value?.trim() ?? ''
  };
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
  this.userDeleteError = '';
  this.changeDetector.detectChanges();
}

cancelDeleteUser(): void {
  this.userToDelete = null;
  this.userDeleteError = '';
}

deleteUser(userId: number): void {
  this.userService.deleteUser(userId).subscribe({
    next: () => {
      this.users = this.users.filter(user => user.userId !== userId);
      this.userToDelete = null;
      this.userDeleteError = '';
    },
    error: (error) => {
      console.error('Failed to delete user:', error);
      this.userDeleteError = error.error?.message
        || 'This user cannot be deleted because they have assigned tasks.';
    }
  });
}

addTask(): void {
  if (this.taskForm.invalid) {
    this.taskForm.markAllAsTouched();
    this.addTaskError = 'Please complete all required task fields.';
    return;
  }

  this.addTaskError = '';
  const formValue = this.taskForm.getRawValue();
  const taskPayload = {
    title: formValue.title?.trim() ?? '',
    description: formValue.description?.trim() ?? '',
    dueDate: formValue.dueDate ?? '',
    status: Number(formValue.status),
    priority: Number(formValue.priority),
    userId: Number(formValue.userId)
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

  onDragStart(task: Task): void {
    this.draggedTask = task;
  }

  onDragEnd(): void {
    this.draggedTask = null;
    this.dragOverStatus = null;
  }

  onDragOver(status: number, event: DragEvent): void {
    event.preventDefault();
    this.dragOverStatus = status;
  }

  onDrop(status: number, event: DragEvent): void {
    event.preventDefault();

    const task = this.draggedTask;
    this.draggedTask = null;
    this.dragOverStatus = null;

    if (!task || task.status === status) {
      return;
    }

    this.taskService.getTaskById(task.taskId).subscribe({
      next: (details) => {
        const user = this.users.find(item => item.fullName === details.fullName);
        const updatedTask = {
          title: details.title,
          description: details.description || '',
          dueDate: details.dueDate || '',
          status,
          priority: details.priority ?? 1,
          userId: user?.userId ?? 0
        };

        this.taskService.updateTask(task.taskId, updatedTask).subscribe({
          next: () => this.loadTasks(),
          error: (error) => console.error('Failed to move task:', error)
        });
      },
      error: (error) => console.error('Failed to load task for moving:', error)
    });
  }

  closeDetails(): void {
    this.selectedTask = null;
  }

get totalTasks(): number {
  return this.tasks.length;
}

get filteredTasks(): Task[] {
  const searchTerm = this.searchTerm.trim().toLowerCase();

  return this.tasks.filter(task => {
    const matchesSearch = !searchTerm
      || task.title.toLowerCase().includes(searchTerm);
    const matchesStatus = this.statusFilter === 0 || task.status === this.statusFilter;
    const matchesPriority = this.priorityFilter === 0 || task.priority === this.priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
}

getColumnTasks(status: number): Task[] {
  return this.filteredTasks.filter(task => task.status === status);
}

getPaginatedColumnTasks(status: number): Task[] {
  const tasks = this.getColumnTasks(status);
  const page = this.getPageForStatus(status);
  const start = (page - 1) * this.pageSize;
  return tasks.slice(start, start + this.pageSize);
}

getTotalPagesForStatus(status: number): number {
  return Math.max(1, Math.ceil(this.getColumnTasks(status).length / this.pageSize));
}

getPageForStatus(status: number): number {
  if (status === 1) {
    return this.todoPage;
  }
  if (status === 2) {
    return this.inProgressPage;
  }
  return this.completedPage;
}

previousPageForStatus(status: number): void {
  const page = this.getPageForStatus(status);
  if (page > 1) {
    this.setPageForStatus(status, page - 1);
  }
}

nextPageForStatus(status: number): void {
  const page = this.getPageForStatus(status);
  if (page < this.getTotalPagesForStatus(status)) {
    this.setPageForStatus(status, page + 1);
  }
}

private setPageForStatus(status: number, page: number): void {
  if (status === 1) {
    this.todoPage = page;
  } else if (status === 2) {
    this.inProgressPage = page;
  } else {
    this.completedPage = page;
  }
}

resetPagination(): void {
  this.todoPage = 1;
  this.inProgressPage = 1;
  this.completedPage = 1;
}

clearFilters(): void {
  this.searchTerm = '';
  this.statusFilter = 0;
  this.priorityFilter = 0;
  this.resetPagination();
  this.applyFilters();
}

applyFilters(): void {
  const status = this.statusFilter === 0 ? null : this.statusFilter;
  const priority = this.priorityFilter === 0 ? null : this.priorityFilter;
  const request = status === null && priority === null
    ? this.taskService.getTasks()
    : this.taskService.getFilteredTasks(status, priority);

  request.subscribe({
    next: (data) => {
      this.tasks = data;
      this.todoPage = Math.min(this.todoPage, this.getTotalPagesForStatus(1));
      this.inProgressPage = Math.min(this.inProgressPage, this.getTotalPagesForStatus(2));
      this.completedPage = Math.min(this.completedPage, this.getTotalPagesForStatus(3));
      this.changeDetector.detectChanges();
    },
    error: (error) => console.error('Error filtering tasks:', error)
  });
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
    private readonly themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
      this.loadUsers();

  }

  loadTasks(): void {
    this.applyFilters();
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
  this.themeService.toggle();
}

}
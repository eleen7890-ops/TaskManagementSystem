import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-tasks',
  imports: [DatePipe, NgClass, NgFor, NgIf],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements OnInit {
  isDarkMode = false;
  tasks: Task[] = [];
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
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
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


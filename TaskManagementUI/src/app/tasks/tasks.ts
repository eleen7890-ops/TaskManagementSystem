import { Component, OnInit } from '@angular/core';
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

  constructor(private readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        console.log(this.tasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      },
    });
  }

  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        console.log(this.tasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }
}

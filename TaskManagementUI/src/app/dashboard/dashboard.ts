import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
 
  tasks: Task[] = [];
  error = '';
get isDarkMode(): boolean {
  return this.themeService.isDarkMode;
}
  constructor(
    private readonly taskService: TaskService,
    private readonly themeService: ThemeService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.tasks = tasks;
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        console.error('Error loading dashboard tasks:', error);
        this.error = 'Unable to load dashboard data. Make sure the API is running.';
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  count(status: number): number {
    return this.tasks.filter(task => task.status === status).length;
  }

  get statusChartStyle(): string {
    if (this.tasks.length === 0) return 'conic-gradient(#e9e3e6 0deg 360deg)';
    const todoEnd = this.count(1) / this.tasks.length * 360;
    const progressEnd = todoEnd + this.count(2) / this.tasks.length * 360;
    return `conic-gradient(#d98bb0 0deg ${todoEnd}deg, #d9a86c ${todoEnd}deg ${progressEnd}deg, #8bb8a8 ${progressEnd}deg 360deg)`;
  }

  priorityCount(priority: number): number {
    return this.tasks.filter(task => task.priority === priority).length;
  }

  priorityWidth(priority: number): string {
    const maximum = Math.max(1, this.priorityCount(1), this.priorityCount(2), this.priorityCount(3));
    return `${this.priorityCount(priority) / maximum * 100}%`;
  }

  get recentTasks(): Task[] {
    return [...this.tasks]
      .sort((a, b) => b.taskId - a.taskId)
      .slice(0, 5);
  }

 toggleTheme(): void {
  this.themeService.toggle();
}

}
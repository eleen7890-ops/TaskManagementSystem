import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tasks',
  imports: [NgClass],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  isDarkMode = false;

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }
}

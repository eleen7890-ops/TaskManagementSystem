import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'lockin-dark-mode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly darkModeSubject = new BehaviorSubject<boolean>(this.readInitialValue());
  readonly darkMode$ = this.darkModeSubject.asObservable();

  get isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  toggle(): void {
    this.setDarkMode(!this.isDarkMode);
  }

  setDarkMode(value: boolean): void {
    this.darkModeSubject.next(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }

  private readInitialValue(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
}
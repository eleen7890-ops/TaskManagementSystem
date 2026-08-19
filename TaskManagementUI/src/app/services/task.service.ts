import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = 'https://localhost:7063/api/TaskItem';

  constructor(private readonly http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }
}

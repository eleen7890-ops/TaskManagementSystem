import { inject, Injectable } from "@angular/core";
import { Task } from "../models/task";
import { HttpClient } from "@angular/common/http";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TaskDetails } from "../models/task-details";
import { CreateTask } from "../models/create-task";
import { User } from "../models/user";
@Injectable({
  providedIn: "root",
})
export class TaskService {
  private apiUrl = 'https://localhost:7063/api/TaskItem';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }
  getFilteredTasks(status: number | null, priority: number | null): Observable<Task[]> {
    let params = new HttpParams();

    if (status !== null) {
      params = params.set('status', status);
    }
    if (priority !== null) {
      params = params.set('priority', priority);
    }

    return this.http.get<Task[]>(`${this.apiUrl}/filter`, { params });
  }
  getTaskById(id: number): Observable<TaskDetails> {
  return this.http.get<TaskDetails>(`${this.apiUrl}/${id}`);
}
createTask(task: CreateTask): Observable<number> {
  return this.http.post<number>(this.apiUrl, task);
}

deleteTask(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

updateTask(id: number, task: CreateTask): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${id}`, task);
}
  }
  

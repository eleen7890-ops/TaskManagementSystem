import { inject, Injectable } from "@angular/core";
import { Task } from "../models/task";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TaskDetails } from "../models/task-details";
@Injectable({
  providedIn: "root",
})
export class TaskService {
  private apiUrl = 'https://localhost:7063/api/TaskItem';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }
  getTaskById(id: number): Observable<TaskDetails> {
  return this.http.get<TaskDetails>(`${this.apiUrl}/${id}`);
}
  }
  

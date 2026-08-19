import { inject, Injectable } from "@angular/core";
import { Task } from "../models/task";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class TaskService {
  private apiUrl = 'https://localhost:7063/api/TaskItem';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }
  }
  

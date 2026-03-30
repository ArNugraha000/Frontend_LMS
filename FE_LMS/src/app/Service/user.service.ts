import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseUrl = "http://localhost:8080/User";

  constructor(private http: HttpClient) {}

  // 🔥 LOGIN API (JSON)
  login(user: { usrName: string; usrPassword: string }): Observable<User[]> {
    return this.http.post<User[]>(`${this.baseUrl}/login`, user);
  }
}

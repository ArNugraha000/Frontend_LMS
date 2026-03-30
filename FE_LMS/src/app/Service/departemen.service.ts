import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class DepartemenService {
  private baseUrl = "http://localhost:8080/api/departemen";

  constructor(private http: HttpClient) {}

  getDepartemen(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDep`);
  }

  save(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
}

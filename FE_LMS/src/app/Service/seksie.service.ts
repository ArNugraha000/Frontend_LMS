import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class SeksieService {
  private baseUrl = "http://localhost:8080/api/seksie";

  constructor(private http: HttpClient) {}

  getSeksie(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getSek`);
  }

  save(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DivisiService {
  private baseUrl = "http://localhost:8080/api/divisi";

  constructor(private http: HttpClient) {}

  getDivisi(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDiv`);
  }

  save(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
}

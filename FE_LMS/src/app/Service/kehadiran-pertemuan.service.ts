import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { KehadiranPertemuanRequest } from "../models/kehadiran-pertemuan.model";

@Injectable({
  providedIn: "root",
})
export class KehadiranPertemuanService {
  private apiUrl = "http://localhost:8080/api/kehadiran-pertemuan";

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getByPlbId(plbId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/plb/${plbId}`);
  }

  getById(kptId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${kptId}`);
  }

  create(request: KehadiranPertemuanRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  update(kptId: number, request: KehadiranPertemuanRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${kptId}`, request);
  }

  // TOGGLE STATUS - PAKE INI!
  toggleStatus(kptId: number, user: string = "admin"): Observable<any> {
    return this.http.put(`${this.apiUrl}/${kptId}/toggle?user=${user}`, {});
  }
}

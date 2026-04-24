import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Kursus } from "../models/kursus.model";

@Injectable({
  providedIn: "root",
})
export class KursusService {
  // ✅ Pastikan URL ini sesuai dengan backend
  private apiUrl = "http://localhost:8080/api/kursus";

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAll`);
  }

  getPublished(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getPublished`);
  }

  getUnpublished(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUnpublished`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${id}`);
  }

  create(kursusData: any, file: File | null): Observable<any> {
    const formData = new FormData();
    formData.append(
      "kursus",
      new Blob([JSON.stringify(kursusData)], { type: "application/json" }),
    );
    if (file) {
      formData.append("file", file);
    }
    return this.http.post<any>(`${this.apiUrl}/create`, formData);
  }

  update(kursusData: any, file: File | null): Observable<any> {
    const formData = new FormData();
    formData.append(
      "kursus",
      new Blob([JSON.stringify(kursusData)], { type: "application/json" }),
    );
    if (file) {
      formData.append("file", file);
    }
    return this.http.put<any>(`${this.apiUrl}/update`, formData);
  }

  delete(id: number, modifier: string = "system"): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, {
      params: new HttpParams().set("modifier", modifier),
    });
  }

  publish(id: number, modifier: string = "system"): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/publish/${id}`, null, {
      params: new HttpParams().set("modifier", modifier),
    });
  }
}

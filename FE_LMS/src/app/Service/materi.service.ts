import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MateriService {
  private baseUrl = "http://localhost:8080/api/materi";

  constructor(private http: HttpClient) {}

  // GET ALL
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // ✅ GET BY ID - Mendapatkan materi berdasarkan ID
  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // CREATE (WITH FILE)
  create(data: any, file: File | null, userName: string): Observable<any> {
    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );

    if (file) {
      formData.append("file", file);
    }

    return this.http.post(`${this.baseUrl}?userName=${userName}`, formData);
  }

  // UPDATE
  update(
    id: number,
    data: any,
    file: File | null,
    userName: string,
  ): Observable<any> {
    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );

    if (file) {
      formData.append("file", file);
    }

    return this.http.put(
      `${this.baseUrl}/${id}?userName=${userName}`,
      formData,
    );
  }

  // SOFT DELETE (TOGGLE)
  delete(id: number, userName: string) {
    return this.http.put(
      `${this.baseUrl}/delete/${id}?userName=${userName}`,
      {},
    );
  }

  // DOWNLOAD FILE
  getFile(filename: string) {
    return `${this.baseUrl}/file/${filename}`;
  }
}

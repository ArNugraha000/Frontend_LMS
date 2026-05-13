import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DetailTrainingService {
  private baseUrl = "http://localhost:8080/api/detail-pelatihan";

  constructor(private http: HttpClient) {}

  // GET DETAIL BY KURSUS
  getByKursus(idKursus: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${idKursus}`);
  }

  // ADD DETAIL (tambah relasi materi ke pelatihan)
  add(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, data);
  }

  // UPDATE SINGLE MATERI (update urutan/tanggal)
  update(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, data);
  }

  // DELETE ALL MATERI BY KURSUS
  deleteAll(idKursus: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idKursus}`);
  }

  // DELETE SINGLE MATERI (hapus relasi)
  deleteMateri(idKursus: number, idMateri: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idKursus}/materi/${idMateri}`);
  }
}

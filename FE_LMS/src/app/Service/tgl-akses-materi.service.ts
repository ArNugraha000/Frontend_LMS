import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TglAksesMateriRequest } from "../models/tgl-akses-materi.model";

@Injectable({
  providedIn: "root",
})
export class TglAksesMateriService {
  private apiUrl = "http://localhost:8080/api/tgl-akses-materi";

  constructor(private http: HttpClient) {}

  getByKptId(kptId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/kpt/${kptId}`);
  }

  getById(tamId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${tamId}`);
  }

  save(request: TglAksesMateriRequest): Observable<any> {
    console.log("Saving request:", request); // Debugging
    return this.http.post(this.apiUrl, request);
  }

  delete(tamId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${tamId}`);
  }

  deleteByKptId(kptId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/kpt/${kptId}`);
  }
}

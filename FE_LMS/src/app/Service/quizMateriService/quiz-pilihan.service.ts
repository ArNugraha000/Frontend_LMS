import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { QuizPilihan } from "../../models/quizMateriModel/quiz-pilihan.model";

@Injectable({ providedIn: "root" })
export class QuizPilihanService {
  private apiUrl = "http://localhost:8080/api/quiz-pilihan";

  constructor(private http: HttpClient) {}

  createPilihan(pilihan: QuizPilihan): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, pilihan);
  }

  updatePilihan(pilihan: QuizPilihan): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, pilihan);
  }

  deletePilihan(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getPilihanBySoal(soalId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/soal/${soalId}`);
  }

  saveAllPilihan(soalId: number, pilihanList: QuizPilihan[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/soal/${soalId}/batch`, pilihanList);
  }
}

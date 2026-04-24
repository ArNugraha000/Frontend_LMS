import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  QuizSoal,
  QuizSoalDetail,
} from "../../models/quizMateriModel/quiz-soal.model";

@Injectable({ providedIn: "root" })
export class QuizSoalService {
  private apiUrl = "http://localhost:8080/api/quiz-soal"; // sesuaikan

  constructor(private http: HttpClient) {}

  createSoal(soal: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, soal);
  }

  updateSoal(soal: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, soal);
  }

  deleteSoal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getSoalByMateri(materiId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/materi/${materiId}`);
  }

  getSoalWithPilihan(soalId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/detail/${soalId}`);
  }

  getAllSoalWithPilihanByMateri(materiId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/materi/${materiId}/full`);
  }
}

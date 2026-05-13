// Service/pelatihan-batch.service.ts

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { DtoResponseTrainingBatch } from "../models/trainingBatch.model";

@Injectable({
  providedIn: "root",
})
export class PelatihanBatchService {
  private baseUrl = "http://localhost:8080/api/pelatihan-batch";

  constructor(private http: HttpClient) {}

  // ========== GET ALL WITH JOIN (dapat gambar dari kursus) ==========
  getAllWithJoin(
    page: number = 0,
    size: number = 10,
  ): Observable<DtoResponseTrainingBatch> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());
    return this.http.get<DtoResponseTrainingBatch>(
      `${this.baseUrl}/list-with-join`,
      { params },
    );
  }

  // ========== GET ACTIVE BATCHES ==========
  getActiveBatches(): Observable<DtoResponseTrainingBatch> {
    return this.http.get<DtoResponseTrainingBatch>(`${this.baseUrl}/active`);
  }

  // ========== ✅ TAMBAHKAN METHOD INI ==========
  // Get last batch number for a specific course (krsId)
  getLastBatchNumber(krsId: number): Observable<DtoResponseTrainingBatch> {
    return this.http.get<DtoResponseTrainingBatch>(
      `${this.baseUrl}/last-batch-number/${krsId}`,
    );
  }

  // ========== ✅ TAMBAHKAN METHOD CREATE ==========
  create(data: any): Observable<DtoResponseTrainingBatch> {
    return this.http.post<DtoResponseTrainingBatch>(
      `${this.baseUrl}/create`,
      data,
    );
  }

  // ========== ✅ TAMBAHKAN METHOD UPDATE ==========
  update(data: any): Observable<DtoResponseTrainingBatch> {
    return this.http.put<DtoResponseTrainingBatch>(
      `${this.baseUrl}/update`,
      data,
    );
  }

  // ========== ✅ TAMBAHKAN METHOD DELETE ==========
  delete(id: number): Observable<DtoResponseTrainingBatch> {
    return this.http.delete<DtoResponseTrainingBatch>(
      `${this.baseUrl}/delete/${id}`,
    );
  }
}

// Service/pendaftaran.service.ts

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  BatchPelatihan,
  DtoResponsePendaftaran,
} from "../models/pendaftaran.model";

@Injectable({
  providedIn: "root",
})
export class PendaftaranService {
  private baseUrl = "http://localhost:8080/api/pendaftaran";

  constructor(private http: HttpClient) {}

  // Get all batches for dropdown
  getAllBatches(): Observable<DtoResponsePendaftaran> {
    return this.http.get<DtoResponsePendaftaran>(`${this.baseUrl}/batches`);
  }

  // Get pendaftaran by batch (sudah terdaftar)
  getByBatch(
    plbId: number,
    page: number = 0,
    size: number = 10,
  ): Observable<DtoResponsePendaftaran> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());
    return this.http.get<DtoResponsePendaftaran>(
      `${this.baseUrl}/by-batch/${plbId}`,
      { params },
    );
  }

  // Get available karyawan (belum terdaftar di batch tertentu)
  getAvailableKaryawan(
    plbId: number,
    keyword: string = "",
    page: number = 0,
    size: number = 10,
  ): Observable<DtoResponsePendaftaran> {
    let params = new HttpParams()
      .set("plbId", plbId.toString())
      .set("keyword", keyword)
      .set("page", page.toString())
      .set("size", size.toString());
    return this.http.get<DtoResponsePendaftaran>(
      `${this.baseUrl}/available-karyawan`,
      { params },
    );
  }

  // ✅ TAMBAHKAN METHOD INI - Get UNREGISTERED karyawan (BELUM terdaftar sama sekali)
  getUnregisteredKaryawan(
    plbId: number,
    keyword: string = "",
    page: number = 0,
    size: number = 10,
  ): Observable<DtoResponsePendaftaran> {
    let params = new HttpParams()
      .set("plbId", plbId.toString())
      .set("keyword", keyword)
      .set("page", page.toString())
      .set("size", size.toString());
    return this.http.get<DtoResponsePendaftaran>(
      `${this.baseUrl}/unregistered-karyawan`,
      { params },
    );
  }

  // Register single karyawan
  registerKaryawan(
    kryId: number,
    plbId: number,
    createdBy: string,
  ): Observable<DtoResponsePendaftaran> {
    return this.http.post<DtoResponsePendaftaran>(`${this.baseUrl}/register`, {
      kryId,
      plbId,
      createdBy,
    });
  }

  // Bulk register karyawan
  bulkRegisterKaryawan(
    kryIds: number[],
    plbId: number,
    createdBy: string,
  ): Observable<DtoResponsePendaftaran> {
    return this.http.post<DtoResponsePendaftaran>(
      `${this.baseUrl}/bulk-register`,
      {
        kryIds,
        plbId,
        createdBy,
      },
    );
  }

  // Update status
  updateStatus(
    id: number,
    newStatus: number,
    modifBy: string,
  ): Observable<DtoResponsePendaftaran> {
    let params = new HttpParams()
      .set("newStatus", newStatus.toString())
      .set("modifBy", modifBy);
    return this.http.put<DtoResponsePendaftaran>(
      `${this.baseUrl}/update-status/${id}`,
      null,
      { params },
    );
  }

  // Delete pendaftaran
  delete(id: number): Observable<DtoResponsePendaftaran> {
    return this.http.delete<DtoResponsePendaftaran>(
      `${this.baseUrl}/delete/${id}`,
    );
  }
}

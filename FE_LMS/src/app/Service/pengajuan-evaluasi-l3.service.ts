// Service/pengajuan-evaluasi-l3.service.ts

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  PengajuanEvaluasiL3,
  PageResponsePengajuan,
  DtoResponseL3,
} from "../models/pengajuan-evaluasi-l3.model";

@Injectable({
  providedIn: "root",
})
export class PengajuanEvaluasiL3Service {
  private baseUrl = "http://localhost:8080/api/pengajuan-evaluasi-l3";

  constructor(private http: HttpClient) {}

  // ========== CREATE ==========
  create(
    data: PengajuanEvaluasiL3,
  ): Observable<DtoResponseL3<PengajuanEvaluasiL3>> {
    return this.http.post<DtoResponseL3<PengajuanEvaluasiL3>>(
      `${this.baseUrl}/create`,
      data,
    );
  }

  // ========== UPDATE ==========
  update(
    data: PengajuanEvaluasiL3,
  ): Observable<DtoResponseL3<PengajuanEvaluasiL3>> {
    return this.http.put<DtoResponseL3<PengajuanEvaluasiL3>>(
      `${this.baseUrl}/update`,
      data,
    );
  }

  // ========== GET BY ID ==========
  getById(id: number): Observable<DtoResponseL3<PengajuanEvaluasiL3>> {
    return this.http.get<DtoResponseL3<PengajuanEvaluasiL3>>(
      `${this.baseUrl}/detail/${id}`,
    );
  }

  // ========== GET ALL (PAGINATION) ==========
  getAll(
    page: number = 0,
    size: number = 10,
    sortBy: string = "evaId",
    direction: string = "desc",
  ): Observable<DtoResponseL3<PageResponsePengajuan<PengajuanEvaluasiL3>>> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sortBy", sortBy)
      .set("direction", direction);

    return this.http.get<
      DtoResponseL3<PageResponsePengajuan<PengajuanEvaluasiL3>>
    >(`${this.baseUrl}/list`, { params });
  }

  // ========== GET BY KARYAWAN ID ==========
  getByKaryawanId(
    kryId: number,
    page: number = 0,
    size: number = 10,
  ): Observable<DtoResponseL3<PageResponsePengajuan<PengajuanEvaluasiL3>>> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());

    return this.http.get<
      DtoResponseL3<PageResponsePengajuan<PengajuanEvaluasiL3>>
    >(`${this.baseUrl}/by-karyawan/${kryId}`, { params });
  }

  // ✅ PERBAIKAN: GET BY STATUS (0,1,2) - status jadi number
  getByStatus(
    status: number, // ✅ String → Number
    page: number = 0,
    size: number = 10,
    sortBy: string = "evaCreatedDate",
    direction: string = "desc",
  ): Observable<DtoResponseL3<PageResponsePengajuan<PengajuanEvaluasiL3>>> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sortBy", sortBy)
      .set("direction", direction);

    return this.http.get<
      DtoResponseL3<PageResponsePengajuan<PengajuanEvaluasiL3>>
    >(`${this.baseUrl}/by-status/${status}`, { params });
  }

  // ========== GET BY MULTIPLE STATUSES ==========
  // statuses: string seperti "0,1,2" (tetap string karena dari query param)
  getByStatuses(
    statuses: string,
    page: number = 0,
    size: number = 10,
  ): Observable<DtoResponseL3<PageResponsePengajuan<PengajuanEvaluasiL3>>> {
    let params = new HttpParams()
      .set("statuses", statuses)
      .set("page", page.toString())
      .set("size", size.toString());

    return this.http.get<
      DtoResponseL3<PageResponsePengajuan<PengajuanEvaluasiL3>>
    >(`${this.baseUrl}/by-statuses`, { params });
  }

  // ========== GET STATUS COUNTS (DASHBOARD) ==========
  getStatusCounts(): Observable<DtoResponseL3<any>> {
    return this.http.get<DtoResponseL3<any>>(`${this.baseUrl}/status-counts`);
  }

  // ✅ PERBAIKAN: SEARCH BY STATUS AND KEYWORD - status jadi number
  searchByStatusAndKeyword(
    status: number, // ✅ String → Number
    keyword: string,
    page: number = 0,
    size: number = 10,
  ): Observable<DtoResponseL3<PageResponsePengajuan<PengajuanEvaluasiL3>>> {
    let params = new HttpParams()
      .set("status", status.toString()) // number ke string untuk query param
      .set("keyword", keyword)
      .set("page", page.toString())
      .set("size", size.toString());

    return this.http.get<
      DtoResponseL3<PageResponsePengajuan<PengajuanEvaluasiL3>>
    >(`${this.baseUrl}/search`, { params });
  }

  // ✅ PERBAIKAN: UPDATE STATUS (WORKFLOW) - newStatus jadi number
  updateStatus(id: number, newStatus: number): Observable<DtoResponseL3<any>> {
    let params = new HttpParams().set("newStatus", newStatus.toString());
    return this.http.put<DtoResponseL3<any>>(
      `${this.baseUrl}/update-status/${id}`,
      null,
      { params },
    );
  }

  // ========== APPROVE TO PENINJAUAN (0 -> 1) ==========
  approveToPeninjauan(id: number): Observable<DtoResponseL3<any>> {
    return this.http.put<DtoResponseL3<any>>(
      `${this.baseUrl}/approve-to-peninjauan/${id}`,
      {},
    );
  }

  // ========== APPROVE TO SUBMITTED (1 -> 2) ==========
  approveToSubmitted(id: number): Observable<DtoResponseL3<any>> {
    return this.http.put<DtoResponseL3<any>>(
      `${this.baseUrl}/approve-to-submitted/${id}`,
      {},
    );
  }

  // ========== REJECT (any -> 0) ==========
  reject(id: number, reason?: string): Observable<DtoResponseL3<any>> {
    let params = reason
      ? new HttpParams().set("reason", reason)
      : new HttpParams();
    return this.http.put<DtoResponseL3<any>>(
      `${this.baseUrl}/reject/${id}`,
      null,
      { params },
    );
  }

  // ========== DELETE ==========
  delete(id: number): Observable<DtoResponseL3<any>> {
    return this.http.delete<DtoResponseL3<any>>(`${this.baseUrl}/delete/${id}`);
  }

  // ✅ PERBAIKAN: CHECK EXISTENCE - krsId menjadi plbId
  exists(plbId: number, kryId: number): Observable<DtoResponseL3<boolean>> {
    let params = new HttpParams()
      .set("plbId", plbId.toString()) // ✅ dulu krsId, sekarang plbId
      .set("kryId", kryId.toString());
    return this.http.get<DtoResponseL3<boolean>>(`${this.baseUrl}/exists`, {
      params,
    });
  }
}

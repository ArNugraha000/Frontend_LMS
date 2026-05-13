// services/karyawan.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Karyawan,
  PageResponse,
  SingleResponse,
  DtoResponse,
  Divisi,
  Departemen,
  Seksi,
  Jabatan,
} from "../models/karyawan.model";

@Injectable({
  providedIn: "root",
})
export class KaryawanService {
  private baseUrl = "http://localhost:8080/api/karyawan";
  private masterUrl = "http://localhost:8080/api";

  constructor(private http: HttpClient) {}

  // ========== CRUD OPERATIONS ==========
  create(data: Karyawan): Observable<SingleResponse<Karyawan>> {
    return this.http.post<SingleResponse<Karyawan>>(
      `${this.baseUrl}/create`,
      data,
    );
  }

  update(data: Karyawan): Observable<SingleResponse<Karyawan>> {
    return this.http.put<SingleResponse<Karyawan>>(
      `${this.baseUrl}/update`,
      data,
    );
  }

  detail(id: number): Observable<SingleResponse<Karyawan>> {
    return this.http.get<SingleResponse<Karyawan>>(
      `${this.baseUrl}/detail/${id}`,
    );
  }

  list(
    page: number = 0,
    size: number = 10,
    sortBy: string = "kryId",
    direction: string = "desc",
    search?: string,
  ): Observable<PageResponse<Karyawan>> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sortBy", sortBy)
      .set("direction", direction);
    if (search) params = params.set("search", search);
    return this.http.get<PageResponse<Karyawan>>(`${this.baseUrl}/list`, {
      params,
    });
  }

  // ========== DELETE OPERATIONS ==========
  softDelete(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/soft-delete/${id}`, {});
  }

  hardDelete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/hard-delete/${id}`);
  }

  toggleStatus(id: number): Observable<SingleResponse<Karyawan>> {
    return this.http.put<SingleResponse<Karyawan>>(
      `${this.baseUrl}/toggle-status/${id}`,
      {},
    );
  }

  // ========== LOGIN ==========
  login(
    usernameOrEmail: string,
    password: string,
  ): Observable<SingleResponse<Karyawan>> {
    return this.http.post<SingleResponse<Karyawan>>(`${this.baseUrl}/login`, {
      usernameOrEmail,
      password,
    });
  }

  // ========== MASTER DATA API (DROPDOWN) ==========
  getAllDivisi(): Observable<Divisi[]> {
    return this.http.get<Divisi[]>(`${this.masterUrl}/divisi/getDiv`);
  }

  getAllDepartemen(): Observable<Departemen[]> {
    return this.http.get<Departemen[]>(`${this.masterUrl}/departemen/getDep`);
  }

  getAllSeksi(): Observable<Seksi[]> {
    return this.http.get<Seksi[]>(`${this.masterUrl}/seksie/getSek`);
  }

  getAllJabatanActive(): Observable<Jabatan[]> {
    return this.http.get<Jabatan[]>(
      `${this.masterUrl}/jabatan/list-active-all`,
    );
  }

  // ========== STATUS EVALUASI API ==========
  getByStatusEvaluasi(
    statusEvaluasi: number,
  ): Observable<DtoResponse<Karyawan[]>> {
    let params = new HttpParams().set(
      "statusEvaluasi",
      statusEvaluasi.toString(),
    );
    return this.http.get<DtoResponse<Karyawan[]>>(
      `${this.baseUrl}/get-by-status-evaluasi`,
      { params },
    );
  }

  updateStatusEvaluasi(
    id: number,
    statusEvaluasi: number,
  ): Observable<DtoResponse<any>> {
    let params = new HttpParams().set(
      "statusEvaluasi",
      statusEvaluasi.toString(),
    );
    return this.http.put<DtoResponse<any>>(
      `${this.baseUrl}/update-status-evaluasi/${id}`,
      null,
      { params },
    );
  }

  setSudahEvaluasi(id: number): Observable<DtoResponse<any>> {
    return this.http.put<DtoResponse<any>>(
      `${this.baseUrl}/set-sudah-evaluasi/${id}`,
      {},
    );
  }

  setBelumEvaluasi(id: number): Observable<DtoResponse<any>> {
    return this.http.put<DtoResponse<any>>(
      `${this.baseUrl}/set-belum-evaluasi/${id}`,
      {},
    );
  }
}

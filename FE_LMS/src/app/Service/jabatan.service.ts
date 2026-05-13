// services/jabatan.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Jabatan,
  JabatanPageResponse,
  JabatanListResponse,
  JabatanResponse,
  JabatanDeleteResponse,
} from "../models/jabatan.model";

@Injectable({
  providedIn: "root",
})
export class JabatanService {
  private apiUrl = "http://localhost:8080/api/jabatan";

  constructor(private http: HttpClient) {}

  /**
   * Get all jabatan with pagination (for admin - includes nonaktif)
   */
  list(
    page: number = 0,
    size: number = 10,
    sortBy: string = "jbnId",
    direction: string = "desc",
    search?: string,
  ): Observable<JabatanPageResponse> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sortBy", sortBy)
      .set("direction", direction);

    if (search && search.trim() !== "") {
      params = params.set("search", search);
    }

    return this.http.get<JabatanPageResponse>(`${this.apiUrl}/list`, {
      params,
    });
  }

  /**
   * Get only ACTIVE jabatan (for user - status = 0)
   */
  listActive(
    page: number = 0,
    size: number = 10,
    sortBy: string = "jbnId",
    direction: string = "asc",
    search?: string,
  ): Observable<JabatanPageResponse> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sortBy", sortBy)
      .set("direction", direction);

    if (search && search.trim() !== "") {
      params = params.set("search", search);
    }

    return this.http.get<JabatanPageResponse>(`${this.apiUrl}/list-active`, {
      params,
    });
  }

  /**
   * Get all active jabatan (no pagination) for dropdown
   */
  listActiveAll(): Observable<JabatanListResponse> {
    return this.http.get<JabatanListResponse>(`${this.apiUrl}/list-active-all`);
  }

  /**
   * Get jabatan by ID
   */
  getById(id: number): Observable<JabatanResponse> {
    return this.http.get<JabatanResponse>(`${this.apiUrl}/detail/${id}`);
  }

  /**
   * Create new jabatan
   */
  create(data: Jabatan): Observable<JabatanResponse> {
    return this.http.post<JabatanResponse>(`${this.apiUrl}/create`, data);
  }

  /**
   * Update jabatan
   */
  update(data: Jabatan): Observable<JabatanResponse> {
    return this.http.put<JabatanResponse>(`${this.apiUrl}/update`, data);
  }

  /**
   * Update status jabatan (0 = AKTIF, 1 = NONAKTIF)
   */
  updateStatus(
    id: number,
    status: number,
    modifBy: string = "SYSTEM",
  ): Observable<JabatanDeleteResponse> {
    let params = new HttpParams()
      .set("status", status.toString())
      .set("modifBy", modifBy);
    return this.http.put<JabatanDeleteResponse>(
      `${this.apiUrl}/update-status/${id}`,
      null,
      { params },
    );
  }

  /**
   * Toggle status jabatan (AKTIF <-> NONAKTIF)
   */
  toggleStatus(
    id: number,
    modifBy: string = "SYSTEM",
  ): Observable<JabatanDeleteResponse> {
    let params = new HttpParams().set("modifBy", modifBy);
    return this.http.put<JabatanDeleteResponse>(
      `${this.apiUrl}/toggle-status/${id}`,
      null,
      { params },
    );
  }

  /**
   * Soft delete - set status menjadi 1 (NONAKTIF)
   */
  softDelete(
    id: number,
    modifBy: string = "SYSTEM",
  ): Observable<JabatanDeleteResponse> {
    let params = new HttpParams().set("modifBy", modifBy);
    return this.http.delete<JabatanDeleteResponse>(
      `${this.apiUrl}/soft-delete/${id}`,
      { params },
    );
  }

  /**
   * Hard delete - permanent delete from database
   */
  hardDelete(id: number): Observable<JabatanDeleteResponse> {
    return this.http.delete<JabatanDeleteResponse>(
      `${this.apiUrl}/hard-delete/${id}`,
    );
  }
}

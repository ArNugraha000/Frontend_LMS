// services/profile.service.ts - Tanpa Password
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";

export interface ProfileData {
  kryId: number;
  kryUsername: string;
  kryNamaDpn: string;
  kryNamaBkg: string;
  kryEmail: string;
  kryTglLahir: string;
  kryProfil?: string;
  kryDivisi?: string;
  kryDep?: string;
  krySesi?: string;
  kryJabatan?: string;
  kryStatus?: string;
  kryCreatedDate?: string;
  kryModifDate?: string;
  fullName?: string;
  kryStatusEvaluasi?: number;
}

export interface ApiResponse {
  success: boolean;
  data: any;
  message?: string;
}

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private apiUrl = "http://localhost:8080/api/karyawan";

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  getUserIdFromCookie(): number | null {
    const userId = this.cookieService.get("userId");
    console.log("User ID from cookie:", userId);
    return userId ? parseInt(userId, 10) : null;
  }

  getProfileById(id: number): Observable<ApiResponse> {
    console.log("Fetching profile for ID:", id);
    return this.http.get<ApiResponse>(`${this.apiUrl}/detail/${id}`);
  }

  getMyProfile(): Observable<ApiResponse> {
    const userId = this.getUserIdFromCookie();
    if (!userId) {
      throw new Error("User ID not found in cookies");
    }
    return this.getProfileById(userId);
  }

  updateProfile(data: {
    kryId: number;
    kryEmail?: string;
    kryTglLahir?: string;
    kryProfil?: string;
  }): Observable<ApiResponse> {
    console.log("Updating profile with data:", data);
    return this.http.put<ApiResponse>(`${this.apiUrl}/update-profile`, data);
  }

  updateMyProfile(data: {
    kryEmail?: string;
    kryTglLahir?: string;
    kryProfil?: string;
  }): Observable<ApiResponse> {
    const userId = this.getUserIdFromCookie();
    if (!userId) {
      throw new Error("User ID not found in cookies");
    }
    return this.updateProfile({
      kryId: userId,
      ...data,
    });
  }
}

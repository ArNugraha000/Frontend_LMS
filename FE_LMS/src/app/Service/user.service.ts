import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, of, switchMap } from "rxjs";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseUrl = "http://localhost:8080/User";
  private karyawanBaseUrl = "http://localhost:8080/api/karyawan";

  constructor(private http: HttpClient) {}

  // 🔥 LOGIN API - Mencoba ke User dulu, jika gagal coba ke Karyawan
  login(user: { usrName: string; usrPassword: string }): Observable<any> {
    // Coba login ke API User dulu
    return this.http.post<any>(`${this.baseUrl}/login`, user).pipe(
      switchMap((userResponse: any) => {
        // Jika User API mengembalikan data (berhasil login)
        if (userResponse && userResponse.length > 0) {
          return of(userResponse);
        }

        // Jika User API tidak mengembalikan data, coba ke Karyawan API
        return this.loginToKaryawan(user);
      }),
      catchError((error) => {
        // Jika error dari User API, coba ke Karyawan API
        console.log("User API error, trying Karyawan API...");
        return this.loginToKaryawan(user);
      }),
    );
  }

  // Login ke API Karyawan
  private loginToKaryawan(user: {
    usrName: string;
    usrPassword: string;
  }): Observable<any> {
    const karyawanPayload = {
      usernameOrEmail: user.usrName,
      password: user.usrPassword,
    };

    return this.http
      .post<any>(`${this.karyawanBaseUrl}/login`, karyawanPayload)
      .pipe(
        switchMap((response: any) => {
          if (response && response.success && response.data) {
            // Convert KaryawanVo format ke format User yang diharapkan frontend
            const convertedUser = this.convertKaryawanToUser(response.data);
            return of([convertedUser]); // Return dalam array format seperti User API
          }
          return of([]); // Return empty array jika gagal
        }),
        catchError((error) => {
          console.error("Karyawan API error:", error);
          return of([]); // Return empty array jika kedua API gagal
        }),
      );
  }

  // Konversi data Karyawan ke format User
  private convertKaryawanToUser(karyawanData: any): any {
    return {
      usrId: karyawanData.kryId,
      usrName: karyawanData.kryUsername,
      usrPassword: karyawanData.kryPassword,
      usrEmail: karyawanData.kryEmail,
      usrFullName:
        karyawanData.fullName ||
        `${karyawanData.kryNamaDpn} ${karyawanData.kryNamaBkg}`,
      role: karyawanData.kryJabatan || "User",
      status: karyawanData.kryStatus === "0" ? "Active" : "Inactive",
      divisi: karyawanData.kryDivisi,
      departement: karyawanData.kryDep,
      // Tambahkan field lain sesuai kebutuhan
    };
  }
}

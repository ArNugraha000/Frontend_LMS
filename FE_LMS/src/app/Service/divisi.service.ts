import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class DivisiService {
  private baseUrl = "http://localhost:8080/api/divisi";

  private reloadTrigger = new Subject<void>();
  reload$ = this.reloadTrigger.asObservable();

  constructor(private http: HttpClient) {}

  // Handler error
  private handleError(error: HttpErrorResponse) {
    let errorMessage = "Terjadi kesalahan pada server";

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error && error.error.data) {
        errorMessage = error.error.data;
      } else if (error.message) {
        errorMessage = error.message;
      }
    }

    console.error("API Error:", error);

    Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "swal-success-btn",
      },
      buttonsStyling: false,
    });

    return throwError(() => new Error(errorMessage));
  }

  getDivisi(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/getDiv`)
      .pipe(catchError(this.handleError));
  }

  save(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data).pipe(
      tap(() => this.reloadTrigger.next()),
      catchError(this.handleError),
    );
  }

  update(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, data).pipe(
      tap(() => this.reloadTrigger.next()),
      catchError(this.handleError),
    );
  }

  softDeleteDivisi(id: number, userName: string): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/soft-delete/${id}`, { modifBy: userName })
      .pipe(
        tap(() => this.reloadTrigger.next()),
        catchError(this.handleError),
      );
  }
}

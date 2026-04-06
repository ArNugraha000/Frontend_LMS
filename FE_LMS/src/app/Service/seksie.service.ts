import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SeksieService {
  private baseUrl = "http://localhost:8080/api/seksie";

  private reloadTrigger = new Subject<void>();
  reload$ = this.reloadTrigger.asObservable();

  constructor(private http: HttpClient) {}

  getSeksie(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getSek`);
  }

  save(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  update(data: any): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/update`, data)
      .pipe(tap(() => this.reloadTrigger.next()));
  }

  softDelete(id: number, userName: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/delete/${id}`, { userName }).pipe(
      tap(() => this.reloadTrigger.next()), // trigger reload setiap sukses
    );
  }
}

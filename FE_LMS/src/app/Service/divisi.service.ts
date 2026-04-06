import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DivisiService {
  private baseUrl = "http://localhost:8080/api/divisi";

  private reloadTrigger = new Subject<void>();
  reload$ = this.reloadTrigger.asObservable();

  constructor(private http: HttpClient) {}

  getDivisi(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDiv`);
  }

  save(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, data);
  }

  // Divisi
  softDeleteDivisi(id: number, userName: string): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/delete/${id}`, { userName })
      .pipe(tap(() => this.reloadTrigger.next()));
  }
}

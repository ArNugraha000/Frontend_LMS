import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { Kursus } from "../models/kursus.model";

@Injectable({
  providedIn: "root",
})
export class KursusService {
  private apiUrl = "http://localhost:8080/Kursus/getKursus";

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap((res) => {
        console.log("Response API Kursus:", res);
      }),
    );
  }
}

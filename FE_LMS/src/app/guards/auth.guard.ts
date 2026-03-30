import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLogin = localStorage.getItem("isLogin");

    if (isLogin === "true") {
      return true; // boleh masuk
    } else {
      // ❌ belum login → redirect ke login
      this.router.navigate(["/login"]);
      return false;
    }
  }
}

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "logout-cmp",
  templateUrl: "logout.component.html",
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // 🔥 langsung logout saat component dibuka (optional)
    this.logout();
  }

  logout() {
    // 🧹 hapus semua data login
    localStorage.removeItem("isLogin");

    // 🔥 redirect aman ke login
    this.router.navigateByUrl("/login");
  }
}

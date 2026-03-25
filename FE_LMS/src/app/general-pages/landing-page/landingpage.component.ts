import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "dashboard-cmp",
  moduleId: module.id,
  templateUrl: "landingpage.component.html",
})
export class LandingPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToLogin() {
    this.router.navigate(["/login"]);
  }

  goToAbout() {
    this.router.navigate(["/about"]);
  }
  goToRegister() {
    this.router.navigate(["/register"]);
  }
}

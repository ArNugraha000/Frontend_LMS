import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { KaryawanService } from "../../Service/karyawan.service";
import { Karyawan, PageResponse } from "../../models/karyawan.model";

@Component({
  selector: "icons-cmp",
  templateUrl: "mytraining.component.html",
  styleUrls: ["./mytraining.component.css"],
})
export class MyTrainingComponent {
  constructor(private router: Router) {}

  goTo(menu: string) {
    switch (menu) {
      case "profil":
        this.router.navigate(["/profile"]);
        break;
      case "beranda":
        this.router.navigate(["/dashboard"]);
        break;
      case "materi":
        this.router.navigate(["/materi"]);
        break;
      case "pelatihan":
        this.router.navigate(["/manage-training"]);
        break;
      default:
        console.log("Menu tidak dikenali:", menu);
    }
  }
}

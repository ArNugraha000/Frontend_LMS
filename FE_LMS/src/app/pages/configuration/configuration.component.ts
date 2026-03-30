import { Component, OnInit } from "@angular/core";
import { DivisiService } from "app/Service/divisi.service";
import { DepartemenService } from "app/Service/departemen.service";
import { SeksieService } from "app/Service/seksie.service";

@Component({
  selector: "app-master",
  templateUrl: "./configuration.component.html",
})
export class ConfigurationComponent implements OnInit {
  activeTab = "divisi";

  divisiList: any[] = [];
  departemenList: any[] = [];
  seksiList: any[] = [];

  constructor(
    private divisiService: DivisiService,
    private departemenService: DepartemenService,
    private seksieService: SeksieService,
  ) {}

  ngOnInit() {
    this.loadDivisi();
    this.loadDepartemen();
    this.loadSeksie();
  }

  // 🔵 DIVISI
  loadDivisi() {
    this.divisiService.getDivisi().subscribe({
      next: (res: any) => {
        this.divisiList = res.data || res;
      },
    });
  }

  // 🟢 DEPARTEMEN
  loadDepartemen() {
    this.departemenService.getDepartemen().subscribe({
      next: (res: any) => {
        this.departemenList = res.data || res;
      },
    });
  }

  // 🟣 SEKSI
  loadSeksie() {
    this.seksieService.getSeksie().subscribe({
      next: (res: any) => {
        this.seksiList = res.data || res;
      },
    });
  }

  // 🔥 ACTION
  tambah(type: string) {
    console.log("Tambah:", type);
  }

  edit(item: any) {
    console.log("Edit:", item);
  }

  delete(item: any) {
    console.log("Delete:", item);
  }
}

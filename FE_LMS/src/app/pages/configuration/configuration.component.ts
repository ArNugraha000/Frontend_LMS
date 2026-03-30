import { Component, OnInit } from "@angular/core";
import { DivisiService } from "app/Service/divisi.service";
import { DepartemenService } from "app/Service/departemen.service";
import { SeksieService } from "app/Service/seksie.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ViewChild, TemplateRef } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

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
    private modalService: NgbModal,
    private cookiesService: CookieService,
  ) {}

  @ViewChild("modalDivisi") modalDivisi!: TemplateRef<any>;
  @ViewChild("modalDepartemen") modalDepartemen!: TemplateRef<any>;
  @ViewChild("modalSeksi") modalSeksi!: TemplateRef<any>;

  formDivisi: any = {};
  formDepartemen: any = {};
  formSeksi: any = {};

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

  tambah(type: string) {
    if (type === "divisi") {
      this.formDivisi = {};
      this.modalService.open(this.modalDivisi, { size: "md" });
    }

    if (type === "departemen") {
      this.formDepartemen = {};
      this.modalService.open(this.modalDepartemen, { size: "md" });
    }

    if (type === "seksi") {
      this.formSeksi = {};
      this.modalService.open(this.modalSeksi, { size: "md" });
    }
  }

  edit(item: any) {
    console.log("Edit:", item);
  }

  delete(item: any) {
    console.log("Delete:", item);
  }

  saveDivisi(modal: any) {
    const userName = this.cookiesService.get("userName") || "SYSTEM";

    this.formDivisi.divStatus = "0";
    this.formDivisi.divCreateBy = userName;
    this.divisiService.save(this.formDivisi).subscribe(() => {
      this.loadDivisi();
      modal.close();
    });
  }

  saveDepartemen(modal: any) {
    const userName = this.cookiesService.get("userName") || "SYSTEM";

    const payload = {
      depJudul: this.formDepartemen.depJudul,
      depNama: this.formDepartemen.depNama,
      depStatus: "0",
      depCreateBy: userName, // ✅ TAMBAHAN DI SINI
      divisi: {
        divId: this.formDepartemen.divId,
      },
    };

    console.log("PAYLOAD:", payload);

    this.departemenService.save(payload).subscribe({
      next: (res) => {
        console.log("SUCCESS", res);
        this.loadDepartemen();
        modal.close();
      },
      error: (err) => {
        console.error("ERROR", err);
      },
    });
  }

  saveSeksi(modal: any) {
    const userName = this.cookiesService.get("userName") || "SYSTEM";

    const payload = {
      sekJudul: this.formSeksi.sekJudul,
      sekNama: this.formSeksi.sekNama,
      sekStatus: "0",
      sekCreateBy: userName,
      departemen: {
        depId: this.formSeksi.depId, // ✅ FIX DI SINI
      },
    };

    console.log("PAYLOAD SEKSI:", payload);

    this.seksieService.save(payload).subscribe(() => {
      this.loadSeksie();
      modal.close();
    });
  }
}

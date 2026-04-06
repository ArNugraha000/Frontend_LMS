import { Component, OnInit } from "@angular/core";
import { DivisiService } from "app/Service/divisi.service";
import { DepartemenService } from "app/Service/departemen.service";
import { SeksieService } from "app/Service/seksie.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ViewChild, TemplateRef } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2";
import { Observable } from "rxjs";
import { Subscription } from "rxjs";

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
  formDepartemen: any = { divId: null };
  formSeksi: any = { depId: null };

  private subs: Subscription[] = [];

  isEditSeksi: boolean = false;
  isEditDepartemen: boolean = false;
  isEditDivisi: boolean = false;

  originalSeksi: any;
  originalDepartemen: any;
  originalDivisi: any;

  searchDivisi: string = "";
  searchDepartemen: string = "";
  searchSeksi: string = "";

  // 🔵 DIVISI
  pageDivisi = 1;
  pageSizeDivisi: any = 5;

  // 🟢 DEPARTEMEN
  pageDepartemen = 1;
  pageSizeDepartemen: any = 5;

  // 🟣 SEKSI
  pageSeksi = 1;
  pageSizeSeksi: any = 5;

  pageSizeOptions = [5, 10, 50, "Semua"];

  ngOnInit() {
    this.divisiService.reload$.subscribe(() => this.loadDivisi());
    this.loadDivisi();

    this.departemenService.reload$.subscribe(() => this.loadDepartemen());
    this.loadDepartemen();

    this.seksieService.reload$.subscribe(() => this.loadSeksie());
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
      this.isEditDivisi = false;
      this.formDivisi = {};
      this.modalService.open(this.modalDivisi);
    }

    if (type === "departemen") {
      this.isEditDepartemen = false;
      this.formDepartemen = {};
      this.modalService.open(this.modalDepartemen);
    }

    if (type === "seksi") {
      this.isEditSeksi = false;
      this.formSeksi = {};
      this.modalService.open(this.modalSeksi);
    }
  }

  editSeksie(item: any) {
    this.isEditSeksi = true;
    this.loadDepartemen();
    this.formSeksi = {
      sekId: item.sekId,
      sekJudul: item.sekJudul,
      sekNama: item.sekNama,
      depId: item.depId,
    };

    this.originalSeksi = { ...this.formSeksi };
    setTimeout(() => {
      this.modalService.open(this.modalSeksi, { size: "md" });
    }, 100);
  }

  editDepartemen(item: any) {
    this.isEditDepartemen = true;

    this.formDepartemen = {
      depId: item.depId,
      depJudul: item.depJudul,
      depNama: item.depNama,
      divId: item.divId, // relasi
    };

    this.originalDepartemen = { ...this.formDepartemen };
    this.modalService.open(this.modalDepartemen, { size: "md" });
  }

  editDivisi(item: any) {
    this.isEditDivisi = true;

    this.formDivisi = {
      divId: item.divId,
      divJudul: item.divJudul,
      divNama: item.divNama,
    };
    this.originalDivisi = { ...this.formDivisi };

    this.modalService.open(this.modalDivisi, { size: "md" });
  }

  delete(item: any) {
    console.log("Delete:", item);
  }

  saveDivisi(modal: any) {
    const userName = this.cookiesService.get("userName") || "SYSTEM";

    if (!this.formDivisi.divJudul?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Kode Harus diisi",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal-success-btn",
        },
        buttonsStyling: false,
      });
      return;
    }
    if (!this.formDivisi.divNama?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Nama Harus diisi",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal-success-btn",
        },
        buttonsStyling: false,
      });
      return;
    }

    if (this.isEditDivisi) {
      // 🔥 UPDATE

      if (
        JSON.stringify(this.formDivisi) === JSON.stringify(this.originalDivisi)
      ) {
        Swal.fire({
          title: "Info!",
          text: "Tidak ada perubahan data",
          icon: "info",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "swal-success-btn",
          },
          buttonsStyling: false,
        });
        return;
      }

      const payload = {
        divId: this.formDivisi.divId,
        divJudul: this.formDivisi.divJudul,
        divNama: this.formDivisi.divNama,
        divModifBy: userName,
      };

      this.divisiService.update(payload).subscribe({
        next: () => {
          Swal.fire({
            title: "Berhasil!",
            text: "Divisi berhasil diubah",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });
          this.loadDivisi();
          modal.close();
          this.isEditDivisi = false;
        },
        error: (err) => {
          console.error(err);
          Swal.fire("Gagal!", "Update gagal", "error");
          Swal.fire({
            title: "Gagal!",
            text: "Update gagal",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });
        },
      });
    } else {
      // 🔥 CREATE
      const payload = {
        divJudul: this.formDivisi.divJudul,
        divNama: this.formDivisi.divNama,
        divStatus: "0",
        divCreateBy: userName,
      };

      console.log("CREATE DIVISI:", payload);

      this.divisiService.save(payload).subscribe({
        next: () => {
          Swal.fire({
            title: "Berhasil!",
            text: "Divisi berhasil disimpan",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });
          this.loadDivisi();
          modal.close();
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: "Gagal!",
            text: "Simpan gagal",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });
        },
      });
    }
  }

  saveDepartemen(modal: any) {
    const userName = this.cookiesService.get("userName") || "SYSTEM";

    if (!this.formDepartemen.depJudul?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Kode Harus diisi",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal-success-btn",
        },
        buttonsStyling: false,
      });
      return;
    }

    if (!this.formDepartemen.depNama?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Nama Harus diisi",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal-success-btn",
        },
        buttonsStyling: false,
      });
      return;
    }

    if (!this.formDepartemen.divId) {
      Swal.fire({
        title: "Warning!",
        text: "Divisi dari departemen ini Harus diisi",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal-success-btn",
        },
        buttonsStyling: false,
      });
      return;
    }

    if (this.isEditDepartemen) {
      // 🔥 UPDATE

      if (
        JSON.stringify(this.formDepartemen) ===
        JSON.stringify(this.originalDepartemen)
      ) {
        Swal.fire({
          title: "Info!",
          text: "Tidak ada perubahan data",
          icon: "info",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "swal-success-btn",
          },
          buttonsStyling: false,
        });
        return;
      }
      const payload = {
        depId: this.formDepartemen.depId,
        depJudul: this.formDepartemen.depJudul,
        depNama: this.formDepartemen.depNama,
        divId: this.formDepartemen.divId,
        depModifBy: userName,
      };

      console.log("UPDATE DEPARTEMEN:", payload);

      this.departemenService.update(payload).subscribe({
        next: () => {
          Swal.fire({
            title: "Berhasil!",
            text: "Departemen berhasil diubah",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });
          this.loadDepartemen();
          modal.close();
          this.isEditDepartemen = false;
        },
        error: (err) => {
          console.error(err);
          Swal.fire("Gagal!", "Update gagal", "error");
        },
      });
    } else {
      // 🔥 CREATE
      const payload = {
        depJudul: this.formDepartemen.depJudul,
        depNama: this.formDepartemen.depNama,
        depStatus: "0",
        depCreateBy: userName,
        divisi: {
          divId: this.formDepartemen.divId,
        },
      };

      this.departemenService.save(payload).subscribe({
        next: () => {
          Swal.fire({
            title: "Berhasil!",
            text: "Departemen berhasil disimpan",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });
          this.loadDepartemen();
          modal.close();
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: "Gagal!",
            text: "Simpan gagal",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });
        },
      });
    }
  }

  saveSeksi(modal: any) {
    const userName = this.cookiesService.get("userName") || "SYSTEM";

    if (!this.formSeksi.sekJudul?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Kode Harus diisi",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal-success-btn",
        },
        buttonsStyling: false,
      });
      return;
    }
    if (!this.formSeksi.sekNama?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Nama Harus diisi",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal-success-btn",
        },
        buttonsStyling: false,
      });
      return;
    }
    if (!this.formSeksi.depId) {
      Swal.fire({
        title: "Warning!",
        text: "Departemen dari Seksie ini Harus diisi",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal-success-btn",
        },
        buttonsStyling: false,
      });
      return;
    }

    if (this.isEditSeksi) {
      if (
        JSON.stringify(this.formSeksi) === JSON.stringify(this.originalSeksi)
      ) {
        Swal.fire({
          title: "Info!",
          text: "Tidak ada perubahan data",
          icon: "info",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "swal-success-btn",
          },
          buttonsStyling: false,
        });
        return;
      }
      // 🔥 UPDATE
      const payload = {
        sekId: this.formSeksi.sekId,
        sekJudul: this.formSeksi.sekJudul,
        sekNama: this.formSeksi.sekNama,
        depId: this.formSeksi.depId,
        sekModifBy: userName,
      };

      this.seksieService.update(payload).subscribe({
        next: () => {
          Swal.fire({
            title: "Berhasil!",
            text: "Data seksie berhasil diubah",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });

          this.loadSeksie();
          modal.close();
          this.isEditSeksi = false;
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: "Gagal!",
            text: "Terjadi kesalahan saat update",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });
        },
      });
    } else {
      // 🔥 CREATE
      const payload = {
        sekJudul: this.formSeksi.sekJudul,
        sekNama: this.formSeksi.sekNama,
        sekStatus: "0",
        sekCreateBy: userName,
        departemen: {
          depId: this.formSeksi.depId,
        },
      };

      this.seksieService.save(payload).subscribe({
        next: () => {
          Swal.fire({
            title: "Berhasil!",
            text: "Data seksi berhasil disimpan",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });

          this.loadSeksie();
          modal.close();
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: "Gagal!",
            text: "Terjadi kesalahan saat simpan",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });
        },
      });
    }
  }

  confirmToggleStatus(event: Event, item: any, type: string) {
    event.preventDefault(); // mencegah checkbox auto-toggle
    const userName = this.cookiesService.get("userName") || "SYSTEM";

    let isActive: boolean;
    let name: string;

    // Tentukan tipe
    if (type === "seksi") {
      isActive = item.sekStatus?.toUpperCase() === "AKTIF";
      name = item.sekNama;
    } else if (type === "departemen") {
      isActive = item.depStatus?.toUpperCase() === "AKTIF";
      name = item.depNama;
    } else if (type === "divisi") {
      isActive = item.divStatus?.toUpperCase() === "AKTIF";
      name = item.divNama;
    }

    const actionText = isActive ? "NonAktifkan" : "Aktifkan";

    Swal.fire({
      title: `Apakah Anda ingin ${actionText} ${type} "${name}"?`,
      text: "Anda tidak bisa membatalkan aksi ini nanti!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let apiCall: Observable<any>;
        if (type === "seksi")
          apiCall = this.seksieService.softDelete(item.sekId, userName);
        if (type === "departemen")
          apiCall = this.departemenService.softDeleteDepartemen(
            item.depId,
            userName,
          );
        if (type === "divisi")
          apiCall = this.divisiService.softDeleteDivisi(item.divId, userName);

        apiCall.subscribe(() => {
          Swal.fire({
            title: "Berhasil!",
            text: `${type.charAt(0).toUpperCase() + type.slice(1)} "${name}" telah diubah menjadi ${isActive ? "NONAKTIF" : "AKTIF"}.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal-success-btn",
            },
            buttonsStyling: false,
          });
        });
      }
    });
  }

  get filteredDivisi() {
    if (!this.searchDivisi) return this.divisiList;

    return this.divisiList.filter((x) =>
      (x.divJudul + x.divNama)
        .toLowerCase()
        .includes(this.searchDivisi.toLowerCase()),
    );
  }

  get filteredDepartemen() {
    if (!this.searchDepartemen) return this.departemenList;

    return this.departemenList.filter((x) =>
      (x.depJudul + x.depNama + x.divNama)
        .toLowerCase()
        .includes(this.searchDepartemen.toLowerCase()),
    );
  }

  get filteredSeksi() {
    if (!this.searchSeksi) return this.seksiList;

    return this.seksiList.filter((x) =>
      (x.sekJudul + x.sekNama + x.depNama)
        .toLowerCase()
        .includes(this.searchSeksi.toLowerCase()),
    );
  }
  // 🔵 DIVISI
  get pagedDivisi() {
    if (this.pageSizeDivisi === "Semua") return this.filteredDivisi;

    const start = (this.pageDivisi - 1) * this.pageSizeDivisi;
    return this.filteredDivisi.slice(start, start + this.pageSizeDivisi);
  }

  get totalPagesDivisi() {
    if (this.pageSizeDivisi === "Semua") return 1;
    return Math.ceil(this.filteredDivisi.length / this.pageSizeDivisi);
  }

  // 🟢 DEPARTEMEN
  get pagedDepartemen() {
    if (this.pageSizeDepartemen === "Semua") return this.filteredDepartemen;

    const start = (this.pageDepartemen - 1) * this.pageSizeDepartemen;
    return this.filteredDepartemen.slice(
      start,
      start + this.pageSizeDepartemen,
    );
  }

  get totalPagesDepartemen() {
    if (this.pageSizeDepartemen === "Semua") return 1;
    return Math.ceil(this.filteredDepartemen.length / this.pageSizeDepartemen);
  }

  // 🟣 SEKSI
  get pagedSeksi() {
    if (this.pageSizeSeksi === "Semua") return this.filteredSeksi;

    const start = (this.pageSeksi - 1) * this.pageSizeSeksi;
    return this.filteredSeksi.slice(start, start + this.pageSizeSeksi);
  }

  get totalPagesSeksi() {
    if (this.pageSizeSeksi === "Semua") return 1;
    return Math.ceil(this.filteredSeksi.length / this.pageSizeSeksi);
  }
}

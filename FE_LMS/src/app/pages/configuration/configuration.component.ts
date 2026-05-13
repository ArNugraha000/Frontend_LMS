// configuration.component.ts
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
import { Router } from "@angular/router";

@Component({
  selector: "app-master",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.css"],
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
    private router: Router,
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
      error: (err) => {
        console.error("Error loading divisi:", err);
      },
    });
  }

  // 🟢 DEPARTEMEN
  loadDepartemen() {
    this.departemenService.getDepartemen().subscribe({
      next: (res: any) => {
        this.departemenList = res.data || res;
      },
      error: (err) => {
        console.error("Error loading departemen:", err);
      },
    });
  }

  // 🟣 SEKSI
  loadSeksie() {
    this.seksieService.getSeksie().subscribe({
      next: (res: any) => {
        this.seksiList = res.data || res;
      },
      error: (err) => {
        console.error("Error loading seksi:", err);
      },
    });
  }

  // ✅ VALIDASI DIVISI - CEK DUPLIKAT KODE
  isDivisiKodeDuplicate(kode: string, excludeId?: number): boolean {
    return this.divisiList.some(
      (item) =>
        item.divJudul?.toUpperCase() === kode?.toUpperCase() &&
        item.divId !== excludeId,
    );
  }

  // ✅ VALIDASI DEPARTEMEN - CEK DUPLIKAT KODE
  isDepartemenKodeDuplicate(kode: string, excludeId?: number): boolean {
    return this.departemenList.some(
      (item) =>
        item.depJudul?.toUpperCase() === kode?.toUpperCase() &&
        item.depId !== excludeId,
    );
  }

  // ✅ VALIDASI SEKSI - CEK DUPLIKAT KODE
  isSeksiKodeDuplicate(kode: string, excludeId?: number): boolean {
    return this.seksiList.some(
      (item) =>
        item.sekJudul?.toUpperCase() === kode?.toUpperCase() &&
        item.sekId !== excludeId,
    );
  }

  openJabatanPage(): void {
    this.router.navigate(["/jabatan"]);
  }

  openKaryawanPage(): void {
    this.router.navigate(["/karyawan"]);
  }

  tambah(type: string) {
    if (type === "divisi") {
      this.isEditDivisi = false;
      this.formDivisi = {};
      this.modalService.open(this.modalDivisi);
    }

    if (type === "departemen") {
      this.isEditDepartemen = false;
      this.formDepartemen = { divId: null };
      this.modalService.open(this.modalDepartemen);
    }

    if (type === "seksi") {
      this.isEditSeksi = false;
      this.formSeksi = { depId: null };
      this.modalService.open(this.modalSeksi);
    }
  }

  editSeksie(item: any) {
    this.isEditSeksi = true;
    this.formSeksi = {
      sekId: item.sekId,
      sekJudul: item.sekJudul,
      sekNama: item.sekNama,
      depId: item.depId,
    };
    this.originalSeksi = { ...this.formSeksi };
    this.modalService.open(this.modalSeksi, { size: "md" });
  }

  editDepartemen(item: any) {
    this.isEditDepartemen = true;
    this.formDepartemen = {
      depId: item.depId,
      depJudul: item.depJudul,
      depNama: item.depNama,
      divId: item.divId,
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
    const newKode = this.formDivisi.divJudul?.trim().toUpperCase();
    const currentId = this.isEditDivisi ? this.formDivisi.divId : undefined;

    // Validasi Kode tidak boleh kosong
    if (!this.formDivisi.divJudul?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Kode Harus diisi",
        icon: "warning",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    // Validasi Nama tidak boleh kosong
    if (!this.formDivisi.divNama?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Nama Harus diisi",
        icon: "warning",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    // ✅ VALIDASI DUPLIKAT KODE (untuk create dan update)
    if (this.isDivisiKodeDuplicate(newKode, currentId)) {
      Swal.fire({
        title: "Gagal!",
        text: `Kode "${this.formDivisi.divJudul}" sudah digunakan oleh divisi lain. Silakan gunakan kode yang berbeda.`,
        icon: "error",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    if (this.isEditDivisi) {
      if (
        JSON.stringify(this.formDivisi) === JSON.stringify(this.originalDivisi)
      ) {
        Swal.fire({
          title: "Info!",
          text: "Tidak ada perubahan data",
          icon: "info",
          confirmButtonColor: "#ba0403",
        });
        return;
      }

      const payload = {
        divId: this.formDivisi.divId,
        divJudul: newKode,
        divNama: this.formDivisi.divNama,
        divModifBy: userName,
      };

      this.divisiService.update(payload).subscribe({
        next: () => {
          Swal.fire({
            title: "Berhasil!",
            text: "Divisi berhasil diubah",
            icon: "success",
            confirmButtonColor: "#ba0403",
          });
          this.loadDivisi();
          modal.close();
          this.isEditDivisi = false;
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: "Gagal!",
            text: err.error?.message || "Update gagal",
            icon: "error",
            confirmButtonColor: "#ba0403",
          });
        },
      });
    } else {
      const payload = {
        divJudul: newKode,
        divNama: this.formDivisi.divNama,
        divStatus: "0",
        divCreateBy: userName,
      };

      this.divisiService.save(payload).subscribe({
        next: () => {
          Swal.fire({
            title: "Berhasil!",
            text: "Divisi berhasil disimpan",
            icon: "success",
            confirmButtonColor: "#ba0403",
          });
          this.loadDivisi();
          modal.close();
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: "Gagal!",
            text: err.error?.message || "Simpan gagal",
            icon: "error",
            confirmButtonColor: "#ba0403",
          });
        },
      });
    }
  }

  saveDepartemen(modal: any) {
    const userName = this.cookiesService.get("userName") || "SYSTEM";
    const newKode = this.formDepartemen.depJudul?.trim().toUpperCase();
    const currentId = this.isEditDepartemen
      ? this.formDepartemen.depId
      : undefined;

    // Validasi Kode tidak boleh kosong
    if (!this.formDepartemen.depJudul?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Kode Harus diisi",
        icon: "warning",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    // Validasi Nama tidak boleh kosong
    if (!this.formDepartemen.depNama?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Nama Harus diisi",
        icon: "warning",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    // Validasi Divisi harus dipilih
    if (!this.formDepartemen.divId) {
      Swal.fire({
        title: "Warning!",
        text: "Divisi dari departemen ini Harus diisi",
        icon: "warning",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    // ✅ VALIDASI DUPLIKAT KODE (untuk create dan update)
    if (this.isDepartemenKodeDuplicate(newKode, currentId)) {
      Swal.fire({
        title: "Gagal!",
        text: `Kode "${this.formDepartemen.depJudul}" sudah digunakan oleh departemen lain. Silakan gunakan kode yang berbeda.`,
        icon: "error",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    if (this.isEditDepartemen) {
      if (
        JSON.stringify(this.formDepartemen) ===
        JSON.stringify(this.originalDepartemen)
      ) {
        Swal.fire({
          title: "Info!",
          text: "Tidak ada perubahan data",
          icon: "info",
          confirmButtonColor: "#ba0403",
        });
        return;
      }
      const payload = {
        depId: this.formDepartemen.depId,
        depJudul: newKode,
        depNama: this.formDepartemen.depNama,
        divId: this.formDepartemen.divId,
        depModifBy: userName,
      };

      this.departemenService.update(payload).subscribe({
        next: () => {
          Swal.fire({
            title: "Berhasil!",
            text: "Departemen berhasil diubah",
            icon: "success",
            confirmButtonColor: "#ba0403",
          });
          this.loadDepartemen();
          modal.close();
          this.isEditDepartemen = false;
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: "Gagal!",
            text: err.error?.message || "Update gagal",
            icon: "error",
            confirmButtonColor: "#ba0403",
          });
        },
      });
    } else {
      const payload = {
        depJudul: newKode,
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
            confirmButtonColor: "#ba0403",
          });
          this.loadDepartemen();
          modal.close();
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: "Gagal!",
            text: err.error?.message || "Simpan gagal",
            icon: "error",
            confirmButtonColor: "#ba0403",
          });
        },
      });
    }
  }

  saveSeksi(modal: any) {
    const userName = this.cookiesService.get("userName") || "SYSTEM";
    const newKode = this.formSeksi.sekJudul?.trim().toUpperCase();
    const currentId = this.isEditSeksi ? this.formSeksi.sekId : undefined;

    // Validasi Kode tidak boleh kosong
    if (!this.formSeksi.sekJudul?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Kode Harus diisi",
        icon: "warning",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    // Validasi Nama tidak boleh kosong
    if (!this.formSeksi.sekNama?.trim()) {
      Swal.fire({
        title: "Warning!",
        text: "Nama Harus diisi",
        icon: "warning",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    // Validasi Departemen harus dipilih
    if (!this.formSeksi.depId) {
      Swal.fire({
        title: "Warning!",
        text: "Departemen dari Seksie ini Harus diisi",
        icon: "warning",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    // ✅ VALIDASI DUPLIKAT KODE (untuk create dan update)
    if (this.isSeksiKodeDuplicate(newKode, currentId)) {
      Swal.fire({
        title: "Gagal!",
        text: `Kode "${this.formSeksi.sekJudul}" sudah digunakan oleh seksi lain. Silakan gunakan kode yang berbeda.`,
        icon: "error",
        confirmButtonColor: "#ba0403",
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
          confirmButtonColor: "#ba0403",
        });
        return;
      }
      const payload = {
        sekId: this.formSeksi.sekId,
        sekJudul: newKode,
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
            confirmButtonColor: "#ba0403",
          });
          this.loadSeksie();
          modal.close();
          this.isEditSeksi = false;
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: "Gagal!",
            text: err.error?.message || "Update gagal",
            icon: "error",
            confirmButtonColor: "#ba0403",
          });
        },
      });
    } else {
      const payload = {
        sekJudul: newKode,
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
            confirmButtonColor: "#ba0403",
          });
          this.loadSeksie();
          modal.close();
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: "Gagal!",
            text: err.error?.message || "Simpan gagal",
            icon: "error",
            confirmButtonColor: "#ba0403",
          });
        },
      });
    }
  }

  confirmToggleStatus(event: Event, item: any, type: string) {
    event.preventDefault();
    const userName = this.cookiesService.get("userName") || "SYSTEM";

    let isActive: boolean;
    let name: string;
    let id: number;

    if (type === "seksi") {
      isActive = item.sekStatus?.toUpperCase() === "AKTIF";
      name = item.sekNama;
      id = item.sekId;
    } else if (type === "departemen") {
      isActive = item.depStatus?.toUpperCase() === "AKTIF";
      name = item.depNama;
      id = item.depId;
    } else {
      isActive = item.divStatus?.toUpperCase() === "AKTIF";
      name = item.divNama;
      id = item.divId;
    }

    const actionText = isActive ? "NonAktifkan" : "Aktifkan";
    const newStatusText = isActive ? "NONAKTIF" : "AKTIF";

    Swal.fire({
      title: `Apakah Anda ingin ${actionText} ${type} "${name}"?`,
      text: `${type.charAt(0).toUpperCase() + type.slice(1)} akan menjadi ${newStatusText}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ba0403",
      cancelButtonColor: "#64748b",
    }).then((result) => {
      if (result.isConfirmed) {
        let apiCall: Observable<any>;
        if (type === "seksi") {
          apiCall = this.seksieService.softDelete(id, userName);
        } else if (type === "departemen") {
          apiCall = this.departemenService.softDeleteDepartemen(id, userName);
        } else {
          apiCall = this.divisiService.softDeleteDivisi(id, userName);
        }

        apiCall.subscribe({
          next: () => {
            Swal.fire({
              title: "Berhasil!",
              text: `${type.charAt(0).toUpperCase() + type.slice(1)} "${name}" telah diubah menjadi ${newStatusText}.`,
              icon: "success",
              confirmButtonColor: "#ba0403",
            });
            // Refresh data after toggle
            if (type === "seksi") this.loadSeksie();
            if (type === "departemen") this.loadDepartemen();
            if (type === "divisi") this.loadDivisi();
          },
          error: (err) => {
            console.error("Error toggling status:", err);
            Swal.fire({
              title: "Gagal!",
              text:
                err.error?.message || "Terjadi kesalahan saat mengubah status",
              icon: "error",
              confirmButtonColor: "#ba0403",
            });
          },
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
      (x.depJudul + x.depNama + (x.divNama || ""))
        .toLowerCase()
        .includes(this.searchDepartemen.toLowerCase()),
    );
  }

  get filteredSeksi() {
    if (!this.searchSeksi) return this.seksiList;
    return this.seksiList.filter((x) =>
      (x.sekJudul + x.sekNama + (x.depNama || ""))
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

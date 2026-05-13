// karyawan.component.ts
import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { KaryawanService } from "../../../Service/karyawan.service";
import {
  Karyawan,
  PageResponse,
  Divisi,
  Departemen,
  Seksi,
  Jabatan,
} from "../../../models/karyawan.model";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: "app-karyawan",
  templateUrl: "./karyawan.component.html",
  styleUrls: ["./karyawan.component.css"],
})
export class KaryawanComponent implements OnInit {
  @ViewChild("modalKaryawan") modalKaryawan!: TemplateRef<any>;
  @ViewChild("modalDetail") modalDetail!: TemplateRef<any>;

  // Data
  karyawanList: Karyawan[] = [];
  selectedKaryawan: Karyawan = this.getEmptyKaryawan();

  // Master Data untuk Dropdown
  divisiList: Divisi[] = [];
  departemenList: Departemen[] = [];
  seksiList: Seksi[] = [];
  jabatanList: Jabatan[] = [];

  // Filtered untuk cascading
  filteredDepartemen: Departemen[] = [];
  filteredSeksi: Seksi[] = [];

  // Form
  formKaryawan: Karyawan = this.getEmptyKaryawan();
  isEdit = false;
  viewMode = false;

  // Search & Pagination
  searchKeyword = "";
  private searchSubject = new Subject<string>();
  page = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 25, 50];
  sortBy = "kryId";
  sortDirection = "desc";

  loading = false;
  showToggleModal = false;
  toggleItem: Karyawan | null = null;
  toggleNewStatus = "";

  private modalRef: NgbModalRef | null = null;

  constructor(
    private karyawanService: KaryawanService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadMasterData();
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.page = 0;
        this.loadData();
      });
  }

  private getEmptyKaryawan(): Karyawan {
    return {
      kryId: undefined,
      kryUsername: "",
      kryPassword: "",
      kryNamaDpn: "",
      kryNamaBkg: "",
      kryEmail: "",
      kryTglLahir: "",
      kryProfil: "",
      kryDivisi: "",
      kryDep: "",
      krySesi: "",
      kryGol: "",
      kryJabatan: "",
      kryStatus: "0",
    };
  }

  loadMasterData(): void {
    this.karyawanService.getAllDivisi().subscribe({
      next: (res: any) => {
        this.divisiList = res.data || res;
      },
      error: (err) => console.error("Error loading divisi:", err),
    });

    this.karyawanService.getAllDepartemen().subscribe({
      next: (res: any) => {
        this.departemenList = res.data || res;
      },
      error: (err) => console.error("Error loading departemen:", err),
    });

    this.karyawanService.getAllSeksi().subscribe({
      next: (res: any) => {
        this.seksiList = res.data || res;
      },
      error: (err) => console.error("Error loading seksi:", err),
    });

    this.karyawanService.getAllJabatanActive().subscribe({
      next: (res: any) => {
        this.jabatanList = res.data || res;
      },
      error: (err) => console.error("Error loading jabatan:", err),
    });
  }

  onDivisiChange(event: any): void {
    const selectedDivisiKode = event.target?.value || event;
    if (selectedDivisiKode) {
      const selectedDivisi = this.divisiList.find(
        (d) => d.divJudul === selectedDivisiKode,
      );
      if (selectedDivisi) {
        this.filteredDepartemen = this.departemenList.filter(
          (dep) => dep.divId === selectedDivisi.divId,
        );
      } else {
        this.filteredDepartemen = [];
      }
    } else {
      this.filteredDepartemen = [];
    }
    this.formKaryawan.kryDep = "";
    this.formKaryawan.krySesi = "";
    this.filteredSeksi = [];
  }

  onDepartemenChange(event: any): void {
    const selectedDepartemenKode = event.target?.value || event;
    if (selectedDepartemenKode) {
      const selectedDepartemen = this.departemenList.find(
        (dep) => dep.depJudul === selectedDepartemenKode,
      );
      if (selectedDepartemen) {
        this.filteredSeksi = this.seksiList.filter(
          (sek) => sek.depId === selectedDepartemen.depId,
        );
      } else {
        this.filteredSeksi = [];
      }
    } else {
      this.filteredSeksi = [];
    }
    this.formKaryawan.krySesi = "";
  }

  loadData(): void {
    this.loading = true;
    this.karyawanService
      .list(
        this.page,
        this.pageSize,
        this.sortBy,
        this.sortDirection,
        this.searchKeyword,
      )
      .subscribe({
        next: (res: PageResponse<Karyawan>) => {
          if (res.success) {
            this.karyawanList = res.data;
            this.totalElements = res.totalElements;
            this.totalPages = res.totalPages;
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal Memuat Data",
              text: res.message,
              confirmButtonColor: "#ba0403",
            });
          }
          this.loading = false;
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Terjadi Kesalahan",
            text: err.error?.message || err.message,
            confirmButtonColor: "#ba0403",
          });
          this.loading = false;
        },
      });
  }

  onSearchKeyUp(): void {
    this.searchSubject.next(this.searchKeyword);
  }
  onSearchEnter(): void {
    this.searchSubject.next(this.searchKeyword);
  }
  clearSearch(): void {
    this.searchKeyword = "";
    this.searchSubject.next(this.searchKeyword);
  }
  onPageChange(page: number): void {
    this.page = page;
    this.loadData();
  }
  onPageSizeChange(): void {
    this.page = 0;
    this.loadData();
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortBy = column;
      this.sortDirection = "asc";
    }
    this.loadData();
  }

  getSortIcon(column: string): string {
    if (this.sortBy !== column) return "bi-arrow-down-up";
    return this.sortDirection === "asc" ? "bi-arrow-up" : "bi-arrow-down";
  }

  getStatusBadgeClass(status: string): string {
    return status === "0" ? "badge-custom-active" : "badge-custom-inactive";
  }

  getStatusText(status: string): string {
    return status === "0" ? "AKTIF" : "NONAKTIF";
  }

  getAvatarColor(username: string): string {
    const colors = [
      "#4361ee",
      "#3a0ca3",
      "#7209b7",
      "#f72585",
      "#4cc9f0",
      "#4895ef",
      "#560bad",
      "#b5179e",
      "#06d6a0",
      "#ef476f",
      "#ffd166",
      "#118ab2",
    ];
    let hash = 0;
    if (username) {
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getDivisiNama(kode: string): string {
    const divisi = this.divisiList.find((d) => d.divJudul === kode);
    return divisi ? divisi.divNama : kode || "-";
  }

  getDepartemenNama(kode: string): string {
    const departemen = this.departemenList.find((d) => d.depJudul === kode);
    return departemen ? departemen.depNama : kode || "-";
  }

  getSeksiNama(kode: string): string {
    const seksi = this.seksiList.find((s) => s.sekJudul === kode);
    return seksi ? seksi.sekNama : kode || "-";
  }

  getJabatanNama(kode: string): string {
    const jabatan = this.jabatanList.find((j) => j.jbnKode === kode);
    return jabatan ? jabatan.jbnNama : kode || "-";
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  openCreateModal(): void {
    this.isEdit = false;
    this.formKaryawan = this.getEmptyKaryawan();
    this.filteredDepartemen = [];
    this.filteredSeksi = [];
    this.modalRef = this.modalService.open(this.modalKaryawan, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
  }

  openEditModal(karyawan: Karyawan): void {
    this.isEdit = true;
    this.formKaryawan = { ...karyawan, kryPassword: "" };
    this.filteredDepartemen = [];
    this.filteredSeksi = [];

    if (this.formKaryawan.kryDivisi) {
      setTimeout(() => {
        this.onDivisiChange(this.formKaryawan.kryDivisi);
        if (this.formKaryawan.kryDep) {
          setTimeout(() => {
            this.onDepartemenChange(this.formKaryawan.kryDep);
          }, 100);
        }
      }, 100);
    }

    if (this.formKaryawan.kryTglLahir) {
      try {
        const date = new Date(this.formKaryawan.kryTglLahir);
        if (!isNaN(date.getTime())) {
          this.formKaryawan.kryTglLahir = date.toISOString().split("T")[0];
        }
      } catch (e) {}
    }
    this.modalRef = this.modalService.open(this.modalKaryawan, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
  }

  openDetailModal(karyawan: Karyawan): void {
    this.selectedKaryawan = { ...karyawan };
    this.modalRef = this.modalService.open(this.modalDetail, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.dismiss();
      this.modalRef = null;
    }
  }

  saveKaryawan(): void {
    if (!this.formKaryawan.kryUsername?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Username harus diisi",
        confirmButtonColor: "#ba0403",
      });
      return;
    }
    if (!this.formKaryawan.kryNamaDpn?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Nama Depan harus diisi",
        confirmButtonColor: "#ba0403",
      });
      return;
    }
    if (!this.formKaryawan.kryEmail?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Email harus diisi",
        confirmButtonColor: "#ba0403",
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formKaryawan.kryEmail)) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Format email tidak valid",
        confirmButtonColor: "#ba0403",
      });
      return;
    }
    if (
      !this.isEdit &&
      (!this.formKaryawan.kryPassword ||
        this.formKaryawan.kryPassword.trim() === "")
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Password harus diisi",
        confirmButtonColor: "#ba0403",
      });
      return;
    }
    if (
      !this.isEdit &&
      this.formKaryawan.kryPassword &&
      this.formKaryawan.kryPassword.length < 4
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Password minimal 4 karakter",
        confirmButtonColor: "#ba0403",
      });
      return;
    }
    if (this.formKaryawan.kryUsername.includes(" ")) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Username tidak boleh mengandung spasi",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    const dataToSend = { ...this.formKaryawan };
    if (!dataToSend.kryPassword || dataToSend.kryPassword.trim() === "")
      delete dataToSend.kryPassword;

    const request = this.isEdit
      ? this.karyawanService.update(dataToSend)
      : this.karyawanService.create(dataToSend);
    request.subscribe({
      next: (res) => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: this.isEdit
              ? "Data berhasil diupdate"
              : "Data berhasil disimpan",
            confirmButtonColor: "#ba0403",
          });
          this.closeModal();
          this.loadData();
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: res.message,
            confirmButtonColor: "#ba0403",
          });
        }
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan",
          text: err.error?.message || err.message,
          confirmButtonColor: "#ba0403",
        });
      },
    });
  }

  closeToggleModal(): void {
    this.showToggleModal = false;
    this.toggleItem = null;
  }

  confirmToggleStatus(event: any, karyawan: Karyawan): void {
    const newStatus = event.target.checked ? "0" : "1";
    this.toggleItem = karyawan;
    this.toggleNewStatus = newStatus;
    this.showToggleModal = true;
    setTimeout(() => {
      event.target.checked = karyawan.kryStatus === "0";
    });
  }

  confirmToggleAction(): void {
    if (!this.toggleItem) return;
    this.karyawanService.toggleStatus(this.toggleItem.kryId!).subscribe({
      next: (res) => {
        if (res.success) {
          this.toggleItem!.kryStatus = this.toggleNewStatus;
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: `Status berhasil diubah menjadi ${this.getStatusText(this.toggleNewStatus)}`,
            confirmButtonColor: "#ba0403",
          });
          this.loadData();
        }
        this.closeToggleModal();
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: err.error?.message || err.message,
          confirmButtonColor: "#ba0403",
        });
        this.closeToggleModal();
      },
    });
  }
}

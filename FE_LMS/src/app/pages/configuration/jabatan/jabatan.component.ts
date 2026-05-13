// jabatan.component.ts
import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { JabatanService } from "../../../Service/jabatan.service";
import { Jabatan, JabatanPageResponse } from "../../../models/jabatan.model";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: "app-jabatan",
  templateUrl: "./jabatan.component.html",
  styleUrls: ["./jabatan.component.css"],
})
export class JabatanComponent implements OnInit {
  @ViewChild("modalJabatan") modalJabatan!: TemplateRef<any>;
  @ViewChild("modalDetail") modalDetail!: TemplateRef<any>;

  // Data
  jabatanList: Jabatan[] = [];
  selectedJabatan: Jabatan = this.getEmptyJabatan();

  // Form
  formJabatan: Jabatan = this.getEmptyJabatan();
  isEdit = false;
  viewMode = false;

  // Level options
  levelOptions = [
    { value: 1, label: "Staff" },
    { value: 2, label: "Supervisor" },
    { value: 3, label: "Manager" },
    { value: 4, label: "Direktur" },
  ];

  // Search & Pagination
  searchKeyword = "";
  private searchSubject = new Subject<string>();
  page = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 25, 50];
  sortBy = "jbnId";
  sortDirection = "desc";

  loading = false;

  showToggleModal = false;
  toggleItem: Jabatan | null = null;
  toggleNewStatus = "";

  private modalRef: NgbModalRef | null = null;

  constructor(
    private jabatanService: JabatanService,
    private modalService: NgbModal,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.page = 0;
        this.loadData();
      });
  }

  private getEmptyJabatan(): Jabatan {
    return {
      jbnId: undefined,
      jbnKode: "",
      jbnNama: "",
      jbnLevelJabatan: 1,
      deskripsi: "",
      jbnStatus: 0,
    };
  }

  loadData(): void {
    this.loading = true;
    this.jabatanService
      .list(
        this.page,
        this.pageSize,
        this.sortBy,
        this.sortDirection,
        this.searchKeyword,
      )
      .subscribe({
        next: (res: JabatanPageResponse) => {
          if (res.success) {
            this.jabatanList = res.data.content;
            this.totalElements = res.data.totalElements;
            this.totalPages = res.data.totalPages;
          } else {
            console.error("Error from API:", res.message);
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
          console.error("Error loading data:", err);
          Swal.fire({
            icon: "error",
            title: "Terjadi Kesalahan",
            text: "Gagal memuat data: " + (err.error?.message || err.message),
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

  getStatusBadgeClass(status: number | undefined): string {
    return status === 0 ? "badge-custom-active" : "badge-custom-inactive";
  }

  getStatusText(status: number | undefined): string {
    return status === 0 ? "AKTIF" : "NONAKTIF";
  }

  // ✅ TAMBAHKAN METHOD INI
  getLevelBadgeClass(level: number | undefined): string {
    switch (level) {
      case 1:
        return "badge-level-staff";
      case 2:
        return "badge-level-supervisor";
      case 3:
        return "badge-level-manager";
      case 4:
        return "badge-level-direktur";
      default:
        return "badge-level-staff";
    }
  }

  // ✅ TAMBAHKAN METHOD INI
  getLevelText(level: number | undefined): string {
    switch (level) {
      case 1:
        return "Staff";
      case 2:
        return "Supervisor";
      case 3:
        return "Manager";
      case 4:
        return "Direktur";
      default:
        return "-";
    }
  }

  // ✅ TAMBAHKAN METHOD INI
  goBackToOrganisasi(): void {
    this.router.navigate(["/configuration"]);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  openCreateModal(): void {
    this.isEdit = false;
    this.viewMode = false;
    this.formJabatan = this.getEmptyJabatan();
    this.modalRef = this.modalService.open(this.modalJabatan, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
  }

  openEditModal(jabatan: Jabatan): void {
    this.isEdit = true;
    this.viewMode = false;
    this.formJabatan = { ...jabatan };
    this.modalRef = this.modalService.open(this.modalJabatan, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
  }

  openDetailModal(jabatan: Jabatan): void {
    this.selectedJabatan = { ...jabatan };
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

  saveJabatan(): void {
    if (!this.formJabatan.jbnKode || this.formJabatan.jbnKode.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Kode jabatan harus diisi",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    if (!this.formJabatan.jbnNama || this.formJabatan.jbnNama.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Nama jabatan harus diisi",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    if (this.formJabatan.jbnKode.includes(" ")) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Kode jabatan tidak boleh mengandung spasi",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    this.formJabatan.jbnKode = this.formJabatan.jbnKode.toUpperCase();

    const request = this.isEdit
      ? this.jabatanService.update(this.formJabatan)
      : this.jabatanService.create(this.formJabatan);

    request.subscribe({
      next: (res: any) => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: this.isEdit
              ? "Data jabatan berhasil diupdate"
              : "Data jabatan berhasil disimpan",
            confirmButtonColor: "#ba0403",
          });
          this.closeModal();
          this.loadData();
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Error: " + res.message,
            confirmButtonColor: "#ba0403",
          });
        }
      },
      error: (err) => {
        console.error("Save error:", err);
        let errorMessage = "Terjadi kesalahan saat menyimpan data";
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan",
          text: errorMessage,
          confirmButtonColor: "#ba0403",
        });
      },
    });
  }

  closeToggleModal(): void {
    this.showToggleModal = false;
    this.toggleItem = null;
  }

  confirmToggleStatus(event: any, jabatan: Jabatan): void {
    const newStatus = event.target.checked ? 0 : 1;

    this.toggleItem = jabatan;
    this.toggleNewStatus = newStatus.toString();

    this.showToggleModal = true;

    setTimeout(() => {
      event.target.checked = jabatan.jbnStatus === 0;
    });
  }

  confirmToggleAction(): void {
    if (!this.toggleItem) return;

    this.jabatanService.toggleStatus(this.toggleItem.jbnId!).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toggleItem!.jbnStatus = parseInt(this.toggleNewStatus);
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: res.message,
            confirmButtonColor: "#ba0403",
          });
          this.loadData();
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: res.message,
            confirmButtonColor: "#ba0403",
          });
        }
        this.closeToggleModal();
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Error: " + (err.error?.message || err.message),
          confirmButtonColor: "#ba0403",
        });
        this.closeToggleModal();
      },
    });
  }

  confirmDelete(jabatan: Jabatan): void {
    Swal.fire({
      title: "Hapus Jabatan?",
      text: `Apakah Anda yakin ingin menghapus PERMANEN jabatan "${jabatan.jbnNama}"?\n\nData akan dihapus dari database dan tidak dapat dikembalikan!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ba0403",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        this.jabatanService.hardDelete(jabatan.jbnId!).subscribe({
          next: (res: any) => {
            if (res.success) {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data jabatan berhasil dihapus permanen",
                confirmButtonColor: "#ba0403",
              });
              this.loadData();
            } else {
              Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal menghapus data: " + res.message,
                confirmButtonColor: "#ba0403",
              });
            }
          },
          error: (err) => {
            console.error("Delete error:", err);
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan",
              text:
                "Gagal menghapus data: " + (err.error?.message || err.message),
              confirmButtonColor: "#ba0403",
            });
          },
        });
      }
    });
  }

  softDelete(jabatan: Jabatan): void {
    Swal.fire({
      title: "Nonaktifkan Jabatan?",
      text: `Apakah Anda yakin ingin menonaktifkan jabatan "${jabatan.jbnNama}"?\n\nJabatan tidak akan muncul di dropdown/select sampai diaktifkan kembali.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ba0403",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Nonaktifkan",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        this.jabatanService.softDelete(jabatan.jbnId!).subscribe({
          next: (res: any) => {
            if (res.success) {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Jabatan berhasil dinonaktifkan",
                confirmButtonColor: "#ba0403",
              });
              this.loadData();
            } else {
              Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal menonaktifkan: " + res.message,
                confirmButtonColor: "#ba0403",
              });
            }
          },
          error: (err) => {
            console.error("Soft delete error:", err);
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan",
              text: "Error: " + (err.error?.message || err.message),
              confirmButtonColor: "#ba0403",
            });
          },
        });
      }
    });
  }
}

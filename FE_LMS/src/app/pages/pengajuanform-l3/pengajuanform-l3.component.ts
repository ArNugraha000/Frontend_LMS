import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { PengajuanEvaluasiL3Service } from "../../Service/pengajuan-evaluasi-l3.service";
import {
  PengajuanEvaluasiL3,
  PageResponsePengajuan,
} from "../../models/pengajuan-evaluasi-l3.model";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: "app-pengajuanform-l3",
  templateUrl: "./pengajuanform-l3.component.html",
  styleUrls: ["./pengajuanform-l3.component.css"],
})
export class PengajuanformL3Component implements OnInit {
  @ViewChild("modalDetail") modalDetail!: TemplateRef<any>;
  @ViewChild("modalForm") modalForm!: TemplateRef<any>;

  // Data Pengajuan Evaluasi L3
  pengajuanList: PengajuanEvaluasiL3[] = [];
  selectedPengajuan: PengajuanEvaluasiL3 = this.getEmptyPengajuan();
  formPengajuan: PengajuanEvaluasiL3 = this.getEmptyPengajuan();

  // Search & Pagination
  searchKeyword = "";
  private searchSubject = new Subject<string>();
  page = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 25, 50];
  sortBy = "evaCreatedDate";
  sortDirection = "desc";

  // ✅ PERUBAHAN: Filter status dari string jadi number
  activeStatus: number = 0; // Default DRAFT (0)

  // ✅ PERUBAHAN: Status options untuk filter (value jadi number)
  statusOptions = [
    { value: 0, label: "DRAFT (Tampil Admin)", icon: "bi-file-earmark-text" },
    { value: 1, label: "PENINJAUAN", icon: "bi-eye" },
    { value: 2, label: "SUBMITTED", icon: "bi-check-circle" },
  ];

  loading = false;
  isEdit = false;
  private modalRef: NgbModalRef | null = null;

  constructor(
    private router: Router,
    private pengajuanService: PengajuanEvaluasiL3Service,
    private modalService: NgbModal,
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

  // ✅ PERUBAHAN: Empty pengajuan (evaPlbId, evaStatus number)
  private getEmptyPengajuan(): PengajuanEvaluasiL3 {
    return {
      evaId: undefined,
      evaPlbId: 0, // ✅ dulu evaKrsId
      evaKryId: 0,
      evaEfektifitasSebelum: "",
      evaEfektifitasSesudah: "",
      evaStatus: 0, // ✅ number
    };
  }

  loadData(): void {
    this.loading = true;

    if (this.searchKeyword && this.searchKeyword.trim() !== "") {
      this.pengajuanService
        .searchByStatusAndKeyword(
          this.activeStatus,
          this.searchKeyword,
          this.page,
          this.pageSize,
        )
        .subscribe({
          next: (res) => {
            if (res.code === 200 && res.data) {
              const pageData =
                res.data as PageResponsePengajuan<PengajuanEvaluasiL3>;
              this.pengajuanList = pageData.content || [];
              this.totalElements = pageData.totalElements || 0;
              this.totalPages = pageData.totalPages || 0;
            } else {
              this.pengajuanList = [];
              this.totalElements = 0;
              this.totalPages = 0;
            }
            this.loading = false;
          },
          error: (err) => {
            console.error("Error loading data:", err);
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan",
              text: err.error?.message || "Gagal memuat data",
              confirmButtonColor: "#ba0403",
            });
            this.loading = false;
          },
        });
    } else {
      this.pengajuanService
        .getByStatus(
          this.activeStatus,
          this.page,
          this.pageSize,
          this.sortBy,
          this.sortDirection,
        )
        .subscribe({
          next: (res) => {
            if (res.code === 200 && res.data) {
              const pageData =
                res.data as PageResponsePengajuan<PengajuanEvaluasiL3>;
              this.pengajuanList = pageData.content || [];
              this.totalElements = pageData.totalElements || 0;
              this.totalPages = pageData.totalPages || 0;
            } else {
              this.pengajuanList = [];
              this.totalElements = 0;
              this.totalPages = 0;
            }
            this.loading = false;
          },
          error: (err) => {
            console.error("Error loading data:", err);
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan",
              text: err.error?.message || "Gagal memuat data",
              confirmButtonColor: "#ba0403",
            });
            this.loading = false;
          },
        });
    }
  }

  // ✅ PERUBAHAN: onStatusChange (parameter jadi number)
  onStatusChange(status: number): void {
    this.activeStatus = status;
    this.page = 0;
    this.searchKeyword = "";
    this.loadData();
  }

  onSearchKeyUp(): void {
    this.searchSubject.next(this.searchKeyword);
  }

  onSearchEnter(): void {
    this.searchSubject.next(this.searchKeyword);
  }

  clearSearch(): void {
    this.searchKeyword = "";
    this.page = 0;
    this.loadData();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadData();
  }

  onPageSizeChange(): void {
    this.page = 0;
    this.loadData();
  }

  // ✅ PERUBAHAN: Helper methods untuk status (parameter jadi number)
  getStatusBadgeClass(status: number): string {
    switch (status) {
      case 0:
        return "badge-status-draft";
      case 1:
        return "badge-status-peninjauan";
      case 2:
        return "badge-status-submitted";
      default:
        return "badge-secondary";
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return "DRAFT";
      case 1:
        return "PENINJAUAN";
      case 2:
        return "SUBMITTED";
      default:
        return "-";
    }
  }

  getStatusIcon(status: number): string {
    switch (status) {
      case 0:
        return "bi-file-earmark-text";
      case 1:
        return "bi-eye";
      case 2:
        return "bi-check-circle-fill";
      default:
        return "bi-question-circle";
    }
  }

  getStatusFullText(status: number): string {
    switch (status) {
      case 0:
        return "DRAFT (Tampil Admin)";
      case 1:
        return "PENINJAUAN";
      case 2:
        return "SUBMITTED";
      default:
        return "-";
    }
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  openDetailModal(pengajuan: PengajuanEvaluasiL3): void {
    this.selectedPengajuan = { ...pengajuan };
    this.modalRef = this.modalService.open(this.modalDetail, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
  }

  openCreateModal(): void {
    this.isEdit = false;
    this.formPengajuan = this.getEmptyPengajuan();
    this.modalRef = this.modalService.open(this.modalForm, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
  }

  openEditModal(pengajuan: PengajuanEvaluasiL3): void {
    this.isEdit = true;
    this.formPengajuan = { ...pengajuan };
    this.modalRef = this.modalService.open(this.modalForm, {
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

  // ✅ PERUBAHAN: Save Pengajuan (validasi pake evaPlbId)
  savePengajuan(): void {
    if (!this.formPengajuan.evaPlbId || this.formPengajuan.evaPlbId === 0) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Batch Pelatihan harus dipilih",
        confirmButtonColor: "#ba0403",
      });
      return;
    }
    if (!this.formPengajuan.evaKryId || this.formPengajuan.evaKryId === 0) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Karyawan harus dipilih",
        confirmButtonColor: "#ba0403",
      });
      return;
    }
    if (!this.formPengajuan.evaEfektifitasSebelum?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Efektifitas Sebelum harus diisi",
        confirmButtonColor: "#ba0403",
      });
      return;
    }
    if (!this.formPengajuan.evaEfektifitasSesudah?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validasi",
        text: "Efektifitas Sesudah harus diisi",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    const request = this.isEdit
      ? this.pengajuanService.update(this.formPengajuan)
      : this.pengajuanService.create(this.formPengajuan);

    request.subscribe({
      next: (res) => {
        if (res.code === 200 || res.code === 201) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: res.message,
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
          title: "Error",
          text: err.error?.message || "Terjadi kesalahan",
          confirmButtonColor: "#ba0403",
        });
      },
    });
  }

  // ✅ PERUBAHAN: Update Status (newStatus jadi number)
  updateStatus(id: number, newStatus: number): void {
    const statusText = this.getStatusFullText(newStatus);
    Swal.fire({
      title: "Konfirmasi",
      text: `Ubah status pengajuan menjadi ${statusText}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ba0403",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Ubah",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        this.pengajuanService.updateStatus(id, newStatus).subscribe({
          next: (res) => {
            if (res.code === 200) {
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
          },
          error: (err) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: err.error?.message || "Terjadi kesalahan",
              confirmButtonColor: "#ba0403",
            });
          },
        });
      }
    });
  }

  deletePengajuan(id: number): void {
    Swal.fire({
      title: "Hapus Pengajuan",
      text: "Apakah Anda yakin ingin menghapus pengajuan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ba0403",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        this.pengajuanService.delete(id).subscribe({
          next: (res) => {
            if (res.code === 200) {
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
          },
          error: (err) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: err.error?.message || "Terjadi kesalahan",
              confirmButtonColor: "#ba0403",
            });
          },
        });
      }
    });
  }

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

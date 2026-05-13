import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import Swal from "sweetalert2";

import { PendaftaranService } from "../../Service/pendaftaran.service";
import { Pendaftaran, BatchPelatihan } from "../../models/pendaftaran.model";

@Component({
  selector: "app-pendaftaran",
  templateUrl: "./pendaftaran.component.html",
  styleUrls: ["./pendaftaran.component.css"],
})
export class PendaftaranComponent implements OnInit {
  @ViewChild("modalRegister") modalRegister!: TemplateRef<any>;
  @ViewChild("modalDetail") modalDetail!: TemplateRef<any>;

  // ========== DATA PENDAFTARAN (sudah terdaftar) ==========
  pendaftaranList: Pendaftaran[] = [];
  selectedPendaftaran: Pendaftaran | null = null;

  // ========== BATCH LIST ==========
  batchList: BatchPelatihan[] = [];
  selectedPlbId: number = 0;

  // ========== UNREGISTERED KARYAWAN (untuk register) ==========
  unregisteredKaryawanList: any[] = [];
  registerPlbId: number = 0;
  searchKaryawanKeyword: string = "";

  // ========== SEARCH & PAGINATION ==========
  searchKeyword = "";
  private searchSubject = new Subject<string>();
  page = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 25, 50];

  loading = false;
  private modalRef: NgbModalRef | null = null;

  constructor(
    private router: Router,
    private pendaftaranService: PendaftaranService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.loadBatches();

    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.page = 0;
        if (this.selectedPlbId > 0) {
          this.loadPendaftaranByBatch();
        }
      });
  }

  // ========== LOAD BATCHES ==========
  loadBatches(): void {
    this.pendaftaranService.getAllBatches().subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.data) {
          this.batchList = res.data;
        }
      },
      error: (err) => {
        console.error("Error loading batches:", err);
      },
    });
  }

  // ========== LOAD PENDAFTARAN YANG SUDAH TERDAFTAR ==========
  loadPendaftaranByBatch(): void {
    if (this.selectedPlbId <= 0) {
      this.pendaftaranList = [];
      this.totalElements = 0;
      this.totalPages = 0;
      return;
    }

    this.loading = true;
    this.pendaftaranService
      .getByBatch(this.selectedPlbId, this.page, this.pageSize)
      .subscribe({
        next: (res: any) => {
          if (res.code === 200 && res.data) {
            this.pendaftaranList = res.data.content || [];
            this.totalElements = res.data.totalElements || 0;
            this.totalPages = res.data.totalPages || 0;
          } else {
            this.pendaftaranList = [];
            this.totalElements = 0;
            this.totalPages = 0;
          }
          this.loading = false;
        },
        error: (err) => {
          console.error("Error:", err);
          this.loading = false;
        },
      });
  }

  // ========== LOAD KARYAWAN YANG BELUM TERDAFTAR ==========
  loadUnregisteredKaryawan(): void {
    if (this.registerPlbId <= 0) {
      this.unregisteredKaryawanList = [];
      return;
    }

    this.pendaftaranService
      .getUnregisteredKaryawan(
        // ✅ Method ini harus ada di service
        this.registerPlbId,
        this.searchKaryawanKeyword,
        0,
        1000,
      )
      .subscribe({
        next: (res: any) => {
          if (res.code === 200 && res.data) {
            this.unregisteredKaryawanList = (res.data.content || []).map(
              (item: any) => ({
                ...item,
                selected: false,
              }),
            );
          } else {
            this.unregisteredKaryawanList = [];
          }
        },
        error: (err) => {
          console.error("Error:", err);
          this.unregisteredKaryawanList = [];
        },
      });
  }

  // ========== BATCH CHANGE ==========
  onBatchChange(): void {
    this.page = 0;
    this.searchKeyword = "";
    this.loadPendaftaranByBatch();
  }

  // ========== SEARCH ==========
  onSearchKeyUp(): void {
    this.searchSubject.next(this.searchKeyword);
  }

  clearSearch(): void {
    this.searchKeyword = "";
    this.searchSubject.next(this.searchKeyword);
  }

  // ========== PAGINATION ==========
  onPageChange(page: number): void {
    this.page = page;
    this.loadPendaftaranByBatch();
  }

  onPageSizeChange(): void {
    this.page = 0;
    this.loadPendaftaranByBatch();
  }

  // ========== STATUS METHODS ==========
  getStatusBadgeClass(status: number): string {
    switch (status) {
      case 0:
        return "badge-status-draft";
      case 1:
        return "badge-status-active";
      case 2:
        return "badge-status-rejected";
      default:
        return "badge-secondary";
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return "BELUM TERDAFTAR";
      case 1:
        return "TERDAFTAR";
      case 2:
        return "DITOLAK";
      default:
        return "-";
    }
  }

  getStatusIcon(status: number): string {
    switch (status) {
      case 0:
        return "bi-clock-history";
      case 1:
        return "bi-check-circle-fill";
      case 2:
        return "bi-x-circle-fill";
      default:
        return "bi-question-circle";
    }
  }

  // ========== UPDATE STATUS ==========
  updateStatus(id: number, newStatus: number): void {
    const statusText = this.getStatusText(newStatus);
    Swal.fire({
      title: "Konfirmasi",
      text: `Ubah status pendaftaran menjadi ${statusText}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ba0403",
      confirmButtonText: "Ya, Ubah",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        this.pendaftaranService
          .updateStatus(id, newStatus, "SYSTEM")
          .subscribe({
            next: (res: any) => {
              if (res.code === 200) {
                Swal.fire({
                  icon: "success",
                  title: "Berhasil",
                  text: res.message,
                  confirmButtonColor: "#ba0403",
                });
                this.loadPendaftaranByBatch();
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
                text: err.error?.message,
                confirmButtonColor: "#ba0403",
              });
            },
          });
      }
    });
  }

  // ========== DELETE PENDAFTARAN ==========
  deletePendaftaran(id: number): void {
    Swal.fire({
      title: "Hapus Pendaftaran",
      text: "Yakin ingin menghapus pendaftaran ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ba0403",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        this.pendaftaranService.delete(id).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: res.message,
                confirmButtonColor: "#ba0403",
              });
              this.loadPendaftaranByBatch();
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
              text: err.error?.message,
              confirmButtonColor: "#ba0403",
            });
          },
        });
      }
    });
  }

  // ========== REGISTER MODAL ==========
  openRegisterModal(): void {
    this.registerPlbId = 0;
    this.searchKaryawanKeyword = "";
    this.unregisteredKaryawanList = [];
    this.modalRef = this.modalService.open(this.modalRegister, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
  }

  onRegisterBatchChange(): void {
    this.loadUnregisteredKaryawan();
  }

  searchUnregisteredKaryawan(): void {
    this.loadUnregisteredKaryawan();
  }

  // ========== CHECKBOX SELECT ALL ==========
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.unregisteredKaryawanList.forEach((item) => (item.selected = checked));
  }

  isAllSelected(): boolean {
    return (
      this.unregisteredKaryawanList.length > 0 &&
      this.unregisteredKaryawanList.every((item) => item.selected)
    );
  }

  getSelectedCount(): number {
    return this.unregisteredKaryawanList.filter((item) => item.selected).length;
  }

  // ========== SUBMIT REGISTER ==========
  submitRegister(): void {
    const selectedKryIds = this.unregisteredKaryawanList
      .filter((item) => item.selected)
      .map((item) => item.kryId);

    if (selectedKryIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Pilih minimal satu karyawan",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    if (this.registerPlbId <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Pilih batch pelatihan",
        confirmButtonColor: "#ba0403",
      });
      return;
    }

    this.pendaftaranService
      .bulkRegisterKaryawan(selectedKryIds, this.registerPlbId, "SYSTEM")
      .subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: res.message,
              confirmButtonColor: "#ba0403",
            });
            this.closeModal();
            if (this.selectedPlbId === this.registerPlbId) {
              this.loadPendaftaranByBatch();
            } else if (this.selectedPlbId === 0) {
              this.selectedPlbId = this.registerPlbId;
              this.loadPendaftaranByBatch();
            }
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
            text: err.error?.message,
            confirmButtonColor: "#ba0403",
          });
        },
      });
  }

  // ========== MODAL DETAIL ==========
  openDetailModal(pendaftaran: Pendaftaran): void {
    this.selectedPendaftaran = { ...pendaftaran };
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

  getBatchName(plbId: number): string {
    const batch = this.batchList.find((b) => b.plbId === plbId);
    return batch ? batch.plbNamaBatch : "";
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  // ========== MENU NAVIGATION ==========
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

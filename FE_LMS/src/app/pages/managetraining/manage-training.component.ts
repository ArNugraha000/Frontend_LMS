import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { KursusService } from "../../Service/kursus.service";
import { Kursus } from "../../models/kursus.model";
import { PelatihanBatchService } from "../../Service/trainingBatch.service";

@Component({
  selector: "app-training-materi",
  templateUrl: "./manage-training.component.html",
  styleUrls: ["./manage-training.component.css"],
})
export class ManageTrainingComponent implements OnInit {
  // Data
  allData: Kursus[] = [];
  filteredData: Kursus[] = [];
  pagedData: Kursus[] = [];

  // Search & Filter
  searchText: string = "";
  currentFilter: string = "all";
  sortBy: string = "name";
  currentPage: number = 1;
  totalPages: number = 1;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageSize: number = 5;

  // Statistics
  totalAll: number = 0;
  totalDraft: number = 0;
  totalPublished: number = 0;

  // Modal
  showModal: boolean = false;
  showDetailModal: boolean = false;
  isEditMode: boolean = false;
  editId: number | null = null;
  selectedDetail: Kursus | null = null;

  // Form Data
  formData: any = {
    krsNama: "",
    krsJenis: "",
    krsDeskripsi: "",
    krsSasaran: "",
    krsGambar: "",
  };

  // File
  selectedFile: File | null = null;
  fileName: string = "";
  isSaving: boolean = false;

  // ==================== MODAL BATCH ====================
  showBatchModal = false;
  selectedKursusId: number = 0;
  selectedKursusNama: string = "";
  generatedBatchName: string = "";
  isSavingBatch = false;

  batchForm = {
    plbKrsId: 0,
    plbNamaBatch: "",
    plbStatus: 0,
  };

  constructor(
    private kursusService: KursusService,
    private router: Router,
    private pelatihanBatchService: PelatihanBatchService,
  ) {}

  ngOnInit(): void {
    console.log("ManageTrainingComponent Loaded");
    this.loadKursus();
  }

  loadKursus() {
    this.kursusService.getUnpublished().subscribe({
      next: (res: any) => {
        console.log("FULL RESPONSE API:", res);

        if (res && res.status === 200) {
          this.allData = res.data || [];
        } else if (res && res.data) {
          this.allData = res.data;
        } else {
          this.allData = [];
        }

        this.totalAll = this.allData.length;
        this.totalDraft = this.allData.filter(
          (x) => x.krsPublishStatus === 1,
        ).length;
        this.totalPublished = this.allData.filter(
          (x) => x.krsPublishStatus === 2,
        ).length;

        this.applyFilter();
      },
      error: (err) => {
        console.error("ERROR API:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Terjadi kesalahan saat memuat data pelatihan",
        });
      },
    });
  }

  // ✅ Method untuk generate preview nama batch (panggil API)
  generatePreviewBatchName() {
    this.pelatihanBatchService
      .getLastBatchNumber(this.selectedKursusId)
      .subscribe({
        next: (res: any) => {
          const nextNumber = (res.data || 0) + 1;
          this.generatedBatchName = `${this.selectedKursusNama} #${nextNumber}`;
          this.batchForm.plbNamaBatch = this.generatedBatchName;
        },
        error: () => {
          this.generatedBatchName = `${this.selectedKursusNama} #1`;
          this.batchForm.plbNamaBatch = this.generatedBatchName;
        },
      });
  }

  // ✅ Buka modal batch (dipanggil dari tombol "Terbitkan")
  openBatchModal(kursusId: number, kursusNama: string) {
    this.selectedKursusId = kursusId;
    this.selectedKursusNama = kursusNama;
    this.batchForm = {
      plbKrsId: kursusId,
      plbNamaBatch: "",
      plbStatus: 0,
    };

    this.generatePreviewBatchName();
    this.showBatchModal = true;
  }

  saveBatch() {
    if (!this.batchForm.plbNamaBatch) {
      Swal.fire("Warning", "Nama batch tidak boleh kosong!", "warning");
      return;
    }

    this.isSavingBatch = true;

    this.pelatihanBatchService.create(this.batchForm).subscribe({
      next: (batchRes: any) => {
        this.isSavingBatch = false;

        if (batchRes.code === 201) {
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: `Batch "${batchRes.data?.plbNamaBatch || this.batchForm.plbNamaBatch}" berhasil dibuat!`,
            timer: 2000,
            showConfirmButton: false,
          });

          this.closeBatchModal();
          this.loadKursus();
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: batchRes.message,
          });
        }
      },
      error: (err) => {
        this.isSavingBatch = false;

        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.error?.message || "Terjadi kesalahan saat membuat batch",
        });
      },
    });
  }

  closeBatchModal() {
    this.showBatchModal = false;
  }

  // ✅ MODAL KONFIRMASI PUBLISH - Sekarang panggil openBatchModal
  publishKursus(id: number, nama: string) {
    this.openBatchModal(id, nama);
  }

  // ✅ MODAL KONFIRMASI PUBLISH - Override yang lama
  showPublishModal: boolean = false;
  publishId: number | null = null;

  openPublishModal(id: number, nama: string) {
    // Alihkan ke batch modal
    this.openBatchModal(id, nama);
  }

  closePublishModal() {
    this.showPublishModal = false;
    this.publishId = null;
  }

  confirmPublish() {
    // Tidak dipakai lagi, karena pake batch modal
    this.closePublishModal();
  }

  // ========== REST OF METHODS (applyFilter, sort, pagination, dll) ==========
  applyFilter() {
    let data = [...this.allData];
    if (this.currentFilter === "draft") {
      data = data.filter((item) => item.krsPublishStatus === 1);
    } else if (this.currentFilter === "published") {
      data = data.filter((item) => item.krsPublishStatus === 2);
    }
    if (this.searchText) {
      const lower = this.searchText.toLowerCase();
      data = data.filter(
        (item) =>
          item.krsNama?.toLowerCase().includes(lower) ||
          item.krsJenis?.toLowerCase().includes(lower),
      );
    }
    if (this.sortBy === "name") {
      data.sort((a, b) => a.krsNama?.localeCompare(b.krsNama || "") || 0);
    } else if (this.sortBy === "date") {
      data.sort(
        (a, b) =>
          new Date(b.krsModifDate).getTime() -
          new Date(a.krsModifDate).getTime(),
      );
    }
    this.filteredData = data;
    this.updatePagination();
  }

  filterData(type: string) {
    this.currentFilter = type;
    this.currentPage = 1;
    this.applyFilter();
  }

  sortData(type: string) {
    this.sortBy = type;
    this.applyFilter();
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilter();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedData = this.filteredData.slice(start, start + this.pageSize);
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  openCreateModal() {
    this.resetForm();
    this.isEditMode = false;
    this.editId = null;
    this.showModal = true;
  }

  openEditModal(item: Kursus) {
    this.resetForm();
    this.isEditMode = true;
    this.editId = item.krsId;
    this.formData = {
      krsNama: item.krsNama,
      krsJenis: item.krsJenis,
      krsDeskripsi: item.krsDeskripsi,
      krsSasaran: item.krsSasaran || "",
      krsGambar: item.krsGambar,
    };
    this.showModal = true;
  }

  openDetailModal(item: Kursus) {
    this.selectedDetail = item;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedDetail = null;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      krsNama: "",
      krsJenis: "",
      krsDeskripsi: "",
      krsSasaran: "",
      krsGambar: "",
    };
    this.fileName = "";
    this.selectedFile = null;
    this.isSaving = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "warning",
          title: "Format File Tidak Didukung",
          text: "Hanya file gambar yang diperbolehkan (JPG, PNG, GIF, dll)",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "Ukuran File Terlalu Besar",
          text: "Maksimal ukuran file adalah 5MB",
        });
        return;
      }
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  saveKursus() {
    if (!this.formData.krsNama || this.formData.krsNama.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Field Kosong",
        text: "Nama pelatihan harus diisi",
      });
      return;
    }
    if (!this.formData.krsJenis) {
      Swal.fire({
        icon: "warning",
        title: "Field Kosong",
        text: "Jenis pelatihan harus dipilih",
      });
      return;
    }

    this.isSaving = true;
    const kursusData = {
      krsId: this.editId,
      krsNama: this.formData.krsNama,
      krsJenis: this.formData.krsJenis,
      krsDeskripsi: this.formData.krsDeskripsi || "",
      krsSasaran: this.formData.krsSasaran || "",
      krsCreateBy: "admin",
      krsModifBy: "admin",
    };

    if (this.isEditMode) {
      this.kursusService.update(kursusData, this.selectedFile).subscribe({
        next: (res: any) => {
          this.isSaving = false;
          if (res && res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: "Data pelatihan berhasil diupdate",
              timer: 1500,
              showConfirmButton: false,
            });
            this.closeModal();
            this.loadKursus();
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: res?.message || "Gagal mengupdate data",
            });
          }
        },
        error: (err) => {
          this.isSaving = false;
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Terjadi kesalahan saat mengupdate data",
          });
        },
      });
    } else {
      this.kursusService.create(kursusData, this.selectedFile).subscribe({
        next: (res: any) => {
          this.isSaving = false;
          if (res && (res.status === 200 || res.status === 201)) {
            Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: "Data pelatihan berhasil disimpan",
              timer: 1500,
              showConfirmButton: false,
            });
            this.closeModal();
            this.loadKursus();
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: res?.message || "Gagal menyimpan data",
            });
          }
        },
        error: (err) => {
          this.isSaving = false;
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Terjadi kesalahan saat menyimpan data",
          });
        },
      });
    }
  }

  isiKehadiran(item: Kursus) {
    console.log("Isi Kehadiran:", item.krsNama);
  }

  lihatRiwayat(item: Kursus) {
    console.log("Riwayat:", item.krsNama);
  }

  onLeftClick(): void {
    this.router.navigate(["/mytraining"]);
  }

  onMiddleClick(): void {
    this.router.navigate(["/profile"]);
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
        this.router.navigate(["/training"]);
        break;
      case "pelatihan":
        this.openCreateModal();
        break;
      default:
        console.log("Menu tidak dikenali:", menu);
    }
  }

  goToMateri(krsId: number) {
    this.router.navigate(["/manage-training", krsId]);
  }

  // ===== MODAL KONFIRMASI HAPUS =====
  showDeleteModal: boolean = false;
  deleteId: number | null = null;

  openDeleteModal(id: number) {
    this.deleteId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteId = null;
  }

  confirmDelete() {
    if (this.deleteId) {
      this.kursusService.delete(this.deleteId, "admin").subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Terhapus!",
              text: "Data pelatihan berhasil dihapus",
              timer: 1500,
              showConfirmButton: false,
            });
            this.closeDeleteModal();
            this.loadKursus();
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: res?.message || "Gagal menghapus data",
            });
          }
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Terjadi kesalahan saat menghapus data",
          });
        },
      });
    }
  }

  deleteKursus(id: number) {
    this.openDeleteModal(id);
  }
}

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2";
import { KursusService } from "../../Service/kursus.service";
import { Kursus } from "../../models/kursus.model";

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
  currentFilter: string = "all"; // all, draft, published

  // Sorting
  sortBy: string = "name"; // name, date

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageSize: number = 5;

  // Statistics
  totalAll: number = 0;
  totalDraft: number = 0;
  totalPublished: number = 0;

  // ===== MODAL =====
  showModal: boolean = false;
  showDetailModal: boolean = false;
  isEditMode: boolean = false;
  editId: number | null = null;
  selectedDetail: Kursus | null = null;

  // FORM DATA
  formData: any = {
    krsNama: "",
    krsJenis: "",
    krsDeskripsi: "",
    krsSasaran: "",
    krsGambar: "",
  };

  // FILE
  selectedFile: File | null = null;
  fileName: string = "";
  isSaving: boolean = false;

  constructor(
    private kursusService: KursusService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log("ManageTrainingComponent Loaded");
    this.loadKursus();
  }

  loadKursus() {
    this.kursusService.getAll().subscribe({
      next: (res: any) => {
        console.log("FULL RESPONSE API:", res);

        // ✅ Perbaiki: ambil data dari res.data
        if (res && res.status === 200) {
          this.allData = res.data || [];
        } else if (res && res.data) {
          this.allData = res.data;
        } else {
          this.allData = [];
        }

        // Calculate statistics
        this.totalAll = this.allData.length;
        this.totalDraft = this.allData.filter(
          (x) => x.krsPublishStatus === 1,
        ).length;
        this.totalPublished = this.allData.filter(
          (x) => x.krsPublishStatus === 2,
        ).length;

        // Apply current filter
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

  applyFilter() {
    let data = [...this.allData];

    // Apply status filter
    if (this.currentFilter === "draft") {
      data = data.filter((item) => item.krsPublishStatus === 1);
    } else if (this.currentFilter === "published") {
      data = data.filter((item) => item.krsPublishStatus === 2);
    }

    // Apply search filter
    if (this.searchText) {
      const lower = this.searchText.toLowerCase();
      data = data.filter(
        (item) =>
          item.krsNama?.toLowerCase().includes(lower) ||
          item.krsJenis?.toLowerCase().includes(lower),
      );
    }

    // Apply sorting
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
    const end = start + this.pageSize;
    this.pagedData = this.filteredData.slice(start, end);
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

  // ========== MODAL CREATE / EDIT ==========
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
      // Validate file type (only images)
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "warning",
          title: "Format File Tidak Didukung",
          text: "Hanya file gambar yang diperbolehkan (JPG, PNG, GIF, dll)",
        });
        return;
      }

      // Validate file size (max 5MB)
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
    // Validate required fields
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
      // UPDATE
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
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Terjadi kesalahan saat mengupdate data",
          });
        },
      });
    } else {
      // CREATE
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
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Terjadi kesalahan saat menyimpan data",
          });
        },
      });
    }
  }

  // Navigation
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

  // ===== MODAL KONFIRMASI HAPUS =====
  showDeleteModal: boolean = false;
  deleteId: number | null = null;

  // Buka modal konfirmasi hapus
  openDeleteModal(id: number) {
    this.deleteId = id;
    this.showDeleteModal = true;
  }

  // Tutup modal konfirmasi hapus
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteId = null;
  }

  // Konfirmasi hapus (panggil API delete)
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
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Terjadi kesalahan saat menghapus data",
          });
        },
      });
    }
  }

  // Update method deleteKursus - panggil modal, bukan langsung hapus
  deleteKursus(id: number) {
    this.openDeleteModal(id); // ← Ganti dengan modal
  }

  // ===== MODAL KONFIRMASI PUBLISH =====
  showPublishModal: boolean = false;
  publishId: number | null = null;

  // Buka modal konfirmasi publish
  openPublishModal(id: number) {
    this.publishId = id;
    this.showPublishModal = true;
  }

  // Tutup modal konfirmasi publish
  closePublishModal() {
    this.showPublishModal = false;
    this.publishId = null;
  }

  // Konfirmasi publish (panggil API publish)
  confirmPublish() {
    if (this.publishId) {
      this.kursusService.publish(this.publishId, "admin").subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            this.closePublishModal();
            Swal.fire({
              icon: "success",
              title: "Diterbitkan!",
              text: "Pelatihan berhasil dipublikasikan",
              timer: 1500,
              showConfirmButton: false,
            });
            this.loadKursus();
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: res?.message || "Gagal menerbitkan data",
            });
          }
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Terjadi kesalahan saat menerbitkan data",
          });
        },
      });
    }
  }

  // Update method publishKursus - panggil modal, bukan langsung
  publishKursus(id: number) {
    this.openPublishModal(id);
  }
}

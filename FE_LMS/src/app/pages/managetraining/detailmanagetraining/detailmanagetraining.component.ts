import { Component, OnInit } from "@angular/core";
import { MateriService } from "../../../Service/materi.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DetailTrainingService } from "../../../Service/detailTrainingService/detail-training.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-training-materi",
  templateUrl: "./detailmanagetraining.component.html",
  styleUrls: ["./detailmanagetraining.component.css"],
})
export class DetailManageTraining implements OnInit {
  materi: any[] = [];
  allMateri: any[] = [];
  idKursus!: number;

  showModal = false;
  mode: "add" | "edit" = "add";

  // 🔥 MODAL HAPUS
  showHapusModal: boolean = false;
  showHapusSemuaModal: boolean = false;

  selectedMateri: any = {
    id: null,
    idMateri: null,
    urutan: 0,
    tanggalMulai: "",
    tanggalAkhir: "",
    judulMateri: "",
    jenisMateri: "",
    informasiMateri: "",
    durasi: "",
  };

  constructor(
    private materiService: MateriService,
    private detailService: DetailTrainingService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idKursus = +params["krsId"];

      console.log("ID Pelatihan yang dipilih:", this.idKursus);

      if (!this.idKursus || isNaN(this.idKursus)) {
        Swal.fire("Error", "ID Pelatihan tidak valid!", "error");
        return;
      }

      this.loadAll();
    });
  }

  goBack() {
    this.router.navigate(["/manage-training"]);
  }

  loadAll() {
    if (!this.idKursus || this.idKursus <= 0) {
      console.error("ID Kursus belum diisi!");
      return;
    }

    this.materiService.getAll().subscribe((allMateri) => {
      this.allMateri = allMateri;

      this.detailService.getByKursus(this.idKursus).subscribe((detailList) => {
        this.materi = detailList.map((detail: any) => {
          const materiData = allMateri.find(
            (m: any) => m.id === detail.idMateri,
          );
          return {
            id: detail.id,
            idMateri: detail.idMateri,
            urutan: detail.urutan,
            tanggalMulai: detail.tanggalMulai,
            tanggalAkhir: detail.tanggalAkhir,
            judulMateri: materiData?.judulMateri || "Unknown",
            jenisMateri: materiData?.jenisMateri || "VIDEO",
            informasiMateri: materiData?.informasiMateri || "",
            durasi: materiData?.waktuMelihat
              ? materiData.waktuMelihat + " menit"
              : "-",
            icon:
              materiData?.jenisMateri === "QUIZ"
                ? "bi-clipboard-check"
                : "bi-file-earmark-play",
            type:
              materiData?.jenisMateri?.toLowerCase() === "quiz"
                ? "quiz"
                : "video",
            desc: materiData?.informasiMateri || "",
            checked: false,
          };
        });
      });
    });
  }

  openAddModal() {
    this.mode = "add";
    this.selectedMateri = {
      id: null,
      idMateri: null,
      urutan: this.materi.length + 1,
      tanggalMulai: "",
      tanggalAkhir: "",
      judulMateri: "",
      jenisMateri: "",
      informasiMateri: "",
      durasi: "",
    };
    this.showModal = true;
  }

  openEditModal(item: any) {
    this.mode = "edit";
    this.selectedMateri = {
      ...item,
      tanggalMulai: item.tanggalMulai
        ? this.formatDateForInput(item.tanggalMulai)
        : "",
      tanggalAkhir: item.tanggalAkhir
        ? this.formatDateForInput(item.tanggalAkhir)
        : "",
    };
    this.showModal = true;
  }

  onMateriChange() {
    const selected = this.allMateri.find(
      (m) => m.id === this.selectedMateri.idMateri,
    );
    if (selected) {
      this.selectedMateri.judulMateri = selected.judulMateri;
      this.selectedMateri.jenisMateri = selected.jenisMateri;
      this.selectedMateri.informasiMateri = selected.informasiMateri;
      this.selectedMateri.durasi = selected.waktuMelihat
        ? selected.waktuMelihat + " menit"
        : "-";
    }
  }

  formatDateForInput(date: any): string {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  closeModal() {
    this.showModal = false;
  }

  simpanDetail() {
    if (!this.selectedMateri.idMateri) {
      Swal.fire("Warning", "Pilih materi terlebih dahulu!", "warning");
      return;
    }

    const payload = {
      idKursus: this.idKursus,
      listMateri: [
        {
          idMateri: this.selectedMateri.idMateri,
          tanggalMulai: this.selectedMateri.tanggalMulai,
          tanggalAkhir: this.selectedMateri.tanggalAkhir,
        },
      ],
      user: "admin",
    };

    this.detailService.add(payload).subscribe({
      next: () => {
        Swal.fire(
          "Success",
          "Materi berhasil ditambahkan ke pelatihan!",
          "success",
        );
        this.closeModal();
        this.loadAll();
      },
      error: (err) => {
        console.error(err);
        Swal.fire("Error", err.error?.message || "Gagal menambahkan!", "error");
      },
    });
  }

  updateDetail() {
    if (!this.selectedMateri.idMateri) {
      Swal.fire("Error", "ID Materi tidak ditemukan!", "error");
      return;
    }

    const payload = {
      idKursus: this.idKursus,
      idMateri: this.selectedMateri.idMateri,
      urutan: this.selectedMateri.urutan,
      tanggalMulai: this.selectedMateri.tanggalMulai,
      tanggalAkhir: this.selectedMateri.tanggalAkhir,
      user: "admin",
    };

    this.detailService.update(payload).subscribe({
      next: () => {
        Swal.fire("Success", "Detail pelatihan berhasil diupdate!", "success");
        this.closeModal();
        this.loadAll();
      },
      error: (err) => {
        console.error(err);
        Swal.fire("Error", err.error?.message || "Gagal update!", "error");
      },
    });
  }

  // ==================== MODAL HAPUS ====================

  // 🔥 Buka modal hapus per item
  openHapusModal() {
    if (this.selectedItems.length === 0) {
      Swal.fire("Warning", "Pilih materi yang akan dihapus!", "warning");
      return;
    }
    this.showHapusModal = true;
  }

  // 🔥 Tutup modal hapus per item
  closeHapusModal() {
    this.showHapusModal = false;
  }

  // 🔥 Konfirmasi hapus per item
  confirmHapus() {
    const selected = this.selectedItems;

    const deletePromises = selected.map((item) =>
      this.detailService.deleteMateri(this.idKursus, item.idMateri).toPromise(),
    );

    Promise.all(deletePromises)
      .then(() => {
        this.closeHapusModal();
        Swal.fire(
          "Deleted",
          `${selected.length} materi berhasil dihapus dari pelatihan!`,
          "success",
        );
        this.loadAll();
      })
      .catch(() => {
        Swal.fire("Error", "Gagal menghapus!", "error");
      });
  }

  // 🔥 Buka modal hapus semua
  openHapusSemuaModal() {
    this.showHapusSemuaModal = true;
  }

  // 🔥 Tutup modal hapus semua
  closeHapusSemuaModal() {
    this.showHapusSemuaModal = false;
  }

  // 🔥 Konfirmasi hapus semua
  confirmHapusSemua() {
    this.detailService.deleteAll(this.idKursus).subscribe({
      next: () => {
        this.closeHapusSemuaModal();
        Swal.fire(
          "Deleted",
          "Semua materi berhasil dihapus dari pelatihan!",
          "success",
        );
        this.loadAll();
      },
      error: () => {
        Swal.fire("Error", "Gagal menghapus!", "error");
      },
    });
  }

  // GETTER untuk checkbox
  get selectedItems() {
    return this.materi.filter((x) => x.checked);
  }

  get isEditDisabled() {
    return this.selectedItems.length !== 1;
  }

  get isDeleteDisabled() {
    return this.selectedItems.length === 0;
  }

  openEditSelected() {
    const selected = this.selectedItems;
    if (selected.length !== 1) {
      Swal.fire("Warning", "Pilih 1 data untuk edit!", "warning");
      return;
    }
    this.openEditModal(selected[0]);
  }
}

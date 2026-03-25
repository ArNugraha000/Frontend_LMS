import { Component, OnInit } from "@angular/core";
import { KursusService } from "../../Service/kursus.service";
import { Kursus } from "../../models/kursus.model";
import { Router } from "@angular/router";

@Component({
  selector: "icons-cmp",
  templateUrl: "./training.component.html",
})
export class TrainingComponent implements OnInit {
  filteredData: Kursus[] = [];
  pagedData: Kursus[] = [];

  searchText: string = "";

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(
    private kursusService: KursusService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log("TrainingComponent Loaded");
    this.loadKursus();
  }

  loadKursus() {
    this.kursusService.getAll().subscribe({
      next: (res: any) => {
        console.log("FULL RESPONSE API:", res);

        this.filteredData = res.data || [];

        console.log("DATA KURSUS:", this.filteredData);

        this.updatePagination();
      },

      error: (err) => {
        console.error("ERROR API:", err);
      },
    });
  }

  updatePagination() {
    let data = this.filteredData;

    if (this.searchText) {
      const lower = this.searchText.toLowerCase();

      data = this.filteredData.filter((item) =>
        item.krsNama?.toLowerCase().includes(lower),
      );
    }

    this.totalPages = Math.ceil(data.length / this.pageSize) || 1;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedData = data.slice(start, end);

    console.log("PAGED DATA:", this.pagedData);
  }

  onSearch() {
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

  isiKehadiran(item: Kursus) {
    console.log("Isi Kehadiran:", item.krsNama);
  }

  lihatRiwayat(item: Kursus) {
    console.log("Riwayat:", item.krsNama);
  }

  onLeftClick(): void {
    console.log("Mulai kursus");
    this.router.navigate(["/mytraining"]);
  }

  onMiddleClick(): void {
    console.log("Profil saya");
    this.router.navigate(["/profile"]);
  }
}

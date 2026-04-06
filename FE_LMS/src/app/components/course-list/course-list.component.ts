import { Component, OnInit } from "@angular/core";
import { KursusService } from "../../Service/kursus.service";
import { Kursus } from "../../models/kursus.model";

@Component({
  selector: "app-course-list",
  templateUrl: "./course-list.component.html",
})
export class CourseListComponent implements OnInit {
  allData: Kursus[] = [];
  filteredData: Kursus[] = [];
  pagedData: Kursus[] = [];

  searchText: string = "";

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(private kursusService: KursusService) {}

  ngOnInit(): void {
    console.log("CourseListComponent Loaded");
    this.loadData();
  }

  loadData() {
    this.kursusService.getAll().subscribe((res: any) => {
      console.log("FULL RESPONSE:", res);

      // ambil array dari res.data
      this.allData = res.data || [];

      console.log("DATA KURSUS:", this.allData);

      this.filteredData = this.allData;

      this.setupPagination();
    });
  }

  onSearch() {
    const searchLower = this.searchText.toLowerCase();

    this.filteredData = this.allData.filter((item) =>
      item.krsNama?.toLowerCase().includes(searchLower),
    );

    this.currentPage = 1;
    this.setupPagination();
  }

  setupPagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize) || 1;
    this.updatePagedData();
  }

  updatePagedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedData = this.filteredData.slice(start, end);

    console.log("PAGED DATA:", this.pagedData);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedData();
    }
  }

  isiKehadiran(item: Kursus) {
    alert("Mengisi kehadiran: " + item.krsNama);
  }

  lihatRiwayat(item: Kursus) {
    alert("Melihat riwayat: " + item.krsNama);
  }
}

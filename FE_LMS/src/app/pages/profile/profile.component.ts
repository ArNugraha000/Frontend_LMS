// profile.component.ts - Tanpa Password
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { ProfileService, ProfileData } from "../../Service/profile.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  isEditing = false;
  profileData: ProfileData | null = null;
  errorMessage = "";
  successMessage = "";
  imagePreview: string | null = null;
  todayDate: string = new Date().toISOString().split("T")[0];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private cookieService: CookieService,
  ) {
    this.profileForm = this.fb.group({
      // Read-only fields
      kryNamaDpn: [{ value: "", disabled: true }],
      kryNamaBkg: [{ value: "", disabled: true }],
      kryJabatan: [{ value: "", disabled: true }],
      kryDivisi: [{ value: "", disabled: true }],
      kryDep: [{ value: "", disabled: true }],
      krySesi: [{ value: "", disabled: true }],
      // Editable fields (TANPA PASSWORD)
      kryEmail: ["", [Validators.required, Validators.email]],
      kryTglLahir: [""],
      kryProfil: [""],
    });
  }

  ngOnInit(): void {
    console.log("Profile Component Initialized");
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = "";

    console.log("Loading profile...");

    this.profileService.getMyProfile().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log("API Response:", response);

        if (response && response.success === true && response.data) {
          this.profileData = response.data;
          console.log("Profile Data:", this.profileData);
          this.populateForm(this.profileData); // HANYA SATU KALI PANGGIL
        } else {
          console.error("Response does not have data:", response);
          this.errorMessage = response?.message || "Gagal memuat data profil";
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error("Error loading profile:", error);
        this.errorMessage =
          error.error?.message ||
          error.message ||
          "Terjadi kesalahan saat memuat data profil";
      },
    });
  }

  populateForm(data: ProfileData): void {
    console.log("Populating form with data:", data);

    let formattedDate = "";
    if (data.kryTglLahir) {
      formattedDate = data.kryTglLahir.split("T")[0];
    }

    this.profileForm.patchValue({
      kryNamaDpn: data.kryNamaDpn || "-",
      kryNamaBkg: data.kryNamaBkg || "-",
      kryJabatan: data.kryJabatan || "-",
      kryDivisi: data.kryDivisi || "-",
      kryDep: data.kryDep || "-",
      krySesi: data.krySesi || "-",
      kryEmail: data.kryEmail || "",
      kryTglLahir: formattedDate,
      kryProfil: data.kryProfil || "",
    });

    if (data.kryProfil && data.kryProfil !== "b" && data.kryProfil !== "") {
      this.imagePreview = data.kryProfil;
    }

    console.log("Form values after patch:", this.profileForm.getRawValue());
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    this.successMessage = "";
    this.errorMessage = "";
    if (!this.isEditing && this.profileData) {
      this.populateForm(this.profileData); // HANYA SATU KALI PANGGIL
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.errorMessage = "Mohon lengkapi data dengan benar";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";
    this.successMessage = "";

    const formValue = this.profileForm.getRawValue();

    const updateData: any = {};

    // Hanya kirim email dan tanggal lahir (TANPA PASSWORD)
    if (
      formValue.kryEmail &&
      formValue.kryEmail !== this.profileData?.kryEmail
    ) {
      updateData.kryEmail = formValue.kryEmail;
    }

    if (
      formValue.kryTglLahir &&
      formValue.kryTglLahir !== this.profileData?.kryTglLahir?.split("T")[0]
    ) {
      updateData.kryTglLahir = formValue.kryTglLahir;
    }

    if (
      formValue.kryProfil &&
      formValue.kryProfil !== this.profileData?.kryProfil
    ) {
      updateData.kryProfil = formValue.kryProfil;
    }

    console.log("Update data being sent:", updateData);

    // If no changes
    if (Object.keys(updateData).length === 0) {
      this.isLoading = false;
      this.successMessage = "Tidak ada perubahan yang disimpan";
      setTimeout(() => {
        this.toggleEditMode();
      }, 1500);
      return;
    }

    this.profileService.updateMyProfile(updateData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log("Update response:", response);

        if (response && response.success) {
          this.successMessage = response.message || "Profil berhasil diupdate";

          // Update cookies if email changed
          if (updateData.kryEmail) {
            this.cookieService.set("userEmail", updateData.kryEmail);
          }

          setTimeout(() => {
            this.loadProfile(); // Ini akan memanggil populateForm lagi
            this.toggleEditMode();
          }, 1500);
        } else {
          this.errorMessage = response?.message || "Gagal mengupdate profil";
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error("Error updating profile:", error);
        this.errorMessage =
          error.error?.message ||
          error.message ||
          "Terjadi kesalahan saat mengupdate profil";
      },
    });
  }

  // Getter for form controls
  get kryEmail() {
    return this.profileForm.get("kryEmail");
  }
  get kryTglLahir() {
    return this.profileForm.get("kryTglLahir");
  }
  get kryProfil() {
    return this.profileForm.get("kryProfil");
  }
}

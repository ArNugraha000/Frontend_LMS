import { Component } from "@angular/core";
import { UserService } from "../../Service/user.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  showPassword: boolean = false;

  captchaQuestion: string = "";
  captchaAnswer: string = "";
  correctAnswer: number = 0;

  isLoading: boolean = false; // Untuk loading state

  constructor(
    private userService: UserService,
    private router: Router,
    private cookiesService: CookieService,
  ) {
    this.generateCaptcha();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  generateCaptcha() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    this.correctAnswer = a + b;
    this.captchaQuestion = `${a} + ${b} = ?`;
  }

  login() {
    // Validasi CAPTCHA
    if (parseInt(this.captchaAnswer) !== this.correctAnswer) {
      alert("Captcha salah!");
      this.generateCaptcha();
      this.captchaAnswer = "";
      return;
    }

    // Validasi input
    if (!this.email || !this.password) {
      alert("Email/Username dan Password wajib diisi!");
      return;
    }

    this.isLoading = true;

    const payload = {
      usrName: this.email,
      usrPassword: this.password,
    };

    this.userService.login(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        // Cek apakah response memiliki data (array tidak kosong)
        if (res && res.length > 0) {
          const user = res[0];

          // 🔥 simpan ke cookies dan localStorage
          localStorage.setItem("isLogin", "true");
          this.cookiesService.set(
            "userId",
            user.usrId?.toString() || user.userId?.toString(),
          );
          this.cookiesService.set("userName", user.usrName || user.username);
          this.cookiesService.set(
            "userRole",
            user.role || user.usrRole || "User",
          );
          this.cookiesService.set("userEmail", user.usrEmail || this.email);
          this.cookiesService.set(
            "userFullName",
            user.usrFullName || user.usrName,
          );
          this.cookiesService.set(
            "userImage",
            user.usrImage || "assets/img/mike.jpg",
          );

          // Optional: simpan juga data lengkap user
          localStorage.setItem("userData", JSON.stringify(user));

          this.router.navigateByUrl("/dashboard");
        } else {
          alert(
            "Username / Password salah ❌\nPeriksa kembali username/email dan password Anda",
          );
          this.generateCaptcha(); // Refresh captcha setelah gagal
          this.captchaAnswer = "";
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Login error:", err);
        alert("Terjadi kesalahan pada server ❌\nSilakan coba lagi nanti");
        this.generateCaptcha();
        this.captchaAnswer = "";
      },
    });
  }
}

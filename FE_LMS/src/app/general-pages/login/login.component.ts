import { Component } from "@angular/core";
import { UserService } from "../../Service/user.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  showPassword: boolean = false;

  captchaQuestion: string = "";
  captchaAnswer: string = "";
  correctAnswer: number = 0;

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
    if (parseInt(this.captchaAnswer) !== this.correctAnswer) {
      alert("Captcha salah!");
      this.generateCaptcha();
      return;
    }

    if (!this.email || !this.password) {
      alert("Email dan Password wajib diisi!");
      return;
    }

    const payload = {
      usrName: this.email,
      usrPassword: this.password,
    };

    this.userService.login(payload).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          alert("Login berhasil ✅");

          const user = res[0];

          // 🔥 simpan ke cookies
          localStorage.setItem("isLogin", "true"); // 🔥 tandain login
          this.cookiesService.set("userId", user.usrId);
          this.cookiesService.set("userName", user.usrName);
          this.cookiesService.set("userRole", user.role || "User");
          this.cookiesService.set("userImage", "assets/img/mike.jpg");

          this.router.navigateByUrl("/dashboard");
        } else {
          alert("Username / Password salah ❌");
        }
      },
      error: (err) => {
        console.error(err);
        alert("Error server ❌");
      },
    });
  }
}

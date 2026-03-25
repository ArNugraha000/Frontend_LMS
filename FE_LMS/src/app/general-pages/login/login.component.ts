import { Component } from "@angular/core";

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

  constructor() {
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

    alert("Login berhasil (dummy)");
  }
}

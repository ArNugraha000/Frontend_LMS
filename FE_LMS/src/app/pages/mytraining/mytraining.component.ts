import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "icons-cmp",
  moduleId: module.id,
  templateUrl: "mytraining.component.html",
})
export class MyTrainingComponent {
  formData: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formData = this.fb.group({
      nama: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      telepon: ["", Validators.required],
      alamat: [""],
    });
  }

  submitForm() {
    if (this.formData.valid) {
      console.log("Data Form:", this.formData.value);
      alert("Data berhasil dikirim!");
    } else {
      this.formData.markAllAsTouched();
    }
  }
}

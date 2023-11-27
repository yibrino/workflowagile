import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
//import { AlertService } from '../alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form?: FormGroup;

  constructor(private formBuilder : FormBuilder, private authService : AuthService,
    private modalService: NgbModal) {}

  ngOnInit() : void {
    this.form = this.formBuilder.group({
      first_name : ['',[ Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      last_name : ['', [Validators.required, Validators.minLength(3),  Validators.maxLength(20)]],
      email : ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), this.passwordStrengthValidator]],
      repeat_password: ['', Validators.required],
    }, { validator: this.passwordMatchValidator } as FormControlOptions);
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('repeat_password')?.value;

    if (password !== confirmPassword) {
      control.get('repeat_password')?.setErrors({ passwordMismatch: true });
    } else {
      control.get('repeat_password')?.setErrors(null);
    }
  }

  submit_clicked:boolean = false;
  submit() : void {
    // console.log(this.form!.getRawValue())
    if (this.form?.valid) {
      // Form is valid, perform login logic here
      console.log('Login form submitted:', this.form.value);
      this.authService.register(this.form?.getRawValue());
      this.submit_clicked = false;
    } else {
      // Form is invalid, display validation errors
      console.log('Form is invalid');
      this.submit_clicked = true;
    }
  }

  goToSignIn() {
    this.modalService.dismissAll(10);
  }

  passwordStrengthValidator(control: AbstractControl) {
    // Password pattern: at least one uppercase letter, one lowercase letter, and one number
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=|;:,.?/]).+$/;

    if (!passwordPattern.test(control.value)) {
      return { weakPassword: true };
    }

    return null;
  }


}

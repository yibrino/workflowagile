import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
//import { AuthService } from '../auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { AlertService } from '../alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form?: FormGroup;

  constructor(private formBuilder : FormBuilder,
    private modalService: NgbModal) {}

  ngOnInit() : void {
    this.form = this.formBuilder.group({
      first_name : ['', Validators.required],
      last_name : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password1: ['', Validators.required],
      // Add other form controls here
    }, { validator: this.passwordMatchValidator } as FormControlOptions);
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password1')?.value;

    if (password !== confirmPassword) {
      control.get('password1')?.setErrors({ passwordMismatch: true });
    } else {
      control.get('password1')?.setErrors(null);
    }
  }

  submit_clicked:boolean = false;
  submit() : void {
    if (this.form?.valid) {
      // Form is valid, perform login logic here
      console.log('Login form submitted:', this.form.value);
      //this.authService.register(this.form?.getRawValue());
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

}

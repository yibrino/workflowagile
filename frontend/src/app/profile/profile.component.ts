import { Component } from '@angular/core';
import { Teacher } from '../models';
import { AbstractControl, FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private alertService: AlertService,  private formBuilder : FormBuilder, 
    private authService : AuthService, private modal: NgbModal) {}

  form: FormGroup = this.formBuilder.group({
    first_name : ['',[ Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    last_name : ['', [Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), this.passwordStrengthValidator]],
    repeat_password: ['', Validators.required],
  }, { validator: this.passwordMatchValidator } as FormControlOptions);
  
  teacher?: Teacher
  ngOnInit() {
    this.authService.getUserData().subscribe({
      next : (data : Teacher) =>  {
        this.teacher = data;
        this.setIntialFormValues(this.teacher);
      },
      error : (e) => {
       this.alertService.showErrorAlert("Error loading profile","Close",5000);
      }
    })
  }

  setIntialFormValues(data: Teacher) {
    if (data) {
      this.form.get('email')?.setValue(data.email);
      this.form.get('first_name')?.setValue(data.first_name);
      this.form.get('last_name')?.setValue(data.last_name);
    }
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
  submit() {
    if (this.form?.valid) {
      this.authService.updateUser(this.form.getRawValue()).subscribe({
        next : (data: Teacher) => {
          this.teacher = data;
          this.form.reset();
          this.submit_clicked = false;
          this.setIntialFormValues(this.teacher);
          this.alertService.showSuccessAlert("Profile updated successfully","Close",3000);
        },
        error : (e) => {
          this.submit_clicked=true;
          this.alertService.showErrorAlert("Error updating profile","Close",5000);
        }
      })
    } else {
      this.submit_clicked = true;
    }
  }

  passwordStrengthValidator(control: AbstractControl) {
    // Password pattern: at least one uppercase letter, one lowercase letter, and one number, and one special character
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=|;:,.?/]).+$/;

    if (!passwordPattern.test(control.value)) {
      return { weakPassword: true };
    }

    return null;
  }
  
  openDeleteModal(deleteModal:any) {
    const modalRef = this.modal.open(deleteModal).result.then(() => {
      this.deleteAccount();
    });
  }

  deleteAccount() {
    this.authService.deleteUser().subscribe({
      next : (data: any) => {
        this.authService.logoutAfterDeleteAccount();
        this.alertService.showSuccessAlert("Account deleted successfully","Close",3000);
      },
      error : () => {
        this.alertService.showErrorAlert("Error deleting account","Close",5000);
      }
    })
  }

}


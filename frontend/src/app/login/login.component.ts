import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form?: FormGroup;

  constructor(private formBuilder : FormBuilder, private modalService : NgbModal, 
    private authService : AuthService, private alert : AlertService, private router: Router) {}

  ngOnInit() : void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    const emailControl = this.form.get('email');
    if (emailControl) {
      emailControl.valueChanges.subscribe(value => {
        if (!value) {
          this.wrong_credentials = false;
        }
      });
    }
  }
  
  submit_clicked:boolean=false;
  wrong_credentials:boolean=false;
  submit() : void {
    if (this.form?.valid) {
      this.authService.login(this.form?.getRawValue()).subscribe({
        next : (response) => {
          this.authService.setData(true);
          this.alert.showSuccessAlert("Successfully logged in","Close",3000);
          //localStorage.setItem("auth","1");
          this.wrong_credentials = false;
          this.modalService.dismissAll();
          this.router.navigate(["/dashboard"])
        },
        error : (e) => {
          //this.alert.showErrorAlert("Wrong credentials","Close",5000);
          this.wrong_credentials = true;
        }
      });
      this.submit_clicked=false;
    } else {
      this.submit_clicked=true;
    }
  }

  checkLogged() {
    this.authService.checkLogged();
  }

  logout() {
    this.authService.logout();
  }

  goToSignUp() {
    this.modalService.dismissAll(10);
  }

}

import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form?: FormGroup;

  constructor(private formBuilder : FormBuilder,
    private modalService : NgbModal, private authService : AuthService) {}

  ngOnInit() : void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  submit_clicked:boolean=false;
  submit() : void {
    if (this.form?.valid) {
      this.authService.login(this.form?.getRawValue());
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

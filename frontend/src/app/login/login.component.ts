import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form?: FormGroup;

  constructor(private formBuilder : FormBuilder,
    private modalService : NgbModal) {}

  ngOnInit() : void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  submit_clicked:boolean=false;
  submit() : void {
  }

  checkLogged() {
  }

  logout() {
  }

  goToSignUp() {
  }

}

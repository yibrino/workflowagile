import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(private modalService: NgbModal, private authService: AuthService) {}

  open(content : any, content1 : any) {
		this.modalService.open(content, { centered: true  }).dismissed.subscribe(reason => {
      if (reason == 10) {
        this.open(content1,content);
      }
    })
	}
   
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  logout() {
    this.authService.logout();
  }

}

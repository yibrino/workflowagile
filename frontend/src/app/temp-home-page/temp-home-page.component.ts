import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-temp-home-page',
  templateUrl: './temp-home-page.component.html',
  styleUrls: ['./temp-home-page.component.css']
})
export class TempHomePageComponent {

  constructor(private modalService: NgbModal) {}

  open(content : any) {
		this.modalService.open(content, { centered: true  })
	}
   
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

}

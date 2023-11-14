import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-temp-home-page',
  templateUrl: './temp-home-page.component.html',
  styleUrls: ['./temp-home-page.component.css']
})
export class TempHomePageComponent {

  constructor(private modalService: NgbModal) {}

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

}

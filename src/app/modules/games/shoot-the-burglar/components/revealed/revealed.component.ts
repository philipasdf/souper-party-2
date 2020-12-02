import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-revealed',
  templateUrl: './revealed.component.html',
  styleUrls: ['./revealed.component.css'],
})
export class RevealedComponent implements OnChanges {
  @Input()
  role: string;

  @Input()
  imgName: string;

  size = 300;
  imgUrl;
  test;

  constructor() {}

  ngOnChanges(): void {
    if (this.imgName !== null && this.imgName !== '') {
      this.imgUrl = this.imgName;
      if (this.role === 'burglar') {
        this.test = 'assets/images/mask.png';
      } else {
        this.test = 'assets/images/crown.png';
      }
    }
  }
}

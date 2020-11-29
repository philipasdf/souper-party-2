import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ImageFsService } from '../../firestorage-services/image-fs.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnChanges {
  @Input()
  imgName: string;

  @Input()
  size = 100;

  imgUrl$;

  constructor(private imageFs: ImageFsService) {}

  ngOnChanges(): void {
    if (this.imgName !== null && this.imgName !== '') {
      this.imgUrl$ = this.imageFs.getImgURL(this.imgName);
    }
  }
}

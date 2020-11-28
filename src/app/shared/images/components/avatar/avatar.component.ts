import { Component, Input, OnInit } from '@angular/core';
import { ImageFsService } from '../../firestorage-services/image-fs.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnInit {
  @Input()
  imgName: string;

  @Input()
  size: number;

  imgUrl$;

  constructor(private imageFs: ImageFsService) {}

  ngOnInit(): void {
    this.imgUrl$ = this.imageFs.getImgURL(this.imgName);
  }
}

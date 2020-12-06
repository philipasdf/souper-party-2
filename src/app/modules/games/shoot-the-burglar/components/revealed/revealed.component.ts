import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, ViewChild } from '@angular/core';
import { REVEALED_CONFIGS } from './reavealed-configs';

@Component({
  selector: 'app-revealed',
  templateUrl: './revealed.component.html',
  styleUrls: ['./revealed.component.css'],
})
export class RevealedComponent implements OnChanges, AfterViewInit {
  @Input()
  role: string;

  @Input()
  imgName: string;

  @ViewChild('container')
  container: ElementRef;

  @ViewChild('sticker')
  sticker: ElementRef;

  @ViewChild('avatar')
  avatar: ElementRef;

  imgUrl = '';
  stickerUrl = '';

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.updateImageSizes();
  }

  ngOnChanges(): void {
    if (this.imgName !== null && this.imgName !== '') {
      this.imgUrl = this.imgName;
    }
  }

  private updateImageSizes() {
    const totalWidth = window.outerWidth;
    const shuffled = this.shuffleArray(REVEALED_CONFIGS);
    const config = shuffled.find((s) => s.role === this.role);

    this.renderer.setStyle(this.container.nativeElement, 'height', `${totalWidth}px`);
    this.renderer.setStyle(this.container.nativeElement, 'width', `${totalWidth}px`);

    this.sticker.nativeElement.src = config.src;
    this.sticker.nativeElement.width = totalWidth * config.sticker.ratioSize;
    this.renderer.setStyle(this.sticker.nativeElement, 'top', `${totalWidth * config.sticker.ratioTop}px`);
    this.renderer.setStyle(this.sticker.nativeElement, 'left', `${totalWidth * config.sticker.ratioLeft}px`);

    this.avatar.nativeElement.height = totalWidth * config.avatar.ratioSize;
    this.renderer.setStyle(this.avatar.nativeElement, 'top', `${totalWidth * config.avatar.ratioTop}px`);
    this.renderer.setStyle(this.avatar.nativeElement, 'left', `${totalWidth * config.avatar.ratioLeft}px`);
    this.renderer.setStyle(this.avatar.nativeElement, 'transform', `rotate(${config.avatar.rotate}deg)`);
    this.renderer.setStyle(this.avatar.nativeElement, 'z-index', config.avatar.zIndex);
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
}

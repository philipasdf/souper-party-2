import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  ViewChild,
} from '@angular/core';
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

  @Input()
  totalWidth = 0;

  @ViewChild('container')
  container: ElementRef;

  @ViewChild('sticker')
  sticker: ElementRef;

  @ViewChild('avatar')
  avatar: ElementRef;

  imgUrl = '';

  constructor(private renderer: Renderer2, private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.updateImageSizes();
  }

  ngOnChanges(): void {
    if (this.imgName !== null && this.imgName !== '') {
      this.imgUrl = this.imgName;
    }
  }

  private updateImageSizes() {
    const totalWidth = this.totalWidth;
    const shuffled = this.shuffleArray(REVEALED_CONFIGS);
    const config = shuffled.find((s) => s.role === this.role);

    const container = this.container.nativeElement;
    this.renderer.setStyle(container, 'height', `${totalWidth}px`);
    this.renderer.setStyle(container, 'width', `${totalWidth}px`);

    const sticker = this.sticker.nativeElement;
    sticker.src = config.src;
    sticker.width = totalWidth * config.sticker.ratioSize;
    this.renderer.setStyle(sticker, 'top', `${totalWidth * config.sticker.ratioTop}px`);
    this.renderer.setStyle(sticker, 'left', `${totalWidth * config.sticker.ratioLeft}px`);

    // hack calculate ratio of height and width of avatar & totalWidth
    // ratio of avatar is width="250" height="300" => 250 * 1.2 = 300 => ratio = 1.2
    const avatarHeight = totalWidth * config.avatar.ratioSize;
    const avatarWidth = avatarHeight / 1.2;

    const avatar = this.avatar.nativeElement;
    this.renderer.setStyle(avatar, 'height', `${avatarHeight}px`);
    this.renderer.setStyle(avatar, 'width', `${avatarWidth}px`);
    this.renderer.setStyle(avatar, 'top', `${totalWidth * config.avatar.ratioTop}px`);
    this.renderer.setStyle(avatar, 'left', `${totalWidth * config.avatar.ratioLeft}px`);
    this.renderer.setStyle(avatar, 'transform', `rotate(${config.avatar.rotate}deg)`);
    this.renderer.setStyle(avatar, 'z-index', config.avatar.zIndex);
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

import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { setPlayerAvatar, SUCCESS } from 'src/app/shared/actions/player.actions';
import { ImageFsService } from 'src/app/shared/images/firestorage-services/image-fs.service';
import { LobbyParentComponent } from '../lobby-parent/lobby-parent.component';

@Component({
  selector: 'app-lobby-avatar-creator',
  templateUrl: './lobby-avatar-creator.component.html',
  styleUrls: ['./lobby-avatar-creator.component.css'],
})
export class LobbyAvatarCreatorComponent extends LobbyParentComponent implements OnInit, AfterViewInit {
  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    this.updateImageSizes();
  }

  @ViewChild('container')
  container: ElementRef;

  @ViewChild('video', { static: true })
  video: ElementRef;

  @ViewChild('faceTemplate', { static: true })
  faceTemplate: ElementRef;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef;

  @ViewChild('snapshot', { static: true })
  snapshot: ElementRef;
  snapshotHeight;
  snapshotWidth;

  imgURL = null;
  currPlayerAvatar: File = null;
  isUploading = false;

  constructor(
    protected route: ActivatedRoute,
    protected store: Store,
    private images: ImageFsService,
    private actions$: Actions,
    private router: Router,
    private renderer: Renderer2
  ) {
    super(route, store);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.runWebcam();

    this.actions$
      .pipe(takeUntil(this.unsub$), ofType(SUCCESS))
      .subscribe(() => this.router.navigate([`lobby/${this.partyName}/${this.playerFireId}`]));
  }

  ngAfterViewInit() {}

  async runWebcam() {
    try {
      this.video.nativeElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: {} });
      this.updateImageSizes();
    } catch (e) {
      console.error('error running webcam', e);
    }
  }

  onSnapshot() {
    const sourceImage = this.video.nativeElement;
    const faceTemplate = this.faceTemplate.nativeElement;

    const a = (sourceImage.videoWidth - sourceImage.width) / 2;
    const b = (sourceImage.width - faceTemplate.width) / 2;
    const sourceX = a + b;
    const c = (sourceImage.videoHeight - sourceImage.height) / 2;
    const d = (sourceImage.height - faceTemplate.height) / 2;
    const sourceY = c + d;

    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(
        sourceImage,
        sourceX,
        sourceY,
        faceTemplate.width,
        faceTemplate.height,
        0,
        0,
        faceTemplate.width,
        faceTemplate.height
      );

    this.snapshotHeight = faceTemplate.height;
    this.snapshotWidth = faceTemplate.width;

    this.imgURL = this.canvas.nativeElement.toDataURL('image/jpg');
    this.canvas.nativeElement.toBlob((blob) => {
      this.currPlayerAvatar = new File([blob], 'snapshot.png', { type: 'image/png' });
    }, 'image/png');
  }

  private updateImageSizes() {
    const totalWidth = Math.round(window.outerWidth);

    const container = this.container.nativeElement;
    this.renderer.setStyle(container, 'height', `${totalWidth}px`);
    this.renderer.setStyle(container, 'width', `${totalWidth}px`);

    const video = this.video.nativeElement;
    this.renderer.setAttribute(video, 'height', `${totalWidth}`);
    this.renderer.setAttribute(video, 'width', `${totalWidth}`);

    const face = this.faceTemplate.nativeElement;
    this.renderer.setStyle(face, 'height', `${Math.round(totalWidth / 2)}px`);
    this.renderer.setStyle(face, 'top', '50%');
    this.renderer.setStyle(face, 'left', '50%');
    this.renderer.setStyle(face, 'transform', 'translateX(-50%) translateY(-50%)');

    const canvas = this.canvas.nativeElement;
    this.renderer.setAttribute(canvas, 'width', `${face.width}`);
    this.renderer.setAttribute(canvas, 'height', `${face.height}`);
  }

  async onNext() {
    this.isUploading = true;
    const uploadTask = await this.images.uploadImg(this.partyName, this.playerFireId, this.currPlayerAvatar);
    const imgUrl = await this.images.getImgURL(uploadTask.metadata.name).toPromise();
    this.store.dispatch(setPlayerAvatar({ avatar: uploadTask.metadata.name, avatarUrl: imgUrl }));
    await timer(3000).toPromise();
    this.isUploading = false;
  }
}

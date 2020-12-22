import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Point } from 'node_modules/face-api.js';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { setPlayerAvatar, SUCCESS } from 'src/app/shared/actions/player.actions';
import { ImageFsService } from 'src/app/shared/images/firestorage-services/image-fs.service';
import { LobbyParentComponent } from '../lobby-parent/lobby-parent.component';
import { AvatarCreatorService } from './avatar-creator.service';

@Component({
  selector: 'app-avatar-creator',
  templateUrl: './avatar-creator.component.html',
  styleUrls: ['./avatar-creator.component.css'],
})
export class AvatarCreatorComponent extends LobbyParentComponent implements OnInit, AfterViewInit {
  @ViewChild('container', { static: true })
  container: ElementRef;

  @ViewChild('video', { static: true })
  video: ElementRef;

  @ViewChild('snapshot', { static: true })
  snapshot: ElementRef;

  @ViewChild('faceFocus', { static: true })
  faceFocus: ElementRef;

  @ViewChild('faceTrace', { static: true })
  faceTrace: ElementRef;

  @ViewChild('avatar', { static: true })
  avatar: ElementRef;

  SCREENWIDTH = 0;
  videoRatio = 0;
  videoWidth = 0; // finally calculated video width responsive to Screensize
  videoHeight = 0; // finally calculated video width responsive to Screensize

  hasSnapshot = false;
  isSnapshotDisabled = false;
  isVideoSizeLoaded = false;
  isUploading = false;
  isVideoHidden = true;

  currPlayerAvatar: File = null;

  constructor(
    protected route: ActivatedRoute,
    protected store: Store,
    private images: ImageFsService,
    private actions$: Actions,
    private router: Router,
    private renderer: Renderer2,
    private service: AvatarCreatorService
  ) {
    super(route, store);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.actions$
      .pipe(takeUntil(this.unsub$), ofType(SUCCESS))
      .subscribe(() => this.router.navigate([`lobby/${this.partyName}/${this.playerFireId}`]));
  }

  async ngAfterViewInit() {
    await this.service.initWebCam(this.video.nativeElement);
    await timer(200).toPromise(); // wait for video.videoWidth and video.videoHeight to get initialized
    this.setVideoSize();
    await this.runFaceApi();
  }

  async onDrawVideoSnapshotOnCanvas() {
    const sourceImage = this.video.nativeElement;
    const target = this.snapshot.nativeElement;
    const width = sourceImage.videoWidth;
    const height = sourceImage.videoHeight;

    this.renderer.setAttribute(target, 'width', width);
    this.renderer.setAttribute(target, 'height', height);

    target.getContext('2d').drawImage(sourceImage, 0, 0, width, height, 0, 0, width, height);
    this.hasSnapshot = true;

    const detection = await this.service.detectFaceLandmarks(this.snapshot.nativeElement);
    if (detection) {
      // for debugging
      // faceapi.draw.drawDetections(this.trimFace.nativeElement, detection);
      // faceapi.draw.drawFaceLandmarks(this.trimFace.nativeElement, detection);
      this.drawAvatar(detection.landmarks.positions);
      this.saveAvatarFile();
    } else {
      this.onCancel();
      alert('Ups! Bitte versuch es noch einmal. Manchmal kann kein Gesicht erkannt werden 8-)');
    }
  }

  onCancel() {
    const canvas = this.snapshot.nativeElement;
    this.service.clearCanvas(this.snapshot.nativeElement, canvas);
    this.service.clearCanvas(this.faceTrace.nativeElement, canvas);
    this.service.clearCanvas(this.avatar.nativeElement, canvas);
    this.hasSnapshot = false;
    this.isVideoHidden = false;
    this.runFaceTracking();
  }

  async onSubmit() {
    this.isUploading = true;
    if (!this.currPlayerAvatar) {
      this.onCancel();
      return;
    }
    const uploadTask = await this.images.uploadImg(this.partyName, this.playerFireId, this.currPlayerAvatar);
    const imgUrl = await this.images.getImgURL(uploadTask.metadata.name).toPromise();
    await this.images.updateMetadata(uploadTask.metadata.name).toPromise();
    this.store.dispatch(setPlayerAvatar({ avatar: uploadTask.metadata.name, avatarUrl: imgUrl }));
    await timer(3000).toPromise();
    this.isUploading = false;
  }

  private setVideoSize() {
    this.SCREENWIDTH = window.outerWidth;
    const video = this.video.nativeElement;
    this.videoRatio = video.videoWidth / video.videoHeight;
    this.videoWidth = Math.min(this.SCREENWIDTH, video.videoWidth);
    this.videoHeight = this.videoWidth / this.videoRatio;

    this.renderer.setAttribute(this.video.nativeElement, 'width', `${this.videoWidth}`);
    this.renderer.setAttribute(this.video.nativeElement, 'height', `${this.videoHeight}`);
    this.renderer.setAttribute(this.faceTrace.nativeElement, 'width', this.video.nativeElement.width);
    this.renderer.setAttribute(this.faceTrace.nativeElement, 'height', this.video.nativeElement.height);
  }

  private async runFaceApi() {
    await this.service.loadFaceApiWeights();
    this.runFaceTracking();
    this.setContainerSize();
  }

  private async runFaceTracking() {
    this.isVideoHidden = false;
    if (this.hasSnapshot) {
      this.service.clearCanvas(this.faceFocus.nativeElement, this.video.nativeElement);
      this.service.clearCanvas(this.faceTrace.nativeElement, this.video.nativeElement);
      return;
    }
    try {
      const detection = await this.service.detectFace(this.video.nativeElement, this.faceTrace.nativeElement);
      this.drawFaceFocusBox(detection?.box);
      this.setContainerSize();
      setTimeout(() => this.runFaceTracking());
    } catch (error) {
      console.error('failed to runFaceTracking()', error);
    }
  }

  private drawFaceFocusBox(box) {
    const faceFocus = this.faceFocus.nativeElement;
    const video = this.video.nativeElement;
    const focusBoxRectSize = Math.min(this.videoWidth, this.videoHeight) * 0.75;

    this.renderer.setAttribute(faceFocus, 'width', video.width);
    this.renderer.setAttribute(faceFocus, 'height', video.height);

    this.service.clearCanvas(faceFocus, video);
    this.isSnapshotDisabled = !this.service.drawStrokeRect(box, focusBoxRectSize, video, faceFocus.getContext('2d'));
  }

  private setContainerSize() {
    if (this.video.nativeElement.videoWidth > 0 && !this.isVideoSizeLoaded) {
      const container = this.container.nativeElement;
      const video = this.video.nativeElement;
      this.renderer.setStyle(container, 'height', `${video.height}px`);
      this.renderer.setStyle(container, 'width', `${video.width}px`);
      this.isVideoSizeLoaded = true;
    }
  }

  private drawAvatar(points: Point[]) {
    const avatar = this.avatar.nativeElement;
    const { xMin, yMin, chinPadding, offset, avatarHeight, avatarWidth } = this.service.getAvatarDimensions(points);

    // for debugging
    // this.renderer.setAttribute(avatar, 'width', this.video.nativeElement.videoWidth);
    // this.renderer.setAttribute(avatar, 'height', this.video.nativeElement.videoHeight);
    // ctx.strokeStyle = 'red';
    // ctx.strokeRect(xMin, yMin - offset, width, height + offset);
    this.renderer.setAttribute(avatar, 'width', `${avatarWidth}`);
    this.renderer.setAttribute(avatar, 'height', `${avatarHeight}`);

    avatar
      .getContext('2d')
      .drawImage(
        this.snapshot.nativeElement,
        xMin,
        yMin - offset + chinPadding,
        avatarWidth,
        avatarHeight,
        0,
        0,
        avatarWidth,
        avatarHeight
      );
    this.isVideoHidden = true;
    this.service.clearCanvas(this.snapshot.nativeElement, this.video.nativeElement);
  }

  private saveAvatarFile() {
    this.avatar.nativeElement.toBlob((blob) => {
      this.currPlayerAvatar = new File([blob], 'snapshot.png', { type: 'image/png' });
    }, 'image/png');
  }
}

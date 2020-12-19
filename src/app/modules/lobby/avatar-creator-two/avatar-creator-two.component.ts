import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as faceapi from 'node_modules/face-api.js';
import { Point } from 'node_modules/face-api.js';
import { AvatarCreatorService } from './avatar-creator.service';

@Component({
  selector: 'app-avatar-creator-two',
  templateUrl: './avatar-creator-two.component.html',
  styleUrls: ['./avatar-creator-two.component.css'],
})
export class AvatarCreatorTwoComponent implements AfterViewInit {
  @ViewChild('container', { static: true })
  container: ElementRef;

  @ViewChild('video', { static: true })
  video: ElementRef;

  @ViewChild('snapshot', { static: true })
  snapshot: ElementRef;

  @ViewChild('faceFocus', { static: true })
  faceFocus: ElementRef;

  @ViewChild('trimFace', { static: true })
  trimFace: ElementRef;

  @ViewChild('avatar', { static: true })
  avatar: ElementRef;

  hasSnapshot = false;
  isSnapshotDisabled = false;
  isVideoSizeLoaded = false;

  currPlayerAvatar: File = null;

  constructor(private service: AvatarCreatorService, private renderer: Renderer2) {}

  async ngAfterViewInit() {
    await this.service.initWebCam(this.video.nativeElement);
    await this.runFaceApi();
  }

  private async runFaceApi() {
    await this.service.loadFaceApiWeights();

    this.runFaceTracking();
    this.setContainerSize();
  }

  private async runFaceTracking() {
    if (this.hasSnapshot) {
      this.service.clearCanvasOfVideoDimensions(this.faceFocus.nativeElement, this.video.nativeElement);
      this.service.clearCanvasOfVideoDimensions(this.trimFace.nativeElement, this.video.nativeElement);
      return;
    }

    try {
      const results = await this.service.computeFaceDetection(this.video.nativeElement, this.trimFace.nativeElement);

      this.drawFaceFocusBox(results?.box);
      this.setContainerSize();

      setTimeout(() => this.runFaceTracking());
    } catch (error) {
      console.error('failed to runFaceTracking()', error);
    }
  }

  private setContainerSize() {
    if (this.video.nativeElement.videoWidth > 0 && !this.isVideoSizeLoaded) {
      const container = this.container.nativeElement;
      const video = this.video.nativeElement;
      this.renderer.setStyle(container, 'height', `${video.videoHeight}px`);
      this.renderer.setStyle(container, 'width', `${video.videoWidth}px`);
      this.isVideoSizeLoaded = true;
    }
  }

  private drawFaceFocusBox(box) {
    const faceFocus = this.faceFocus.nativeElement;
    const video = this.video.nativeElement;
    const focusBoxRectSize = 350;

    this.renderer.setAttribute(faceFocus, 'width', video.videoWidth);
    this.renderer.setAttribute(faceFocus, 'height', video.videoHeight);

    this.service.clearCanvasOfVideoDimensions(faceFocus, video);
    this.isSnapshotDisabled = !this.service.drawStrokeRect(box, focusBoxRectSize, video, faceFocus.getContext('2d'));
  }

  onDrawVideoSnapshotOnCanvas() {
    const sourceImage = this.video.nativeElement;
    const target = this.snapshot.nativeElement;
    const width = sourceImage.videoWidth;
    const height = sourceImage.videoHeight;
    this.renderer.setAttribute(target, 'width', width);
    this.renderer.setAttribute(target, 'height', height);

    this.service.drawImageOnCanvas(sourceImage, target, width, height);
    this.hasSnapshot = true;
  }

  onCancel() {
    const canvas = this.snapshot.nativeElement;
    this.service.clearCanvas(this.snapshot.nativeElement, canvas.width, canvas.height);
    this.service.clearCanvas(this.trimFace.nativeElement, canvas.width, canvas.height);
    this.service.clearCanvas(this.avatar.nativeElement, canvas.width, canvas.height);
    this.hasSnapshot = false;
    this.runFaceTracking();
  }

  async onTrimFace() {
    try {
      const options = new faceapi.TinyFaceDetectorOptions();
      const detection = await faceapi.detectSingleFace(this.snapshot.nativeElement, options).withFaceLandmarks(true);
      console.log('detection', detection);

      const dims = faceapi.matchDimensions(this.trimFace.nativeElement, this.snapshot.nativeElement, true);
      console.log('dims', dims);

      if (detection) {
        const resizedResult = faceapi.resizeResults(detection, dims);
        console.log('resizedResult', resizedResult);

        // faceapi.draw.drawDetections(this.trimFace.nativeElement, resizedResult);
        // faceapi.draw.drawFaceLandmarks(this.trimFace.nativeElement, resizedResult);
        this.drawAvatarRect(resizedResult.landmarks.positions);
      } else {
        // TODO reset everything, and display Message
      }
    } catch (error) {
      console.error('failed to faceDetection()', error);
    }
  }

  private drawAvatarRect(points: Point[]) {
    const avatar = this.avatar.nativeElement;

    const padding = 5;
    const xMin = Math.min(...points.map((p) => p.x)) - padding;
    const xMax = Math.max(...points.map((p) => p.x)) + padding;
    const yMin = Math.min(...points.map((p) => p.y)) - padding;
    const yMax = Math.max(...points.map((p) => p.y)) + padding;
    const width = xMax - xMin;
    const height = yMax - yMin;

    // super hack, because the highest landmarkPoint is usually the eyebrow.
    // With this offset I want to include the forehead and hair
    const offset = height * 0.429;
    const chinPadding = 15; // small padding to include the chin
    const avatarHeight = height + offset;
    const avatarWidth = width;

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

    this.service.clearCanvasOfVideoDimensions(this.snapshot.nativeElement, this.video.nativeElement);

    avatar.toBlob((blob) => {
      this.currPlayerAvatar = new File([blob], 'snapshot.png', { type: 'image/png' });
    }, 'image/png');
  }
}

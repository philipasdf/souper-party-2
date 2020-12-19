import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as faceapi from 'node_modules/face-api.js';
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

  hasSnapshot = false;
  isSnapshotDisabled = false;
  isVideoSizeLoaded = false;

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

        faceapi.draw.drawDetections(this.trimFace.nativeElement, resizedResult);
        faceapi.draw.drawFaceLandmarks(this.trimFace.nativeElement, resizedResult);
      }
    } catch (error) {
      console.error('failed to faceDetection()', error);
    }
  }
}

import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as faceapi from 'node_modules/face-api.js';

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

  constructor(private renderer: Renderer2) {}

  async ngAfterViewInit() {
    await this.initCam();
    await this.runFaceApi();
  }

  private async initCam() {
    this.video.nativeElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: {} });
  }

  private async runFaceApi() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/weights');
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/assets/weights');

    this.runFaceTracking();
    this.setContainerSize();
  }

  private async runFaceTracking() {
    if (this.hasSnapshot) {
      this.clearCanvas(this.faceFocus.nativeElement, this.video.nativeElement);
      this.clearCanvas(this.trimFace.nativeElement, this.video.nativeElement);
      return;
    }

    try {
      const options = new faceapi.TinyFaceDetectorOptions();
      const results = await faceapi.detectSingleFace(this.video.nativeElement, options);
      const dims = faceapi.matchDimensions(this.trimFace.nativeElement, this.video.nativeElement, true);
      if (results) {
        const resizedResults = faceapi.resizeResults(results, dims);
        faceapi.draw.drawDetections(this.trimFace.nativeElement, resizedResults);
      }

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

  private clearCanvas(canvas, video) {
    canvas.getContext('2d').clearRect(0, 0, video.videoWidth, video.videoHeight);
  }

  private drawFaceFocusBox(box) {
    const faceFocus = this.faceFocus.nativeElement;
    const ctx = faceFocus.getContext('2d');
    const video = this.video.nativeElement;

    this.renderer.setAttribute(faceFocus, 'width', video.videoWidth);
    this.renderer.setAttribute(faceFocus, 'height', video.videoHeight);

    this.clearCanvas(faceFocus, video);

    const focusBox = 350;

    const rectTop = video.videoHeight / 2 - focusBox / 2;
    const rectLeft = video.videoWidth / 2 - focusBox / 2;
    const rectBottom = rectTop + focusBox;
    const rectRight = rectLeft + focusBox;

    let isFocusMatching = false;
    if (box) {
      isFocusMatching = rectTop < box.top && rectLeft < box.left && rectBottom > box.bottom && rectRight > box.right;
      this.isSnapshotDisabled = !isFocusMatching;
    }

    ctx.strokeStyle = isFocusMatching ? '#00FF00' : '#DB482E';
    ctx.lineJoin = 'bevel';
    ctx.lineWidth = 5;

    ctx.strokeRect(rectLeft, rectTop, focusBox, focusBox);
  }

  onSnapshot() {
    const sourceImage = this.video.nativeElement;
    const target = this.snapshot.nativeElement;
    const width = sourceImage.videoWidth;
    const height = sourceImage.videoHeight;
    this.renderer.setAttribute(target, 'width', width);
    this.renderer.setAttribute(target, 'height', height);
    target.getContext('2d').drawImage(sourceImage, 0, 0, width, height, 0, 0, width, height);
    this.hasSnapshot = true;
  }

  onCancel() {
    const canvas = this.snapshot.nativeElement;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    this.trimFace.nativeElement.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    this.hasSnapshot = false;
    this.runFaceTracking();
  }

  onTrimFace() {
    this.faceDetection();
  }

  private async faceDetection() {
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

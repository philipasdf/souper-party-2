import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as faceapi from 'node_modules/face-api.js';

@Component({
  selector: 'app-avatar-creator-two',
  templateUrl: './avatar-creator-two.component.html',
  styleUrls: ['./avatar-creator-two.component.css'],
})
export class AvatarCreatorTwoComponent implements AfterViewInit {
  @ViewChild('video', { static: true })
  video: ElementRef;

  @ViewChild('snapshot', { static: true })
  snapshot: ElementRef;

  @ViewChild('trimFace', { static: true })
  trimFace: ElementRef;

  hasSnapshot = false;

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

    // this.runFaceTracking();
  }

  private async runFaceTracking() {
    try {
      const results = await faceapi.detectAllFaces(this.video.nativeElement);
      const dims = faceapi.matchDimensions(this.trimFace.nativeElement, this.video.nativeElement, true);
      const resizedResults = faceapi.resizeResults(results, dims);
      // TODO color own Cross, if Box matches
      faceapi.draw.drawDetections(this.trimFace.nativeElement, resizedResults);
      setTimeout(() => this.runFaceTracking());
    } catch (error) {
      console.error(error);
    }
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
      console.error(error);
    }
  }
}

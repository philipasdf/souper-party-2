import { Injectable } from '@angular/core';
import * as faceapi from 'node_modules/face-api.js';

@Injectable({
  providedIn: 'root',
})
export class AvatarCreatorService {
  constructor() {}

  async initWebCam(video) {
    video.srcObject = await navigator.mediaDevices.getUserMedia({ video: {} });
  }

  async loadFaceApiWeights() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/weights');
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/assets/weights');
  }

  drawImageOnCanvas(sourceImage, target, width, height) {
    target.getContext('2d').drawImage(sourceImage, 0, 0, width, height, 0, 0, width, height);
  }

  clearCanvasOfVideoDimensions(canvas, video) {
    canvas.getContext('2d').clearRect(0, 0, video.videoWidth, video.videoHeight);
  }

  clearCanvas(target, width, height) {
    target.getContext('2d').clearRect(0, 0, width, height);
  }

  async computeFaceDetection(videoSource, canvasTarget) {
    const options = new faceapi.TinyFaceDetectorOptions();
    const results = await faceapi.detectSingleFace(videoSource, options);
    const dims = faceapi.matchDimensions(canvasTarget, videoSource, true);
    if (results) {
      const resizedResults = faceapi.resizeResults(results, dims);
      faceapi.draw.drawDetections(canvasTarget, resizedResults);
    }
    return results;
  }

  /**
   *
   * @param detectionBox box from faceapi.detectSingleFace().results
   * @param rectSize size of the Rect to draw
   * @param video video where faceDetection was computed
   * @param targetContext target canvas to draw the rect
   * @return boolean is detection matching the rect
   */
  drawStrokeRect(detectionBox, rectSize: number, video, targetContext): boolean {
    const rectTop = video.videoHeight / 2 - rectSize / 2;
    const rectLeft = video.videoWidth / 2 - rectSize / 2;
    const rectBottom = rectTop + rectSize;
    const rectRight = rectLeft + rectSize;

    let isFocusMatching = false;
    if (detectionBox) {
      isFocusMatching =
        rectTop < detectionBox.top &&
        rectLeft < detectionBox.left &&
        rectBottom > detectionBox.bottom &&
        rectRight > detectionBox.right;
    }

    targetContext.strokeStyle = isFocusMatching ? '#00FF00' : '#DB482E';
    targetContext.lineJoin = 'bevel';
    targetContext.lineWidth = 5;

    targetContext.strokeRect(rectLeft, rectTop, rectSize, rectSize);

    return !detectionBox ? true : isFocusMatching;
  }
}

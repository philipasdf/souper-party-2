import { Injectable } from '@angular/core';
import * as faceapi from 'node_modules/face-api.js';
import { Point, resizeResults } from 'node_modules/face-api.js';

@Injectable({
  providedIn: 'root',
})
export class AvatarCreatorService {
  tinyFaceDetectorOptions = new faceapi.TinyFaceDetectorOptions();

  constructor() {}

  async initWebCam(video) {
    video.srcObject = await navigator.mediaDevices.getUserMedia({ video: {} });
  }

  async loadFaceApiWeights() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/weights');
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/assets/weights');
  }

  clearCanvas(canvas, dimensionSource) {
    canvas.getContext('2d').clearRect(0, 0, dimensionSource.width, dimensionSource.height);
  }

  async detectFace(videoSource, canvasTarget) {
    const results = await faceapi.detectSingleFace(videoSource, this.tinyFaceDetectorOptions);
    const dims = faceapi.matchDimensions(canvasTarget, videoSource, false);
    let resizedResults;
    if (results) {
      resizedResults = faceapi.resizeResults(results, dims);
      faceapi.draw.drawDetections(canvasTarget, resizedResults);
    }
    return resizedResults;
  }

  async detectFaceLandmarks(source) {
    try {
      return await faceapi.detectSingleFace(source, this.tinyFaceDetectorOptions).withFaceLandmarks(true);
    } catch (error) {
      console.error('failed to faceDetection()', error);
    }
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
    // const rectTop = video.videoHeight / 2 - rectSize / 2;
    // const rectLeft = video.videoWidth / 2 - rectSize / 2;
    const rectTop = video.height / 2 - rectSize / 2;
    const rectLeft = video.width / 2 - rectSize / 2;
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

  drawAvatar(points: Point[], canvas) {}

  getAvatarDimensions(points: Point[]) {
    const padding = 5;
    const xMin = Math.min(...points.map((p) => p.x)) - padding;
    const xMax = Math.max(...points.map((p) => p.x)) + padding;
    const yMin = Math.min(...points.map((p) => p.y)) - padding;
    const yMax = Math.max(...points.map((p) => p.y)) + padding;
    const chinPadding = 15; // small padding to include the chin

    const height = yMax - yMin;
    // super hack, because the highest landmarkPoint is usually the eyebrow.
    // With this offset I want to include the forehead and hair
    const offset = height * 0.429;
    const avatarHeight = height + offset;
    const avatarWidth = xMax - xMin;

    return {
      xMin,
      yMin,
      chinPadding,
      offset,
      avatarHeight,
      avatarWidth,
    };
  }
}

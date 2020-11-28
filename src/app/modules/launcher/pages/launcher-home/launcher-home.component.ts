import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as playerReducer from 'src/app/shared/reducers/player.reducer';
import * as playerActions from 'src/app/shared/actions/player.actions';

@Component({
  selector: 'app-launcher-home',
  templateUrl: './launcher-home.component.html',
  styleUrls: ['./launcher-home.component.css'],
})
export class LauncherHomeComponent implements OnInit {
  nameInput = '';
  imgURL = null;

  @ViewChild('video', { static: true })
  video: ElementRef;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef;

  constructor(private playerStore: Store<playerReducer.State>) {}

  ngOnInit(): void {
    this.playerStore.select(playerReducer.selectCurrPlayerName).subscribe((currPlayer) => {
      this.nameInput = currPlayer;
    });

    this.canvas.nativeElement.width = 300;
    this.canvas.nativeElement.height = 200;
    this.video.nativeElement.width = 300;
    this.video.nativeElement.height = 200;
    this.runWebcam();
  }

  async runWebcam() {
    try {
      this.video.nativeElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: {} });
    } catch (e) {
      console.error('error running webcam', e);
    }
  }

  saveUser() {
    this.playerStore.dispatch(playerActions.saveCurrPlayer({ currPlayer: this.nameInput.trim() }));
  }

  onSnapshot() {
    // this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
    // this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;

    const sourceImage = this.video.nativeElement;
    const sourceX = 0;
    const sourceY = 0;
    const sourceWidth = this.video.nativeElement.videoWidth;
    const sourceHeight = this.video.nativeElement.videoHeight;
    const canvasX = 0;
    const canvasY = 0;
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, canvasX, canvasY, canvasWidth, canvasHeight);

    this.imgURL = this.canvas.nativeElement.toDataURL('image/png');
  }
}

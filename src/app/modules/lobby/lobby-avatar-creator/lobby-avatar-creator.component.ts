import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class LobbyAvatarCreatorComponent extends LobbyParentComponent implements OnInit {
  @ViewChild('video', { static: true })
  video: ElementRef;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef;

  imgURL = null;
  currPlayerAvatar: File = null;
  isUploading = false;

  constructor(
    protected route: ActivatedRoute,
    protected store: Store,
    private images: ImageFsService,
    private actions$: Actions,
    private router: Router
  ) {
    super(route, store);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.canvas.nativeElement.width = 300;
    this.canvas.nativeElement.height = 200;
    this.video.nativeElement.width = 300;
    this.video.nativeElement.height = 200;
    this.runWebcam();

    this.actions$
      .pipe(takeUntil(this.unsub$), ofType(SUCCESS))
      .subscribe(() => this.router.navigate([`lobby/${this.partyName}/${this.playerFireId}`]));
  }

  async runWebcam() {
    try {
      this.video.nativeElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: {} });
    } catch (e) {
      console.error('error running webcam', e);
    }
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

    this.imgURL = this.canvas.nativeElement.toDataURL('image/jpg');
    this.canvas.nativeElement.toBlob((blob) => {
      this.currPlayerAvatar = new File([blob], 'snapshot.png', { type: 'image/png' });
    }, 'image/png');
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

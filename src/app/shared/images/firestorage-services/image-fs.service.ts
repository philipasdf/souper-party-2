import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageFsService {
  constructor(private firestorage: AngularFireStorage) {}

  getImgURL(imgFileName: string): Observable<string> {
    return this.firestorage.ref(`/avatars/${imgFileName}`).getDownloadURL();
  }

  uploadImg(partyName: string, playerFireId: string, file: File): AngularFireUploadTask {
    const fileName = `${partyName}_${playerFireId}_${file.name}`;
    return this.firestorage.upload(`/avatars/${fileName}`, file);
  }

  updateMetadata(imgFileName: string): Observable<any> {
    return this.firestorage
      .ref(`/avatars/${imgFileName}`)
      .updateMetadata({ cacheControl: 'public, max-age=6000, s-maxage=6000' });
  }
}

// import { Injectable } from '@angular/core';
// import { AngularFireStorage } from '@angular/fire/storage';
// import { Observable } from 'rxjs';
// import { finalize } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class FirebaseService {
//   constructor(private storage: AngularFireStorage) {}

//   uploadAudioFile(file: File): Observable<string> {
//     const filePath = `audio/${new Date().getTime()}_recording.wav`;
//     const fileRef = this.storage.ref(filePath);
//     const task = this.storage.upload(filePath, file);

//     return new Observable<string>((observer) => {
//       task
//         .snapshotChanges()
//         .pipe(
//           finalize(() => {
//             fileRef.getDownloadURL().subscribe(
//               (fileURL) => {
//                 observer.next(fileURL);
//                 observer.complete();
//               },
//               (error) => {
//                 observer.error(error);
//               }
//             );
//           })
//         )
//         .subscribe();
//     });
//   }
// }

import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private storage: AngularFireStorage) {}

  uploadAudioFile(file: File): Observable<string> {
    const filePath = `audio/${new Date().getTime()}_recording.wav`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable<string>((observer) => {
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(
              (fileURL) => {
                observer.next(fileURL);
                observer.complete();
              },
              (error) => {
                observer.error(error);
              }
            );
          }),
          catchError((error) => {
            observer.error(error);
            return throwError(error);
          })
        )
        .subscribe();
    });
  }
}

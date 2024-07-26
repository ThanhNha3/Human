import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AssemblyAIService {
  private apiKey: string = '3599f000d45e4502b2c5c1078e8820ab';
  private apiUrl: string = 'https://api.assemblyai.com/v2';

  constructor(private http: HttpClient) {}

  transcribeAudio(audioUrl: string): Observable<string> {
    const headers = new HttpHeaders({
      authorization: this.apiKey,
      'content-type': 'application/json',
    });

    const body = {
      audio_url: audioUrl,
      language_code: 'vi',
    };

    return this.http
      .post<{ id: string }>(`${this.apiUrl}/transcript`, body, { headers })
      .pipe(
        switchMap((response) => this.pollTranscriptionResult(response.id)),
        catchError((error) => {
          console.error('Transcription request failed', error);
          return of('Transcription failed');
        })
      );
  }

  private pollTranscriptionResult(transcriptionId: string): Observable<string> {
    const headers = new HttpHeaders({
      authorization: this.apiKey,
    });

    return new Observable<string>((observer) => {
      const poll = () => {
        this.http
          .get<{ status: string; text?: string }>(
            `${this.apiUrl}/transcript/${transcriptionId}`,
            { headers }
          )
          .subscribe(
            (response) => {
              if (response.status === 'completed') {
                observer.next(response.text!);
                observer.complete();
              } else if (response.status === 'failed') {
                observer.error('Transcription failed');
              } else {
                setTimeout(poll, 5000);
              }
            },
            (error) => {
              observer.error(error);
            }
          );
      };
      poll();
    });
  }
}

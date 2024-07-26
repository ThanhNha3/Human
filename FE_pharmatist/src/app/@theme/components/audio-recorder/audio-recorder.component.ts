import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from 'src/app/@core/service/firebase.service';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss'],
})
export class AudioRecorderComponent implements OnInit {
  @Output() fileUploaded = new EventEmitter<string>();
  private recordRTC: any;
  private stream!: MediaStream;

  isRecording: boolean = false;
  isPaused: boolean = false;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {}

  async startRecording() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.recordRTC = new RecordRTC(this.stream, { type: 'audio' });
    this.recordRTC.startRecording();
    this.isRecording = true;
    this.isPaused = false;
  }

  pauseRecording() {
    if (this.isPaused) {
      this.recordRTC.resumeRecording();
    } else {
      this.recordRTC.pauseRecording();
    }
    this.isPaused = !this.isPaused;
  }

  stopRecording() {
    this.recordRTC.stopRecording(() => {
      this.stream.getTracks().forEach((track) => track.stop());
      const audioBlob = this.recordRTC.getBlob();
      const audioFile = new File([audioBlob], 'recording.wav', {
        type: 'audio/wav',
      });

      this.firebaseService.uploadAudioFile(audioFile).subscribe(
        (fileURL) => {
          console.log('File URL:', fileURL);
          this.fileUploaded.emit(fileURL);
          // this.assemblyAIService.transcribeAudio(fileURL).subscribe(
          //   (transcription) => {
          //     console.log('Transcription:', transcription);
          //   },
          //   (error) => {
          //     console.error('Transcription failed:', error);
          //   }
          // );
        },
        (error) => {
          console.error('Upload failed:', error);
        }
      );
    });
    this.isRecording = false;
    this.isPaused = false;
  }
}

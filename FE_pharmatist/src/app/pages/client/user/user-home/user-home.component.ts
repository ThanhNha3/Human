import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssemblyAIService } from 'src/app/@core/service/assemblyai.service';
import { ChatService } from 'src/app/@core/service/chat.service';
import { VoiceInputService } from 'src/app/@core/service/voice-input.service';
import { DataSharingService } from 'src/app/@core/service/common/data-sharing.service';
import { Router } from '@angular/router';
import { LangchainService } from 'src/app/@core/service/langchain.service';
import { AuthService } from 'src/app/@core/service/auth.service';
import { UserService } from 'src/app/@core/service/user.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss'],
})
export class UserHomeComponent implements OnInit {
  showRecorder = false;
  isConflict = false;
  conflictMessage = '';
  isLogged: boolean = false;
  userId: string = '';
  newestSickness: string = '';
  mainMessage: string = '';

  constructor(
    private assemblyAIService: AssemblyAIService,
    private voiceInputService: VoiceInputService,
    private chatService: ChatService,
    private spinner: NgxSpinnerService,
    private dataSharingService: DataSharingService,
    private router: Router,
    private langchainService: LangchainService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isLogged = this.authService.isLoggedIn();
    if (this.isLogged) {
      this.userId = this.authService.decodeToken().id;
      this.userService
        .getNewestSickness(Number(this.userId))
        .subscribe((response) => {
          this.newestSickness = response.results.symptom;
        });
    }
  }

  startRecording() {
    this.showRecorder = true;
  }

  onFileUploaded(fileURL: string) {
    this.spinner.show();
    this.assemblyAIService.transcribeAudio(fileURL).subscribe(
      (transcription) => {
        const message = transcription.replace(
          /\b(\d{4})[-\s]*(\d{3})[-\s]*(\d{3})\b/g,
          (match, p1, p2, p3) => {
            return `${p1}${p2}${p3}`;
          }
        );
        // Sửa
        this.langchainService
          .predictSickness({
            followUpVisit: this.isLogged,
            input: message,
            oldSickness: this.newestSickness,
          })
          .subscribe((response) => {
            if (response.results.response == 'true') {
              this.chatService
                .create({ message: message })
                .subscribe((response) => {
                  const isDataInvalid =
                    !response.fullname ||
                    !response.age ||
                    !response.gender ||
                    !response.phone ||
                    !response.symptom;
                  const isFullnameInvalid = !response.fullname;
                  const isAgeInvalid = !response.age;
                  const isPhoneInvalid = !response.phone;
                  const isGenderInvalid = !response.gender;
                  const isSymptomInvalid = !response.symptom;

                  // Prepare data for sharing
                  const validationState = {
                    isDataInvalid,
                    isFullnameInvalid,
                    isAgeInvalid,
                    isPhoneInvalid,
                    isGenderInvalid,
                    isSymptomInvalid,
                  };

                  // Share data and validation state
                  this.dataSharingService.changeData(response);
                  this.dataSharingService.changeInvalidState(validationState);
                  this.spinner.hide();
                  this.router.navigate(['/xac-nhan-thong-tin']);
                });
            } else {
              this.mainMessage = message;
              this.conflictMessage = response.results.response;
              this.spinner.hide();
              this.setConflictState();
            }
          });
      },
      (error) => {
        console.error('Transcription failed:', error);
        this.router.navigate(['/error']);
      }
    );
  }

  setConflictState() {
    this.isConflict = !this.isConflict;
  }

  confirmConflict() {
    this.setConflictState();
    this.chatService
      .create({ message: this.mainMessage })
      .subscribe((response) => {
        const isDataInvalid =
          !response.fullname ||
          !response.age ||
          !response.gender ||
          !response.phone ||
          !response.symptom;
        const isFullnameInvalid = !response.fullname;
        const isAgeInvalid = !response.age;
        const isPhoneInvalid = !response.phone;
        const isGenderInvalid = !response.gender;
        const isSymptomInvalid = !response.symptom;

        // Prepare data for sharing
        const validationState = {
          isDataInvalid,
          isFullnameInvalid,
          isAgeInvalid,
          isPhoneInvalid,
          isGenderInvalid,
          isSymptomInvalid,
        };

        // Share data and validation state
        this.dataSharingService.changeData(response);
        this.dataSharingService.changeInvalidState(validationState);
        this.spinner.hide();
        this.router.navigate(['/xac-nhan-thong-tin']);
      });
  }
}

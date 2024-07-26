import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { AssemblyAIService } from 'src/app/@core/service/assemblyai.service';
// import { AuthService } from 'src/app/@core/service/auth.service';
import { ChatService } from 'src/app/@core/service/chat.service';
// import { UserService } from 'src/app/@core/service/user.service';
import { VoiceInputService } from 'src/app/@core/service/voice-input.service';

// import { FormBuilder, Validators, FormGroup } from '@angular/forms';
// import { PrescriptionService } from 'src/app/@core/service/prescription.service';
import { DataSharingService } from 'src/app/@core/service/common/data-sharing.service';
import { Router } from '@angular/router';

// interface IInfo {
//   fullname: string;
//   age: number;
//   gender: string;
//   phone: string;
//   symptom: string;
//   underlying_condition: string | null;
//   allergic: string[];
// }

// interface IDiagnosis {
//   name: string;
//   probability: number;
//   department: string;
// }

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss'],
})
export class UserHomeComponent implements OnInit {
  constructor(
    private assemblyAIService: AssemblyAIService,
    private voiceInputService: VoiceInputService,
    private chatService: ChatService,
    private spinner: NgxSpinnerService,
    private dataSharingService: DataSharingService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
        this.chatService.create({ message: message }).subscribe((response) => {
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
      },
      (error) => {
        console.error('Transcription failed:', error);
        this.router.navigate(['/error']);
      }
    );
  }
}

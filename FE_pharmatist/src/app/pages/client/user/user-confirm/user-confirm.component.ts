import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/@core/service/auth.service';
import { DataSharingService } from 'src/app/@core/service/common/data-sharing.service';
import { PrescriptionService } from 'src/app/@core/service/prescription.service';
import { UserService } from 'src/app/@core/service/user.service';

interface Info {
  fullname: string;
  age: number | null;
  gender: string;
  phone: string;
  symptom: string;
  underlying_condition: string;
  allergic: string[];
}

interface IDiagnosis {
  name: string;
  probability: number;
  department: string;
}

function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits;
}

@Component({
  selector: 'app-user-confirm',
  templateUrl: './user-confirm.component.html',
  styleUrls: ['./user-confirm.component.scss'],
})
export class UserConfirmComponent implements OnInit {
  userForm!: FormGroup;
  user_info: Info | null = null;
  user_prescription: IDiagnosis | null = null;
  isDataInvalid: boolean = false;
  isFullnameInvalid: boolean = false;
  isAgeInvalid: boolean = false;
  isPhoneInvalid: boolean = false;
  isGenderInvalid: boolean = false;
  isSymptomInvalid: boolean = false;
  invalidFields = [
    { key: 'isFullnameInvalid', message: 'Tên không được để trống' },
    { key: 'isAgeInvalid', message: 'Tuổi không được để trống' },
    { key: 'isPhoneInvalid', message: 'Số điện thoại không được để trống' },
    { key: 'isGenderInvalid', message: 'Giới tính không được để trống' },
    { key: 'isSymptomInvalid', message: 'Triệu chứng không được để trống' },
  ];
  missingFieldsMessage: string = '';

  @ViewChild('closeButton') closeButton!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private userService: UserService,
    private prescriptionService: PrescriptionService,
    private dataSharingService: DataSharingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullname: ['', [Validators.required]],
      age: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      gender: [[this.user_info?.gender ?? ''], Validators.required],
      symptom: ['', Validators.required],
      underlying_condition: [''],
      allergic: [''],
    });

    this.dataSharingService.currentData.subscribe((data) => {
      this.user_info = data;
      if (this.user_info?.phone) {
        this.user_info.phone = formatPhoneNumber(this.user_info.phone);
      }
      if (this.user_info?.gender) {
        this.user_info.gender = this.user_info.gender.toLowerCase();
      }
      const allergicString = this.user_info?.allergic
        ? this.user_info.allergic.join(',')
        : '';
      this.userForm.patchValue({
        fullname: this.user_info?.fullname ?? '',
        age: this.user_info?.age ?? '',
        phone: this.user_info?.phone ?? '',
        gender: this.user_info?.gender ?? '',
        symptom: this.user_info?.symptom ?? '',
        underlying_condition: this.user_info?.underlying_condition ?? '',
        allergic: allergicString,
      });
    });

    this.dataSharingService.currentInvalidState.subscribe((invalidState) => {
      this.isDataInvalid = invalidState.isDataInvalid;
      this.isFullnameInvalid = invalidState.isFullnameInvalid;
      this.isAgeInvalid = invalidState.isAgeInvalid;
      this.isPhoneInvalid = invalidState.isPhoneInvalid;
      this.isGenderInvalid = invalidState.isGenderInvalid;
      this.isSymptomInvalid = invalidState.isSymptomInvalid;

      this.invalidFields.forEach((field) => {
        if (invalidState[field.key]) {
          this.missingFieldsMessage += `${field.message}, `;
        }
      });
      this.missingFieldsMessage = this.missingFieldsMessage.replace(/, $/, '');
    });
  }

  onConfirmInfo() {
    this.spinner.show();
    const userData = {
      fullname: this.user_info?.fullname,
      phone: this.user_info?.phone,
      gender: this.user_info?.gender,
      allergic: JSON.stringify(this.user_info?.allergic ?? []),
      age: this.user_info?.age,
    };
    console.log(userData);

    this.userService.create(userData).subscribe(
      (res) => {
        const { id, phone } = res.data;
        this.prescriptionService
          .create({
            created_by: id,
            symptoms: this.user_info?.symptom,
            underlying_condition: this.user_info?.underlying_condition,
          })
          .subscribe({
            next: (response) => {
              const highestProbabilityDiagnosis = response.data.reduce(
                (prev: any, current: any) => {
                  return prev.probability > current.probability
                    ? prev
                    : current;
                }
              );
              this.user_prescription = highestProbabilityDiagnosis;
              this.spinner.hide();
            },
            error: (error) => {
              console.error('Error in creating prescription:', error);
              this.spinner.hide();
              this.router.navigate(['/error']);
            },
          });
      },
      (err) => {
        console.error('Error in updating user info:', err);
        this.spinner.hide();
        this.router.navigate(['/error']);
      }
    );
  }

  onEditInfo() {
    if (this.userForm.valid) {
      this.spinner.show();
      this.isDataInvalid = false;
      const updatedValues = this.userForm.value;
      updatedValues.allergic = updatedValues.allergic
        ? updatedValues.allergic.split(',')
        : [];
      this.user_info = { ...this.user_info, ...updatedValues };
      this.userForm.patchValue({
        fullname: this.user_info?.fullname ?? '',
        age: this.user_info?.age ?? '',
        phone: this.user_info?.phone ?? '',
        gender: this.user_info?.gender ?? '',
        symptom: this.user_info?.symptom ?? '',
        underlying_condition: this.user_info?.underlying_condition ?? '',
        allergic: this.user_info?.allergic,
      });
      // Chưa thêm age
      const userData = {
        fullname: this.user_info?.fullname,
        phone: this.user_info?.phone,
        gender: this.user_info?.gender,
        allergic: JSON.stringify(this.user_info?.allergic ?? []),
        age: this.user_info?.age,
      };
      this.userService.create(userData).subscribe(
        (res) => {
          const { id, phone } = res.data;
          this.prescriptionService
            .create({
              created_by: id,
              symptoms: this.user_info?.symptom,
              underlying_condition: this.user_info?.underlying_condition,
            })
            .subscribe({
              next: (response) => {
                const highestProbabilityDiagnosis = response.data.reduce(
                  (prev: any, current: any) => {
                    return prev.probability > current.probability
                      ? prev
                      : current;
                  }
                );
                this.user_prescription = highestProbabilityDiagnosis;
                this.spinner.hide();
              },
              error: (error) => {
                console.error('Error in creating prescription:', error);
                this.spinner.hide();
                this.router.navigate(['/error']);
              },
            });
        },
        (err) => {
          console.error('Error in updating user info:', err);
          this.spinner.hide();
          this.router.navigate(['/error']);
        }
      );
    }
  }

  onBack() {
    this.user_info = null;
    this.user_prescription = null;
    this.isDataInvalid = false;
    this.router.navigate(['/']);
  }

  onAccept() {
    this.user_info = null;
    this.user_prescription = null;
    this.isDataInvalid = false;
    this.router.navigate(['/']);
  }
}

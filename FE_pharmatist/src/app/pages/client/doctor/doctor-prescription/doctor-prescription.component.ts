import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrescriptionService } from 'src/app/@core/service/prescription.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/@core/service/user.service';
import { UserAllergicService } from 'src/app/@core/service/user-allergic.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from 'src/app/@core/service/department.service';

@Component({
  selector: 'app-doctor-prescription',
  templateUrl: './doctor-prescription.component.html',
  styleUrls: ['./doctor-prescription.component.scss'],
})
export class DoctorPrescriptionComponent implements OnInit {
  diagnosis: any[] = [];
  user: any;
  prescription: any;
  id!: string;
  userAllergics: any[] = [];
  addDiagnosisForm!: FormGroup;
  symtoms: any[] = [];
  specializedSymptoms: string = '';
  departments: any = [];

  constructor(
    private DepartmentService: DepartmentService,
    private prescriptionService: PrescriptionService,
    private userAllergicService: UserAllergicService,
    private UserService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.fetchPrescription(this.id);
    this.DepartmentService.getAllDepartment().subscribe((response) => {
      this.departments = response.data;
      console.log('Departments:', this.departments);
    });
    this.addDiagnosisForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  fetchPrescription(id: string) {
    this.prescriptionService.getPrescriptionDiagnosis(Number(id)).subscribe(
      (response) => {
        this.diagnosis = response.data.sickness;
        this.user = response.data.user;
        this.prescription = response.data.prescription;
        this.userAllergics = response.data.userAllergics;
        this.userAllergics = this.userAllergics.map((item) => item.name);
        this.specializedSymptoms = response.data.specializedSymptoms.join(', ');
        this.spinner.hide();
      },
      (error) => {
        console.error('Error:', error);
        this.router.navigate(['/error']);
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    const draggedItemId = this.diagnosis[event.previousIndex].id;
    const newOrder = event.currentIndex + 1; // +1 if you want the order to start from 1 instead of 0
    this.updateOrder(draggedItemId, newOrder);
  }

  updateOrder(id: number, newOrder: number) {
    const updatePayload = {
      id: id,
      order: newOrder,
    };

    this.prescriptionService
      .updateOderSickness(this.id, updatePayload)
      .subscribe(
        (response) => {
          this.diagnosis = response.data;
          console.log(this.diagnosis);
        },
        (error) => {
          console.error('Error:', error);
          this.router.navigate(['/error']);
        }
      );
  }

  addDiagnosis() {
    if (this.addDiagnosisForm.valid) {
      const data = {
        name: this.addDiagnosisForm.value.name,
        order: this.diagnosis[this.diagnosis.length - 1]?.order + 1 || 1,
        department: this.addDiagnosisForm.value.department,
      };
      this.prescriptionService.createDiagnosis(Number(this.id), data).subscribe(
        (response) => {
          this.prescriptionService
            .getAllSicknessByPrescriptionId(Number(this.prescription.id))
            .subscribe((response) => {
              this.diagnosis = response.data;
            });
        },
        (error) => {
          console.error('Error:', error);
          this.router.navigate(['/error']);
        }
      );
    }
  }

  deleteDiagnosis(id: string) {
    this.prescriptionService
      .deleteDiagnosis(Number(this.prescription.id), Number(id))
      .subscribe(
        (response) => {
          this.prescriptionService
            .getAllSicknessByPrescriptionId(Number(this.prescription.id))
            .subscribe((response) => {
              this.diagnosis = response.data;
            });
        },
        (error) => {
          console.error('Error:', error);
          this.router.navigate(['/error']);
        }
      );
  }

  generateMedicine() {
    this.spinner.show();
    const data = {
      message: this.diagnosis.map((item) => item.name).join(', '),
      user_id: this.user.id,
      prescriptionId: this.prescription.id,
    };
    console.log(data);

    this.prescriptionService.generateMedicine(data).subscribe(
      (res) => {
        this.router.navigate(['/bac-si/chi-tiet-don-kham', this.id]);
      },
      (error) => {
        console.error('Error:', error);
        this.router.navigate(['/error']);
      }
    );
  }

  // Thay đổi thông tin user
  currentFullNameChanged(event: any) {
    this.user.fullname = event.target.value;
  }

  currentAgeChanged(event: any) {
    console.log('Age:', event.target.value);
    this.user.age = event.target.value;
  }

  currentGenderChanged(event: any) {
    this.user.gender = event.target.value;
  }

  updateInformation() {
    this.UserService.update(this.user, this.user.id).subscribe(
      (response) => {
        console.log('Update response:', response);
        this.Toastr.success('Thay đổi thông tin thành công!', 'Thông báo');
      },
      (error) => {
        console.error('Error:', error);
        this.Toastr.error('Thay đổi thông tin thất bại!', 'Thông báo');
      }
    );
  }

  // Thay đổi lịch sử bệnh lí
  currentUnderlyingChange(event: any) {
    this.prescription.underlying_condition = event.target.value;
  }
  updateUnderlying() {
    this.prescriptionService
      .updatePrescription(this.prescription, this.user.id, this.prescription.id)
      .subscribe(
        (response) => {
          console.log('Update response:', response);
          this.Toastr.success('Thay đổi bệnh nền thành công!', 'Thông báo');
        },
        (error) => {
          console.error('Error:', error);
          this.Toastr.error('Thay đổi bệnh nền thất bại!', 'Thông báo');
        }
      );
  }

  //Thay đổi thuốc dị ứng
  currentAllergicChange(event: any) {
    const newAllergic = event.target.value.split(',');
    this.userAllergics = newAllergic;
  }
  updateAllergic() {
    const arrayAllergics = this.userAllergics;
    console.log('Array Allergics:', arrayAllergics);

    if (arrayAllergics[0] === '') {
      this.userAllergicService
        .delete(this.user.id, this.prescription.id)
        .subscribe(
          (response) => {
            this.Toastr.success('xóa dị ứng thành công!', 'Thông báo');
            console.log('Delete allergic response:', response);
          },
          (error) => {
            console.error('Error deleting allergic:', error);
            this.Toastr.error('Xóa dị ứng thất bại!', 'Thông báo');
          }
        );
    } else {
      const observables = arrayAllergics.map((item) => {
        return this.userAllergicService.get(
          this.user.id,
          this.prescription.id,
          item
        );
      });

      forkJoin(observables).subscribe(
        (responses) => {
          responses.forEach((response, index) => {
            const existedAllergic = arrayAllergics.find((item) => {
              const itemTrimmed = item.trim();
              const responseNameTrimmed =
                response.data[0] && response.data[0].name
                  ? response.data[0].name.trim()
                  : '';

              return itemTrimmed === responseNameTrimmed;
            });

            console.log('Existed allergic:', existedAllergic);

            if (!existedAllergic) {
              const newAllergic = {
                name: arrayAllergics[index].trim(),
                user_id: this.user.id,
                prescription_id: this.prescription.id,
              };

              this.userAllergicService.create(newAllergic).subscribe(
                (createResponse) => {
                  this.Toastr.success('Thêm dị ứng thành công!', 'Thông báo');
                  console.log('Create allergic response:', createResponse);
                },
                (createError) => {
                  console.error('Error creating allergic:', createError);
                  this.Toastr.error('Thêm dị ứng thất bại!', 'Thông báo');
                }
              );
            }
          });
        },
        (error) => {
          console.error('Error:', error);
          this.router.navigate(['/error']);
        }
      );
    }
  }

  //Thay đổi triệu chứng
  currentSymptomsChange(event: any) {
    this.prescription.symptoms = event.target.value;
  }

  updateSymptoms() {
    this.prescriptionService
      .updatePrescription(this.prescription, this.user.id, this.prescription.id)
      .subscribe(
        (response) => {
          this.Toastr.success('Thay đổi triệu chứng thành công!', 'Thông báo');
        },
        (error) => {
          console.error('Error:', error);
          this.Toastr.error('Thay đổi triệu chứng thất bại!', 'Thông báo');
        }
      );
  }
}

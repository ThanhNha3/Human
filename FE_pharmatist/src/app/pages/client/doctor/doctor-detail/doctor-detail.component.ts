import { Component, OnInit } from '@angular/core';
import { PrescriptionService } from 'src/app/@core/service/prescription.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrescriptionMedicineService } from 'src/app/@core/service/prescription-medicine.service';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/@core/service/auth.service';
import { MedicineService } from 'src/app/@core/service/medicine.service';
import { FormControl } from '@angular/forms';
import { debounceTime, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AiRecordService } from 'src/app/@core/service/ai-record.service';

@Component({
  selector: 'app-doctor-detail',
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.scss'],
})
export class DoctorDetailComponent implements OnInit {
  medicines: any[] = [];
  id!: string;
  diagnosis: any;
  user: any;
  prescription: any;
  doctor_id: string = '';
  medicineData: any[] = []; // Danh sách thuốc trong csdl
  medicineFromDBAI: any[] = []; // Danh sách thuốc từ DBAI
  searchControl: FormControl = new FormControl('');
  isConfirmed: boolean = false;
  specializedSymptoms: string = '';

  constructor(
    private aiRecordService: AiRecordService,
    private prescriptionService: PrescriptionService,
    private prescriptionMedicineService: PrescriptionMedicineService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private medicineService: MedicineService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  // ngOnInit(): void {
  //   this.spinner.show();
  //   this.id = this.route.snapshot.paramMap.get('id') || '';
  //   this.fetchPrescriptionDetail(this.id);
  //   this.doctor_id = this.authService.decodeToken().id;
  //   this.medicineService.getAll().subscribe((response) => {
  //     this.medicineData = response.medicine;
  //   });
  //   this.onSearching();
  // }

  ngOnInit(): void {
    this.spinner.show();
    console.log('Spinner shown');
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.doctor_id = this.authService.decodeToken().id;

    // Sử dụng forkJoin để chờ tất cả các Observable hoàn thành
    forkJoin({
      prescriptionDetail: this.prescriptionService.getPrescriptionDiagnosis(
        Number(this.id)
      ),
      medicineData: this.medicineService.getAll(),
    })
      .pipe(
        finalize(() => {
          this.spinner.hide();
          console.log('Spinner hidden');
        })
      )
      .subscribe(
        ({ prescriptionDetail, medicineData }) => {
          // Xử lý dữ liệu từ API
          this.diagnosis = prescriptionDetail.data.sickness
            .map((item: any) => item.name)
            .join(', ');
          this.user = prescriptionDetail.data.user;
          this.medicines = prescriptionDetail.data.medicines;
          this.prescription = prescriptionDetail.data.prescription;
          this.medicineFromDBAI = prescriptionDetail.data.medicineFromDBAI;
          this.medicineData = medicineData.medicine;
          this.specializedSymptoms =
            prescriptionDetail.data.specializedSymptoms.join(', ');
          console.log(this.specializedSymptoms);
        },
        (error) => {
          console.log('Error fetching prescription detail:', error);
          this.router.navigate(['/error']);
        }
      );

    // Gọi các hàm khác nếu cần
    this.onSearching();
  }

  fetchPrescriptionDetail(id: string): void {
    this.prescriptionService.getPrescriptionDiagnosis(Number(id)).subscribe(
      (response) => {
        this.diagnosis = response.data.sickness
          .map((item: any) => item.name)
          .join(', ');
        this.user = response.data.user;
        this.medicines = response.data.medicines;
        this.prescription = response.data.prescription;
        this.medicineFromDBAI = response.data.medicineFromDBAI;
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching prescription detail:', error);
        this.router.navigate(['/error']);
      }
    );
  }

  handleUpdatePrescription(data: any): void {
    const updatedMedicine = {
      quantity: data.quantity,
      dosage: data.dosage,
    };
    this.prescriptionMedicineService
      .update(updatedMedicine, this.id, data.id)
      .subscribe(() => {
        // this.fetchPrescriptionDetail(this.id);
        this.prescriptionMedicineService
          .getAllMedicineByPrescriptionId(Number(this.id))
          .subscribe((response) => {
            this.medicines = response.data;
          });
      });
  }

  handleDeletePrescription(id: number): void {
    this.prescriptionMedicineService.remove(this.id, id).subscribe(() => {
      this.prescriptionMedicineService
        .getAllMedicineByPrescriptionId(Number(this.id))
        .subscribe((response) => {
          this.medicines = response.data;
        });
    });
  }
  //Chấp nhận đơn thuốc
  handleAcceptPrescription(): void {
    const acceptPrescription$ =
      this.prescriptionMedicineService.confirmedPrescriptionMedicine(this.id);
    const acceptUserPrescription$ =
      this.prescriptionService.doctorAcceptPrescription(
        this.user.id,
        Number(this.id),
        Number(this.doctor_id)
      );

    forkJoin([acceptPrescription$, acceptUserPrescription$]).subscribe(
      () => {
        this.toastr.success('Đơn khám đã được duyệt thành công!', 'Thông báo');
        this.isConfirmed = true;
      },
      (error) => {
        console.error('Error accepting prescription:', error);
        this.toastr.error('Duyệt đơn khám thất bại!', 'Thông báo');
      }
    );
    // Thêm một API thêm vào DBAI
    const medicines = this.medicines;
    const sicknesses = this.diagnosis;
    const symptoms = this.prescription.symptoms;

    const data = {
      medicines,
      sicknesses,
      symptoms,
    };

    console.log(data);

    this.aiRecordService.create(data).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log('Thêm vào DBAI thất bại i', error);
        this.router.navigate(['/error']);
      }
    );
  }

  handleAddMedicineToPrescription(id: string): void {
    this.spinner.show();
    const newMedicine = {
      prescriptionId: Number(this.id),
      medicineId: id,
      quantity: 0,
      dosage: '',
    };
    this.prescriptionMedicineService
      .addMedicineToPrescription(newMedicine)
      .subscribe(() => {
        this.prescriptionMedicineService
          .getAllMedicineByPrescriptionId(Number(this.id))
          .subscribe((response) => {
            this.medicines = response.data;
            this.spinner.hide();
          });
      });
  }

  onSearching(): void {
    this.searchControl.valueChanges

      .pipe(debounceTime(500)) // Apply debounceTime of 800ms
      .subscribe(
        (value) => {
          this.handleSearchMedicine(value); // Call your search function here
        },
        (error) => {
          console.error('Error searching medicine:', error);
          this.toastr.error('Tìm kiếm thuốc thất bại!', 'Thông báo');
        }
      );
  }

  handleSearchMedicine(value: string): void {
    this.medicineService.getByMedicineName(value).subscribe(
      (response) => {
        console.log(response);
        this.medicineData = response.medicine;
      },
      (error) => {
        console.error('Error searching medicine:', error);
        this.toastr.error('Tìm kiếm thuốc thất bại!', 'Thông báo');
      }
    );
  }
}

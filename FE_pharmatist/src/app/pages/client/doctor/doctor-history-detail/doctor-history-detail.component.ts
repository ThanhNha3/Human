import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrescriptionService } from 'src/app/@core/service/prescription.service';

@Component({
  selector: 'app-doctor-history-detail',
  templateUrl: './doctor-history-detail.component.html',
  styleUrls: ['./doctor-history-detail.component.scss'],
})
export class DoctorHistoryDetailComponent implements OnInit {
  id!: number;
  prescriptionData!: any;
  sicknessName!: any;
  sicknessDepartment!: any;
  total_money: number = 0;
  newMedicineArray: any = [];

  constructor(
    private router: ActivatedRoute,
    private prescriptionService: PrescriptionService,
    private spinner: NgxSpinnerService
  ) {}

  randomPrice(min = 40000, max = 1000000): number {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // Tạo số ngẫu nhiên từ min đến max
    return randomNumber - (randomNumber % 10); // Trả về số có thể chia hết cho 10
  }

  ngOnInit(): void {
    this.spinner.show();
    this.id = Number(this.router.snapshot.params['id']);
    this.prescriptionService.getPrescriptionDiagnosis(this.id).subscribe(
      (res) => {
        this.prescriptionData = res.data;
        this.sicknessName = this.prescriptionData.sickness.map(
          (sick: any) => sick.name
        );
        this.sicknessDepartment = this.prescriptionData.sickness.map(
          (sick: any) => sick.department
        );

        this.newMedicineArray = this.prescriptionData.medicines.map(
          (item: any) => {
            if (!item.price && item.price <= 0) {
              item.price = this.randomPrice();
            }
            return {
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              dosage: item.dosage,
              unit: item.unit,
            };
          }
        );

        this.total_money = this.newMedicineArray.reduce(
          (acc: number, medicine: any) => {
            return acc + medicine.price;
          },
          0
        );
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  formatCurrency(price: number): string {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

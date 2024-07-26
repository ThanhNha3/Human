import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/@core/service/auth.service';
import { PrescriptionMedicineService } from 'src/app/@core/service/prescription-medicine.service';
import { PrescriptionService } from 'src/app/@core/service/prescription.service';

@Component({
  selector: 'app-prescription-history-detail',
  templateUrl: './prescription-history-detail.component.html',
  styleUrls: ['./prescription-history-detail.component.scss']
})
export class PrescriptionHistoryDetailComponent implements OnInit {

  userId!: number;
  medicienID!: number;
  sickness!: [];
  prescriptionMedicine: any;
  total_money: number = 0;
  newMedicineArray: any = [];

  constructor(
    private authService: AuthService,
    private router: ActivatedRoute,
    private prescriptionMedicineService: PrescriptionMedicineService,
  ) { }
  randomPrice(min = 40000, max = 1000000): number {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // Tạo số ngẫu nhiên từ min đến max
    return randomNumber - (randomNumber % 10); // Trả về số có thể chia hết cho 10
  }
  ngOnInit(): void {
    this.userId = this.authService.decodeToken().id
    this.medicienID = Number(this.router.snapshot.params['id']);
    this.prescriptionMedicineService
      .findByPrescriptionId(this.userId, this.medicienID)
      .subscribe(
        (res) => {
          this.prescriptionMedicine = res;
          console.log(res)
          this.sickness = this.prescriptionMedicine.sickness.map(
            (sick: any) => sick.name
          );
          this.newMedicineArray = this.prescriptionMedicine.medicines.map(
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
            (acc: number, medicine: any) => acc + medicine.price,
            0
          );
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

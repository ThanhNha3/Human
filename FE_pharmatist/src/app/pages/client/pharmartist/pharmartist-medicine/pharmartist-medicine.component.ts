import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrescriptionMedicineService } from 'src/app/@core/service/prescription-medicine.service';
import { PrescriptionService } from 'src/app/@core/service/prescription.service';

@Component({
  selector: 'app-pharmartist-medicine',
  templateUrl: './pharmartist-medicine.component.html',
  styleUrls: ['./pharmartist-medicine.component.scss'],
})
export class PharmartistMedicineComponent implements OnInit {
  id!: number;
  medicienID!: number;
  sickness!: [];
  prescriptionMedicine: any;
  total_money: number = 0;
  showButtonAccepted: boolean = true;
  showButtonHanded: boolean = true;
  newMedicineArray: any = [];

  constructor(
    private router: ActivatedRoute,
    private prescriptionMedicineService: PrescriptionMedicineService,
    private prescriptionService: PrescriptionService,
    private Toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.router.snapshot.params['id']);
    this.medicienID = Number(this.router.snapshot.params['medicienID']);
    this.prescriptionMedicineService
      .findByPrescriptionId(this.id, this.medicienID)
      .subscribe(
        (res) => {
          this.prescriptionMedicine = res;
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

  randomPrice(min = 40000, max = 1000000): number {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // Tạo số ngẫu nhiên từ min đến max
    return randomNumber - (randomNumber % 10); // Trả về số có thể chia hết cho 10
  }

  formatCurrency(price: number): string {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Xác nhận bốc thuốc
  acceptedPrescriptionMedicine() {
    this.prescriptionMedicineService.updateStatus(this.medicienID).subscribe(
      (res) => {
        this.Toastr.success('Bốc thuốc thành công', 'Thông báo');
        this.showButtonAccepted = false;
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // Xác nhận đã bàn giao
  acceptedPrescription() {
    this.prescriptionService
      .pharmartistAcceptPrescription(this.id, this.medicienID)
      .subscribe(
        (res) => {
          console.log(res);
          this.Toastr.success('Bàn giao thành công', 'Thông báo');
          this.showButtonHanded = false;
        },
        (err) => {
          console.log(err);
        }
      );
  }
}

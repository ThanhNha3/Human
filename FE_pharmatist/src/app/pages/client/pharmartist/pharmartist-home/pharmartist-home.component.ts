import { Component, OnInit } from '@angular/core';
import { PrescriptionMedicineService } from 'src/app/@core/service/prescription-medicine.service';
import { PrescriptionService } from 'src/app/@core/service/prescription.service';

@Component({
  selector: 'app-pharmartist-home',
  templateUrl: './pharmartist-home.component.html',
  styleUrls: ['./pharmartist-home.component.scss'],
})
export class PharmartistHomeComponent implements OnInit {
  prescriptionMedicines: any[] = [];
  isDataPending: boolean = false;
  searchTerm!: number;

  constructor(
    private prescriptionMedicineService: PrescriptionMedicineService,
    private PrescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    this.loadPrescriptionMedicines();
  }

  loadPrescriptionMedicines() {
    this.prescriptionMedicineService.findAll().subscribe(
      (res) => {
        console.log(res.data);
        this.prescriptionMedicines = res.data;
      },
      (error) => {
        console.error('Error fetching prescription medicines:', error);
      }
    );
  }
  performSearch() {
    this.isDataPending = true;
    this.PrescriptionService.getByPrescriptionId(this.searchTerm).subscribe(
      (res) => {
        this.prescriptionMedicines = [];
        this.prescriptionMedicines.push(res.data);
        console.log(this.prescriptionMedicines);
        // console.log(this.prescriptionMedicines[0].prescription.prescriptionId);
        this.isDataPending = false;
      },
      (error) => {
        console.error('Error fetching prescription medicines:', error);
        this.isDataPending = false;
      }
    );
  }
}

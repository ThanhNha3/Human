import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrescriptionService } from 'src/app/@core/service/prescription.service';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.scss'],
})
export class DoctorHomeComponent implements OnInit {
  prescriptionData: any;
  sickness: any[] = [];
  isDataPending: boolean = true;

  constructor(
    private prescriptionService: PrescriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prescriptionService.getByStatus('pending').subscribe(
      (data) => {
        this.prescriptionData = data.data;
        this.isDataPending = true;
      },
      (error) => {
        console.error('Error fetching prescription medicines:', error);
        this.router.navigate(['/error']);
      }
    );
  }

  getPrescriptionByStatus(status: string) {
    this.prescriptionService.getByStatus(status).subscribe(
      (data) => {
        this.prescriptionData = data.data;
        this.isDataPending = status === 'pending';
      },
      (error) => {
        console.error('Error fetching prescription medicines:', error);
        this.router.navigate(['/error']);
      }
    );
  }
}

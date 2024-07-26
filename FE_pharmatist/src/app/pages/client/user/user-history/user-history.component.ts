import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/service/auth.service';
import { PrescriptionService } from 'src/app/@core/service/prescription.service';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss'],
})
export class UserHistoryComponent implements OnInit {
  userId!: string;
  prescriptions: any[] = [];
  timeday!: string;
  constructor(
    private authService: AuthService,
    private PrescriptionService: PrescriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.decodeToken().id;
    this.getAllPrescriptionByUserId();
  }

  getAllPrescriptionByUserId() {
    this.PrescriptionService.getAllPrescriptionByUserId(
      Number(this.userId)
    ).subscribe(
      (res) => {
        console.log(res.data);
        this.prescriptions = res.data;
        this.prescriptions.map((item) => {
          item.createdAt = new Date(item.createdAt).toLocaleDateString('vi');
        });
      },
      (error) => {
        console.error('Error fetching prescription medicines:', error);
        this.router.navigate(['/error']);
      }
    );
  }
}

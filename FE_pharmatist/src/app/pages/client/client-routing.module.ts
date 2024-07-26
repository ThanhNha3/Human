import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomeComponent } from './user/user-home/user-home.component';
import { DoctorHomeComponent } from './doctor/doctor-home/doctor-home.component';
import { ClientComponent } from './client.component';
import { DoctorDetailComponent } from './doctor/doctor-detail/doctor-detail.component';
import { PrescriptionHistoryDetailComponent } from './user/prescription-history-detail/prescription-history-detail.component';
import { HealthAdviceComponent } from './user/health-advice/health-advice.component';
import { UserHistoryComponent } from './user/user-history/user-history.component';
import { PharmartistHomeComponent } from './pharmartist/pharmartist-home/pharmartist-home.component';
import { PharmartistMedicineComponent } from './pharmartist/pharmartist-medicine/pharmartist-medicine.component';
import { DoctorPrescriptionComponent } from './doctor/doctor-prescription/doctor-prescription.component';
import { DoctorHistoryDetailComponent } from './doctor/doctor-history-detail/doctor-history-detail.component';
import { UserConfirmComponent } from './user/user-confirm/user-confirm.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      { path: '', component: UserHomeComponent },
      { path: 'tu-van-suc-khoe', component: HealthAdviceComponent },
      { path: 'lich-su-don-thuoc', component: UserHistoryComponent },
      { path: 'xac-nhan-thong-tin', component: UserConfirmComponent },
      { path: 'bac-si', component: DoctorHomeComponent },
      { path: 'bac-si/don-kham/:id', component: DoctorPrescriptionComponent },
      {
        path: 'bac-si/chi-tiet-don-kham/:id',
        component: DoctorDetailComponent,
      },
      {
        path: 'bac-si/lich-su-don-kham/:id',
        component: DoctorHistoryDetailComponent,
      },
      { path: 'duoc-si', component: PharmartistHomeComponent },
      {
        path: 'duoc-si/chi-tiet-don-thuoc/:id/:medicienID',
        component: PharmartistMedicineComponent,
      },
      {
        path: 'lich-su-don-thuoc/:id',
        component: PrescriptionHistoryDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}

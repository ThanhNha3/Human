import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { UserHomeComponent } from './user/user-home/user-home.component';
import { DoctorHomeComponent } from './doctor/doctor-home/doctor-home.component';

import { AudioRecorderComponent } from 'src/app/@theme/components/audio-recorder/audio-recorder.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DoctorDetailComponent } from './doctor/doctor-detail/doctor-detail.component';
import { PrescriptionHistoryDetailComponent } from './user/prescription-history-detail/prescription-history-detail.component';
import { AudioPlayerComponent } from 'src/app/@theme/components/audio-player/audio-player.component';
import { TableInlineEditComponent } from 'src/app/@theme/components/table-inline-edit/table-inline-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HealthAdviceComponent } from './user/health-advice/health-advice.component';
import { UserHistoryComponent } from './user/user-history/user-history.component';
import { PharmartistHomeComponent } from './pharmartist/pharmartist-home/pharmartist-home.component';
import { PharmartistMedicineComponent } from './pharmartist/pharmartist-medicine/pharmartist-medicine.component';
import { DoctorPrescriptionComponent } from './doctor/doctor-prescription/doctor-prescription.component';
import { JoinPipe } from 'src/app/@core/pipe/join.pipe';
import { UserConfirmComponent } from './user/user-confirm/user-confirm.component';
import { DoctorHistoryDetailComponent } from './doctor/doctor-history-detail/doctor-history-detail.component';
import { ErrorComponent } from './error/error.component';
@NgModule({
  declarations: [
    ClientComponent,
    HeaderComponent,
    FooterComponent,
    UserHomeComponent,
    DoctorHomeComponent,
    AudioRecorderComponent,
    DoctorDetailComponent,
    PrescriptionHistoryDetailComponent,
    AudioPlayerComponent,
    TableInlineEditComponent,
    HealthAdviceComponent,
    UserHistoryComponent,
    PharmartistHomeComponent,
    PharmartistMedicineComponent,
    DoctorPrescriptionComponent,
    JoinPipe,
    UserConfirmComponent,
    DoctorHistoryDetailComponent,
    ErrorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClientRoutingModule,
    NgxSpinnerModule,
    DragDropModule,
  ],
})
export class ClientModule {}

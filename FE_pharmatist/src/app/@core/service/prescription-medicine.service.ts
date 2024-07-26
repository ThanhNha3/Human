import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api-endpoint.config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionMedicineService {
  constructor(private http: HttpClient) {}

  create(data: any): Observable<any> {
    return this.http.post(API_BASE_URL + API_ENDPOINTS.user, data);
  }

  addMedicineToPrescription(data: any): Observable<any> {
    return this.http.post(
      API_BASE_URL + API_ENDPOINTS.prescription_medicine,
      data
    );
  }

  update(
    data: any,
    prescription_id: number | string,
    id: number | string
  ): Observable<any> {
    return this.http.patch(
      API_BASE_URL +
        API_ENDPOINTS.prescription_medicine +
        `/${prescription_id}/${id}`,
      data
    );
  }

  remove(
    prescription_id: number | string,
    id: number | string
  ): Observable<any> {
    return this.http.delete(
      API_BASE_URL +
        API_ENDPOINTS.prescription_medicine +
        `/${prescription_id}/${id}`
    );
  }

  confirmedPrescriptionMedicine(
    prescription_id: number | string
  ): Observable<any> {
    return this.http.patch(
      API_BASE_URL +
        API_ENDPOINTS.prescription_medicine +
        `/${prescription_id}`,
      {}
    );
  }
  // Lấy danh sách đơn thuốc
  findAll(): Observable<any> {
    return this.http.get(API_BASE_URL + API_ENDPOINTS.prescription_medicine);
  }

  //Lấy chi tiết đơn thuốc
  findByPrescriptionId(id: number, medicienID: number): Observable<any> {
    return this.http.get(
      API_BASE_URL +
        API_ENDPOINTS.prescription_medicine +
        '/' +
        id +
        '/' +
        medicienID
    );
  }
  // Dược sĩ xác nhận đã bốc thuốc
  updateStatus(id: number): Observable<any> {
    return this.http.patch(
      API_BASE_URL + API_ENDPOINTS.prescription_medicine + '/accepted/' + id,
      {}
    );
  }

  getAllMedicineByPrescriptionId(id: number): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.prescription_medicine + '/medicine/' + id
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api-endpoint.config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  constructor(private http: HttpClient) {}

  getByPrescriptionId(prescription_id: number): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.prescription.base + '?id=' + prescription_id
    );
  }

  getByStatus(status: string): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.prescription.base + `?status=${status}`
    );
  }

  getByUserIdPending(user_id: string | number): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.prescription + `/${user_id}?status=pending`
    );
  }

  getByUserIdAccepted(user_id: string | number): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.prescription + `/${user_id}?status=accepted`
    );
  }
  // Lấy chi tiết đơn thuốc của 1 người dùng
  getById(user_id: number | string, id: number): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.prescription + `/${user_id}/${id}`
    );
  }

  getPrescriptionDiagnosis(id: number): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.prescription.base + '/' + id
    );
  }
  // (4)Tạo chuẩn đoán + đơn thuốc dựa trên thông tin được truyền vào
  create(data: any): Observable<any> {
    return this.http.post(
      API_BASE_URL + API_ENDPOINTS.prescription.generate_diagnosis,
      data
    );
  }

  createDiagnosis(prescription_id: number, data: any): Observable<any> {
    return this.http.post(
      API_BASE_URL +
        API_ENDPOINTS.prescription.base +
        '/' +
        prescription_id +
        API_ENDPOINTS.prescription.sickness,
      data
    );
  }
  // (7)
  generateMedicine(data: any): Observable<any> {
    return this.http.post(
      API_BASE_URL + API_ENDPOINTS.prescription.generate_medicine,
      data
    );
  }

  deleteDiagnosis(prescription_id: number, id: number): Observable<any> {
    return this.http.delete(
      API_BASE_URL +
        API_ENDPOINTS.prescription.base +
        '/' +
        prescription_id +
        API_ENDPOINTS.prescription.sickness +
        '/' +
        id
    );
  }

  doctorAcceptPrescription(
    user_id: string | number,
    prescription_id: number,
    accepted_by: number
  ): Observable<any> {
    console.log(
      API_BASE_URL +
        API_ENDPOINTS.prescription.base +
        '/' +
        user_id +
        '/' +
        prescription_id
    );

    console.log('đang accepted prescription');

    return this.http.patch(
      API_BASE_URL +
        API_ENDPOINTS.prescription.base +
        '/' +
        user_id +
        '/' +
        prescription_id,
      { status: 'confirmed', accepted_by }
    );
  }

  pharmartistAcceptPrescription(
    user_id: string | number,
    prescription_id: number
  ): Observable<any> {
    return this.http.patch(
      API_BASE_URL +
        API_ENDPOINTS.prescription.base +
        '/' +
        user_id +
        '/' +
        prescription_id,
      { status: 'accepted' }
    );
  }

  updateOderSickness(id: number | string, data: any): Observable<any> {
    return this.http.put(
      API_BASE_URL +
        API_ENDPOINTS.prescription.base +
        `/${id}/sicknesses/order`,
      data
    );
  }
  updatePrescription(
    data: any,
    user_id: string | number,
    prescription_id: number
  ) {
    return this.http.patch(
      API_BASE_URL +
        API_ENDPOINTS.prescription.base +
        '/' +
        user_id +
        '/' +
        prescription_id,
      data
    );
  }
  getAllPrescriptionByUserId(user_id: number): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.prescription.base + '/user/' + user_id
    );
  }

  getAllSicknessByPrescriptionId(prescription_id: number): Observable<any> {
    return this.http.get(
      API_BASE_URL +
        API_ENDPOINTS.prescription.base +
        '/sicknesses/' +
        prescription_id
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api-endpoint.config';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  findMostSicknessByAgeGroup(): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.admin.base + API_ENDPOINTS.admin.findSickness
    );
  }

  findUserByAgeGroup(): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.admin.base + API_ENDPOINTS.admin.findUser
    );
  }

  getAverageByAgeGroup(): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.admin.base + API_ENDPOINTS.admin.getAverage
    );
  }
}

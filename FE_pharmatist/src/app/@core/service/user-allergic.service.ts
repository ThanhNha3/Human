import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api-endpoint.config';

@Injectable({
  providedIn: 'root',
})
export class UserAllergicService {
  constructor(private http: HttpClient) {}

  get(
    user_id: number | string,
    prescription_id: number | string,
    name: string
  ): Observable<any> {
    console.log(
      API_BASE_URL +
        API_ENDPOINTS.allergic +
        `/${user_id}` +
        `/${prescription_id}?name=${name}`
    );

    return this.http.get(
      API_BASE_URL +
        API_ENDPOINTS.allergic +
        `/${user_id}` +
        `/${prescription_id}?name=${name}`
    );
  }

  create(data: any): Observable<any> {
    return this.http.post(API_BASE_URL + API_ENDPOINTS.allergic, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  delete(user_id: number | string, id: number | string): Observable<any> {
    return this.http.delete(API_BASE_URL + API_ENDPOINTS.allergic, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, prescription_id:id }),
    });
  }

  update(
    data: any,
    user_id: number | string,
    id: number | string
  ): Observable<any> {
    return this.http.patch(
      API_BASE_URL + API_ENDPOINTS.allergic + `/${user_id}` + `/${id}`,
      data
    );
  }
}

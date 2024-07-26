import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Info {
  fullname: string;
  age: number | null;
  gender: string;
  phone: string;
  symptom: string;
  underlying_condition: string;
  allergic: string[];
}

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  private dataSource = new BehaviorSubject<Info>({
    fullname: '',
    age: null,
    gender: '',
    phone: '',
    symptom: '',
    underlying_condition: '',
    allergic: [],
  });
  currentData = this.dataSource.asObservable();

  private invalidSource = new BehaviorSubject<any>({
    isDataInvalid: false,
    isFullnameInvalid: false,
    isAgeInvalid: false,
    isPhoneInvalid: false,
    isGenderInvalid: false,
    isSymptomInvalid: false,
  });
  currentInvalidState = this.invalidSource.asObservable();

  constructor() {}

  changeData(data: Info) {
    this.dataSource.next(data);
  }

  changeInvalidState(invalidState: any) {
    this.invalidSource.next(invalidState);
  }
}

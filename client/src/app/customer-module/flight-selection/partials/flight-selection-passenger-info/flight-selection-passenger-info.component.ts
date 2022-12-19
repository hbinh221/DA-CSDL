import { Router } from '@angular/router';
import { PassengerService } from './../../../../services/passenger.service';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from 'src/app/services/location.service';
import { BehaviorSubject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FlightDataModel } from 'src/app/customer-module/models/flight-data.model';

@Component({
  selector: 'app-flight-selection-passenger-info',
  templateUrl: './flight-selection-passenger-info.component.html',
  styleUrls: ['./flight-selection-passenger-info.component.css'],
})
export class FlightSelectionPassengerInfoComponent implements OnInit {
  emailRegex: string = '^[a-z0-9A-Z/.._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  phoneRegex: string = '[0-9]+$';
  idCardRegex: string = '^[0-9]+$';
  passengerQuantity: number = 0;
  form!: FormGroup;
  flightData: FlightDataModel[] = [];
  fromLocationName: string = '';
  toLocationName: string = '';
  fromLocationCode: string = '';
  toLocationCode: string = '';
  search$ = new BehaviorSubject<string>('');
  gender: any = [
    {
      value: true,
      label: 'Nam',
    },
    {
      value: false,
      label: 'Nữ',
    },
  ];

  listLocation: any[] = [];
  passengerList: any;
  indexFromArray: number = -1;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private passengerService: PassengerService,
    protected msg: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.fetchLocation();
    this.checkIdCardForPassenger();
  }

  fetchLocation() {
    this.flightData.map((e) => {
      e.fromLocation = e.fromLocation?.substring(
        e.fromLocation.indexOf('(') + 1,
        e.fromLocation.lastIndexOf(')')
      );
      e.toLocation = e.toLocation?.substring(
        e.toLocation.indexOf('(') + 1,
        e.toLocation.lastIndexOf(')')
      );
    });
  }

  initForm() {
    this.flightData = JSON.parse(sessionStorage.getItem('flight-info')!);
    this.form = this.fb.group({
      passengerInfo: this.fb.array([]),
    });
    if (this.flightData?.length > 0) {
      this.passengerQuantity = this.flightData[0].passengerQuantity;
      for (let i = 0; i < this.passengerQuantity; i++) {
        const control: FormGroup = this.fb.group({
          firstName: [null, [Validators.required]],
          lastName: [null, [Validators.required]],
          idCard: [
            null,
            [
              Validators.required,
              Validators.minLength(9),
              Validators.maxLength(12),
              Validators.pattern(this.idCardRegex),
            ],
          ],
          birthDay: [null, [Validators.required]],
          gender: [true, [Validators.required]],
          phone: [
            null,
            [Validators.required, Validators.pattern(this.phoneRegex)],
          ],
          email: [
            null,
            [Validators.required, Validators.pattern(this.emailRegex)],
          ],
        });
        this.passengerInfo.push(control);
      }
    }
  }

  get passengerInfo(): FormArray {
    return this.form.controls.passengerInfo as FormArray;
  }

  setValueForPassenger(form: FormGroup) {
    form.get('firstName')?.setValue(this.passengerList.firstName);
    form.get('lastName')?.setValue(this.passengerList.lastName);
    form.get('gender')?.setValue(this.passengerList.gender);
    form.get('email')?.setValue(this.passengerList.email);
    form.get('birthDay')?.setValue(this.passengerList.birthDay);
    form.get('phone')?.setValue(this.passengerList.phone);
    form.get('idCard')?.setValue(this.passengerList.idCard);
  }

  checkIdCardForPassenger() {
    this.search$
      .asObservable()
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((search: string) => this.passengerService.checkIdCard(search))
      )
      .subscribe((res) => {
        if (res.code === 200) {
          this.passengerList = res.data;
          this.setValueForPassenger(
            (this.form.controls.passengerInfo as FormArray).controls[
              this.indexFromArray
            ] as FormGroup
          );
          this.passengerList = null;
        }
      });
  }

  onSearch(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    this.search$.next(target.value);
    this.indexFromArray = index;
  }

  addPasengerTmp(): void {
    let payload: any[] = [];
    payload = this.form.value?.passengerInfo;
    this.passengerService.addPassengerTmp(payload).subscribe((res) => {
      if (res.code === 200) {
        let list: any[] = [];
        list = res.data;
        list.map(e => Object.assign(e, {insuranceList: [], milkTeaList: [], baggageList: [] }));
        this.msg.success('Success');
        sessionStorage.setItem(
          'passenger-info',
          JSON.stringify(list)
        );
        this.router.navigateByUrl('/customer/passenger-service');
      }
    });
  }
}

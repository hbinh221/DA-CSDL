import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { endOfMonth } from 'date-fns';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AirlineService } from 'src/app/services/airline.service';
import { LocationService } from 'src/app/services/location.service';
@Component({
  selector: 'app-booking-flight',
  templateUrl: './booking-flight.component.html',
  styleUrls: ['./booking-flight.component.css'],
})
export class BookingFlightComponent implements OnInit {
  listLocation: any[] = [];
  sourceLocation: any[] = [];
  desLocation: any[] = [];
  form!: FormGroup;
  listAirline: any[] = [];

  ranges = {
    Today: [new Date(), new Date()],
    'This Month': [new Date(), endOfMonth(new Date())],
  };
  constructor(
    private locationService: LocationService,
    private airlineService: AirlineService,
    private fb: FormBuilder,
    private router: Router,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initForm();
    forkJoin([
      this.locationService.getLocation(),
      this.airlineService.getAirline(),
    ]).subscribe((result) => {
      this.fetchLocation(result[0]);
      this.fetchAirline(result[1]);
    });
  }

  initForm() {
    this.form = this.fb.group({
      type: [null],
      fromLocationId: [null, Validators.required],
      toLocationId: [null, Validators.required],
      flightTime: [null, Validators.required],
      passenger: [1],
      promotion: [null],
    });
    this.form.get('type')?.setValue('one-way');
  }

  fetchLocation(res: any) {
    if (res.code === 200) {
      this.listLocation = res.data;
      this.sourceLocation = [...this.listLocation];
      this.desLocation = [...this.listLocation];
    }
  }

  fetchAirline(res: any) {
    if (res.code === 200) {
      this.listAirline = [...res.data];
    }
  }

  onChangeSourceLocation(ev: any) {
    this.desLocation = [...this.listLocation];
    const index = this.listLocation.findIndex((item) => item.id === ev);
    if (index !== -1) {
      this.desLocation.splice(index, 1);
      this.desLocation = [...this.desLocation];
    }
  }

  onChangeDesLocation(ev: any) {
    this.sourceLocation = [...this.listLocation];
    const index = this.listLocation.findIndex((item) => item.id === ev);
    if (index !== -1) {
      this.sourceLocation.splice(index, 1);
      this.sourceLocation = [...this.sourceLocation];
    }
  }

  goToSelectFlight() {
    const fromDate =
      this.form.value.type === 'one-way'
        ? this.datepipe.transform(this.form.value.flightTime, 'YYYY-MM-dd')
        : this.datepipe.transform(this.form.value.flightTime[0], 'YYYY-MM-dd');
    const toDate =
      this.form.value.type === 'one-way'
        ? ''
        : this.datepipe.transform(this.form.value.flightTime[1], 'YYYY-MM-dd');
    this.router.navigate([
      'customer/flight-selection',
      this.form.value.type,
      this.form.value.fromLocationId,
      this.form.value.toLocationId,
      fromDate,
      toDate,
      this.form.value.passenger,
    ]);
  }

  addHours(numOfHours: any, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
  }
}

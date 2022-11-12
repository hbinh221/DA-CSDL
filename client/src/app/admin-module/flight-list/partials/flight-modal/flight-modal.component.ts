import { LocationService } from './../../../../services/location.service';
import { PlaneService } from './../../../../services/plane.service';
import { AirlineService } from './../../../../services/airline.service';
import { FlightService } from './../../../../services/flight.service';
import { ModelBaseComponent } from './../../../shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-flight-modal',
  templateUrl: './flight-modal.component.html',
  styleUrls: ['./flight-modal.component.css'],
})
export class FlightModalComponent extends ModelBaseComponent implements OnInit {
  airlineList: any = [];
  planeList: any = [];
  toLocationList: any = [];
  fromLocationList: any = [];
  airlineIdFilter: string = '00000000-0000-0000-0000-000000000000';
  departureTime: Date = new Date();
  landedTime: Date = new Date();

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
    private flightService: FlightService,
    private airlineService: AirlineService,
    private planeService: PlaneService,
    private locationService: LocationService,
    public datePipe: DatePipe
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
    this.getAirline();
    //this.getPlane();
    this.getLocation();
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      airlineId: [null, Validators.required],
      planeId: [null, Validators.required],
      flightNo: [null, Validators.required],
      fromLocationId: [null, Validators.required],
      toLocationId: [null, Validators.required],
      departureTime: [null, Validators.required],
      landedTime: [null, Validators.required],
      time1: [null, Validators.required],
      time2: [null, Validators.required],
      cost: [null, Validators.required],
      remark: [null, Validators.required],
    });
  }

  getAirline(): void {
    this.isLoading = true;
    this.airlineService
      .getAirline()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res.code === 200) {
          this.airlineList = res.data;
          this.airlineIdFilter = res.data[0].id;
        }
      });
  }
  log(): void {
    // this.modalForm.value.time1 = this.datePipe.transform(this.modalForm.value.time1, 'hh:mm:ss');
    // this.modalForm.value.time2 = this.datePipe.transform(this.modalForm.value.time2, 'hh:mm:ss');
  }

  getLocation(): void {
    this.isLoading = true;
    this.locationService
      .getLocation()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res.code === 200) {
          this.toLocationList = res.data;
          this.fromLocationList = res.data;
        }
      });
  }

  getPlane(): void {
    this.isLoading = true;
    this.planeService
      .getPlane('', this.airlineIdFilter)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res.code === 200) {
          this.planeList = res.data;
        }
      });
  }

  // deleteItem(): void {
  //   this.isLoading = true;
  //   this.flightService
  //     .deleteAdmin(this.modalForm.value.id)
  //     .pipe(finalize(() => (this.isLoading = false)))
  //     .subscribe((response) => {
  //       if (response.code === 200) {
  //         this.msg.success('Successfully');
  //         this.handleCancel();
  //         this.onDeleteItem.emit(response.data);
  //       } else {
  //         this.msg.warning('Failed');
  //         this.handleCancel();
  //       }
  //     });
  // }

  submitForm(): void {
    this.validateForm();
    this.isLoading = true;
    if (this.mode === 'create') {
      let payload = {
        planeId: this.modalForm.value.planeId,
        departureTime: this.createDate(this.modalForm.value.departureTime, this.modalForm.value.time1),
      };

      this.flightService
        .checkCreateFlight(payload)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((response) => {
          if (Boolean(response.data) == true) {

            this.modalForm.value.departureTime = this.createDate(this.modalForm.value.departureTime, this.modalForm.value.time1);
            this.modalForm.value.landedTime = this.createDate(this.modalForm.value.landedTime, this.modalForm.value.time2);

            this.flightService
              .createFlight(this.modalForm.value)
              .pipe(finalize(() => (this.isLoading = false)))
              .subscribe((res) => {
                if (res.code === 200) {
                  this.modalForm.reset();
                  this.msg.success('Successfully');
                  this.checkEditForm();
                  this.onCreateItem.emit(res.data);
                }
              });
          } else {
            this.msg.warning('Trùng giờ bay!');
          }
        });
    }
  }

  createDate(date: any, time: any): any {
    let dateString = '';
    dateString =
      this.datePipe.transform(date, 'dd-MM-yyyy') +
      ' ' +
      this.datePipe.transform(time, 'HH:mm:ss');
    return dateString;
  }
}

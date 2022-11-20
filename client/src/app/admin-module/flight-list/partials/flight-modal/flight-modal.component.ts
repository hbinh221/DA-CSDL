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
import { endOfMonth , setHours} from 'date-fns'
@Component({
  selector: 'app-flight-modal',
  templateUrl: './flight-modal.component.html',
  styleUrls: ['./flight-modal.component.css'],
})
export class FlightModalComponent extends ModelBaseComponent implements OnInit {
  airlineList: any = [];
  planeList: any = [];
  sourceLocation: any = [];
  desLocation: any = [];
  listLocation: any = [];
  airlineIdFilter: string = '00000000-0000-0000-0000-000000000000';
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };
  timeDefaultValue = setHours(new Date(), 0);
  disabledEndDate = (endDate: Date): boolean => {
    if (endDate > new Date()) {
      return false;
    }
    return true;
  }
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
    this.getPlane();
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
      flightTime: [null, Validators.required],
      cost: [null, Validators.required],
      remark: [null, Validators.required],
    });
  }

  openModal(data:any,mode: string, isEdit: boolean){
    this.isVisible = true;
    this.isEdit = isEdit;
    this.mode = mode;
    this.data = data;
    if(mode === 'create'){
      this.modalForm.reset();
    }
    else{
      this.modalForm.patchValue(data);
      this.modalForm.get('flightTime')?.setValue([data.departureTime, data.landedTime]);
    }
    this.checkEditForm();
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

  getLocation(): void {
    this.isLoading = true;
    this.locationService
      .getLocation()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res.code === 200) {
          this.listLocation = [...res.data];
          this.sourceLocation = [...this.listLocation];
          this.desLocation = [...this.listLocation];
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

  deleteItem(): void {
    this.isLoading = true;
    this.flightService
      .deleteFlight(this.modalForm.value.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response) => {
        if (response.code === 200) {
          this.msg.success('Successfully');
          this.handleCancel();
          this.onDeleteItem.emit(response.data);
        } else {
          this.msg.warning('Failed');
          this.handleCancel();
        }
      });
  }

  submitForm(): void {
    this.validateForm();
    this.isLoading = true;
    if (this.mode === 'create') {
      let payload = {
        planeId: this.modalForm.value.planeId,
        departureTime: this.modalForm.value.flightTime[0],
        landedTime: this.modalForm.value.flightTime[1]
      };

      this.flightService
        .checkCreateFlight(payload)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((response) => {
          if (Boolean(response.data) == true) {
            this.flightService
              .createFlight(this.modalForm.value)
              .pipe(finalize(() => (this.isLoading = false)))
              .subscribe((res) => {
                if (res.code === 200) {
                  this.modalForm.reset();
                  this.msg.success('Successfully');
                  this.checkEditForm();
                  this.handleCancel();
                  this.onCreateItem.emit(res.data);
                }
              });
          } else {
            this.msg.warning('Trùng giờ bay!');
          }
        });
    }
  }

  onChangeSourceLocation(ev: any){
    this.desLocation = [...this.listLocation];
      const index = this.listLocation.findIndex((item:any) => item.id === ev);
      if(index !== -1){
        this.desLocation.splice(index, 1);
        this.desLocation = [...this.desLocation];
      }
  }

  onChangeDesLocation(ev:any){
    this.sourceLocation = [...this.listLocation];
    const index = this.listLocation.findIndex((item:any) => item.id === ev);
    if(index !== -1){
      this.sourceLocation.splice(index, 1);
      this.sourceLocation = [...this.sourceLocation];
    }
  }
}

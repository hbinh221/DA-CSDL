import { map } from 'rxjs/operators';
import { PassengerInforModel } from './../../../../../models/passenger-infor.model';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModelBaseComponent } from 'src/app/admin-module/shared/modal-base/modal-base.component';
import { FlightDataModel } from 'src/app/customer-module/models/flight-data.model';

@Component({
  selector: 'app-passenger-service-milk-tea-modal',
  templateUrl: './passenger-service-milk-tea-modal.component.html',
  styleUrls: ['./passenger-service-milk-tea-modal.component.css'],
})
export class PassengerServiceMilkTeaModalComponent
  extends ModelBaseComponent
  implements OnInit
{
  @Input() passengerInfo: PassengerInforModel[] = [];
  @Input() flightData: FlightDataModel[] = [];
  @Input() milkTeaList: any[] = [];
  @Output() isChooseMilkTea = new EventEmitter();

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
    this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!);
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
      remark: [null],
    });
  }

  closeModal() {
    this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!);
    this.isChooseMilkTea.emit();
    this.handleCancel();
  }

  addToCart() {
    sessionStorage.setItem(
      'passenger-info',
      JSON.stringify(this.passengerInfo)
    );
    this.isChooseMilkTea.emit();
    this.handleCancel();
  }

  addMilkTea(passengerId: string, flightId: string, milkTeaId: string): void {
    this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!);
    let passenger: PassengerInforModel;
    passenger = this.passengerInfo.find(e => e.id === passengerId)!;
    passenger.milkTeaList.map(e => {
      if (e.id === milkTeaId && e.flightId === flightId) {
        e.isChoose = !e.isChoose
      }
    })
    this.passengerInfo.map(e => e.id == passengerId ? e = Object.assign(passenger) : null);
    sessionStorage.setItem('passenger-info', JSON.stringify(this.passengerInfo));
  }
}

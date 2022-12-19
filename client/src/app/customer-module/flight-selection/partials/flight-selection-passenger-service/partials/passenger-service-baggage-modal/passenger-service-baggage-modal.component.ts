import { ModelBaseComponent } from './../../../../../../admin-module/shared/modal-base/modal-base.component';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PassengerInforModel } from 'src/app/customer-module/models/passenger-infor.model';
import { FlightDataModel } from 'src/app/customer-module/models/flight-data.model';

@Component({
  selector: 'app-passenger-service-baggage-modal',
  templateUrl: './passenger-service-baggage-modal.component.html',
  styleUrls: ['./passenger-service-baggage-modal.component.css'],
})
export class PassengerServiceBaggageModalComponent
  extends ModelBaseComponent
  implements OnInit
{
  @Input() passengerInfo: PassengerInforModel[] = [];
  @Input() flightData: FlightDataModel[] = [];
  @Input() baggageList: any[] = [];
  @Output() isChooseBaggage  = new EventEmitter();

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

  closeModal() {
    this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!);
    this.isChooseBaggage.emit();
    this.handleCancel();
  }

  addToCart() {
    sessionStorage.setItem('passenger-info', JSON.stringify(this.passengerInfo));
    this.isChooseBaggage.emit();
    this.handleCancel();
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

  addBaggage(id: string, passengerId: string, flightId: string): void {
    let baggage: Object;
    baggage = this.baggageList.find((e) => (e.id == id));
    this.passengerInfo.map((e) => {
      if(e.id == passengerId ) {
        (e.baggageList as any[]).push({ ...baggage, flightId: this.flightData.find(e => e.id == flightId)?.id})
      }
    }
    );
  }

  minusBaggage(id: string, passengerId: string): void {
    let baggage: Object;
    baggage = this.baggageList.find((e) => (e.id == id));
    this.passengerInfo.map((e) => {
      if(e.id == passengerId) {
        let index = -1;
        index = e.baggageList.indexOf((e.baggageList as any[]).find(e => e.id == id));
        if(index > -1) {
          e.baggageList.splice(index, 1);
        }
      }
    });
  }

  calcCostBaggage(passengerId: string, flightId: string) {
    //this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!);
    let sum = 0;
    let passenger = this.passengerInfo.some(e => e.id == passengerId);
    if(passenger) {
      let list = this.passengerInfo.find(e => e.id == passengerId)?.baggageList;
      list?.map(e => e.flightId == flightId ? sum += e.cost : null);
    }
    return sum;
  }

  countBaggage(id: string, passengerId: string, flightId: string) {
    //this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!);
    let count = 0;
    let passenger = this.passengerInfo.some(e => e.id == passengerId);
    if(passenger) {
      let list = this.passengerInfo.find(e => e.id == passengerId)?.baggageList;
      list?.map(e => e.id == id && e.flightId == flightId ? count ++ : null);
    }
    return count;
  }
}

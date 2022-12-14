import { ModelBaseComponent } from './../../../../../../admin-module/shared/modal-base/modal-base.component';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-passenger-service-baggage-modal',
  templateUrl: './passenger-service-baggage-modal.component.html',
  styleUrls: ['./passenger-service-baggage-modal.component.css'],
})
export class PassengerServiceBaggageModalComponent
  extends ModelBaseComponent
  implements OnInit
{
  @Input() passengerInfo: any[] = [];
  @Input() flightData: any[] = [];
  @Input() baggageList: any[] = [];
  @Output() isChooseBaggage  = new EventEmitter();
  passengerList: any[] = [];

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
    this.passengerList = JSON.parse(sessionStorage.getItem('passenger-info')!);
  }

  closeModal() {
    let list = [];
    list = JSON.parse(sessionStorage.getItem('passenger-info')!);
    (list as any[]).map(e => e.baggageList = []);
    sessionStorage.setItem(
      'passenger-info',
      JSON.stringify(list)
    );
    this.isChooseBaggage.emit();
    this.handleCancel();
  }

  addToCart() {
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
    this.passengerList = JSON.parse(sessionStorage.getItem('passenger-info')!);
    let baggage: Object;
    baggage = this.baggageList.find((e) => (e.id == id));
    this.passengerList.map((e) => {
      if(e.id == passengerId ) {
        (e.baggageList as any[]).push({ ...baggage, flightId: this.flightData.find(e => e.id == flightId)})
      }
    }
    );
    sessionStorage.setItem('passenger-info', JSON.stringify(this.passengerList));
  }

  minusBaggage(id: string, passengerId: string): void {
    this.passengerList = JSON.parse(sessionStorage.getItem('passenger-info')!);
    let baggage: Object;
    baggage = this.baggageList.find((e) => (e.id == id));
    this.passengerList.map((e) => {
      if(e.id == passengerId) {
        let index = -1;
        index = e.baggageList.indexOf((e.baggageList as any[]).find(e => e.id == id));
        if(index > -1) {
          e.baggageList.splice(index, 1);
        }
      }
    });
    sessionStorage.setItem('passenger-info', JSON.stringify(this.passengerList));
  }

  calcCostBaggage(passengerId: string, flightId: string) {
    this.passengerList = JSON.parse(sessionStorage.getItem('passenger-info')!);
    let sum = 0;
    let passenger = this.passengerList.some(e => e.id == passengerId);
    if(passenger) {
      let list = this.passengerList.find(e => e.id == passengerId).baggageList as any[];
      list.map(e => e.flightId.id == flightId ? sum += e.cost : null);
    }
    return sum;
  }

  countBaggage(id: string, passengerId: string, flightId: string) {
    this.passengerList = JSON.parse(sessionStorage.getItem('passenger-info')!);
    let count = 0;
    let passenger = this.passengerList.some(e => e.id == passengerId);
    if(passenger) {
      let list = this.passengerList.find(e => e.id == passengerId).baggageList as any[];
      list.map(e => e.id == id && e.flightId.id == flightId ? count ++ : null);
    }
    return count;
  }
}

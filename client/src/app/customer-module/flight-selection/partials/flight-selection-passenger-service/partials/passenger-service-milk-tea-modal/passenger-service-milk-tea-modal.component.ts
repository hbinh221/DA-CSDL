import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModelBaseComponent } from 'src/app/admin-module/shared/modal-base/modal-base.component';

@Component({
  selector: 'app-passenger-service-milk-tea-modal',
  templateUrl: './passenger-service-milk-tea-modal.component.html',
  styleUrls: ['./passenger-service-milk-tea-modal.component.css']
})
export class PassengerServiceMilkTeaModalComponent extends ModelBaseComponent  implements OnInit {
  @Input() passengerInfo: any[] = [];
  @Input() flightData: any[] = [];
  @Input() milkTeaList: any[] = [];
  passengerList: any[] = [];

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
    this.passengerList.map((e) => Object.assign(e, { milkTeaList: [] }));
    sessionStorage.setItem('passenger-info', JSON.stringify(this.passengerList));
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

  addBaggage(id: string, passengerId: string): void {
    let baggage: Object;
    baggage = this.milkTeaList.find((e) => (e.id == id));
    this.passengerList.map((e) => {
      if(e.id == passengerId ) {
        (e.baggageList as any[]).push({ ...baggage, flightId: this.flightData })
      }
    }
    );
    sessionStorage.setItem('passenger-info', JSON.stringify(this.passengerList));
  }

  minusBaggage(id: string, passengerId: string): void {
    let baggage: Object;
    baggage = this.milkTeaList.find((e) => (e.id == id));
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
}

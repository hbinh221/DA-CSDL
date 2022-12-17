import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModelBaseComponent } from 'src/app/admin-module/shared/modal-base/modal-base.component';

@Component({
  selector: 'app-passenger-service-milk-tea-modal',
  templateUrl: './passenger-service-milk-tea-modal.component.html',
  styleUrls: ['./passenger-service-milk-tea-modal.component.css'],
})
export class PassengerServiceMilkTeaModalComponent
  extends ModelBaseComponent
  implements OnInit
{
  @Input() passengerInfo: any[] = [];
  @Input() flightData: any[] = [];
  @Input() milkTeaList: any[] = [];
  @Output() isChooseMilkTea = new EventEmitter();
  passengerList: any[] = [];
  passengerId: string = '';

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
    this.passengerId = this.passengerList[0].id;
    this.milkTeaList.map(e => Object.assign(e, {isChoose: false}))
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
    let list = [];
    list = JSON.parse(sessionStorage.getItem('passenger-info')!);
    (list as any[]).map(e => e.milkTeaList = []);
    sessionStorage.setItem(
      'passenger-info',
      JSON.stringify(list)
    );
    this.isChooseMilkTea.emit();
    this.handleCancel()
  }

  addToCart() {
    this.isChooseMilkTea.emit();
    this.handleCancel();
  }

  changePassengerId(passengerId: string) {
    this.passengerId = passengerId;
  }

  addMilkTea(id: string, flightId: string, isChoose: boolean): void {
    if (isChoose) {
      let milkTea: Object;
      milkTea = this.milkTeaList.find((e) => e.id == id);
      this.passengerList.map((e) => {
        if (e.id == this.passengerId) {
          (e.milkTeaList as any[]).push({
            ...milkTea,
            flightId: this.flightData.find((e) => e.id == flightId),
          });
        }
      });
      sessionStorage.setItem(
        'passenger-info',
        JSON.stringify(this.passengerList)
      );
    } else {
      let milkTea: Object;
      milkTea = this.milkTeaList.find((e) => e.id == id);
      this.passengerList.map((e) => {
        if (e.id == this.passengerId) {
          let index = -1;
          index = e.milkTeaList.indexOf(
            (e.milkTeaList as any[]).find((e) => e.id == id)
          );
          if (index > -1) {
            e.milkTeaList.splice(index, 1);
          }
        }
      });
      sessionStorage.setItem(
        'passenger-info',
        JSON.stringify(this.passengerList)
      );
    }
  }
}

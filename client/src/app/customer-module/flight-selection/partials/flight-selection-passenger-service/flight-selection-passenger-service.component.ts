import { ServiceService } from './../../../../services/service.service';
import { ListBaseComponent } from './../../../../admin-module/shared/list-base/list-base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModelBaseComponent } from 'src/app/admin-module/shared/modal-base/modal-base.component';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-flight-selection-passenger-service',
  templateUrl: './flight-selection-passenger-service.component.html',
  styleUrls: ['./flight-selection-passenger-service.component.css'],
})
export class FlightSelectionPassengerServiceComponent
  extends ListBaseComponent
  implements OnInit
{
  @ViewChild('baggageModal') baggageModal!: ModelBaseComponent;
  @ViewChild('milkTeaModal') milkTeaModal!: ModelBaseComponent;

  flightData: any[] = [];
  passengerInfo: any[] = [];
  serviceList: any[] = [];
  milkTeaList: any[] = [];
  baggageList: any[] = [];
  isInsurance: boolean = false;
  isBaggage: boolean = false;
  isMilkTea: boolean = false;


  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private serviceService: ServiceService
  ) {
    super(router, message);
  }

  ngOnInit(): void {
    this.flightData = JSON.parse(sessionStorage.getItem('flight-info')!);
    this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!)
    this.fetchService();
  }

  fetchService(): void {
    this.serviceService.getService('','9067217F-5674-ED11-BE98-484D7EF0B796', '').subscribe(res => {
      if(res.code === 200) {
        this.serviceList = res.data;
        this.baggageList = (res.data as any[]).filter(e => e.parentId != null);
        this.milkTeaList = (res.data as any[]).filter(e => (e.serviceName as string).includes('Trà sữa trân châu vị'));
        this.milkTeaList.map(e => Object.assign(e, {isChoose: false}))
      }
    })
  }

  showBaggageModal() {
    this.baggageModal.openModal(null, 'create', true);
  }

  showMilkTeaModal() {
    this.milkTeaModal.openModal(null, 'create', true);
  }

  chooseInsurance(id: string) {
    this.isInsurance = !this.isInsurance;
    if(this.isInsurance) {
      let insurance: any;
      insurance = this.serviceList.find(e => e.id == id);
      this.passengerInfo.map(e => (e.serviceList as any[]).push({...insurance, flightId: this.flightData}))
    } else {
      let insurance: any;
      insurance = this.serviceList.find(e => e.id == id);
      this.passengerInfo.map(e =>
        {
            e.serviceList = (e.serviceList as any[]).filter(e => e.id != insurance.id);
        })
    }
    sessionStorage.setItem('passenger-info', JSON.stringify(this.passengerInfo));
  }

  chooseMilkTea() {
    let list = [];
    list = JSON.parse(sessionStorage.getItem('passenger-info')!);
    (list.milkTeaList as any[])?.length > 0 ? this.isMilkTea = true : this.isMilkTea = false;
  }

  chooseBaggage() {
    let list = [];
    list = JSON.parse(sessionStorage.getItem('passenger-info')!);
    (list.baggageList as any[])?.length > 0 ? this.isBaggage = true : this.isBaggage = false;
  }
}

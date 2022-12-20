import { ServiceService } from './../../../../services/service.service';
import { ListBaseComponent } from './../../../../admin-module/shared/list-base/list-base.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModelBaseComponent } from 'src/app/admin-module/shared/modal-base/modal-base.component';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FlightService } from 'src/app/services/flight.service';
import { PassengerInforModel } from 'src/app/customer-module/models/passenger-infor.model';
import { ServiceDataModel } from 'src/app/customer-module/models/service-data.model';
import { FlightDataModel } from 'src/app/customer-module/models/flight-data.model';

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

  flightData: FlightDataModel[] = [];
  passengerInfo: PassengerInforModel[] = [];
  serviceList: any[] = [];
  milkTeaList: ServiceDataModel[] = [];
  baggageList: ServiceDataModel[] = [];
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
    this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!);
    this.fetchService();
  }

  fetchService(): void {
    this.serviceService.getService('','9067217F-5674-ED11-BE98-484D7EF0B796', '').subscribe((res: {code: number, data: ServiceDataModel[]}) => {
      if(res.code === 200) {
        this.serviceList = res.data;
        this.baggageList = res.data.filter(e => e.parentId != null);
        this.milkTeaList = res.data.filter(e => (e.serviceName as string).includes('Trà sữa trân châu vị'));
        let list = [] as any[]
        let list1 = [] as any[]
        if (this.flightData.length !== 0) {
          list = [{...this.milkTeaList[0], isChoose: false, flightId: this.flightData[0].id},
            {...this.milkTeaList[1], isChoose: false, flightId: this.flightData[0].id}]
          if (this.flightData.length === 2) {
            list1 = [{...this.milkTeaList[0], isChoose: false, flightId: this.flightData[1].id},
            {...this.milkTeaList[1], isChoose: false, flightId: this.flightData[1].id}]
          }
          this.passengerInfo.map(e => e.milkTeaList = list.concat(list1));
        }

        sessionStorage.setItem(
          'passenger-info',
          JSON.stringify(this.passengerInfo)
        );
      }
    })
  }

  showBaggageModal() {
    this.baggageModal.openModal(null, 'create', true);
  }

  showMilkTeaModal() {
    this.milkTeaModal.openModal(null, 'create', true);
  }

  chooseInsurance(id: string | undefined) {
    this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!);
    this.isInsurance = !this.isInsurance;
    if(this.isInsurance) {
      let insurance: any;
      insurance = this.serviceList.find(e => e.id == id);
      let list = this.flightData.length !== 1 ? [ this.flightData[0].id, this.flightData[1].id] : [ this.flightData[0].id];
      this.passengerInfo.map(e => (e.insuranceList as any[]).push({...insurance, flightId: list}))
    } else {
      let insurance: any;
      insurance = this.serviceList.find(e => e.id == id);
      this.passengerInfo.map(e =>
        {
            e.insuranceList = (e.insuranceList as any[]).filter(e => e.id != insurance.id);
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

  chooseTicket() {
    this.router.navigateByUrl('/customer/passenger-ticket');
  }
}

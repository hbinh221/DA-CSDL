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

  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private flightService: FlightService
  ) {
    super(router, message);
  }

  ngOnInit(): void {
    this.flightData = JSON.parse(sessionStorage.getItem('flight-info')!);
    this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!)
  }

  goToCreate() {
    this.baggageModal.openModal(null, 'create', true);
  }

  show() {
    this.milkTeaModal.openModal(null, 'create', true);
  }

}

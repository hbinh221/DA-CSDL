import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AirlineService } from 'src/app/services/airline.service';
import { ListBaseComponent } from '../shared/list-base/list-base.component';

@Component({
  selector: 'app-airline-list',
  templateUrl: './airline-list.component.html',
  styleUrls: ['./airline-list.component.css'],
})
export class AirlineListComponent extends ListBaseComponent {
  listOfColumns: any[] = [
    {
      name: 'Airline Name',
    },
  ];
  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private airlineService: AirlineService
  ) {
    super(router, message);
  }

  fetchData(): void {
    this.isLoading = true;
    this.airlineService.getAirline().subscribe((res) => {
      if (res) {
        this.listOfData = res;
        this.isLoading = false;
      }
    });
  }
}

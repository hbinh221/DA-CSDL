import { FlightService } from './../../services/flight.service';
import { ListBaseComponent } from './../shared/list-base/list-base.component';
import { Component, HostListener } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent extends ListBaseComponent {
  listOfColumns: any[] = [
    {
      name: 'Airline Name',
    },
    {
      name: 'PlaneName',
    },
    {
      name: 'FlightNo',
    },
    {
      name: 'SeatQuantity',
    },
    {
      name: 'From',
    },
    {
      name: 'To',
    },
    {
      name: 'StartTime',
    },
    {
      name: 'LandedTime',
    },
    {
      name: 'Cost',
    },
   
  ];

  scrollY!: string;

  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private flightService: FlightService
  ) {
    super(router, message);
  }

  ngAfterViewInit() {
    this.calculateHeightBodyTable();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateHeightBodyTable();
  }

  calculateHeightBodyTable() {
    // this.titleHeight = document.getElementsByClassName('ant-table-title')[0].clientHeight;
    // this.footerHeight = document.getElementsByClassName('ant-table-footer')[0].clientHeight;
    // this.headerHeight = document.getElementsByClassName('ant-table-thead')[0].clientHeight;
    this.scrollY = `calc(100vh - 300px)`;
  }

  trackByMethod(index: number, el: any): number {
    return el.id;
  }

  fetchData(): void {
    this.isLoading = true;
    this.flightService
      .getFlight()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res.code === 200) {
          this.listOfData = res.data;
        }
      });
  }

}

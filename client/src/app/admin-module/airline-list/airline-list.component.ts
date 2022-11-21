import { finalize } from 'rxjs/operators';
import { Component, HostListener, OnInit } from '@angular/core';
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

  scrollY!: string;
  searchValue: string = '';
  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private airlineService: AirlineService
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

  fetchData(search?: string): void {
    this.isLoading = true;
    this.airlineService
      .getAirline('', search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res.code === 200) {
          this.listOfData = res.data;
        }
      });
  }
  search() {
    this.fetchData(this.searchValue);
  }
}

import { PassengerService } from './../../services/passenger.service';
import { ListBaseComponent } from './../shared/list-base/list-base.component';
import { Component, HostListener } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-passenger-list',
  templateUrl: './passenger-list.component.html',
  styleUrls: ['./passenger-list.component.css']
})
export class PassengerListComponent extends ListBaseComponent {
  listOfColumns: any[] = [
    {
      name: 'Name',
    },
    {
      name: ' IdCard',
    },
    {
      name: 'Birth Day',
    },
    {
      name: 'Gender',
    },
    {
      name: 'Phone',
    },
    {
      name: 'Email',
    },
  ];

  scrollY!: string;

  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private passengerService: PassengerService
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
    this.passengerService
      .getAdmin()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res.code === 200) {
          this.listOfData = res.data;
        }
      });
  }

}

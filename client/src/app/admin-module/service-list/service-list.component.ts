import { ListBaseComponent } from './../shared/list-base/list-base.component';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ServiceService } from 'src/app/services/service.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent extends ListBaseComponent implements OnInit {

  listOfColumns: any[] = [
    {
      name: 'Service Name',
    },
    {
      name: ' Cost',
    },
    {
      name: 'Airline Name',
    }
  ];

  scrollY!: string;

  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private serviceService: ServiceService
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
    this.serviceService
      .getService()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res.code === 200) {
          this.listOfData = res.data;
        }
      });
  }

}

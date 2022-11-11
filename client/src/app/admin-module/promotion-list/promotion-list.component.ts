import { NzMessageService } from 'ng-zorro-antd/message';
import { ListBaseComponent } from './../shared/list-base/list-base.component';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PromotionService } from 'src/app/services/promotion.service';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.css'],
})
export class PromotionListComponent extends ListBaseComponent {
  listOfColumns: any[] = [
    {
      name: 'Location Name',
    },
    {
      name: 'Start Date',
    },
    {
      name: 'End Date',
    },
    {
      name: 'Discount',
    },
  ];
  scrollY!: string;

  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private promotionService: PromotionService
  ) {
    super(router, message);
  }

  ngAfterViewInit(){
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

  trackByMethod(index:number, el:any): number {
    return el.id;
  }

  fetchData() {
    this.isLoading = true;
    this.promotionService.getPromotion().subscribe((res) => {
      if (res) {
        this.listOfData = res;
        this.isLoading = false;
      }
    });
  }
}

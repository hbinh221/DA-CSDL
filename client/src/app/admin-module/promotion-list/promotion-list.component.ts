import { NzMessageService } from 'ng-zorro-antd/message';
import { ListBaseComponent } from './../shared/list-base/list-base.component';
import { Component } from '@angular/core';
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
  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private promotionService: PromotionService
  ) {
    super(router, message);
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

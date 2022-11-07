import { ListBaseComponent } from './../shared/list-base/list-base.component';
import { PaymentService } from './../../services/payment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css'],
})
export class PaymentListComponent extends ListBaseComponent {
  listOfColumns: any[] = [
    {
      name: 'Payment Name',
    },
  ];
  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private paymentService: PaymentService
  ) {
    super(router, message);
  }
  fetchData() {
    this.isLoading = true;
    this.paymentService.getPayment().subscribe((res) => {
      if (res) {
        this.listOfData = res;
        this.isLoading = false;
      }
    });
  }
}

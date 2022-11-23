import { ListBaseComponent } from './../shared/list-base/list-base.component';
import { PaymentService } from './../../services/payment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css'],
})
export class PaymentListComponent extends ListBaseComponent {

  listOfColumns: any[] = [
    {
      name: 'Payment Type',
    },
  ];
  scrollY!: string;
  search$ = new BehaviorSubject<string>("");
  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private paymentService: PaymentService
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

  fetchData(search?: string) {
    this.isLoading = true;
    this.search$.asObservable().pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((search: string) => this.paymentService.getPayment('', search).pipe(
      finalize(() => this.isLoading = false))
      )
    ).subscribe(res => {
      if(res.code === 200){
        this.listOfData = [...res.data];
      }
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isLoading = true;
    this.search$.next(target.value);
  }
}

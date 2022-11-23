import { debounceTime, distinctUntilChanged, finalize, switchMap, throttleTime } from 'rxjs/operators';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AirlineService } from 'src/app/services/airline.service';
import { ListBaseComponent } from '../shared/list-base/list-base.component';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-airline-list',
  templateUrl: './airline-list.component.html',
  styleUrls: ['./airline-list.component.css'],
})
export class AirlineListComponent extends ListBaseComponent {
  search$ = new BehaviorSubject<string>("");
  listOfColumns: any[] = [
    {
      name: 'Airline Name',
    },
  ];

  scrollY!: string;
  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private airlineService: AirlineService
  ) {
    super(router, message);
  }

  ngOnInit() {
    this.fetchData();
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
    this.search$.asObservable().pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((search: string) => this.airlineService.getAirline('', search).pipe(
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

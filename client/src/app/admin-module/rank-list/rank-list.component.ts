import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { ListBaseComponent } from './../shared/list-base/list-base.component';
import { Component, HostListener } from '@angular/core';
import { RankService } from 'src/app/services/rank.service';
import { debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-rank-list',
  templateUrl: './rank-list.component.html',
  styleUrls: ['./rank-list.component.css'],
})
export class RankListComponent extends ListBaseComponent {
  listOfColumns: any[] = [
    {
      name: 'Rank Name',
    },
    {
      name: 'Cost',
    },
    {
      name: 'Baggage Weight',
    },
  ];
  scrollY!: string;
  search$ = new BehaviorSubject<string>("");

  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private rankService: RankService
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

  fetchData(search?: string) {
    this.isLoading = true;
    this.search$.asObservable().pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((search: string) => this.rankService.getRank('', search).pipe(
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

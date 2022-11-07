import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { ListBaseComponent } from './../shared/list-base/list-base.component';
import { Component } from '@angular/core';
import { RankService } from 'src/app/services/rank.service';

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
  constructor(
    protected router: Router,
    protected message: NzMessageService,
    private rankService: RankService
  ) {
    super(router, message);
  }

  fetchData() {
    this.isLoading = true;
    this.rankService.getRank().subscribe((res) => {
      if (res) {
        this.listOfData = res;
        this.isLoading = false;
      }
    });
  }
}

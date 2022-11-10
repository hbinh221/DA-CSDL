import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-list-base',
  templateUrl: './list-base.component.html',
  styleUrls: ['./list-base.component.css']
})
export class ListBaseComponent implements OnInit {
  listOfColumns: any[] = [];
  totalPages: number = 0;
  listOfData: any[] = [];
  isLoading: boolean = false;
  constructor(protected router: Router,
    protected message: NzMessageService,) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(){}

  goToCreate(){}

  async goToDetail(data: any){}

  async goToEdit(data: any){}


  

}

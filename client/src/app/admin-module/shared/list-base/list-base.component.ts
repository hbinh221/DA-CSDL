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

  constructor(private router: Router,
    private message: NzMessageService,) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(){}

  goToCreate(){}

  goToDetail(){}

  goToEdit(){}


  

}

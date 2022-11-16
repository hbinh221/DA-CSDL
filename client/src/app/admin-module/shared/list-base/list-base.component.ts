import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModelBaseComponent } from '../modal-base/modal-base.component';

@Component({
  selector: 'app-list-base',
  templateUrl: './list-base.component.html',
  styleUrls: ['./list-base.component.css']
})
export class ListBaseComponent implements OnInit {
  @ViewChild('modalBase') modalBase!: ModelBaseComponent;
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

  goToCreate(){
    this.modalBase.openModal(null, 'create',true);
  }


  async goToEdit(data: any){}


   goToDetail(data: string) {
    this.modalBase.openModal(data, 'detail', false);
  }

  onDeleteItem(data: any){
    let index = this.listOfData.findIndex((item) => item.id == data.id);
    this.listOfData.splice(index, 1);
    this.listOfData = [...this.listOfData];
  }

  onCreateItem(data: any){
    this.listOfData = [...this.listOfData, data];
  }

  async onUpdateItem(data: any) {
    this.listOfData.splice(
      this.listOfData.findIndex((item) => item.id === data.id),
      1,
      data,
    );
    this.listOfData = [...this.listOfData];
  }
}

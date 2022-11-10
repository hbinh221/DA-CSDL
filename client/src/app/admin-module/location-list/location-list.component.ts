import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LocationService } from 'src/app/services/location.service';
import { ListBaseComponent } from '../shared/list-base/list-base.component';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css']
})
export class LocationListComponent extends ListBaseComponent {
  listOfColumns: any[] = [
    {
      name: 'Location Name',
    },
  ];
  scrollY!: string;
  constructor(injector: Injector,protected router: Router,
    protected message: NzMessageService,
    private locationService: LocationService) {
    super(router,message);
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
     this.locationService.getLocation().subscribe(res=>{
      if(res){
        this.listOfData = res;
        this.isLoading = false;
      }
     });
  }
  
}

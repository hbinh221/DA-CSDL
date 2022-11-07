import { Component, Injector, OnInit } from '@angular/core';
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
  constructor(injector: Injector,protected router: Router,
    protected message: NzMessageService,
    private locationService: LocationService) {
    super(router,message);
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

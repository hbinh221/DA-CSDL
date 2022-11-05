import { Component, OnInit } from '@angular/core';
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

  
}

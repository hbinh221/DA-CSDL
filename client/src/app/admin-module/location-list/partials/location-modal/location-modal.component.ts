import { Component, OnInit, Output } from '@angular/core';
import { ModelBaseComponent } from 'src/app/admin-module/shared/modal-base/modal-base.component';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.css']
})
export class LocationModalComponent extends ModelBaseComponent implements OnInit {

  constructor(private locationService: LocationService,
    ) {
    super();
  }

  ngOnInit(): void {
    this.initForm()
  }

  initForm(){}

  


}

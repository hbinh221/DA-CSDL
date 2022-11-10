import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { endOfMonth } from 'date-fns'
import { LocationService } from 'src/app/services/location.service';
@Component({
  selector: 'app-booking-flight',
  templateUrl: './booking-flight.component.html',
  styleUrls: ['./booking-flight.component.css']
})
export class BookingFlightComponent implements OnInit {
  listLocation: any[] = [];
  sourceLocation: any[] = [];
  desLocation: any[] = [];
  form!: FormGroup;

  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };
  constructor(private locationService: LocationService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fetchLocation();
    this.initForm();
  }

  initForm(){
    this.form = this.fb.group({
      type: [null],
      fromLocationId: [null, Validators.required],
      toLocationId: [null, Validators.required],
      flightTime: [null, Validators.required],
      passenger: [1],
      promotion: [null]

    })
    this.form.get('type')?.setValue('one-way');
  }

  fetchLocation(){
    this.locationService.getLocation().subscribe(res => {
        this.listLocation = res;
        this.sourceLocation = [...this.listLocation];
        this.desLocation = [...this.listLocation];
    })
  }

  onChangeSourceLocation(ev: any){
    this.desLocation = [...this.listLocation];
      const index = this.listLocation.findIndex(item => item.id === ev);
      if(index !== -1){
        this.desLocation.splice(index, 1);
        this.desLocation = [...this.desLocation];
      }
  }

  onChangeDesLocation(ev:any){
    this.sourceLocation = [...this.listLocation];
    const index = this.listLocation.findIndex(item => item.id === ev);
    if(index !== -1){
      this.sourceLocation.splice(index, 1);
      this.sourceLocation = [...this.sourceLocation];
    }
  }

}

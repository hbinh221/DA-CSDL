import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-flight-selection-passenger-info',
  templateUrl: './flight-selection-passenger-info.component.html',
  styleUrls: ['./flight-selection-passenger-info.component.css']
})
export class FlightSelectionPassengerInfoComponent implements OnInit {
  passengerQuantity: number = 0;
  form!: FormGroup;
  flightData: any[] = [];
  fromLocationName: string = '';
  toLocationName: string = '';
  fromLocationCode: string = '';
  toLocationCode: string = '';

  listLocation: any[] = [];
  constructor(private fb: FormBuilder, private locationService: LocationService) { }

  async ngOnInit() {
    this.initForm();
   await this.fetchLocation()
    this.fetchData();
  }

  fetchData(){
    this.fromLocationName = this.listLocation?.find(location => location.id === this.flightData[0].fromLocationId)?.locationName;
    this.toLocationName = this.listLocation?.find(location => location.id === this.flightData[0].toLocationId)?.locationName;
    this.fromLocationCode = this.fromLocationName?.substring(
      this.fromLocationName.indexOf('(') + 1,
      this.fromLocationName.lastIndexOf(')')
    );
    this.toLocationCode = this.toLocationName?.substring(
      this.toLocationName.indexOf('(') + 1,
      this.toLocationName.lastIndexOf(')')
    );
  }

 async fetchLocation() {
   await this.locationService.getLocation().toPromise().then(res => {
      if(res.code === 200){
        this.listLocation = res.data
      }
    })
}

  initForm(){
    this.flightData = JSON.parse(localStorage.getItem('flight-info')!);
    this.form = this.fb.group({
      passengerInfo: this.fb.array([])
    })
    if(this.flightData?.length > 0){
      this.passengerQuantity = this.flightData[0].passengerQuantity
      for(let i = 0; i< this.passengerQuantity; i++){
        const control: FormGroup = this.fb.group({
          firstName: [null, [Validators.email, Validators.required]],
          lastName: [null, [Validators.required]],
          idCard: [null, [Validators.required,Validators.minLength(9) ,Validators.maxLength(12)]],
          birthday: [null, [Validators.required]],
          gender: [false],
          phone: [null, [Validators.required, Validators.pattern('2')]],
          email: [null, [Validators.required, Validators.pattern('2')]],
          // password: [null, [Validators.required]],
          // checkPassword: [null, [Validators.required,this.confirmationValidator]],
        })
        this.passengerInfo.push(control);
      }
    }
  }

  get passengerInfo(): FormArray {
    return this.form.controls.passengerInfo as FormArray;
  }

}

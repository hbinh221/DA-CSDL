import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-selection-passenger-info',
  templateUrl: './flight-selection-passenger-info.component.html',
  styleUrls: ['./flight-selection-passenger-info.component.css']
})
export class FlightSelectionPassengerInfoComponent implements OnInit {
  passengerQuantity: number = 0;
  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem('flight-info')){
      this.passengerQuantity = JSON.parse(localStorage.getItem('flight-info')!)[0].passengerQuantity
    }
  }

}

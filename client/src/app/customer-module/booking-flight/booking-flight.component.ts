import { Component, OnInit } from '@angular/core';
import { endOfMonth } from 'date-fns'
@Component({
  selector: 'app-booking-flight',
  templateUrl: './booking-flight.component.html',
  styleUrls: ['./booking-flight.component.css']
})
export class BookingFlightComponent implements OnInit {
  radioValue = 'A';
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };
  constructor() { }

  ngOnInit(): void {
  }

}

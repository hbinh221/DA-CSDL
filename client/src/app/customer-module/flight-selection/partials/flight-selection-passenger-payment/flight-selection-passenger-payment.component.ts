import { DataFormatService } from './../../../../services/data-format.service';
import { PaymentService } from './../../../../services/payment.service';
import { Component, OnInit } from '@angular/core';
import { PassengerInforModel } from 'src/app/customer-module/models/passenger-infor.model';
import { FlightDataModel } from 'src/app/customer-module/models/flight-data.model';

@Component({
  selector: 'app-flight-selection-passenger-payment',
  templateUrl: './flight-selection-passenger-payment.component.html',
  styleUrls: ['./flight-selection-passenger-payment.component.css']
})
export class FlightSelectionPassengerPaymentComponent {
  paymentList: any[] = [];
  passengerInfo: PassengerInforModel[] = [];
  price: string = '';
  flightData: FlightDataModel[] = [];

  constructor(private paymentService: PaymentService, private dataFormatService: DataFormatService) { }

  ngOnInit(): void {
    this.paymentService.getPayment().subscribe(res => {
      if(res.code === 200) {
        this.paymentList = res.data;
      }
    });
    this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!);
    this.flightData = JSON.parse(sessionStorage.getItem('flight-info')!);
    this.calcPriceForPayment();
  }

  calcPriceForPayment() {
    let price: number = 0;
    this.passengerInfo.forEach(passenger => {
      passenger.baggageList.forEach(baggage => {
        price += baggage.cost;
      });
      passenger.insuranceList.forEach(insurance => {
        price += insurance.cost;
      });
      passenger.milkTeaList.forEach(milktea => {
        price += milktea.cost;
      });
    })
    this.flightData.forEach(flight => price += flight.rankClass[0].price)
    this.price = this.dataFormatService.moneyFormat(price);
  }
}

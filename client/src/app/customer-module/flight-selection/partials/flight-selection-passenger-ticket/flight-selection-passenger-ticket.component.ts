import { PassengerInforModel } from 'src/app/customer-module/models/passenger-infor.model';
import { Router } from '@angular/router';
import { RankService } from 'src/app/services/rank.service';
import { TicketService } from './../../../../services/ticket.service';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TicketData } from 'src/app/customer-module/models/ticket-data.model';
import { FlightDataModel } from 'src/app/customer-module/models/flight-data.model';

@Component({
  selector: 'app-flight-selection-passenger-ticket',
  templateUrl: './flight-selection-passenger-ticket.component.html',
  styleUrls: ['./flight-selection-passenger-ticket.component.css'],
})
export class FlightSelectionPassengerTicketComponent implements OnInit {
  flightData: FlightDataModel[] = [];
  ticketData1: TicketData[] = [];
  ticketData2: TicketData[] = [];
  passengerInfo: PassengerInforModel[] = [];
  passengerId: string = '';
  rankList: any[] = [];

  constructor(
    private ticketService: TicketService,
    private rankService: RankService,
    protected msg: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rankService.getRank().subscribe((res) => {
      if (res.code === 200) {
        this.rankList = res.data;
      }
    });
    this.passengerInfo = JSON.parse(sessionStorage.getItem('passenger-info')!);
    this.flightData = JSON.parse(sessionStorage.getItem('flight-info')!);
    this.passengerId = this.passengerInfo[0].id;

    this.bindingPassengerInfor();
    this.fetchData();
  }

  bindingPassengerInfor() {
    this.passengerInfo.map((e) => {
      if (this.flightData.length === 1) {
        Object.assign(e, {
          ticketInfo: [{ ticketId: null, flightId: this.flightData[0].id }],
        });
      } else if (this.flightData.length === 2) {
        Object.assign(e, {
          ticketInfo: [
            { ticketId: null, flightId: this.flightData[0].id, rankId: null },
            { ticketId: null, flightId: this.flightData[1].id, rankId: null },
          ],
        });
      }
    });

    sessionStorage.setItem(
      'passenger-info',
      JSON.stringify(this.passengerInfo)
    );
  }

  fetchData() {
    this.ticketService.getTicket(this.flightData[0].id, this.flightData[0].rankClass[0].id).subscribe((res) => {
      if (res.code === 200) {
        this.ticketData1 = res.data;
      }
    });
    if (this.flightData.length === 2) {
      this.ticketService.getTicket(this.flightData[1].id, this.flightData[1].rankClass[0].id).subscribe((res) => {
        if (res.code === 200) {
          this.ticketData2 = res.data;
        }
      });
    }
  }

  changePassengerId(id: string) {
    this.passengerId = id;
  }

  chooseTicket(ticketId: string, flightId: string, rankId: string) {
    this.passengerInfo.map((e) => {
      if (e.id == this.passengerId) {
        e.ticketInfo.map((e) => {
          if (e.flightId == flightId) {
            this.changeTicket(e.ticketId, ticketId);
            e.ticketId = ticketId;
            e.rankId = rankId;
          }
        });
      }
    });

    sessionStorage.setItem(
      'passenger-info',
      JSON.stringify(this.passengerInfo)
    );
  }

  changeTicket(prevTicketId: string, currentTicketId: string) {
    if (prevTicketId == null) {
      this.ticketData1.map((e) =>
        e.id == currentTicketId ? (e.isReserved = true) : null
      );
      this.ticketData2.map((e) =>
        e.id == currentTicketId ? (e.isReserved = true) : null
      );
    } else {
      this.ticketData1.map((e) => {
        e.id == prevTicketId ? (e.isReserved = false) : null;
        e.id == currentTicketId ? (e.isReserved = true) : null;
      });
      this.ticketData2.map((e) => {
        e.id == prevTicketId ? (e.isReserved = false) : null;
        e.id == currentTicketId ? (e.isReserved = true) : null;
      });
    }
  }

  checkPassengerChooseTicket() {
    let name: string = '';
    this.passengerInfo.map((passenger) =>
      (passenger.ticketInfo as any[]).map((ticket) => {
        if (
          ticket.ticketId == null &&
          !name.includes(`${passenger.firstName} ${passenger.lastName}`)
        ) {
          name = name.concat(
            ' ',
            `${passenger.firstName} ${passenger.lastName}`
          );
        }
      })
    );
    if (name.length === 0) {
      this.router.navigateByUrl('/customer/passenger-payment');
    } else {
      this.msg.warning(`${name} chưa chọn chỗ ngồi`);
    }
  }
}

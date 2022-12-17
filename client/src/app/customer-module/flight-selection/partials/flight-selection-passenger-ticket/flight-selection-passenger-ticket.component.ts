import { Router } from '@angular/router';
import { RankService } from 'src/app/services/rank.service';
import { TicketService } from './../../../../services/ticket.service';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-flight-selection-passenger-ticket',
  templateUrl: './flight-selection-passenger-ticket.component.html',
  styleUrls: ['./flight-selection-passenger-ticket.component.css'],
})
export class FlightSelectionPassengerTicketComponent implements OnInit {
  flightData: any[] = [];
  ticketData1: any[] = [];
  ticketData2: any[] = [];
  passengerInfo: any[] = [];
  passengerId: string = '';
  rankList: any[] = [];
  tabIndex: number = 0;

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
    this.passengerInfo.map((e) => {
      if (this.flightData.length === 1) {
        Object.assign(e, {
          ticketInfo: [{ ticketId: null, flightId: this.flightData[0].id }],
        });
      } else if (this.flightData.length === 2) {
        Object.assign(e, {
          ticketInfo: [
            { ticketId: null, flightId: this.flightData[0].id },
            { ticketId: null, flightId: this.flightData[1].id },
          ],
        });
      }
    });
    sessionStorage.setItem(
      'passenger-info',
      JSON.stringify(this.passengerInfo)
    );
    this.passengerId = this.passengerInfo[0].id;
    this.ticketService.getTicket(this.flightData[0].id).subscribe((res) => {
      if (res.code === 200) {
        this.ticketData1 = res.data;
      }
    });
    if (this.flightData.length === 2) {
      this.ticketService.getTicket(this.flightData[1].id).subscribe((res) => {
        if (res.code === 200) {
          this.ticketData2 = res.data;
        }
      });
    }
  }

  changePassengerId(id: string) {
    this.passengerId = id;
  }
  chooseTicket(ticketId: string, flightId: string) {
    this.passengerInfo.map((e) => {
      if (e.id == this.passengerId) {
        (e.ticketInfo as any[]).map((e) => {
          if (e.flightId == flightId) {
            e.ticketId = ticketId;
          }
        });
      }
    });
    sessionStorage.setItem(
      'passenger-info',
      JSON.stringify(this.passengerInfo)
    );
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

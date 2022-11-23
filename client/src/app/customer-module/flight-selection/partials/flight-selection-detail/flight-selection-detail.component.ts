import { Component, Input, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-flight-selection-detail',
  templateUrl: './flight-selection-detail.component.html',
  styleUrls: ['./flight-selection-detail.component.css']
})
export class FlightSelectionDetailComponent implements OnInit {
  @Input() data: any;
  @Input() fromLocationName: string = "";
  @Input() toLocationName: string = "";
  @Input() listAirline: any[] = [];
  @Input() isVisible: boolean = false;
  @Input() onEmitVisible = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }

  getAirlineName(id: string){
    return this.listAirline.find(item => item.id === id)?.name;
  }

  onChangeActive(ev:any){
    this.isVisible = ev;
    this.onEmitVisible.emit(ev);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { AirlineService } from 'src/app/services/airline.service';
import { FlightService } from 'src/app/services/flight.service';
import { LocationService } from 'src/app/services/location.service';
import { RankService } from 'src/app/services/rank.service';

@Component({
  selector: 'app-flight-selection',
  templateUrl: './flight-selection.component.html',
  styleUrls: ['./flight-selection.component.css'],
})
export class FlightSelectionComponent implements OnInit {
  filterForm!: FormGroup;
  type: string = 'one-way';
  isLoading: boolean = false;
  isVisibleFilter: boolean = false;
  passenger: number = 1;
  toDate: string = '';
  fromLocationName: string = '';
  toLocationName: string = '';
  fromLocationCode: string = '';
  toLocationCode: string = '';
  listOfData: any[] = [];
  listRank: any[] = [];
  listAirline: any[] = [];

  total: number = 0;
  sortKey: string = 'Departure time by ascending';
  request: any = {
    departureTime: null,
    fromLocationId:null,
    toLocationId: null,
    airlineId: null,
    valueSort: 'DepartureTime ascending'
  };
  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private rankService: RankService,
    private airlineService: AirlineService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.isLoading = true;
    this.route.params
      .pipe(
        switchMap((params: any) => {
          this.type = params['type'];
          this.passenger = params['passenger'];
          this.request.departureTime = new Date(params['fromDate']);
          this.request.fromLocationId = params['fromLocationId'];
          this.request.toLocationId = params['toLocationId'];
          this.request.airlineId = '7ccb409e-0a67-ed11-be8b-484d7ef0b796'
          return this.flightService.getFlightForPassenger(this.request);
        })
      )
      .subscribe((res: any) => {
        if (res.code === 200 && res.data && res.data.length > 0) {
          this.fromLocationName = res.data[0]?.fromLocation;
          this.toLocationName = res.data[0]?.toLocation;
          this.fromLocationCode = this.fromLocationName.substring(
            this.fromLocationName.indexOf('(') + 1,
            this.fromLocationName.lastIndexOf(')')
          );
          this.toLocationCode = this.toLocationName.substring(
            this.toLocationName.indexOf('(') + 1,
            this.toLocationName.lastIndexOf(')')
          );
          this.listOfData = res.data;
          this.total = res.data.length;
        }
      });
      this.fetchAirline();
      this.isLoading = false;
  }

  initForm(){
    this.filterForm = this.fb.group({
      airlineId: [null]
    })
  }

  fetchData(){
    this.isLoading = true;
    this.flightService.getFlightForPassenger(this.request)
    .pipe(finalize(() => (this.isLoading = false)))
    .subscribe((res:any) => {
      if(res.code === 200){
        this.listOfData = res.data;
      }
    });
  }

  fetchAirline(){
    this.airlineService.getAirline()
    .subscribe(res => {
      if(res.code === 200){
        this.listAirline = res.data;
      }
    });
  }

  onSortData(column: string, type: string){
    this.request.valueSort = column + ' ' + type;
    this.sortKey = column + ' by ' + type;
    this.fetchData();
  }

  // fetchData(payload: any){
  //   this.flightService.getFlightForPassenger(payload);
  // }

}

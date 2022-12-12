import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  isVisibleDetailTicket: boolean = false;
  passenger: number = 1;
  toDate: string = '';
  fromLocationName: string = '';
  toLocationName: string = '';
  fromLocationCode: string = '';
  toLocationCode: string = '';
  listOfData: any[] = [];
  listRank: any[] = [];
  listAirline: any[] = [];
  listLocation: any[] = [];

  total: number = 0;
  totalPassenger: number = 0;
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
    private fb: FormBuilder,
    private router: Router,
    private locationService: LocationService,
    public datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    sessionStorage.clear();
    this.initForm();
    this.isLoading = true;
    this.route.params
      .pipe(
        switchMap((params: any) => {
          this.type = params['type'];
          this.passenger = params['passenger'];
          this.request.departureTime = this.datePipe.transform(new Date(params['fromDate']), 'yyyy-MM-dd HH:mm:ss');
          this.request.landedTime = new Date(params['toDate']);
          this.request.fromLocationId = params['fromLocationId'];
          this.request.toLocationId = params['toLocationId'];
          this.request.airlineId = null;
          return this.flightService.getFlightForPassenger(this.request);
        })
      )
      .subscribe((res: any) => {
        this.handleResponseData(res);
      });
      this.fetchLocation();
      this.fetchAirline();
      this.isLoading = false;
  }

  fetchLocation() {
      this.locationService.getLocation().subscribe(res => {
        if(res.code === 200){
          this.listLocation = res.data
        }
      })
}

    handleResponseData(res: any){
      if (res.code === 200 && res.data) {
        this.fromLocationName = this.listLocation.find(location => location.id === this.request.fromLocationId)?.locationName;
        this.toLocationName = this.listLocation.find(location => location.id === this.request.toLocationId)?.locationName;
        this.fromLocationCode = this.fromLocationName.substring(
          this.fromLocationName.indexOf('(') + 1,
          this.fromLocationName.lastIndexOf(')')
        );
        this.toLocationCode = this.toLocationName.substring(
          this.toLocationName.indexOf('(') + 1,
          this.toLocationName.lastIndexOf(')')
        );
        this.listOfData = [...res.data];
        this.total = res.data.length;
      }
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

  onClickViewTicket(){
    this.isVisibleDetailTicket = true;
  }

  onChangeVisibleDetail(ev:any){
    this.isVisibleDetailTicket = ev;
  }

  goToInfo(data: any, rankName: string){
    if(this.type === 'round-trip'){
      let  storageData:any[] = [];
      if(sessionStorage.getItem('flight-info')){
        storageData = JSON.parse(sessionStorage.getItem('flight-info')!);
      }
      if(storageData.length === 0){
        storageData.push(data);
        this.request = {
          ...this.request,
          fromLocationId: this.request.toLocationId,
          toLocationId: this.request.fromLocationId,
          departureTime: this.request.landedTime,
          airlineId: data.airlineId,
        }
        this.flightService.getFlightForPassenger(this.request).subscribe(res => {
          this.handleResponseData(res);
        });
        data.rankClass = (data.rankClass as any[]).filter(e => e.rankName == rankName);
        sessionStorage.setItem('flight-info', JSON.stringify([{...data, passengerQuantity: this.passenger}]));
      }
      else if(storageData.length === 1){
        data.rankClass = (data.rankClass as any[]).filter(e => e.rankName == rankName);
        sessionStorage.setItem('flight-info', JSON.stringify([...storageData, {...data, passengerQuantity: this.passenger}]));
        this.router.navigateByUrl('/customer/passenger-info');
      }
    }else{
      let  storageData:any[] = [];
      if(sessionStorage.getItem('flight-info')){
        storageData = JSON.parse(sessionStorage.getItem('flight-info')!);
      }
      if(storageData.length === 0){
        storageData.push(data);
        this.request = {
          ...this.request,
          fromLocationId: this.request.toLocationId,
          toLocationId: this.request.fromLocationId,
          departureTime: this.request.landedTime,
          airlineId: data.airlineId,
        }
        this.flightService.getFlightForPassenger(this.request).subscribe(res => {
          this.handleResponseData(res);
        });
        data.rankClass = (data.rankClass as any[]).filter(e => e.rankName == rankName);
        sessionStorage.setItem('flight-info', JSON.stringify([{...data, passengerQuantity: this.passenger}]));
        this.router.navigateByUrl('/customer/passenger-info');
      }
    }
  }
}

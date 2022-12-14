import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  baseUrl: string = 'flight';
  constructor(private http: HttpClient) {}

  getFlight(id?: string, airlineId?: string): Observable<any> {
    let idString = '';
    if (id) idString = '?id=' + id;
    let airlineIdString = '';
    if (airlineId) airlineIdString = '?airlineId=' + airlineId;
    return this.http.get(
      environment.baseUrl +
        this.baseUrl +
        '/get/flight' +
        idString +
        airlineIdString
    );
  }

  getFlightForPassenger(payload: any){
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/get/flight-for-passenger', payload);
  }


  createFlight(payload: any): Observable<any> {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/create/flight',
      payload
    );
  }

  checkCreateFlight(payload: any): Observable<any> {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/check/create-flight',
      payload
    );
  }

  deleteFlight(id: string): Observable<any> {
    return this.http.delete(environment.baseUrl + this.baseUrl + '/delete/flight'+'?id=' + id);
  }
}

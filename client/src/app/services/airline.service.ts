import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AirlineService {
  baseUrl: string = 'airline';
  constructor(private http: HttpClient) {}

  getAirline(id?: string): Observable<any> {
    let idString = '';
    if (id) idString = '?id=' + id;
    return this.http.get(
      environment.baseUrl + this.baseUrl + '/get/airline' + idString
    );
  }
  createAirline(payload: any): Observable<any> {
    let airlineName = '';
    if (payload) airlineName = '?name=' + payload;
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/create/airline' + airlineName,
      null
    );
  }
  updatePlane(id: string, payload: any): Observable<any> {
    return this.http.put(
      environment.baseUrl + this.baseUrl + '/update/' + id + '?name=' + payload,
      null
    );
  }
  deleteAirline(id: string): Observable<any> {
    return this.http.delete(
      environment.baseUrl + this.baseUrl + '/delete/airline' + '?id=' + id
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  baseUrl: string = 'service';
  constructor(private http: HttpClient) {}

  getService(id?: string, airlineId?: string): Observable<any> {
    let idString = '';
    if (id) idString = '?id=' + id;
    let airlineIdString = '';
    if (airlineId) airlineIdString = '?airlineId=' + airlineId;
    return this.http.get(
      environment.baseUrl + this.baseUrl + '/get/service' + idString + airlineIdString
    );
  }
  createService(payload: any): Observable<any> {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/create/service',
      payload
    );
  }
  updateService(id: string, payload: any): Observable<any> {
    return this.http.put(
      environment.baseUrl + this.baseUrl + '/update/' + id,
      payload
    );
  }
  deleteService(id: string): Observable<any> {
    return this.http.delete(
      environment.baseUrl + this.baseUrl + '/delete/service' + '?id=' + id
    );
  }
}

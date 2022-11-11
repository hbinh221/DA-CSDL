import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaneService {
  baseUrl: string = 'plane';
  constructor(private http: HttpClient) {}

  getPlane(id?: string, ailineId?: string): Observable<any> {
    let idString = '';
    if (id) idString = '?id=' + id;
    let airlineIdString = '';
    if (id) airlineIdString = '?airlineId=' + ailineId;
    return this.http.get(
      environment.baseUrl + this.baseUrl + '/get/plane' + idString + airlineIdString
    );
  }
  createPlane(payload: any): Observable<any> {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/create/plane',
      payload
    );
  }
  deletePlane(id: string): Observable<any> {
    return this.http.delete(
      environment.baseUrl + this.baseUrl + '/delete/plane' + '?id=' + id
    );
  }
}

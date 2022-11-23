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

  getPlane(id?: string, ailineId?: string, searchValue?: string): Observable<any> {
    let idString = '';
    if (id) idString = '?id=' + id;
    let airlineIdString = '';
    if (ailineId) airlineIdString = '?airlineId=' + ailineId;
    let searchValueString = '';
    if (searchValue) searchValueString = '?searchValue=' + searchValue;
    return this.http.get(
      environment.baseUrl + this.baseUrl + '/get/plane' + idString + airlineIdString + searchValueString
    );
  }
  createPlane(payload: any): Observable<any> {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/create/plane',
      payload
    );
  }
  updatePlane(id: string, payload: any): Observable<any> {
    return this.http.put(
      environment.baseUrl + this.baseUrl + '/update/' + id,
      payload
    );
  }
  deletePlane(id: string): Observable<any> {
    return this.http.delete(
      environment.baseUrl + this.baseUrl + '/delete/plane' + '?id=' + id
    );
  }
}

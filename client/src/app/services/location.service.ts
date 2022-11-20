import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  baseUrl: string = 'Location';
  constructor(private http: HttpClient) { }

  getLocation(id?:string): Observable<any>{
    let idString = '';
    if(id) idString = '?id=' + id;
    return this.http.get(environment.baseUrl + this.baseUrl + '/get/location' + idString);
  }
  createLocation(payload: any): Observable<any>{
    return this.http.post(environment.baseUrl + this.baseUrl +
       '/create/location' + '?name=' + payload,  null);
  }
  updateLocation(id: string, payload: any): Observable<any> {
    return this.http.put(
      environment.baseUrl + this.baseUrl + '/update/' + id + '?name=' + payload,
      null
    );
  }
  deleteLocation(id: string): Observable<any>{
    return this.http.delete(environment.baseUrl + this.baseUrl + '/delete/location' + '?id=' + id);
  }
}

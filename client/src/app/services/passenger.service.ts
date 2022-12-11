import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {
  baseUrl: string = 'passenger';
  constructor(private http: HttpClient) {}

  getAdmin(id?: string): Observable<any> {
    let idString = '';
    if (id) idString = '?id=' + id;
    return this.http.get(
      environment.baseUrl + this.baseUrl + '/get/admin' + idString
    );
  }

  createAdmin(payload: any): Observable<any> {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/register',
      payload
    );
  }
  updateAdmin(id: string, payload: any): Observable<any> {
    return this.http.put(
      environment.baseUrl + this.baseUrl + '/update/' + id,
      payload
    );
  }
  checkEmail(email: string) {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/checkemail' + '?email=' + email,
      null
    );
  }

  checkIdCard(payload: string): Observable<any> {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/check/idcardhavedata' + '?idCard=' + payload,
      payload
    );
  }

  deleteAdmin(id: string): Observable<any> {
    return this.http.delete(
      environment.baseUrl + this.baseUrl + '/delete/admin' + '?id=' + id
    );
  }
}

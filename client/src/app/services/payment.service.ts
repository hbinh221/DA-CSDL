import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  baseUrl: string = 'payment';
  constructor(private http: HttpClient) {}

  getPayment(id?: string): Observable<any> {
    let idString = '';
    if (id) idString = '?id=' + id;
    return this.http.get(
      environment.baseUrl + this.baseUrl + '/get/payment' + idString
    );
  }
  createPayment(payload: any): Observable<any> {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/create/payment' + '?name=' + payload,
      null
    );
  }
  deletePayment(id: string): Observable<any> {
    return this.http.delete(
      environment.baseUrl + this.baseUrl + '/delete/payment' + '?id=' + id
    );
  }
}

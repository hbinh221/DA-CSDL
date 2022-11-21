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

  getPayment(id?: string, searchValue?: string): Observable<any> {
    let idString = '';
    if (id) idString = '?id=' + id;
    let valueSearchString = '';
    if (searchValue) valueSearchString = '?searchValue=' + searchValue;
    return this.http.get(
      environment.baseUrl + this.baseUrl + '/get/payment' + idString + valueSearchString
    );
  }
  createPayment(payload: any): Observable<any> {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/create/payment' + '?name=' + payload,
      null
    );
  }
  updatePayment(id: string, payload: any): Observable<any> {
    return this.http.put(
      environment.baseUrl + this.baseUrl + '/update/' + id + '?name=' + payload,
      null
    );
  }
  deletePayment(id: string): Observable<any> {
    return this.http.delete(
      environment.baseUrl + this.baseUrl + '/delete/payment' + '?id=' + id
    );
  }
}

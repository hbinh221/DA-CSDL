import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  baseUrl: string = 'promotion';
  constructor(private http: HttpClient) {}

  getPromotion(id?: string): Observable<any> {
    let idString = '';
    if (id) idString = '?id=' + id;
    return this.http.get(
      environment.baseUrl + this.baseUrl + '/get/promotion' + idString
    );
  }
  createPromotion(payload: any): Observable<any> {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/create/promotion',
      payload
    );
  }
  updatePromotion(id: string, payload: any): Observable<any> {
    return this.http.put(
      environment.baseUrl + this.baseUrl + '/update/' + id,
      payload
    );
  }
  deletePromotion(id: string): Observable<any> {
    return this.http.delete(
      environment.baseUrl + this.baseUrl + '/delete/promotion' + '?id=' + id
    );
  }
}

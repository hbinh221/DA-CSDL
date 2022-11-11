import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RankService {
  baseUrl: string = 'rank';
  constructor(private http: HttpClient) {}

  getRank(id?: string): Observable<any> {
    let idString = '';
    if (id) idString = '?id=' + id;
    return this.http.get(
      environment.baseUrl + this.baseUrl + '/get/rank' + idString
    );
  }
  createRank(payload: any): Observable<any> {
    return this.http.post(environment.baseUrl + this.baseUrl + '/create/rank', payload);
  }
  deleteRank(id: string): Observable<any> {
    return this.http.delete(
      environment.baseUrl + this.baseUrl + '/delete/rank' + '?id=' + id
    );
  }
}

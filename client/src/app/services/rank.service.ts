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

  getRank(id?: string, searchValue?: string): Observable<any> {
    let idString = '';
    if (id) idString = '?id=' + id;
    let searchValueString = '';
    if (searchValue) searchValueString = '?searchValue=' + searchValue;
    return this.http.get(
      environment.baseUrl + this.baseUrl + '/get/rank' + idString + searchValueString
    );
  }
  createRank(payload: any): Observable<any> {
    return this.http.post(environment.baseUrl + this.baseUrl + '/create/rank', payload);
  }
  updateRank(id: string, payload: any): Observable<any> {
    return this.http.put(
      environment.baseUrl + this.baseUrl + '/update/' + id,
      payload
    );
  }
  deleteRank(id: string): Observable<any> {
    return this.http.delete(
      environment.baseUrl + this.baseUrl + '/delete/rank' + '?id=' + id
    );
  }
}

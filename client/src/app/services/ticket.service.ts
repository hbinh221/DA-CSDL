import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  baseUrl: string = 'ticket';
  constructor(private http: HttpClient) { }

  getTicket(id?: string, rankId?: string): Observable<any> {
    let idString = '';
    let rankIdString = '';
    if (id) idString = '?flightId=' + id;
    if (rankId) rankIdString = '&rankId=' + rankId;
    return this.http.get(
      environment.baseUrl + this.baseUrl + '/get/remaningticket' + idString + rankIdString
    );
  }
  updateAdmin(id: string, payload: any): Observable<any> {
    return this.http.put(
      environment.baseUrl + this.baseUrl + '/update/' + id,
      payload
    );
  }
  createTicket(payload: any): Observable<any> {
    return this.http.post(
      environment.baseUrl + this.baseUrl + '/create/ticket',
      payload
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable } from 'rxjs';
import {map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../customer-module/models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl = 'passenger';
  currentUserSource = new BehaviorSubject<any>(null);
  currentUser =  this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private message: NzMessageService) { }

  login(payload: LoginModel):Observable<any>{
    return this.http.post(environment.baseUrl + this.baseUrl + '/login', payload).pipe(
      map((response: any) => {
        const user = response;
        if(user) {
          // this.message.success("Logged In");
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
  
  setCurrentUser(user:any){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
}

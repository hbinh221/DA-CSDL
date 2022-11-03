import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUserSource = new BehaviorSubject<any>(null);
  currentUser =  this.currentUserSource.asObservable();

  constructor() { }
}

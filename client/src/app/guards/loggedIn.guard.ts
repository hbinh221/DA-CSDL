import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, 
    private message: NzMessageService,
    private router: Router){}
  canActivate() : Observable<boolean>{
    return this.authenticationService.currentUser.pipe(
      map(user => {
        if(!user) return true;
        else{
          this.message.error("You have logged in");
          this.router.navigateByUrl('/customer');
          return false;
        }
      })
    );
  }
  
}

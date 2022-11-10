import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {
  constructor(private authenticationService: AuthenticationService, 
    private message: NzMessageService,
    private router: Router){}
  canLoad(): Observable<boolean> {
    return this.authenticationService.currentUser.pipe(
      map(user => {
        if(user.isAdmin) return true;
        else{
          this.message.error("You must be admin to do this");
          this.router.navigateByUrl('customer');
          return false;
        }
      })
    )
  }
    
  
}

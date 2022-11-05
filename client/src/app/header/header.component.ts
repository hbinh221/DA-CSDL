import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isVisibleLogin: boolean = false;
  form!: FormGroup;
  constructor(private fb: FormBuilder,
     private authenticationService: AuthenticationService,
     private message: NzMessageService) { }

  ngOnInit(): void {
    this.initForm();
    const user = JSON.parse(localStorage.getItem('user')!);
    if(user) this.authenticationService.setCurrentUser(user);
  }

  initForm(){
    this.form = this.fb.group({
      email: [null, Validators.required],
      password: [null, [Validators.required,Validators.minLength(5)]],
    })
  }
  

  getUser(){
    return this.authenticationService.currentUser;
  }

  submitForm(){
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.valid) {
      this.authenticationService
        .login(this.form.value)
        .pipe(
          catchError((err) => {
            return of(err);
          })
        )
        .subscribe(response => {
          if(response.status === 200){
            this.message.success("Success");
          }
          else{
            this.message.error("Incorrect email or password");
          }
        })
  }
}

logout(){
  this.isVisibleLogin = false;
  this.authenticationService.logout();
}

}

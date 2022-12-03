import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { AdminModalComponent } from 'src/app/admin-module/passenger-list/partials/admin-modal/admin-modal.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends AdminModalComponent implements OnInit {

  submitForm(){
    this.initForm();
    this.isLoading = true;
    if (this.mode === 'create') {
      // this.passengerService.checkEmail(this.modalForm.value.email).pipe(finalize(() => (this.isLoading = false))).subscribe(response => {
      //   if(Boolean(response) == true) {
          this.modalForm.value.gender == "true" ? this.modalForm.value.gender = true : this.modalForm.value.gender = false;
          this.passengerService
            .createAdmin({...this.modalForm.value,isAdmin: false})
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe((res) => {
              if (res.code === 200) {
                this.modalForm.reset();
                this.msg.success('Successfully');
                this.checkEditForm();
                this.onCreateItem.emit(res.data);
              }
        //     });
        // } else {
        //   this.msg.warning('Email đã tồn tại!');
        // }
      })
    }
    else{
      this.modalForm.value.gender == "true" ? this.modalForm.value.gender = true : this.modalForm.value.gender = false;
      this.passengerService.updateAdmin(this.modalForm.value.id, {...this.modalForm.value,isAdmin: false})
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if(res.code=== 200){
          this.msg.success("Success");
          this.onUpdateItem.emit(res.data);
          this.modalForm.disable();
          this.isEdit = false;
        }else{
          this.msg.error("Failed");
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.modalForm.controls.checkPassword.updateValueAndValidity());
  }
  

  validateEmailFromApiDebounce = () => {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(300).pipe(
        switchMap(() =>
          this.passengerService.checkEmail(control.value).pipe(
            map((isValid) => {
              if (isValid) {
                return null;
              }
              return {
                usernameDuplicated: true,
              };
            })
          )
        )
      );
    };
  };

  confirmationValidator = (control: any): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.modalForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

}

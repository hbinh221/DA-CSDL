import { ModelBaseComponent } from './../../../shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PassengerService } from 'src/app/services/passenger.service';
import { finalize, map, switchMap } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.css']
})
export class AdminModalComponent extends ModelBaseComponent implements OnInit {
  emailRegex: string = '^[a-z0-9A-Z/.._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  phoneRegex: string = '[0-9]+$';
  idCardRegex: string = '^[0-9]+$';
  modalForm!: FormGroup
  gender: any = [
    {
      value: true,
      label: 'Nam'
    },
    {
      value: false,
      label: 'Nữ'
    }
  ]

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
    protected passengerService: PassengerService
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      idCard: [null, [Validators.required, Validators.pattern(this.idCardRegex)]],
      birthDay: [null, Validators.required],
      gender: [null, Validators.required],
      phone: [null, [Validators.required, Validators.pattern(this.phoneRegex)]],
      email: [null, [Validators.required, Validators.pattern(this.emailRegex)],
      this.validateEmailFromApiDebounce()],
      password: [null, Validators.required],
    });
  }

  deleteItem(): void {
    this.isLoading = true;
    this.passengerService
      .deleteAdmin(this.modalForm.value.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response) => {
        if (response.code === 200) {
          this.msg.success('Successfully');
          this.handleCancel();
          this.onDeleteItem.emit(response.data);
        } else {
          this.msg.warning('Failed');
          this.handleCancel();
        }
      });
  }

  submitForm(): void {
    this.validateForm();
    this.isLoading = true;
    if (this.mode === 'create') {
      // this.passengerService.checkEmail(this.modalForm.value.email).pipe(finalize(() => (this.isLoading = false))).subscribe(response => {
      //   if(Boolean(response) == true) {
          this.modalForm.value.gender == "true" ? this.modalForm.value.gender = true : this.modalForm.value.gender = false;
          this.passengerService
            .createAdmin({...this.modalForm.value, isAdmin: true})
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
      this.passengerService.updateAdmin(this.modalForm.value.id, {...this.modalForm.value,isAdmin: true})
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
}

import { ModelBaseComponent } from './../../../shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PassengerService } from 'src/app/services/passenger.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.css']
})
export class AdminModalComponent extends ModelBaseComponent implements OnInit {

  gender: any = [
    {
      value: 1,
      label: 'Nam'
    },
    {
      value: 0,
      label: 'Nữ'
    }
  ]

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
    private passengerService: PassengerService
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
      idCard: [null, Validators.required],
      birthDay: [null, Validators.required],
      gender: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
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
      this.passengerService.checkEmail(this.modalForm.value.email).pipe(finalize(() => (this.isLoading = false))).subscribe(response => {
        if(Boolean(response) == true) {
          this.modalForm.value.gender == "1" ? this.modalForm.value.gender = true : this.modalForm.value.gender = false;
          this.passengerService
            .createAdmin(this.modalForm.value)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe((res) => {
              if (res.code === 200) {
                this.modalForm.reset();
                this.msg.success('Successfully');
                this.checkEditForm();
                this.onCreateItem.emit(res.data);
              }
            });
        } else {
          this.msg.warning('Email đã tồn tại!');
        }
      })
    }
  }

}

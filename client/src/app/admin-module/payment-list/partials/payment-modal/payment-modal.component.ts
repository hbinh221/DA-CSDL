import { finalize } from 'rxjs/operators';
import { PaymentService } from './../../../../services/payment.service';
import { ModelBaseComponent } from './../../../shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent extends ModelBaseComponent implements OnInit {

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
    private paymentService: PaymentService
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      paymentType: [null, Validators.required],
    });
  }

  deleteItem(): void {
    this.isLoading = true;
    this.paymentService
      .deletePayment(this.modalForm.value.id).pipe(finalize(() => this.isLoading = false))
      .subscribe((response) => {
        if(response.code === 200) {
          this.msg.success('Successfully');
          this.handleCancel();
          this.onDeleteItem.emit(response.data);
        } else {
          this.msg.success('Failed');
          this.handleCancel();
        }
      });
  }

  submitForm(): void {
    this.validateForm();
    this.isLoading = true;
    if (this.mode === 'create') {
      this.paymentService
        .createPayment(this.modalForm.value.paymentType).pipe(finalize(() => this.isLoading = false))
        .subscribe((res) => {
          if (res.code == 200) {
            this.modalForm.reset();
            this.msg.success('Successfully');
            this.checkEditForm();
            this.onCreateItem.emit(res.data);
          } else {
            this.modalForm.reset();
            this.msg.warning('Loại thanh toán này đã tồn tại:)');
            this.checkEditForm();
          }
        });
    } else {
      this.paymentService.updatePayment(this.modalForm.value.id, this.modalForm.value.paymentType)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        if(res.code=== 200){
          this.msg.success("Success");
          this.onUpdateItem.emit(res.data);
          this.modalForm.disable();
          this.isEdit = false;
        }else{
          this.msg.error("Failed");
        }
      })
    }
  }

}

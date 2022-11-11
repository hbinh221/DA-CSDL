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
      .deletePayment(this.modalForm.value.id)
      .subscribe((response) => {
        if(response.code) {
          this.isLoading = false;
          this.msg.success('Successfully');
          this.handleCancel();
          this.onDeleteItem.emit(response.data);
        }
      });
  }

  submitForm(): void {
    this.validateForm();
    this.isLoading = true;
    if (this.mode === 'create') {
      this.paymentService
        .createPayment(this.modalForm.value.paymentType)
        .subscribe((res) => {
          if (res.code == 200) {
            this.isLoading = false;
            this.modalForm.reset();
            this.msg.success('Successfully');
            this.checkEditForm();
            this.onCreateItem.emit(res.data);
          }
        });
    }
  }

}

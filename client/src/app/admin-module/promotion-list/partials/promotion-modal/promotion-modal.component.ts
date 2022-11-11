import { PromotionService } from './../../../../services/promotion.service';
import { ModelBaseComponent } from './../../../shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-promotion-modal',
  templateUrl: './promotion-modal.component.html',
  styleUrls: ['./promotion-modal.component.css']
})
export class PromotionModalComponent extends ModelBaseComponent implements OnInit {
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
    private promotionService: PromotionService
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      promotionName: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      discount: [null, Validators.required],
    });
  }

  deleteItem(): void {
    this.isLoading = true;
    this.promotionService
      .deletePromotion(this.modalForm.value.id)
      .subscribe((response) => {
    this.isLoading = false;
          this.msg.success('Successfully');
          this.handleCancel();
          this.onDeleteItem.emit(response);
      });
  }

  submitForm(): void {
    this.validateForm();
    this.isLoading = true;
    if (this.mode === 'create') {
      this.promotionService
        .createPromotion(this.modalForm.value.locationName)
        .subscribe((res) => {
            this.isLoading = false;
            this.modalForm.reset();
            this.msg.success('Successfully');
            this.checkEditForm();
            this.onCreateItem.emit(res);
        });
    }
  }

  onChangeStartDate(result: Date): void {
    this.modalForm.value.startDate = result;
    console.log(this.modalForm.value.startDate);
  }

  onChangeEndDate(result: Date): void {
    this.modalForm.value.endDate = result;
    console.log(this.modalForm.value.startDate);
  }

}

import { PromotionService } from './../../../../services/promotion.service';
import { ModelBaseComponent } from './../../../shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-promotion-modal',
  templateUrl: './promotion-modal.component.html',
  styleUrls: ['./promotion-modal.component.css'],
})
export class PromotionModalComponent
  extends ModelBaseComponent
  implements OnInit
{

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
    public datepipe: DatePipe,
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
        this.onDeleteItem.emit(response.data);
      });
  }

  submitForm(): void {
    this.validateForm();
    if (this.mode === 'create') {
      if (this.modalForm.value.startDate > this.modalForm.value.endDate) {
        this.msg.warning('Ngày kết thúc phải lớn hơn ngày bắt đầu');
      } else {
        this.isLoading = true;
        this.promotionService
          .createPromotion(this.modalForm.value).pipe(finalize(() => this.isLoading = false))
          .subscribe((res) => {
            if(res.code === 200) {
              this.modalForm.reset();
              this.msg.success('Successfully');
              this.checkEditForm();
              this.onCreateItem.emit(res.data);
            } else {
              this.msg.error('Failed');
            }
          });
      }
    } else {
      this.promotionService.updatePromotion(this.modalForm.value.id, this.modalForm.value)
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

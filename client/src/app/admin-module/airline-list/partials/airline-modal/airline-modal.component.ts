import { AirlineService } from './../../../../services/airline.service';
import { ModelBaseComponent } from './../../../shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-airline-modal',
  templateUrl: './airline-modal.component.html',
  styleUrls: ['./airline-modal.component.css'],
})
export class AirlineModalComponent
  extends ModelBaseComponent
  implements OnInit
{
  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
    private airlineService: AirlineService
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      airlineName: [null, Validators.required],
    });
  }

  deleteItem(): void {
    this.isLoading = true;
    this.airlineService
      .deleteAirline(this.modalForm.value.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response) => {
        if (response.code === 200) {
          this.msg.success('Successfully');
          this.handleCancel();
          this.onDeleteItem.emit(response.data);
        } else {
          this.msg.error('You must delete all related plane');
          this.handleCancel();
        }
      });
  }

  submitForm(): void {
    this.validateForm();
    this.isLoading = true;
    if (this.mode === 'create') {
      this.airlineService
        .createAirline(this.modalForm.value.airlineName)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => {
          if (res.code === 200) {
            this.modalForm.reset();
            this.msg.success('Successfully');
            this.checkEditForm();
            this.onCreateItem.emit(res.data);
          } else {
            this.modalForm.reset();
            this.msg.warning('Hãng hàng không này đã tồn tại:)');
            this.checkEditForm();
          }
        });
    } else {
      this.airlineService.updatePlane(this.modalForm.value.id, this.modalForm.value.airlineName)
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
      }
        
      )
    }
  }
}

import { ModelBaseComponent } from 'src/app/admin-module/shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ServiceService } from 'src/app/services/service.service';
import { finalize } from 'rxjs/operators';
import { AirlineService } from 'src/app/services/airline.service';

@Component({
  selector: 'app-service-modal',
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.css'],
})
export class ServiceModalComponent
  extends ModelBaseComponent
  implements OnInit
{
  airlineList: any = [];

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
    private serviceService: ServiceService,
    private airlineService: AirlineService
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
    this.fetchData();
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      serviceName: [null, Validators.required],
      cost: [null, Validators.required],
      airlineId: [null, Validators.required],
    });
  }

  fetchData(): void {
    this.isLoading = true;
    this.airlineService
      .getAirline()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res.code === 200) {
          this.airlineList = res.data;
        }
      });
  }

  deleteItem(): void {
    this.isLoading = true;
    this.serviceService
      .deleteService(this.modalForm.value.id)
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
      this.serviceService
        .createService(this.modalForm.value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => {
          if (res.code === 200) {
            this.modalForm.reset();
            this.msg.success('Successfully');
            this.checkEditForm();
            this.onCreateItem.emit(res.data);
          } else {
            this.msg.success('Dịch vụ đã tồn tại');
          }
        });
    } else {
      this.modalForm.value.gender == 'true'
        ? (this.modalForm.value.gender = true)
        : (this.modalForm.value.gender = false);
      this.serviceService
        .updateService(this.modalForm.value.id, this.modalForm.value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => {
          if (res.code === 200) {
            this.msg.success('Success');
            this.onUpdateItem.emit(res.data);
            this.modalForm.disable();
            this.isEdit = false;
          } else {
            this.msg.error('Failded');
          }
        });
    }
  }
}

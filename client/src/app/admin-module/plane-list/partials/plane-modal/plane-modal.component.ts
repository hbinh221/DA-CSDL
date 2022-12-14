import { AirlineService } from 'src/app/services/airline.service';
import { PlaneService } from './../../../../services/plane.service';
import { ModelBaseComponent } from './../../../shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-plane-modal',
  templateUrl: './plane-modal.component.html',
  styleUrls: ['./plane-modal.component.css'],
})
export class PlaneModalComponent extends ModelBaseComponent implements OnInit {
  airlineList: any = [];

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
    private planeService: PlaneService,
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
      code: [null, Validators.required],
      airlineId: [null, Validators.required],
      planeName: [null, Validators.required],
      seatQuantity: [null, Validators.required],
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
    this.planeService
      .deletePlane(this.modalForm.value.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response) => {
        if (response.code === 200) {
          this.msg.success('Successfully');
          this.handleCancel();
          this.onDeleteItem.emit(response.data);
        } else {
          this.msg.error('This plane exists in a flight');
          this.handleCancel();
        }
      });
  }

  submitForm(): void {
    this.validateForm();
    this.isLoading = true;
    if (this.mode === 'create') {
      this.planeService
        .createPlane(this.modalForm.value)
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
      this.planeService.updatePlane(this.modalForm.value.id, this.modalForm.value)
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

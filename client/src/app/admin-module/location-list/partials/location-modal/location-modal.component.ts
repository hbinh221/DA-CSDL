import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModelBaseComponent } from 'src/app/admin-module/shared/modal-base/modal-base.component';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.css'],
})
export class LocationModalComponent
  extends ModelBaseComponent
  implements OnInit {
  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
    private locationService: LocationService
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      locationName: [null, Validators.required],
    });
  }

  deleteItem(): void {
    this.isLoading = true;
    this.locationService
      .deleteLocation(this.modalForm.value.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response) => {
        if (response.code === 200) {
          this.msg.success('Successfully');
          this.handleCancel();
          this.onDeleteItem.emit(response.data);
        } else {
          this.msg.error('Failed');
          this.handleCancel();
        }
      });
  }

  submitForm(): void {
    this.validateForm();
    this.isLoading = true;
    if (this.mode === 'create') {
      this.locationService
        .createLocation(this.modalForm.value.locationName)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => {
          if (res.code === 200) {
            this.modalForm.reset();
            this.msg.success('Successfully');
            this.checkEditForm();
            this.onCreateItem.emit(res.data);
          } else {
            this.modalForm.reset();
            this.msg.error('Failed');
            this.checkEditForm();
          }
        });
    } else {
      this.locationService.updateLocation(this.modalForm.value.id, this.modalForm.value.locationName)
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

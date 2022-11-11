import { AirlineService } from './../../../../services/airline.service';
import { ModelBaseComponent } from './../../../shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-airline-modal',
  templateUrl: './airline-modal.component.html',
  styleUrls: ['./airline-modal.component.css']
})
export class AirlineModalComponent extends ModelBaseComponent implements OnInit {

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
      this.airlineService
        .createAirline(this.modalForm.value.airlineName)
        .subscribe((res) => {
            this.isLoading = false;
            this.modalForm.reset();
            this.msg.success('Successfully');
            this.checkEditForm();
            this.onCreateItem.emit(res);
        });
    }
  }

}

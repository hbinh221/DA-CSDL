import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModelBaseComponent } from 'src/app/admin-module/shared/modal-base/modal-base.component';

@Component({
  selector: 'app-passenger-service-milk-tea-modal',
  templateUrl: './passenger-service-milk-tea-modal.component.html',
  styleUrls: ['./passenger-service-milk-tea-modal.component.css']
})
export class PassengerServiceMilkTeaModalComponent extends ModelBaseComponent  implements OnInit {
  @Input() passengerInfo: any[] = [];
  @Input() flightData: any[] = [];

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      airlineId: [null, Validators.required],
      planeId: [null, Validators.required],
      flightNo: [null, Validators.required],
      fromLocationId: [null, Validators.required],
      toLocationId: [null, Validators.required],
      flightTime: [null, Validators.required],
      cost: [null, Validators.required],
      remark: [null],
    });
  }
}

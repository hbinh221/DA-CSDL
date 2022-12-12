import { ModelBaseComponent } from './../../../../../../admin-module/shared/modal-base/modal-base.component';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-passenger-service-baggage-modal',
  templateUrl: './passenger-service-baggage-modal.component.html',
  styleUrls: ['./passenger-service-baggage-modal.component.css']
})
export class PassengerServiceBaggageModalComponent extends ModelBaseComponent implements OnInit {
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
    this.initForm()
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

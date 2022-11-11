import { ModelBaseComponent } from './../../../shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-flight-modal',
  templateUrl: './flight-modal.component.html',
  styleUrls: ['./flight-modal.component.css']
})
export class FlightModalComponent extends ModelBaseComponent implements OnInit {

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
  }

}

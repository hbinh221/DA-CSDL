import { RankService } from './../../../../services/rank.service';
import { ModelBaseComponent } from 'src/app/admin-module/shared/modal-base/modal-base.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-rank-modal',
  templateUrl: './rank-modal.component.html',
  styleUrls: ['./rank-modal.component.css']
})
export class RankModalComponent extends ModelBaseComponent implements OnInit {

  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService,
    private rankService: RankService
  ) {
    super(http, fb, msg);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      rankName: [null, Validators.required],
      cost: [null, Validators.required],
      baggageWeight: [null, Validators.required],
    });
  }

  deleteItem(): void {
    this.isLoading = true;
    this.rankService
      .deleteRank(this.modalForm.value.id)
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
      this.rankService
        .createRank(this.modalForm.value)
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

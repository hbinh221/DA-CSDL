import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html',
  styleUrls: ['./modal-base.component.css']
})
export class ModelBaseComponent implements OnInit {
  modalForm!:FormGroup;
  @Output() onCreateItem = new EventEmitter();
  @Output() onDeleteItem = new EventEmitter();
  @Output() onUpdateItem = new EventEmitter();
  @Output() onCloseModal = new EventEmitter();
  isVisible: boolean = false;
  mode: string = 'create';
  modalTitle: string = 'Create'
  isEdit: boolean = false;
  recordName: string = '';
  isLoading: boolean = false;
  data: any;
  constructor(protected http: HttpClient,
    protected fb: FormBuilder,
    protected msg: NzMessageService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){}

  validateForm(){
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
  }

  deleteItem(){}

  changeEdit(ev: any) {
    this.isEdit = ev;
    if (this.mode === 'detail') {
      this.modalForm.patchValue(this.data);
    }
    this.checkEditForm();
  }

  checkEditForm(){
    if(this.isEdit) {
      this.modalForm.enable();
      this.modalTitle = 'Update: ' + this.recordName;
    }
    else{
      this.modalForm.disable();
      this.modalTitle = 'View: ' + this.recordName;
    }
  }

  
  openModal(data:any,mode: string, isEdit: boolean){
    this.isVisible = true;
    this.isEdit = isEdit;
    this.mode = mode;
    this.data = data;
    if(mode === 'create'){
      this.modalForm.reset();
    }
    else{
      this.modalForm.patchValue(data);
    }
    this.checkEditForm();
  }

  submitForm(){}

  handleCancel(){
    this.isVisible = false;
  }


}

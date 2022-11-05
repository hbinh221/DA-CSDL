import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html',
  styleUrls: ['./modal-base.component.css']
})
export class ModelBaseComponent implements OnInit {
  modalForm!:FormGroup;
  constructor() { }

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

  submitForm(){}

}

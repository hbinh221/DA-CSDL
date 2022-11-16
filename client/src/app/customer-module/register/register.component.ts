import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  validateForm!: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  submitForm(){}

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }
  
 
  initForm(){
    this.validateForm = this.fb.group({
      firstName: [null, [Validators.email, Validators.required]],
      lastName: [null, [Validators.required]],
      idCard: [null, [Validators.required,Validators.minLength(9) ,Validators.maxLength(12)]],
      birthday: [null, [Validators.required]],
      gender: [false],
      phone: [null, [Validators.required, Validators.pattern('2')]],
      email: [null, [Validators.required, Validators.pattern('2')]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required,this.confirmationValidator]],

    });
  }

  confirmationValidator = (control: any): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

}

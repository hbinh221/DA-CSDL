import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flight-selection',
  templateUrl: './flight-selection.component.html',
  styleUrls: ['./flight-selection.component.css']
})
export class FlightSelectionComponent implements OnInit {
  form!: FormGroup;
  listOfData: any[] = [];
  constructor(private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      debugger
    });
  }

 
}

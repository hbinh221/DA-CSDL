import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFormatService {

  constructor() { }

  moneyFormat(value: Number | number | string): string {
    return value ? Math.round(Number(value)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '0';
  }
}

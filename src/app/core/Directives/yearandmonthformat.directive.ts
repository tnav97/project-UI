import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MONTHFORMAT } from '../Constants/constant';

@Directive({
  selector: '[appYearMonthFormat]',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MONTHFORMAT }],
})
export class YearMonthFormatDirective {}

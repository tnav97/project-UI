import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DATEFORMAT } from '../Constants/constant';

@Directive({
  selector: '[appDateFormat]',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATEFORMAT }],
})
export class DateFormatDirective {}

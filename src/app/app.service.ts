import { Injectable } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ITableColumns, ITableSettings } from './core/models';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  defaultTableSettings(options: {
    columns: Array<ITableColumns>;
    pageIndex?: number;
    pageSize?: number;
    pageSizeOptions?: Array<number>;
  }): ITableSettings {
    const settings: ITableSettings = {
      columns: options.columns,
      displayed: options.columns.map((c: ITableColumns) => c.columnDef),
      pageIndex: options.pageIndex ? options.pageIndex : 0,
      pageSize: options.pageSize ? options.pageSize : 10,
      pageSizeOptions: options.pageSizeOptions ? options.pageSizeOptions : [5, 10, 25, 50, 100],
    };
    return settings;
  }

  convertTime(j: Date | string): string {
    const m = new Date(j);
    const n = moment(m).format('YYYY-MM-DD');
    const k = new Date().toISOString()?.split('T')[1];
    return `${n}T${k}`;
  }

  toastr(e?: string, j?: { text?: string, time?: number, icon?: 'error' | 'warning' | 'success' }): void {
    Swal.fire({
      position: 'center',
      icon: j?.icon ?? 'error',
      title: e ?? 'Something went wrong, try again.',
      showConfirmButton: false,
      timer: j?.time ?? 1500,
      ...(j?.text) && { text: j?.text ?? '' }
    });
  }
}

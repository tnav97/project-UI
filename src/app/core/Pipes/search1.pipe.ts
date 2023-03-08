import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFilter1',
  pure:true
})
export class customSearchPipe1 implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal1 =
        val.employeeName.toLocaleLowerCase().includes(args) ||
        val.employeeName.includes(args) ||
        val.location.toLocaleLowerCase().includes(args) ||
        val.location.includes(args);
      return rVal1;
    });
  }
}

@Pipe({
  name: 'customFilter2',
  pure:true,
})
export class customSearchPipe2 implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal1 =
        (val.employeeId.toLocaleLowerCase().includes(args)) ||
        val.employeeId.includes(args) ;
        val.employeeName.toLocaleLowerCase().includes(args) ||
        val.employeeName.includes(args) ;
        val.location.toLocaleLowerCase().includes(args) ||
        val.location.includes(args) ;
        // val.location.toLocaleLowerCase().includes(args) ||
        // val.location.includes(args);
      return rVal1;
    });
  }
}

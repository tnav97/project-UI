import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customFilter',
})
export class customSearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal =
        val.jobId.toLocaleLowerCase().includes(args) ||
        val.jobId.includes(args) ||
        val.jobLocation.toLocaleLowerCase().includes(args) ||
        val.jobLocation.includes(args) ||
        val.jobTitle.toLocaleLowerCase().includes(args) ||
        val.jobTitle.includes(args) ||
        val.status.toLocaleLowerCase().includes(args) ||
        val.status.includes(args);
      return rVal;
    });
  }
}

@Pipe({
  name: 'customEmployeeFilter',
})
export class customEmployeeSearchPipe implements PipeTransform {
  transform(group: Array<any>, value: string, items?: string[]): any {
    if (!value) return group;

    return group?.filter((n) => items?.some((key) => n[key]?.toLowerCase()?.indexOf(value?.toLowerCase()) !== -1)) ?? group;
  }
}

@Pipe({
  name: 'customHotJobs',
})
export class customHotJobsPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal =
        val.jobId.toLocaleLowerCase().includes(args) ||
        val.jobId.includes(args) ||
        val.businessName.toLocaleLowerCase().includes(args) ||
        val.businessName.includes(args) ||
        val.jobTitle.toLocaleLowerCase().includes(args) ||
        val.jobTitle.includes(args);
      return rVal;
    });
  }
}

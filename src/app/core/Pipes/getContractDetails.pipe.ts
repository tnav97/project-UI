import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getContractDetails',
  pure: true,
})
export class getContractDetailsPipe implements PipeTransform {
  transform(value: any, search: any) {
    let results2: any = [];

    if (!search) return value;
    if (value && value.length) {
      value.forEach((v: any) => {
        let temp = v['position'].toUpperCase();
        let temp1 = v['vendor'].toUpperCase();
        let temp2 = v['name'].toUpperCase();

        search = search.toUpperCase();

        if (temp.includes(search) || temp1.includes(search) || temp2.includes(search)) results2.push(v);
      });
      return results2;
    }
  }
}

@Pipe({
  name: 'search1',
  pure: true,
})
export class SearchPipe1 implements PipeTransform {
  transform(value: any, search: any) {
    let results1: any = [];

    if (!search) return value;
    if (value && value.length) {
      value.forEach((v: any) => {
        let temp = v['vendor'].toUpperCase();

        search = search.toUpperCase();

        if (temp.includes(search)) results1.push(v);
      });
      return results1;
    }
  }
}

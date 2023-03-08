import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: true,
})
export class FilterPipe implements PipeTransform {
  transform(value: any, searchfilter: string) {
    let results: any = [];

    if (!searchfilter) return value;
    if (value && value.length) {
      value.forEach((v: any) => {
        let temp = v['name'].toUpperCase();
        let temp1 = v['position'].toUpperCase();

        searchfilter = searchfilter.toUpperCase();

        if (temp.includes(searchfilter) || temp1.includes(searchfilter)) results.push(v);
      });
      return results;
    }
  }
}

@Pipe({
  name: 'search',
  pure: true,
})
export class SearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal =
        val.name.toLocaleLowerCase().includes(args) ||
        val.name.includes(args) ||
        val.position.toLocaleLowerCase().includes(args) ||
        val.position.includes(args) ||
        val.partner.toLocaleLowerCase().includes(args) ||
        val.partner.includes(args) ||
        val.status.toLocaleLowerCase().includes(args) ||
        val.status.includes(args);
      return rVal;
    });
  }
}

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'sortByTask',
})
export class SortByTaskPipe implements PipeTransform {
  transform(value: any[]): any[] {
    return value.sort((n1, n2) => {
      return n2.taskId - n1.taskId;
    });
  }
}

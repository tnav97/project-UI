import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilterPipe, SearchPipe } from './Pipes/filter.pipe';
import { getContractDetailsPipe } from './Pipes/getContractDetails.pipe';
import { customSearchPipe2 } from './Pipes/search1.pipe';
import { TotalPipe } from './Pipes/total.pipe';

const DIRECTIVES: Array<any> = [];

const PIPES: Array<any> = [TotalPipe, getContractDetailsPipe, SearchPipe, FilterPipe,customSearchPipe2];

@NgModule({
  declarations: [...DIRECTIVES, ...PIPES],
  imports: [CommonModule],
  exports: [...DIRECTIVES, ...PIPES],
})
export class CoreModule {}

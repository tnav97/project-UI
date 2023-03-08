import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { BodyComponent } from './components/body/body.component';
import { NgAdditionalsComponent } from './components/ng-additionals/ng-additionals.component';
import { NgHeadersComponent } from './components/ng-headers/ng-headers.component';
import { NgSidenavComponent } from './components/ng-sidenav/ng-sidenav.component';

const NG_COMPONENTS: Array<any> = [NgHeadersComponent, NgSidenavComponent, NgAdditionalsComponent, BodyComponent];

@NgModule({
  declarations: [...NG_COMPONENTS],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [...NG_COMPONENTS],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
    };
  }
}

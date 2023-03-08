import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { ThemeModule } from '../theme/theme.module';
import { PagesComponent } from './pages.component';
import { routing } from './pages.routing';

@NgModule({
  declarations: [PagesComponent],
  imports: [CommonModule, ThemeModule, routing, MaterialModule],
})
export class PagesModule {}

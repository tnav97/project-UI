import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { customEmployeeSearchPipe } from 'src/app/core/Pipes/search.pipe';
import { MaterialModule } from 'src/app/material.module';
import { AddroleComponent } from './addrole/addrole.component';
import { SeekerlistComponent } from './seekerlist/seekerlist.component';
import { SkillseekerRolesRoutingModule } from './skillseeker-roles-routing.module';
import { SkillseekerRolesComponent } from './skillseeker-roles.component';
import { UsermapComponent } from './usermap/usermap.component';

@NgModule({
  declarations: [SkillseekerRolesComponent, AddroleComponent, UsermapComponent, SeekerlistComponent, customEmployeeSearchPipe],
  imports: [CommonModule, SkillseekerRolesRoutingModule, MaterialModule, ReactiveFormsModule, FormsModule],
})
export class SkillseekerRolesModule {}

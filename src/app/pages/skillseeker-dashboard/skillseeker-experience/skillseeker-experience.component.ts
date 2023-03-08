import { Component, OnInit } from '@angular/core';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

@Component({
  selector: 'app-skillseeker-experience',
  templateUrl: './skillseeker-experience.component.html',
  styleUrls: ['./skillseeker-experience.component.scss'],
})
export class SkillseekerExperienceComponent implements OnInit {
  levelExperience: any;
  objs: any;
  selected: any;

  constructor(private readonly skillseekerdashboardService: skillseekerdashboardService) {}

  ngOnInit(): void {
    this.getOwnerSkillYearOfExperienceDetails();
  }

  getOwnerSkillYearOfExperienceDetails(): void {
    this.skillseekerdashboardService.getOwnerSkillYearOfExperienceDetails().subscribe((response) => {
      this.levelExperience = response;
      this.objs = this.levelExperience.map((x) => ({
        lvl: x[0],
        exp: x[1].split(','),
      }));
    });
  }

  listData(x: any) {
    this.selected = x;
  }
}

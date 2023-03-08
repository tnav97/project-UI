import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SeekerStatusUpdate } from 'src/app/api/flexcub-api/models';
import { SeekerAdminControllerService, SkillSeekerControllerService } from 'src/app/api/flexcub-api/services';

@Injectable({
  providedIn: 'root',
})
export class SkillseekerRolesService {
  constructor(
    private readonly skillSeekerController: SkillSeekerControllerService,
    private readonly seekerAdminControllerService: SeekerAdminControllerService
  ) {}

  getRoleListDetails() {
    return this.skillSeekerController.getSubRoles();
  }

  getModules() {
    return this.skillSeekerController.getModules();
  }

  getSeekerById(taxId: any) {
    return this.skillSeekerController.getSeekerById({ taxId: taxId });
  }

  getAccessById(taxId: any) {
    return this.skillSeekerController.getAccessById({ taxId: taxId });
  }

  addSubRole(request: any): Observable<any> {
    return this.skillSeekerController.addSubRole({ body: request });
  }
  addSubRoleToSeeker(id, roleId): Observable<any> {
    return this.skillSeekerController.addSeekerSubRoles({ skillSeekerId: id, role: roleId });
  }
  updateSeekerStatus(req): Observable<SeekerStatusUpdate> {
    return this.seekerAdminControllerService.updateSeekerStatus({ body: req });
  }
}

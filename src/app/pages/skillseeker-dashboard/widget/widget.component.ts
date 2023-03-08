import { Options } from '@angular-slider/ngx-slider';
import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { SelectionPhaseResponse } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WidgetComponent implements OnInit {
  jobId: string;
  show: boolean = false;
  candidateItemList = [];
  copycandidateItemList = [];
  copycandidateItemListData = [];
  jobTitle: string;
  isLocked: boolean;
  isLoading = true;
  counter = [];
  ClearRateBoolean = true;
  copyItems: any;
  soImgUrl = ownerImgUrl;
  add: string;
  // value: number = 0;
  // options: Options = {
  //   floor: 0,
  //   ceil: 100,
  //   step
  // };

  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 100,
    // step: 10,
    // showTicks: true
  };
  show2: boolean = true;
  show3: boolean = false;
  dialogConfig: string = '';
  items: keyvalue[] = [];
  basket: keyvalue[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private rd: Renderer2,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly skillseekerdashboardService: skillseekerdashboardService
  ) {
    this.items = this.getItems();
    this.basket = this.getBasket();
  }

  ngOnInit(): void {
    this.getQueryParams();
    this.isLoading = true;
    this.skillseekerdashboardService.isLocked(this.jobId).subscribe(
      (res) => {
        this.isLocked = res?.locked;
        res?.flow ? ((this.show = false), (this.isLoading = false)) : null;
      },
      (err) => (this.isLoading = false)
    );
  }

  getQueryParams(): void {
    this.activatedRoute.params
      .pipe(
        filter((param: Params) => !!param),
        first()
      )
      .subscribe((param: Params) => {
        this.jobId = param.jobId;
        this.getCandidateItems(this.jobId);
      });
  }

  drop(event: CdkDragDrop<keyvalue[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const m = this.items[event?.previousIndex] ?? null;
      const i = this.basket.filter((e) => e?.item === m?.item);
      i?.length === 0
        ? this.basket.splice(event.currentIndex, 0, { ...m })
        : this.basket.splice(event.currentIndex, 0, { ...m, item: `${m?.item} ${i?.length + 1}` });
      // copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.show3 = true;
    }

    let count = 0;
    const { container } = event;
    container?.data?.forEach((e) => {
      if (e?.item === container.data[event?.currentIndex]?.item) {
        count++;
        this.show3 = true;
        if (this.show && event?.currentIndex !== container?.data?.length - 1) {
          container.data[event?.currentIndex] = { ...container.data[event.currentIndex], value: count - 1 };
        } else {
          const n = this.getOccurrence(container.data, { ...container.data[event.currentIndex] }['item']) - 1;
          container.data[event?.currentIndex] = { ...container.data[event?.currentIndex], value: n };
        }
      }
    });
  }

  onEnter() {
    this.add?.trim()?.length > 0 ? this.items.push({ item: this.add, value: 0, color: `${this.color()}` }) : null;
    this.show2 = true;
    this.add = '';
  }

  edit() {
    this.show2 = false;
  }

  getOccurrence = (array: any[], value: any) => array.filter((v) => v?.item === value).length;

  noReturnPredicate = () => false;

  allowedPredicate = (item: CdkDrag) => true;

  color = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  reset() {
    this.show = false;
    this.basket = this.getBasket();
    this.items = this.getItems();
  }

  getCandidateItems(jobId: string): void {
    this.skillseekerdashboardService.getCandidateItems(jobId).subscribe((res) => {
      const j = res ?? [];
      j?.forEach((e) => {
        forkJoin([
          this.skillseekerdashboardService.getById(e?.skillOwnerId),
          this.skillseekerdashboardService.downloadImage(e?.skillOwnerId),
        ]).subscribe(
          ([n, m]) => {
            e?.rate === null ? (e.rate = n?.rateCard ?? 0) : null;
            e['image'] = `${this.soImgUrl}${e?.skillOwnerId}`;
          },
          (err) => {
            e['image'] = 'assets/images/avatar-default-skillowner.png';
          }
        );
      });
      this.candidateItemList = j;
      this.jobTitle = res[0].jobTitle;
    });
  }

  previousStatus() {
    this.skillseekerdashboardService.isLocked(this.jobId).subscribe((res) => {
      const data = res?.flow ?? [];
      const basket: keyvalue[] = [];
      const items = [...this.getItems(), ...this.getBasket()];
      data?.forEach((e, i: number) => {
        const ii = items.findIndex((n) => n?.item?.indexOf(e) > -1) ?? -1;
        /**
         * The below validation might be required in the future case, please don't remove.
         * if(ii === -1) return;
         * */
        const c = res?.percentageExpected[i];
        // basket?.push({ item: e, value: parseInt(c) || 0, color: `${items[ii]?.color ?? items[i]?.color}` });
      });
      this.basket = basket;
      this.show = true;
    });
  }

  close() {
    this.dialogConfig = '';
  }

  get _publish(): boolean {
    return this.candidateItemList.every((n) => n['rate'] !== null);
  }

  get _basket(): keyvalue[] {
    return this.basket.filter((e) => !['Start', 'Initial Screening', 'Final Discussion', 'Offer Release'].includes(e?.item)) ?? [];
  }

  publish() {
    this.isLoading = true;

    // if (!this.candidateItemList.every((n) => parseFloat(n['rate']) > 0)) {
    //   Swal.fire({
    //     position: 'center',
    //     icon: 'error',
    //     title: 'Rate cannot be 0 $',
    //     showConfirmButton: false,
    //     timer: 1500,
    //   });
    //   return;
    // }

    const requirement = [],
      percentage = [];
    ['Initial Screening'].forEach((e) => (requirement.push(e), percentage.push(0)));
    this._basket.forEach((e) => (requirement.push(e?.item), percentage.push(e?.value)));
    ['Final Discussion', 'Offer Release'].forEach((e) => (requirement.push(e), percentage.push(0)));

    this.copycandidateItemList = this.candidateItemList;
    this.copycandidateItemList?.forEach((n) => {
      this.copycandidateItemListData.push({
        skillOwnerId: n.skillOwnerId,
        jobId: n.jobId,

      });
    });
    const j = { jobId: this.jobId, requirementPhases: requirement};
    this.dialogConfig = '';

    this.skillseekerdashboardService.InsertRequirementPhasesPath(j).subscribe(
      async (res) => {
        await this.skillseekerdashboardService.skillOwnerRate(this.copycandidateItemListData).toPromise();
        this.router.navigate(['/ssdashboard/ListItems/jobId/' + this.jobId]);
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }

  openPopup() {
    this.dialogConfig = 'percentage';
  }

  rateEntry(event: Event, n: SelectionPhaseResponse): void {
    n['rate'] = parseFloat((event.target as HTMLInputElement)?.value) || 0;
  }

  onlyPrice(event: KeyboardEvent): void {
    const regex = /[0-9\\.\\]/;
    const character = String.fromCharCode(event?.charCode);
    event?.keyCode !== 8 && !regex.test(character) ? event?.preventDefault() : null;
  }

  getItems(): keyvalue[] {
    return [
      { item: 'Written Test', value: 0, color: '#93cc65' },
      { item: 'Coding Round', value: 0, color: '#cc7a65' },
      { item: 'Technical Interview', value: 0, color: '#00FFFF' },
      { item: 'HR Interview', value: 0, color: '#bf84ee' },
      { item: 'Hiring Manager Review', value: 0, color: '#df5bab' },
      { item: 'Behavioral Assesment', value: 0, color: '#5cc0a2' },
      { item: 'Bar Raiser', value: 0, color: '#4885ed' },
    ];
  }

  getBasket(): keyvalue[] {
    return [
      { item: 'Start', value: 0, color: '#3cba54' },
      { item: 'Initial Screening', value: 0, color: '#edb33f' },
    ];
  }
}

interface keyvalue {
  item: string;
  value: number;
  color: any;
}

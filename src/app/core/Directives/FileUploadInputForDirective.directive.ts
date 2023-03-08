import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';

/**
 * A material design file upload queue component.
 */
@Directive({
  selector: 'input[fileUploadInputFor], div[fileUploadInputFor]',
})
export class FileUploadInputForDirective {
  private _queue: any = null;
  private _element: HTMLElement;
  @Output() public onFileSelected: EventEmitter<File[]> = new EventEmitter<File[]>();

  constructor(private element: ElementRef) {
    this._element = this.element.nativeElement;
  }

  @Input('fileUploadInputFor')
  set fileUploadQueue(value: any) {
    if (value) {
      this._queue = value;
    }
  }

  @HostListener('change')
  public onChange(): any {
    let files = this.element.nativeElement.files;
    this.onFileSelected.emit(files);

    for (var i = 0; i < files.length; i++) {
      this._queue.add(files[i]);
    }
    this.element.nativeElement.value = '';
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any): any {
    let files = event.dataTransfer.files;
    const allowed_types = ['application/vnd.ms-excel', '.csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    this.onFileSelected.emit(files);
    if (allowed_types.indexOf(files[0].type) < 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Only Files are allowed ( Excel | CSV )',
        showConfirmButton: false,
        timer: 1500,
      });
      return false;
    }
    for (var i = 0; i < files.length; i++) {
      this._queue.add(files[i]);
    }
    event.preventDefault();
    event.stopPropagation();
    this.element.nativeElement.value = '';
  }

  @HostListener('dragover', ['$event'])
  public onDropOver(event: any): any {
    event.preventDefault();
  }
}

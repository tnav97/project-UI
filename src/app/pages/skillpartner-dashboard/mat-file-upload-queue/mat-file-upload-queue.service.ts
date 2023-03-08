import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IInput } from 'src/app/core/models/input';

@Injectable()
export class MatFileUploadQueueService {
  private inputValueSubject = new BehaviorSubject<IInput>(null);
  inputValue$ = this.inputValueSubject.asObservable();

  initialize(input: IInput) {
    this.inputValueSubject.next(input);
  }

  getInputValue() {
    return this.inputValueSubject.getValue();
  }
}

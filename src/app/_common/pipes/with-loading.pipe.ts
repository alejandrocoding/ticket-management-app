import { Pipe, PipeTransform } from '@angular/core';

import { isObservable, Observable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';

export interface ObservableWithStatus<T> {
  loading?: boolean;
  value?: T;
  error?: string;
}

@Pipe({ name: 'withLoading' })
export class WithLoadingPipe implements PipeTransform {
  transform<T = any>(val: Observable<T>): Observable<ObservableWithStatus<T>> {
    return isObservable(val)
      ? val.pipe(
        map((value: any) => ({ loading: false, value })),
        startWith({ loading: true }),
        catchError(error => of({ loading: false, error }))
      )
      : val;
  }
}

import { NgModule } from '@angular/core';
@NgModule({
  declarations: [WithLoadingPipe],
  exports: [WithLoadingPipe]
})
export class WithLoadingPipeModule { }

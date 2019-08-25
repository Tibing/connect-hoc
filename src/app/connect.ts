import { INJECTOR, Injector, ɵɵdirectiveInject as directiveInject } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface Mapping {
  selectors: { [key: string]: string | ((state: any) => any) };
  actions: { [key: string]: (payload: any) => Action };
}

export const Connect = (mapping: Mapping) => {
  return cmpType => {

    const factory = cmpType.ngComponentDef.factory;
    const onDestroy = cmpType.ngComponentDef.onDestroy;

    const destroy$ = new Subject<void>();

    cmpType.ngComponentDef.factory = (...args) => {
      const cmp = factory(...args);
      const { selectors, actions } = mapping;

      const injector: Injector = directiveInject(INJECTOR);
      const store: Store<any> = injector.get(Store);

      for (const [key, selector] of Object.entries(selectors)) {
        store.pipe(
          select(selector),
          takeUntil(destroy$),
        ).subscribe(val => {
          cmp[key] = val;
        });
      }

      for (const [key, action] of Object.entries(actions)) {
        cmp[key]
          .pipe(
            takeUntil(destroy$),
          )
          .subscribe(val => store.dispatch(action(val)));
      }

      cmpType.ngComponentDef.onDestroy = () => {
        destroy$.next();
        onDestroy.call(cmp);
      };

      return cmp;
    };

    return cmpType;
  };
};

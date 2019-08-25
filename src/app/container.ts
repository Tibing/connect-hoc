import {
  INJECTOR,
  Injector,
  ɵɵdirectiveInject as directiveInject,
  ɵɵelementStart as elementStart,
  ɵɵloadQuery as loadQuery,
  ɵɵqueryRefresh as queryRefresh,
  ɵɵstaticViewQuery as staticViewQuery,
} from '@angular/core';

const rotateAnimation = `
@keyframes spin {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}`;

const styles = `
animation:spin 1s linear infinite;
`;

export const Container = (cmpType) => {
  const factory = cmpType.ngComponentDef.factory;
  const template = cmpType.ngComponentDef.template;

  cmpType.ngComponentDef.viewQuery = (rf, ctx) => {
    if (rf & 1) {
      staticViewQuery(['button'], true);
    }
    if (rf & 2) {
      let res;
      queryRefresh(res = loadQuery()) && (ctx.buttons = res.first);
    }
  };

  cmpType.ngComponentDef.styles.push(rotateAnimation);

  cmpType.ngComponentDef.template = (rf, ctx) => {
    if (rf & 1) {
      elementStart(-1, 'div', ['style', styles]);
    }
    template(rf, ctx);
  };

  cmpType.ngComponentDef.factory = (...args) => {
    const cmp = factory(...args);
    const injector: Injector = directiveInject(INJECTOR);

    return cmp;
  };

  return cmpType;
};

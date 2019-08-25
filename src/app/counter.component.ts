import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Connect } from './connect';
import { decrement, increment, reset } from './counter.actions';
import { Container } from './container';

@Container
@Connect({
  selectors: { count: 'count' },
  actions: { increment, decrement, reset },
})
@Component({
  selector: 'app-counter',
  styles: [`
  `],
  template: `
    <button #button id="increment" (click)="increment.emit()">Increment</button>

    <div #div>Current Count: {{ count }}</div>

    <button id="decrement" (click)="decrement.emit()">Decrement</button>

    <button id="reset" (click)="reset.emit()">Reset Counter</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CounterComponent {
  @Input() count: number;

  @Output() increment = new EventEmitter();
  @Output() decrement = new EventEmitter();
  @Output() reset = new EventEmitter();
}

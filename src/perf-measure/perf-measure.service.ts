import { Injectable, OpaqueToken, Inject } from '@angular/core';

export const perfMeasureServiceEnabled = new OpaqueToken('perfMeasureServiceEnabled');

@Injectable()
export class NativePerformance {
  private nativeMark: (name: string) => void;

  constructor() {
    // TODO(jeffbcross): would not work in Universal or Web Worker
    if (window.performance && window.performance.mark) {
      this.nativeMark = (name: string) => window.performance.mark(name);
    }
  }

  mark(name: string) {
    window.performance.mark(name);
  }
}


@Injectable()
export class PerfMeasureService {
  constructor(public perf: NativePerformance, @Inject(perfMeasureServiceEnabled) private perfEnabled: boolean) {}

  mark(name: string): void {
    if (this.perfEnabled) {
      this.perf.mark(name);
    }
  }
}

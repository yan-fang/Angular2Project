import { TestBed, inject } from '@angular/core/testing';

import { PerfMeasureService, NativePerformance } from './perf-measure.service';
import { PerfMeasureModule } from './perf-measure.module';

describe('PerfMeasureService', () => {
  describe('mark', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PerfMeasureModule],
        providers: []
      });
    });

    it('should call window performance mark', inject(
      [PerfMeasureService, NativePerformance],
      (service: PerfMeasureService, perf: NativePerformance) => {
        const markSpy = spyOn(perf, 'mark');

        service.mark('foo');
        expect(markSpy).toHaveBeenCalledWith('foo');
    }));

    it('should not mark when disabled', () => {
      const module = TestBed.configureTestingModule({
        imports: [PerfMeasureModule.disable()],
        providers: []
      });

      const service = module.get(PerfMeasureService);
      const perf = module.get(NativePerformance);

      const markSpy = spyOn(perf, 'mark');

      service.mark('foo');
      expect(markSpy).not.toHaveBeenCalled();
    });
  });
});

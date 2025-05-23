import { Injectable } from '@angular/core';
import { ReportBaseService } from './report-base.service';
import { Row } from '@models/interfaces/row.model';
import { ReportChartService } from './report-chart.service';
import { InitialEstimation } from '@models/interfaces/initial-estimation.model';
import { SummatoryKeys } from '@models/enums/summatory-keys.enum';
import { ReportDetailService } from './report-detail.service';

@Injectable({
  providedIn: 'root',
})
export class ReportInitialEstimationService extends ReportBaseService {
  constructor(
    private _reportChartService: ReportChartService,
    private _reportDetailService: ReportDetailService
  ) {
    super();
  }

  getEstimationByFeature(data: Row[]) {
    const features = [
      ...new Set(data.map((item: Row) => this.getFeature(item))),
    ];
    const estimationByFeature: InitialEstimation[] = features.map(
      (feature: string) => {
        const dataEstimated = data.filter(
          (item: Row) => this.getFeature(item) === feature
        );
        return {
          feature: feature,
          data: dataEstimated,
          estimated: dataEstimated.reduce(
            this.#getSummatoryByProperty(SummatoryKeys.ESTIMATED),
            0
          ),
          invested: dataEstimated.reduce(
            this.#getSummatoryByProperty(SummatoryKeys.INVESTED),
            0
          ),
        };
      }
    );
    return estimationByFeature;
  }

  getFeatureDetail(data: Row[]) {
    return this._reportDetailService.getDetails(data);
  }

  #getSummatoryByProperty(property: SummatoryKeys) {
    return (total: number, item: Row) => total + Number(item[property]);
  }
}

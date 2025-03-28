import { Phase } from '@models/enums/phase.enum';
import { Configuration } from '@models/interfaces/config.model';

export const ENDED_PHASES: string[] = [
  Phase.CLOSED,
  Phase.DONE,
  Phase.FIXED,
  Phase.COMPLETED,
];
export let MIN_ESTIMATION_VS_INVESTED: number = 20;
export let NAME_MAIN_TYPE: string = 'User Story';
export let NAME_BUG_TYPE: string = 'Defect';
export const CEREMONIES: string[] = [
  'CodeReview',
  'Daily',
  'Planning',
  'Refinement',
  'Review DEMO',
];
export let RATIO_BUGS: number = 60;
export let EFICIENCY: number = 10;
export let SHOW_EFICIENCY: boolean = true;

export function getCurrentConfig(): Configuration {
  return {
    estimatedVsInvested: MIN_ESTIMATION_VS_INVESTED,
    defectRatio: RATIO_BUGS,
    efficiency: EFICIENCY,
    defectName: NAME_BUG_TYPE,
    mainName: NAME_MAIN_TYPE,
    showEfficiency: SHOW_EFICIENCY,
  };
}

export function setMinEstimatedVsInvested(_newValue: number | undefined) {
  if (_newValue) {
    MIN_ESTIMATION_VS_INVESTED = _newValue;
  }
}

export function setNameMainType(_newValue: string | undefined) {
  if (_newValue) {
    NAME_MAIN_TYPE = _newValue;
  }
}

export function setNameBugType(_newValue: string | undefined) {
  if (_newValue) {
    NAME_BUG_TYPE = _newValue;
  }
}

export function setRatioBugs(_newValue: number | undefined) {
  if (_newValue) {
    RATIO_BUGS = _newValue;
  }
}

export function setEficiency(_newValue: number | undefined) {
  if (_newValue) {
    EFICIENCY = _newValue;
  }
}

export function setShowEficiency(_newValue: boolean | undefined) {
  if (_newValue !== undefined) {
    SHOW_EFICIENCY = _newValue;
  }
}

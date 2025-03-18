import { Phase } from '@models/enums/phase.enum';
import { Configuration } from '@models/interfaces/config.model';

export let ENDED_PHASES: string[] = [
  Phase.CLOSED,
  Phase.DONE,
  Phase.FIXED,
  Phase.COMPLETED,
];
export let MIN_ESTIMATION_VS_INVESTED: number = 20;
export let NAME_MAIN_TYPE: string = 'User Story';
export let NAME_BUG_TYPE: string = 'Defect';
export let CEREMONIES: string[] = [
  'CodeReview',
  'Daily',
  'Planning',
  'Refinement',
  'Review DEMO',
];
export let RATIO_BUGS: number = 60;
export let EFICIENCY: number = 10;

export function getCurrentConfig(): Configuration {
  return {
    minEstimacionVsInvertido: MIN_ESTIMATION_VS_INVESTED,
    ratioBugs: RATIO_BUGS,
    ceremonias: CEREMONIES,
    eficiencia: EFICIENCY,
    nombreTipoBug: NAME_BUG_TYPE,
    nombreTipoPrincipal: NAME_MAIN_TYPE,
    fasesTerminadas: ENDED_PHASES,
  };
}

export function setEndedPhases(_newValue: string[] | undefined) {
  if (_newValue) {
    ENDED_PHASES = _newValue;
  }
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

export function setCeremonies(_newValue: string[] | undefined) {
  if (_newValue) {
    CEREMONIES = _newValue;
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

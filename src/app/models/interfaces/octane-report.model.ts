import { BaseTable, EfficiencyTable } from './base-table.model';
import { InitialEstimation } from './initial-estimation.model';

export interface OctaneReport {
  backlog: BaseTable;
  initialEstimation: InitialEstimation[];
  team: BaseTable;
  project: EfficiencyTable;
}

export enum BacklogItemProperty {
  cycle = 'cycle',
  sprint = 'sprint',
  noEstimated = 'noEstimated',
  withRemaining = 'withRemaining',
  noInvested = 'noInvested',
  opened = 'opened',
  noAsigned = 'noAsigned',
  suspiciousInvestement = 'suspiciousInvestement',
  bugs = 'bugs',
  defects = 'defects',
  ceremonies = 'ceremonies',
  estimatedVsInvested = 'estimatedVsInvested',
}

export enum TeamItemProperty {
  member = 'member',
  doneOrClosed = 'doneOrClosed',
  estimatedVsInvested = 'estimatedVsInvested',
}

//Project
// value: 'tasksWithoutSprint'
// value: 'estimatedVsInvested'

//Detail
// value: 'id'
// value: 'feature'
// value: 'team'
// value: 'tags'
// value: 'name'
// value: 'owner'
// value: 'storyPoints'
// value: 'remainingHours'
// value: 'estimatedHours'
// value: 'investedHours'
// value: 'phase'
// value: 'estimatedVsInvested'

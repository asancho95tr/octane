import { BaseTable, EfficiencyTable } from './base-table.model';

export interface OctaneReport {
  backlog: BaseTable;
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

// value: 'tasksWithoutSprint'
// value: 'estimatedVsInvested'

// value: 'member'
// value: 'doneOrClosed'
// value: 'estimatedVsInvested'

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

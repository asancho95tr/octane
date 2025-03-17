import { Phase } from '../enums/phase.enum';

export interface Row {
  ID: number;
  Release: string;
  'Backlog item: Sprint': string;
  'Remaining hours': number;
  'Estimated hours': number;
  'Invested hours': number;
  'Has attachments': string;
  'Backlog item: Tags': string;
  'Backlog item: Priority': string;
  'Backlog item': string;
  'Backlog item: Description': string;
  'Backlog item: Phase': Phase;
  'Backlog item: Parent': string;
  Name: string;
  Description: string;
  Phase: Phase;
  Progress: string;
  'Backlog item: Story points': number;
  'Backlog item: Fixed in build': string;
  'Creation time': number;
  'Backlog item: Blocked': string;
  'Backlog item: Blocked reason': string;
  Author: string;
  'Last modified': number;
  Owner: string;
  'Backlog item: Type': string;
  ID_hyperlink: string;
  Status: string;
  'Numero defectos encontrados': number;
  Assigned: string;
  efficiency: string;
}

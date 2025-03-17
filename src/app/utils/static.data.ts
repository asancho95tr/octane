import { HeadersType } from '@models/enums/headers-type.enum';
import { Header } from '@models/interfaces/header.model';

export const REPORT_HEADERS: Header[] = [
  { text: 'Ciclo', value: 'cycle', type: HeadersType.TEXT },
  { text: 'Sprint', value: 'sprint', type: HeadersType.TEXT },
  { text: 'Sin estimar', value: 'noEstimated', type: HeadersType.NUMBER },
  { text: 'Con ETC', value: 'withRemaining', type: HeadersType.NUMBER },
  { text: 'Sin incurrir', value: 'noInvested', type: HeadersType.NUMBER },
  { text: 'Abiertas', value: 'opened', type: HeadersType.NUMBER },
  { text: 'Sin asignado', value: 'noAsigned', type: HeadersType.NUMBER },
  {
    text: 'Estimado=Incurrido',
    value: 'suspiciousInvestement',
    type: HeadersType.NUMBER,
  },
  { text: 'Bugs', value: 'bugs', type: HeadersType.NUMBER },
  {
    text: 'Número defectos encontrados',
    value: 'defects',
    type: HeadersType.NUMBER,
    hidden: true,
  },
  {
    text: 'Ceremonias',
    value: 'ceremonies',
    type: HeadersType.NUMBER,
    hidden: true,
  },
  {
    text: 'Estimado vs incurrido',
    value: 'estimatedVsInvested',
    type: HeadersType.PERCENT,
  },
];

export const EFFICIENY_HEADERS: Header[] = [
  {
    value: 'tasksWithoutSprint',
    text: 'Tareas sin sprint',
    type: HeadersType.NUMBER,
  },
  {
    value: 'estimatedVsInvested',
    text: 'Estimado vs invertido',
    type: HeadersType.PERCENT,
  },
];

export const TEAM_EFICIENCY_HEADERS: Header[] = [
  {
    value: 'member',
    text: 'Persona',
    type: HeadersType.TEXT,
  },
  {
    value: 'doneOrClosed',
    text: 'Tareas finalizadas',
    type: HeadersType.NUMBER,
  },
  {
    value: 'estimatedVsInvested',
    text: 'Estimado vs incurrido',
    type: HeadersType.PERCENT,
  },
];

export const DETAIL_HEADERS: Header[] = [
  { text: 'ID', value: 'id', type: HeadersType.LINK },
  { text: 'Feature', value: 'feature', type: HeadersType.TEXT, hidden: true },
  { text: 'Team', value: 'team', type: HeadersType.TEXT, hidden: true },
  { text: 'Tags', value: 'tags', type: HeadersType.TEXT, hidden: true },
  { text: 'Name', value: 'name', type: HeadersType.TEXT },
  { text: 'Owner', value: 'owner', type: HeadersType.TEXT },
  { text: 'Story points', value: 'storyPoints', type: HeadersType.TEXT },
  {
    text: 'Remaining hours',
    value: 'remainingHours',
    type: HeadersType.NUMBER,
  },
  {
    text: 'Estimated hours',
    value: 'estimatedHours',
    type: HeadersType.NUMBER,
  },
  { text: 'Invested hours', value: 'investedHours', type: HeadersType.NUMBER },
  { text: 'Phase', value: 'phase', type: HeadersType.TEXT },
  {
    text: 'Estimado vs incurrido',
    value: 'estimatedVsInvested',
    type: HeadersType.PERCENT,
  },
];

export const KeysText: any = {
  ceremonias: 'Tareas tipo',
  minEstimacionVsInvertido: 'Estimado=Incurrido',
  nombreTipoPrincipal: 'Valor tipo tarea principal',
  nombreTipoBug: 'Valor tipo tarea bug',
  fasesTerminadas: 'Fases terminadas',
  eficiencia: '% Estimado vs incurrido',
  ratioBugs: 'Ratio bugs',
};

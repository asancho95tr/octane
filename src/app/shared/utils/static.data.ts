import { HeadersType } from '@models/enums/headers-type.enum';
import { Header } from '@models/interfaces/header.model';

export const REPORT_HEADERS: Header[] = [
  { text: 'Ciclo', value: 'cycle', type: HeadersType.TEXT },
  { text: 'Sprint', value: 'sprint', type: HeadersType.TEXT },
  { text: 'Equipo', value: 'teamSize', type: HeadersType.NUMBER },
  {
    text: 'Sin estimar',
    value: 'noEstimated',
    type: HeadersType.NUMBER,
    tooltip: "Número de tareas sin 'Estimated hours'",
  },
  {
    text: 'Con ETC',
    value: 'withRemaining',
    type: HeadersType.NUMBER,
    tooltip: "Número de tareas con 'Remaining hours'",
  },
  {
    text: 'Sin incurrir',
    value: 'noInvested',
    type: HeadersType.NUMBER,
    tooltip: "Número de tareas sin 'Invested hours'",
  },
  {
    text: 'Abiertas',
    value: 'opened',
    type: HeadersType.NUMBER,
    tooltip:
      "Número de tareas en phase diferente a 'Closed', 'Fixed', 'Completed' y 'Done'",
  },
  {
    text: 'Sin asignado',
    value: 'noAsigned',
    type: HeadersType.NUMBER,
    tooltip: "Número de tareas sin 'Owner'",
  },
  {
    text: 'Estimado=Incurrido',
    value: 'suspiciousInvestement',
    type: HeadersType.NUMBER,
    tooltip:
      "Número de tareas que tienen la misma cantidad 'Invested hours' y 'Estimated hours' siendo superior al ratio configurado (20h por defecto)",
  },
  {
    text: 'Bugs',
    value: 'bugs',
    type: HeadersType.NUMBER,
    tooltip: "Número de tareas de tipo 'Defect'",
  },
  {
    text: 'Número defectos encontrados',
    value: 'defects',
    type: HeadersType.NUMBER,
    hidden: true,
    tooltip:
      "Sumatorio del valor del campo 'Número defectos encontrados' de cada tarea",
  },
  {
    text: 'Ceremonias',
    value: 'ceremonies',
    type: HeadersType.NUMBER,
    hidden: true,
    tooltip:
      "Número de tareas con nombre de ceremonia ('CodeReview', 'Daily', 'Planning', 'Refinement', 'Review DEMO')",
  },
  {
    text: 'Estimado vs incurrido',
    value: 'estimatedVsInvested',
    type: HeadersType.PERCENT,
    tooltip:
      "Cálculo porcentual entre 'Invested hours' y 'Estimated hours'.\n\n (estimated / (inProgress ? invested + remaining : invested)",
  },
];

export const EFFICIENY_HEADERS: Header[] = [
  {
    value: 'tasksWithoutSprint',
    text: 'Tareas sin sprint',
    type: HeadersType.NUMBER,
    tooltip: 'Número de tareas sin sprint',
  },
  {
    value: 'estimatedVsInvested',
    text: 'Estimado vs invertido',
    type: HeadersType.PERCENT,
    tooltip:
      "Cálculo porcentual entre 'Invested hours' y 'Estimated hours'.\n\n (estimated / (inProgress ? invested + remaining : invested)",
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
    tooltip:
      "Número de tareas en phase 'Closed', 'Fixed', 'Completed' o 'Done'",
  },
  {
    value: 'estimatedVsInvested',
    text: 'Estimado vs incurrido',
    type: HeadersType.PERCENT,
    tooltip:
      "Cálculo porcentual entre 'Invested hours' y 'Estimated hours'.\n\n (estimated / (inProgress ? invested + remaining : invested)",
  },
];

export const DETAIL_HEADERS: Header[] = [
  { text: 'ID', value: 'id', type: HeadersType.LINK },
  { text: 'Feature', value: 'feature', type: HeadersType.TEXT },
  { text: 'Team', value: 'team', type: HeadersType.TEXT, hidden: true },
  { text: 'Tags', value: 'tags', type: HeadersType.TEXT, hidden: true },
  { text: 'Name', value: 'name', type: HeadersType.TEXT },
  { text: 'Owner', value: 'owner', type: HeadersType.TEXT },
  {
    text: 'Story points',
    value: 'storyPoints',
    type: HeadersType.TEXT,
    hidden: true,
  },
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
    tooltip:
      "Cálculo porcentual entre 'Invested hours' y 'Estimated hours'.\n\n (estimated / (inProgress ? invested + remaining : invested)",
  },
];

export const KeysText: Record<string, string> = {
  ceremonies: 'Tareas tipo',
  estimatedVsInvested: 'Estimado=Incurrido',
  mainName: 'Valor tipo tarea principal',
  defectName: 'Valor tipo tarea bug',
  closedPhases: 'Fases terminadas',
  efficiency: '% Estimado vs incurrido',
  defectRatio: 'Ratio bugs',
  showEfficiency: 'Mostrar "Estimado vs incurrido"',
};

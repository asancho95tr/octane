export interface Configuration {
    ceremonias?: string[];
    minEstimacionVsInvertido?: number;
    nombreTipoPrincipal?: string;
    nombreTipoBug?: string;
    fasesTerminadas?: string[];
    eficiencia?: number;
    ratioBugs?: number;
}

export interface ProjectConfiguration {
    name: string;
    configuration: Configuration;
}

export const KeysText: any = {
    "ceremonias": "Tareas tipo",
    "minEstimacionVsInvertido": "Estimado=Incurrido",
    "nombreTipoPrincipal": "Valor tipo tarea principal",
    "nombreTipoBug": "Valor tipo tarea bug",
    "fasesTerminadas": "Fases terminadas",
    "eficiencia": "% Estimado vs incurrido",
    "ratioBugs": "Ratio bugs"
}

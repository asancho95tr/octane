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

export interface Configuration {
  estimatedVsInvested: number;
  defectRatio: number;
  efficiency: number;
  defectName: string;
  mainName: string;
  showEfficiency: boolean;
}

export interface ProjectConfiguration {
  name: string;
  configuration: Configuration;
}

import { Injectable } from '@angular/core';
import {
  Configuration,
  ProjectConfiguration,
} from '@models/interfaces/config.model';
import {
  getCurrentConfig,
  setCeremonies,
  setEficiency,
  setEndedPhases,
  setMinEstimatedVsInvested,
  setNameBugType,
  setNameMainType,
  setRatioBugs,
} from '@utils/config.data';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  get currentConfigName(): string {
    return this._localStorageService.getLastSelectedConfigName() ?? '';
  }

  constructor(private _localStorageService: LocalStorageService) {}

  startApp() {
    this._localStorageService.getConfigurationList();
    const config: Configuration | undefined =
      this._localStorageService.getLastConfig();
    if (config) {
      this.updateConstants(config);
    }
  }

  async setData(event: any) {
    return new Promise<Configuration>((resolve, reject) => {
      const fileReader: FileReader = this.uploadConfig(event);
      let jsonObj: Configuration = {};
      fileReader.onload = () => {
        jsonObj = JSON.parse(fileReader.result?.toString() ?? '');
        resolve(jsonObj);
      };
      fileReader.onerror = (error) => {
        console.log(error);
        reject({});
      };
    });
  }

  uploadConfig(event: any): FileReader {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, 'UTF-8');
    return fileReader;
  }

  updateConstants(json: Configuration) {
    setCeremonies(json.ceremonias);
    setMinEstimatedVsInvested(json.minEstimacionVsInvertido);
    setEndedPhases(json.fasesTerminadas);
    setNameMainType(json.nombreTipoPrincipal);
    setNameBugType(json.nombreTipoBug);
    setEficiency(json.eficiencia);
    setRatioBugs(json.ratioBugs);
  }

  getConfigurationsList(): ProjectConfiguration[] {
    return this._localStorageService.getConfigurationList();
  }

  saveConfig(name: string) {
    this._localStorageService.addConfiguration(name, getCurrentConfig());
  }

  loadConfig(name: string) {
    return this._localStorageService.getConfigurationByName(name)
      ?.configuration;
  }

  deleteConfig(name: string) {
    return this._localStorageService.removeConfiguration(name);
  }

  setLastSelectedConfig(name: string) {
    this._localStorageService.setLastSelectedConfig(name);
  }
}

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
  /**
   * Returns the name of the currently selected configuration. If no configuration
   * has been selected, it returns an empty string.
   *
   * @returns the name of the currently selected configuration
   */
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

  /**
   * Sets the configuration data using the selected file.
   * @param event The selected file event.
   * @returns a Promise that resolves with the configuration data if the file is
   *          successfully loaded, or rejects with an empty object if there is an
   *          error.
   */
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

  /**
   * Creates a FileReader object to read the selected file.
   * @param event The selected file event.
   * @returns The FileReader object.
   */
  uploadConfig(event: any): FileReader {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, 'UTF-8');
    return fileReader;
  }

  /**
   * Updates the constants used in the application with the data from the given
   * configuration object.
   * @param json The configuration object.
   */
  updateConstants(json: Configuration) {
    setCeremonies(json.ceremonias);
    setMinEstimatedVsInvested(json.minEstimacionVsInvertido);
    setEndedPhases(json.fasesTerminadas);
    setNameMainType(json.nombreTipoPrincipal);
    setNameBugType(json.nombreTipoBug);
    setEficiency(json.eficiencia);
    setRatioBugs(json.ratioBugs);
  }

  /**
   * Returns the list of configurations stored in local storage.
   *
   * @returns The list of configurations.
   */
  getConfigurationsList(): ProjectConfiguration[] {
    return this._localStorageService.getConfigurationList();
  }

  /**
   * Saves the current configuration under the specified name.
   * Adds the configuration to the list of configurations stored in local storage.
   *
   * @param name The name under which the current configuration should be saved.
   */

  saveConfig(name: string) {
    this._localStorageService.addConfiguration(name, getCurrentConfig());
  }

  /**
   * Loads the configuration associated with the given name from local storage.
   *
   * @param name The name of the configuration to load.
   * @returns The configuration object if found, otherwise undefined.
   */

  loadConfig(name: string) {
    return this._localStorageService.getConfigurationByName(name)
      ?.configuration;
  }

  /**
   * Removes the configuration associated with the given name from local storage.
   *
   * @param name The name of the configuration to delete.
   * @returns Whether the configuration was successfully deleted.
   */
  deleteConfig(name: string) {
    return this._localStorageService.removeConfiguration(name);
  }

  /**
   * Sets the name of the last selected configuration in local storage.
   *
   * @param name The name of the last selected configuration.
   */
  setLastSelectedConfig(name: string) {
    this._localStorageService.setLastSelectedConfig(name);
  }
}

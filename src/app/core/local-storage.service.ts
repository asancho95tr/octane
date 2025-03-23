import { Injectable } from '@angular/core';
import {
  Configuration,
  ProjectConfiguration,
} from '@models/interfaces/config.model';
import { getCurrentConfig } from '@utils/config.data';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private _lastConfig: string = 'lastConfig';
  private _parentObjectName: string = 'configurations';
  private _projectList: ProjectConfiguration[] = [];

  /**
   * Retrieves the list of configurations from local storage. If the list
   * doesn't exist, it returns an empty array.
   *
   * @returns {ProjectConfiguration[]} The list of configurations.
   */
  getConfigurationList(): ProjectConfiguration[] {
    const obj: string | null = localStorage.getItem(this._parentObjectName);
    if (obj) {
      this._projectList = (JSON.parse(obj) as ProjectConfiguration[]) ?? [];
    } else {
      this._projectList = [];
    }
    return this._projectList;
  }

  /**
   * Retrieves the last configuration from local storage. If the configuration
   * doesn't exist, it creates a default configuration and stores it in local
   * storage.
   *
   * @returns {Configuration | undefined} The last configuration.
   */
  getLastConfig(): Configuration | undefined {
    const lastConfigName: string | null = localStorage.getItem(
      this._lastConfig
    );
    if (lastConfigName) {
      return this.getConfigurationByName(lastConfigName)?.configuration;
    } else {
      const name: string = 'Por defecto';
      const config: Configuration = getCurrentConfig();
      this.setLastSelectedConfig(name);
      this.addConfiguration(name, config);
      return config;
    }
  }

  /**
   * Retrieves a configuration by its name from the list of configurations.
   *
   * @param {string} name The name of the configuration to retrieve.
   * @returns {ProjectConfiguration | undefined} The configuration if found, or undefined if not found.
   */
  getConfigurationByName(name: string): ProjectConfiguration | undefined {
    return this._projectList.find(
      (conf: ProjectConfiguration) => conf.name === name
    );
  }

  /**
   * Adds a new configuration to the list of configurations or updates an existing
   * configuration with the same name. The list of configurations is then stored
   * in local storage.
   *
   * @param {string} name The name of the configuration to add or update.
   * @param {Configuration} configuration The configuration to add or update.
   */
  addConfiguration(name: string, configuration: Configuration) {
    const projectConf: ProjectConfiguration | undefined =
      this.getConfigurationByName(name);
    if (projectConf) {
      projectConf.configuration = configuration;
    } else {
      this._projectList.push({ name: name, configuration: configuration });
    }
    this.overrideConfigurations();
  }

  /**
   * Removes a configuration from the list of configurations by its name.
   *
   * @param {string} name The name of the configuration to remove.
   */
  removeConfiguration(name: string) {
    const index: number = this._projectList.findIndex(
      (conf: ProjectConfiguration) => conf.name === name
    );
    if (index >= 0) {
      this._projectList.splice(index, 1);
    }
    this.overrideConfigurations();
  }

  /**
   * Overrides the current list of configurations in local storage with the
   * current state of the `_projectList` property. This method is called by
   * other methods of the service when the list of configurations has changed.
   */
  overrideConfigurations() {
    localStorage.setItem(
      this._parentObjectName,
      JSON.stringify(this._projectList)
    );
  }

  /**
   * Sets the last selected configuration name in local storage.
   *
   * @param {string} name - The name of the configuration to set as the last selected.
   */

  setLastSelectedConfig(name: string) {
    localStorage.setItem(this._lastConfig, name);
  }

  /**
   * Retrieves the name of the last selected configuration from local storage.
   *
   * @returns {string | null} The name of the last selected configuration, or null if not set.
   */

  getLastSelectedConfigName() {
    return localStorage.getItem(this._lastConfig);
  }
}

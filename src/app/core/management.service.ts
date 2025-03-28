import { Injectable } from '@angular/core';
import {
  Configuration,
  ProjectConfiguration,
} from '@models/interfaces/config.model';
import {
  getCurrentConfig,
  setEficiency,
  setMinEstimatedVsInvested,
  setNameBugType,
  setNameMainType,
  setRatioBugs,
  setShowEficiency,
} from '@shared/utils/config.data';
import {
  DefaultConfigName,
  LocalStorageKeys,
} from '@shared/utils/management.data';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  defaultConfig: Configuration = getCurrentConfig();
  lastConfig: string = DefaultConfigName;

  /**
   * Gets the list of all projects names from the local storage.
   * @returns An array of strings with the names of all the projects.
   */
  get projectsNamesList(): string[] {
    return this.getConfigurations().map(
      (config: ProjectConfiguration) => config.name
    );
  }

  /**
   * Loads the last configuration from local storage and updates the constants
   * used in the application with the data from the configuration.
   */
  startApp() {
    const config = this.getLastConfig();
    this.updateConstants(config);
  }

  /**
   * Updates the constants used in the application with the data from the given
   * configuration object.
   * @param json The configuration object.
   */
  updateConstants(json: Configuration) {
    setMinEstimatedVsInvested(json.estimatedVsInvested);
    setNameMainType(json.mainName);
    setNameBugType(json.defectName);
    setEficiency(json.efficiency);
    setRatioBugs(json.defectRatio);
    setShowEficiency(json.showEfficiency);
  }

  /**
   * Retrieves the last configuration from local storage. If the configuration
   * doesn't exist, it returns the default configuration.
   * @returns {Configuration} The last configuration.
   */
  getLastConfig(): Configuration {
    const lastConfigName: string | null = localStorage.getItem(
      LocalStorageKeys.LAST_CONFIG
    );
    const configurations = this.getConfigurations();
    if (lastConfigName) {
      this.lastConfig = lastConfigName;
      return (
        configurations.find(
          (config: ProjectConfiguration) => config.name === lastConfigName
        )?.configuration ?? this.defaultConfig
      );
    }
    this.setConfigutation(DefaultConfigName, this.defaultConfig);
    return this.defaultConfig;
  }

  /**
   * Retrieves the list of project configurations from local storage.
   * If no configurations are found, it returns an empty array.
   *
   * @returns {ProjectConfiguration[]} The list of project configurations.
   */

  getConfigurations(): ProjectConfiguration[] {
    const configurationsString = localStorage.getItem(LocalStorageKeys.CONFIG);
    if (configurationsString) {
      return JSON.parse(configurationsString) as ProjectConfiguration[];
    }
    return [];
  }

  /**
   * Updates the last configuration in local storage.
   * @param name The name of the configuration to set as the last one.
   */
  setLastConfig(name: string) {
    this.lastConfig = name;
    localStorage.setItem(LocalStorageKeys.LAST_CONFIG, name);
  }

  /**
   * Retrieves a project configuration by its name.
   *
   * @param {string} name The name of the configuration to retrieve.
   * @returns {ProjectConfiguration | undefined} The configuration with the given
   * name, or undefined if no configuration with that name is found.
   */
  getConfigurationByName(name: string): ProjectConfiguration | undefined {
    return this.getConfigurations().find(
      (config: ProjectConfiguration) => config.name === name
    );
  }

  /**
   * Updates or adds a project configuration in local storage.
   *
   * @param {string} name The name of the configuration to update or add.
   * @param {Configuration} configuration The configuration data to save.
   */
  setConfigutation(name: string, configuration: Configuration) {
    const project: ProjectConfiguration = {
      name: name,
      configuration: configuration,
    };
    const configurations = this.getConfigurations();
    const configurationIndex = configurations.findIndex(
      (config: ProjectConfiguration) => config.name === name
    );
    if (configurationIndex >= 0) {
      configurations[configurationIndex] = project;
    } else {
      configurations.push(project);
    }
    localStorage.setItem(
      LocalStorageKeys.CONFIG,
      JSON.stringify(configurations)
    );
    this.setLastConfig(name);
  }
}

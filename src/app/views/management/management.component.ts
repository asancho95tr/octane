import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ConfigService } from '@core/config.service';
import { ToastService } from '@core/toast.service';
import { Actions } from '@models/enums/actions.enum';
import {
  Configuration,
  ProjectConfiguration,
} from '@models/interfaces/config.model';
import { getCurrentConfig } from '@utils/config.data';
import { KeysText } from '@utils/static.data';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    NgIf,
    NgFor,
    FormsModule,
    MatButton,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIcon,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatTableModule,
    MatInput,
    MatButtonToggleModule,
  ],
})
export class ManagementComponent implements OnInit {
  config: WritableSignal<Actions> = signal(Actions.IMPORT);
  projectName?: string;
  selectedProject?: string;
  list: ProjectConfiguration[] = [];
  selectedConfigurationName: string = this._configService.currentConfigName;
  selectedConfiguration: Configuration = getCurrentConfig();
  isImported = signal(false);
  KeysText = KeysText;
  Actions = Actions;
  @ViewChild('configImported') configImported?: ElementRef;

  get headers(): string[] {
    return Object.keys(this.selectedConfiguration);
  }

  constructor(
    private _configService: ConfigService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.refreshList();
  }

  setConfig(config: Actions) {
    this.config.set(config);
  }

  /**
   * Refreshes the list of configurations by getting all the configurations
   * from ConfigService and filtering out the current configuration.
   */
  refreshList() {
    this.list = this._configService
      .getConfigurationsList()
      .filter(
        (projectConf: ProjectConfiguration) =>
          projectConf.name !== this._configService.currentConfigName
      );
  }

  /**
   * Handles the configuration file selection event by loading the configuration
   * using ConfigService.setData() and then updating the selectedConfiguration
   * property with the loaded configuration. Also sets the isImported signal to
   * true once the configuration has been loaded.
   * @param event the file selection event
   */
  configSelected(event: any) {
    this._configService.setData(event).then((obj: Configuration) => {
      this.selectedConfiguration = obj;
      this.isImported.set(true);
    });
  }

  /**
   * Saves the configuration selected in the component to the ConfigService
   * under the name given in the `projectName` input. Also updates the
   * constants in the ConfigService using the selected configuration and
   * reloads the list of configurations.
   * @returns void
   */
  saveConfig() {
    if (
      this.projectName &&
      this.projectName !== '' &&
      this.configImported?.nativeElement.value
    ) {
      this._configService.updateConstants(this.selectedConfiguration);
      this._configService.saveConfig(this.projectName);
      this.isImported.set(false);
      this._configService.setLastSelectedConfig(this.projectName);
      this.refreshList();
      this.projectName = undefined;
    } else {
      this._toastService.error(
        'Error',
        'Tienes que introducir un nombre e importar un archivo'
      );
    }

    if (this.configImported) {
      this.configImported.nativeElement.value = null;
    }
  }

  /**
   * Loads the configuration selected in the component from the ConfigService
   * and assigns it to the selectedConfiguration property. If the selected
   * configuration does not exist, it sets the configuration to the default
   * configuration. Also updates the ConfigService with the selected
   * configuration and reloads the list of configurations.
   * @returns void
   */
  loadConfig() {
    if (this.selectedProject) {
      this.selectedConfiguration =
        this._configService.loadConfig(this.selectedProject) ??
        getCurrentConfig();
      this._configService.setLastSelectedConfig(this.selectedProject);
      this.refreshList();
    } else {
      this._toastService.error(
        'Error',
        'Tienes que seleccionar una configuración'
      );
    }
  }

  /**
   * Deletes the configuration selected in the component using the ConfigService.
   * If a project is selected, it removes the configuration associated with that
   * project name, resets the selected configuration to the default, and refreshes
   * the list of configurations. If no project is selected, it shows an error
   * message indicating that a configuration must be selected.
   */

  deleteConfig() {
    if (this.selectedProject) {
      this._configService.deleteConfig(this.selectedProject);
      this.selectedConfigurationName = this._configService.currentConfigName;
      this.selectedConfiguration = getCurrentConfig();
      this.refreshList();
    } else {
      this._toastService.error(
        'Error',
        'Tienes que seleccionar una configuración'
      );
    }
  }

  /**
   * Applies the configuration loaded in the component to the ConfigService,
   * using the service's updateConstants method. If there is no selected
   * configuration, it shows an error message indicating that there is no
   * configuration to load.
   */
  applyLoadedConfig() {
    if (this.selectedConfiguration) {
      this._configService.updateConstants(this.selectedConfiguration);
    } else {
      this._toastService.error('Error', 'Error al cargar la configuración');
    }
  }

  /**
   * Refreshes the table of configurations based on the current value of the
   * `config` signal. If the current value is `Actions.IMPORT`, it sets the
   * `selectedConfiguration` to the current configuration. If the current value
   * is either `Actions.LOAD` or `Actions.DELETE`, it loads the configuration
   * associated with the selected project in the component using the
   * `loadConfig` method. If there is no selected project, it does nothing.
   */
  refreshTable() {
    switch (this.config()) {
      case Actions.IMPORT:
        this.selectedConfiguration = getCurrentConfig();
        break;
      case Actions.LOAD:
      case Actions.DELETE:
        if (this.selectedProject) {
          this.loadConfig();
        }
        break;
    }
  }
}

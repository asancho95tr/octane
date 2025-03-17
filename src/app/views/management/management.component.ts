import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
    MatButtonToggleModule,
    MatIcon,
    MatFormField,
    MatLabel,
    MatOption,
    MatTableModule,
  ],
})
export class ManagementComponent implements OnInit {
  config: Actions = Actions.IMPORT;
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

  refreshList() {
    this.list = this._configService
      .getConfigurationsList()
      .filter(
        (projectConf: ProjectConfiguration) =>
          projectConf.name !== this._configService.currentConfigName
      );
  }

  configSelected(event: any) {
    this._configService.setData(event).then((obj: Configuration) => {
      this.selectedConfiguration = obj;
      this.isImported.set(true);
    });
  }

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

  applyLoadedConfig() {
    if (this.selectedConfiguration) {
      this._configService.updateConstants(this.selectedConfiguration);
    } else {
      this._toastService.error('Error', 'Error al cargar la configuración');
    }
  }

  refreshTable() {
    switch (this.config) {
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

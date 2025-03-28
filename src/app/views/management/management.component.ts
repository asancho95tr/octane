import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { ManagementService } from '@core/management.service';
import { KeysText } from '@shared/utils/static.data';
import { CEREMONIES, ENDED_PHASES } from '@shared/utils/config.data';
import { ToastService } from '@core/toast.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
  imports: [
    RouterModule,
    MatButton,
    FormsModule,
    ReactiveFormsModule,
    DropdownComponent,
    MatLabel,
    MatInput,
    MatFormFieldModule,
    MatSlideToggle,
  ],
})
export class ManagementComponent {
  currentProject = signal(this._managementService.lastConfig);
  projectsList = signal<string[]>(this._managementService.projectsNamesList);
  projectsSaved = signal(this._managementService.getConfigurations());
  projectName: string = this.currentProject();

  KeysText = KeysText;

  form: FormGroup;
  ceremoniesOptions: string[] = CEREMONIES;
  closedPhasesOptions: string[] = ENDED_PHASES;

  constructor(
    private _managementService: ManagementService,
    private _fb: FormBuilder,
    private _toastService: ToastService
  ) {
    this.form = this._fb.group({
      estimatedVsInvested: [null, Validators.required],
      defectRatio: [null, Validators.required],
      efficiency: [null, Validators.required],
      defectName: ['', Validators.required],
      mainName: ['', Validators.required],
      showEfficiency: [false, Validators.required],
    });
  }

  /**
   * Sets the current project to the given name.
   * @param projectName The name of the project to set as the current project.
   */
  createProject(projectName: string) {
    this.projectName = projectName;
  }

  /**
   * Loads the specified project configuration into the form and updates the application state.
   * If the project name is valid, it retrieves the configuration, updates the form values,
   * and sets the project as the last used configuration.
   *
   * @param projectName - The name of the project to load, or null if no project is specified.
   */
  loadProject(projectName: string | null) {
    if (projectName) {
      const conf = this._managementService.getConfigurationByName(projectName);
      if (conf) {
        this.form.patchValue({
          ...conf.configuration,
        });
        this.#loadConfig();
        this._managementService.setLastConfig(projectName);
      }

      if (this.projectName !== projectName) {
        this.projectName = projectName;
      }
    }
  }

  /**
   * Adds a new option to the ceremonies and updates the form.
   * Ensures no duplicate options are added to the ceremonies.
   *
   * @param option The option to be added to the ceremonies.
   */
  onCeremoniesAdd(option: string) {
    const ceremonies = [...new Set(...this.ceremoniesOptions, option)];
    this.form.patchValue({ ceremonies: ceremonies });
  }

  /**
   * Removes options from the ceremonies and updates the form.
   *
   * @param options The options to be removed from the ceremonies.
   */
  onCeremoniesRemove(options: string[]) {
    this.form.patchValue({ ceremonies: options });
  }

  /**
   * Adds a new option to the closed phases and updates the form.
   * If the option already exists, it ensures no duplicates are added.
   *
   * @param option The option to be added to the closed phases.
   */
  onClosedPhasesAdd(option: string) {
    const closedPhases = [...new Set(...this.ceremoniesOptions, option)];
    this.form.patchValue({ closedPhases: closedPhases });
  }

  /**
   * Updates the form's closed phases with the given array of options.
   * @param options The array of options to update the form with.
   */
  onClosedPhasesRemove(options: string[]) {
    this.form.patchValue({ closedPhases: options });
  }

  /**
   * Saves the current form configuration and updates the application's constants.
   * If the form is not valid, it logs a message to the console.
   */
  submitForm() {
    if (this.form.valid) {
      this.#loadConfig();
      this._managementService.setConfigutation(this.projectName, {
        ...this.form.value,
      });
      this._toastService.success(
        'Configuración guardada',
        `La configuración ${this.projectName} ha sido guardada correctamente`
      );
    } else {
      this._toastService.error(
        `Error al guardar la configuración`,
        'El formulario no es válido'
      );
    }
  }

  /**
   * Updates application constants with the current form values.
   * This method extracts the form data and passes it to the
   * management service to update the application's configuration constants.
   */

  #loadConfig() {
    this._managementService.updateConstants({
      ...this.form.value,
    });
  }
}

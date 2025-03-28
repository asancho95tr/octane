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
    private _fb: FormBuilder
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

  createProject(projectName: string) {
    this.projectName = projectName;
  }

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

      this.projectName = projectName;
    }
  }

  onCeremoniesAdd(option: string) {
    const ceremonies = [...new Set(...this.ceremoniesOptions, option)];
    this.form.patchValue({ ceremonies: ceremonies });
  }

  onCeremoniesRemove(options: string[]) {
    this.form.patchValue({ ceremonies: options });
  }

  onClosedPhasesAdd(option: string) {
    const closedPhases = [...new Set(...this.ceremoniesOptions, option)];
    this.form.patchValue({ closedPhases: closedPhases });
  }

  onClosedPhasesRemove(options: string[]) {
    this.form.patchValue({ closedPhases: options });
  }

  submitForm() {
    if (this.form.valid) {
      this.#loadConfig();
      this._managementService.setConfigutation(this.projectName, {
        ...this.form.value,
      });
    } else {
      console.log('Form is invalid');
    }
  }

  #loadConfig() {
    this._managementService.updateConstants({
      ...this.form.value,
    });
  }
}

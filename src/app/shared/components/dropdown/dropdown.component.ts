import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  signal,
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  imports: [
    CommonModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements OnChanges, ControlValueAccessor {
  optionCtrl = new FormControl('');
  options = signal<string[]>([]);

  @Input() label: string = '';
  @Input() allowRemove: boolean = false;
  @Input({ required: true }) set defaultOptions(value: string[]) {
    this.options.set(value);
  }
  @Input() defaultSelectedOption: string | null = null;

  @Output() handleAdd = new EventEmitter<string>();
  @Output() handleRemove = new EventEmitter<string[]>();
  @Output() handleSelection = new EventEmitter<string | null>();

  allowAdd: boolean = false;

  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  ngOnChanges() {
    if (this.defaultSelectedOption) {
      this.optionCtrl.setValue(this.defaultSelectedOption);
    }
  }

  writeValue(value: string | null): void {
    this.optionCtrl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
    this.optionCtrl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.optionCtrl.disable();
    } else {
      this.optionCtrl.enable();
    }
  }

  addOption() {
    const value = this.optionCtrl.value?.trim();
    const options = this.options();
    if (value && !options.includes(value)) {
      this.options.update((opts) => [...opts, value]);
      this.optionCtrl.setValue(value);
      this.handleAdd.emit(value);
      this.onChange(value);
    }
    this.allowAdd = false;
  }

  changeSelection() {
    this.allowAdd = false;
    this.handleSelection.emit(this.optionCtrl.value);
    this.onChange(this.optionCtrl.value);
  }

  removeOption(event: MouseEvent, optionToRemove: string) {
    event.stopPropagation();
    this.options.update((opts) => opts.filter((opt) => opt !== optionToRemove));
    this.handleRemove.emit(this.options());
  }
}

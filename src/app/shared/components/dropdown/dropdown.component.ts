import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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

  /**
   * Called when any data-bound property of a directive changes.
   * If `defaultSelectedOption` is provided, it sets this value
   * to the form control (`optionCtrl`).
   */

  ngOnChanges() {
    if (this.defaultSelectedOption) {
      this.optionCtrl.setValue(this.defaultSelectedOption);
    }
  }

  /**
   * Part of the ControlValueAccessor interface, this function is called
   * by Angular when the value of the component changes.
   * It sets the value of the form control (`optionCtrl`) to the given
   * value, but does not emit an event.
   * @param value the new value of the component.
   */
  writeValue(value: string | null): void {
    this.optionCtrl.setValue(value, { emitEvent: false });
  }

  /**
   * Part of the ControlValueAccessor interface, this function is called
   * by Angular to register a callback that will be executed whenever
   * the value of the component changes. The given function will be
   * called with the new value as its argument.
   * @param fn the callback function to register
   */
  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
    this.optionCtrl.valueChanges.subscribe(fn);
  }

  /**
   * Part of the ControlValueAccessor interface, this function is called
   * by Angular to register a callback that will be executed when the
   * component is touched or blurred. The given function will be called
   * when the user interacts with the form control in a way that triggers
   * a touch event.
   * @param fn the callback function to register
   */

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Part of the ControlValueAccessor interface, this function is called
   * by Angular to enable or disable the component based on the value
   * of the given boolean argument.
   * @param isDisabled `true` if the component should be disabled, and
   * `false` if the component should be enabled.
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.optionCtrl.disable();
    } else {
      this.optionCtrl.enable();
    }
  }

  /**
   * Adds the current value of the form control (`optionCtrl`) to the list
   * of options, sets the value of the form control to the new value,
   * emits an `handleAdd` event with the new option, and calls the
   * `onChange` callback with the new value.
   * Sets `allowAdd` to `false` after adding the option.
   */
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

  /**
   * Called when the selection changes.
   * Sets `allowAdd` to `false` and emits a `handleSelection` event with the new value.
   * Also calls the `onChange` callback with the new value.
   */
  changeSelection() {
    this.allowAdd = false;
    this.handleSelection.emit(this.optionCtrl.value);
    this.onChange(this.optionCtrl.value);
  }

  /**
   * Called when the user clicks on the delete button of an option.
   * Filters out the given `optionToRemove` from the list of options,
   * and emits a `handleRemove` event with the new list of options.
   * Also stops the event propagation.
   */
  removeOption(event: MouseEvent, optionToRemove: string) {
    event.stopPropagation();
    this.options.update((opts) => opts.filter((opt) => opt !== optionToRemove));
    this.handleRemove.emit(this.options());
  }
}

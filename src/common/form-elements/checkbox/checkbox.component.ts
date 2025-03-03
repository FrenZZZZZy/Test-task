import {ChangeDetectionStrategy, Component, Input, OnChanges, signal} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {MatError, MatLabel} from '@angular/material/form-field';

@Component({
  selector: 'app-checkbox',
  imports: [MatCheckbox, NgForOf, ReactiveFormsModule, MatLabel, MatError],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements OnChanges {

  @Input() label!: string;
  @Input() options?: Array<{ label: string, value: string }>;
  @Input() control!: FormGroup;
  @Input() required?: boolean = false;

  errorMessage = signal('');

  ngOnChanges(): void {
    if (!this.options) {
      this.options = new Array<{ label: string, value: string }>();
    }
  }

  onCheckboxChange(event: MatCheckboxChange): void {
    const checkBoxValue = event.source.value;
    const selectedValues = this.control.value as string[];

    if (event.checked) {
      this.control.setValue([...selectedValues, checkBoxValue]);
    } else {
      this.control.setValue(selectedValues.filter(value => value !== checkBoxValue));
    }
    this.updateErrorMessage();
  }

  updateErrorMessage() {
    if (this.required && (!this.control.value || !this.control.value.length)) {
      this.errorMessage.set('Please select at least one skill');
    } else {
      this.errorMessage.set('');
    }
  }
}

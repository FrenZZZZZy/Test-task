import {ChangeDetectionStrategy, Component, Input, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {MatOptionModule} from '@angular/material/core';
import {MatLabel, MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-select',
  imports: [MatLabel, MatSelectModule, MatOptionModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent {

  @Input() label!: string;
  @Input() placeholder?: string;
  @Input() options!: Array<{ label: string, value: string }>;
  @Input() control!: FormControl;
  @Input() required?: boolean = false;

  errorMessage = signal('');

  updateErrorMessage() {
    if (this.control.hasError('required')) {
      this.errorMessage.set('You must select a value');
    } else {
      this.errorMessage.set('');
    }
  }

}

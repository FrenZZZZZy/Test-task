import {ChangeDetectionStrategy, Component, Input, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {MatInputModule} from '@angular/material/input';
import {MatFormField} from '@angular/material/form-field';

@Component({
  selector: 'app-input-text',
  imports: [MatFormField, MatInputModule, ReactiveFormsModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextComponent {

  @Input() label!: string;
  @Input() placeholder?: string;
  @Input() control!: FormControl;
  @Input() required?: boolean = false;

  errorMessage = signal('');

  updateErrorMessage() {
    if (this.control.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else {
      this.errorMessage.set('');
    }
  }
}

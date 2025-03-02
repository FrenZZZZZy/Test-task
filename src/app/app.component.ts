import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {merge, Subject, takeUntil} from 'rxjs';

import {CheckboxComponent} from '../common/form-elements/checkbox/checkbox.component';
import {InputTextComponent} from '../common/form-elements/input-text/input-text.component';
import {SelectComponent} from '../common/form-elements/select/select.component';

import {MatLabel} from '@angular/material/input';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';

import {jsonValidator} from '../common/validators/json-validator';
import {FormField} from '../common/interfaces/form-field';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CheckboxComponent, InputTextComponent, SelectComponent, MatLabel, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule],
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  private readonly _formBuilder = inject(FormBuilder);
  form: FormGroup = this._formBuilder.group({});

  private destructor: Subject<void> = new Subject();

  formConfig: FormField[] = [];

  settingObject: FormControl<string | null> = new FormControl('', [Validators.required, jsonValidator()]);
  errorMessage: WritableSignal<string> = signal('');
  isInvalidJSON: boolean = false;

  constructor() {
    merge(this.settingObject.statusChanges, this.settingObject.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit(): void {
    this.settingObject.valueChanges.pipe(takeUntil(this.destructor)).subscribe(value => {
      if (value && !this.settingObject.errors) {
        const parsedConfig: Array<FormField> = JSON.parse(value) as Array<FormField>;
        if (Array.isArray(parsedConfig)) {
          this.formConfig = [];
          parsedConfig.forEach((value: FormField) => {
            this.formConfig.push({
              type: value.type,
              label: value.label,
              placeholder: value.placeholder || '',
              fieldName: value.fieldName,
              options: value.options,
              required: value.required
            })
          })
        }
      }
    });

    // setting preset
    this.settingObject.setValue('[' +
      // 1
      '{' +
      '"type":"input",' +
      '"label":"First Name",' +
      '"placeholder":"first name",' +
      '"fieldName":"firstName",' +
      '"options": [],' +
      '"required": true' +
      '},' +
      // 2
      '{' +
      '"type":"input",' +
      '"label":"Last Name",' +
      '"placeholder":"last name",' +
      '"fieldName":"lastName",' +
      '"options": [],' +
      '"required": false' +
      '},' +
      // 3
      '{' +
      '"type":"select",' +
      '"label":"Marital Status",' +
      '"placeholder":"please select",' +
      '"fieldName":"maritalStatus",' +
      '"options": [{' +
      '"label":"Single",' +
      '"value":"single"' +
      '},' +
      '{' +
      '"label":"Married",' +
      '"value":"married"' +
      '},' +
      '{' +
      '"label":"Divorced",' +
      '"value":"divorced"' +
      '},' +
      '{' +
      '"label":"Widowed",' +
      '"value":"widowed"' +
      '},' +
      '{' +
      '"label":"Separated",' +
      '"value":"separated"' +
      '},' +
      '{' +
      '"label":"Domestic Partnership",' +
      '"value":"domesticPartnership"' +
      '}],' +
      '"required": false' +
      '},' +
      // 4
      '{' +
      '"type":"checkbox",' +
      '"label":"Skills",' +
      '"placeholder":"",' +
      '"fieldName":"skills",' +
      '"options": [{' +
      '"label":"HTML",' +
      '"value":"html"' +
      '},' +
      '{' +
      '"label":"CSS",' +
      '"value":"css"' +
      '},' +
      '{' +
      '"label":"JS",' +
      '"value":"js"' +
      '},' +
      '{' +
      '"label":"TS",' +
      '"value":"ts"' +
      '},' +
      '{' +
      '"label":"Angular",' +
      '"value":"angular"' +
      '}],' +
      '"required": false' +
      '}' +
      // end
      ']');

    this.initForm();
  }

  ngOnDestroy(): void {
    this.destructor.next();
    this.destructor.complete();
  }


  initForm(): void {
    const formControls: { [key: string]: FormControl | FormGroup } = {};
    this.formConfig.forEach((field: FormField) => {
      if (field.type === 'checkbox') {
        formControls[field.fieldName] = new FormControl([], field.required ? Validators.required : null);
      } else {
        formControls[field.fieldName] = new FormControl('', field.required ? Validators.required : null);
      }
    });
    this.form = this._formBuilder.group(formControls);
  }

  updateErrorMessage(): void {
    this.form = this._formBuilder.group({});
    this.initForm();
    if (this.settingObject.hasError('required')) {
      this.errorMessage.set('You must enter a value');
      this.isInvalidJSON = true;
    } else if (this.settingObject.hasError('invalidJson')) {
      this.errorMessage.set('Entered JSON is not valid');
      this.isInvalidJSON = true;
    } else {
      this.errorMessage.set('');
      this.isInvalidJSON = false;
    }
  }

  getControl(fieldName: string): FormControl {
    return this.form.get(fieldName) as FormControl;
  }

  getGroup(fieldName: string): FormGroup {
    return this.form.get(fieldName) as FormGroup;
  }

  submitForm(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

}

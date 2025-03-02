export interface FormField {
  type: 'input' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  fieldName: string;
  options: Array<{
    label: string;
    value: string;
  }>; // type of field can be changed depend on data structure
  required?: boolean;
}

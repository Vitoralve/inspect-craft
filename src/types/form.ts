export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  helpText?: string;
  conditionalLogic?: {
    dependsOn: string;
    condition: 'equals' | 'not_equals' | 'contains';
    value: string;
  };
}

export type FieldType = 
  | 'text'
  | 'rich_text'
  | 'yes_no'
  | 'select'
  | 'signature'
  | 'photo'
  | 'date'
  | 'time'
  | 'number'
  | 'audio'
  | 'file'
  | 'subform'
  | 'instruction';

export interface FormVersion {
  id: string;
  name: string;
  version: number;
  status: 'draft' | 'published';
  fields: FormField[];
  createdAt: Date;
  publishedAt?: Date;
}

export interface FormBuilderState {
  currentForm: FormVersion;
  versions: FormVersion[];
  selectedField: string | null;
  isDragActive: boolean;
}

export interface FieldPaletteItem {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
}
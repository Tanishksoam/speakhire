export type FormCreationMethod = 'template' | 'scratch' | 'import'| 'ai';
export interface Field {
  id: string;
  type: string;
  title?: string;
  label?: string;
  required?: boolean;
  properties?: Record<string, any>;
}

export type FieldType = 
  | 'shortAnswer'
  | 'multipleChoice'
  | 'radio'
  | 'email'
  | 'heading'
  | 'paragraph'
  | 'dropdown'
  | 'pictureChoice'
  | 'date'
  | 'time'
  | 'rating'
  | 'longAnswer'
  | 'slider';

export interface FieldCategory {
  title: string;
  fields: {
    type: FieldType;
    label: string;
    icon: string;
  }[];
}
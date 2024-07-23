import { Subfield } from "./subfield.model";

export interface Column {
  field: string;
  header: string;
  type: string;
  values?: any[];
  label?: string;
  key?: string;
  subfield?: Subfield[];
}
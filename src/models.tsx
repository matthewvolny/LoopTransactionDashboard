export type Heading = {
  label: string;
  sortable: boolean;
};

export type LabelAndValue = {
  label: string;
  value: string;
};

export interface IdAndValues {
  id: number;
  values: LabelAndValue[];
}

export interface Payments {
  headings: Heading[];
  records: IdAndValues[];
}

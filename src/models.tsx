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

export interface SuccessfulPayments {
  headings: Heading[];
  records: IdAndValues[];
}

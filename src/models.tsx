export type Obj = {
  [key: string]: number;
};

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

export type NetworkInfo = {
  name: string;
  id: string;
  url: string;
};

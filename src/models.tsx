// export interface Transactions {
//   headings: Heading[];
//   records: SuccessfulPayments[];
// }

export interface SuccessfulPayments {
  transaction: string;
  accountProcessed: string;
  contractAddress: string;
  feeAmount: string;
  netAmount: string;
  paymentToken: string;
  processedForDate: string;
  processor: string;
}

export interface SuccessfulPayments {
  accountProcessed: string;
  contractAddress: string;
  feeAmount: string;
  netAmount: string;
  paymentToken: string;
  processedForDate: string;
  processor: string;
  transaction: string;
}

export type TablePair = {
  label: string;
  value: string;
};

export interface FormattedSuccessfulPayments {
  accountProcessed: TablePair;
  contractAddress: TablePair;
  feeAmount: TablePair;
  netAmount: TablePair;
  paymentToken: TablePair;
  processedForDate: TablePair;
  processor: TablePair;
  transaction: TablePair;
}

// export type Heading = {
//   label: string;
//   sortable: boolean;
// };

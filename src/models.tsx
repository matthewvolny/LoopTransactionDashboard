export interface Transactions {
  headings: Heading[];
  records: SuccessfulPayments[];
}

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

export type Heading = {
  label: string;
  sortable: boolean;
};

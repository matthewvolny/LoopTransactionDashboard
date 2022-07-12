import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Payments, NetworkInfo } from "./models";
import { formatDateTimeFromSeconds } from "./utils/dateTimeConverison";
import { Table } from "./components/Table";
import { AccordionTable } from "./components/AccordionTable";
import { DropdownProcessors } from "./components/DropdownProcessors";
import { DropdownNetworks } from "./components/DropdownNetworks";
import { PaymentTypeSelector } from "./components/PaymentTypeSelector";
import "./App.css";

//!for getting specific tokenid for contract address:
//!1)loop through all account addresses, push each unique address to object(as key)
//!2)make fetch requests for each key, tokenId is value for key(address).
//!3)loop through all account addresses adding appropriate tokenId

function App() {
  // const [successfulPayments, setSuccessfulPayments] = useState<Payments>();
  // const [failedPayments, setFailedPayments] = useState<Payments>();
  const [payments, setPayments] = useState<any>();
  const [processor, setProcessor] = useState<string>(
    "0xcbda2f4d091331c5ca4c91ebbf5bd51162edd73e"
  );
  const [network, setNetwork] = useState<string>(
    "https://api.thegraph.com/subgraphs/name/loopcrypto/loop-polygon"
  );

  //1
  useEffect(() => {
    fetchPaymentInfo(processor, network);
  }, [processor, network]);

  //2
  const fetchPaymentInfo = (processor: string, network: string) => {
    const APIURL = `${network}`;
    const tokensQuery = `
  query {
    successfulPayments (where: {processor: "${processor}"}) {
    transaction
    contractAddress
    processor
    accountProcessed
    processedForDate
    feeAmount
    netAmount
    paymentToken
  }
  failedPayments (where: {processor: "${processor}"}) {
    transaction
    contractAddress
    processor
    accountProcessed
    token
    reason
  }
  subscriptionDetails{
    transaction 
    contractAddress 
    subscriber    
    startDate 
    frequency    
    endDate
    lastPaymentDate
    paymentToken
    subscriptionAmount
  }
  }
`;
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });
    client
      .query({
        query: gql(tokensQuery),
      })
      .then((data) => {
        // console.log(data.data);
        let detailedPaymentData = addSubscriptionDataToPayments(data.data);
        console.log(detailedPaymentData);
        let paymentBatches = createPaymentBatchesObject(detailedPaymentData);
        console.log(paymentBatches);
        //!right here
        formatPaymentsForTable(paymentBatches, detailedPaymentData);
        setPayments(
          formatPaymentsForTable(paymentBatches, detailedPaymentData)
        );
        //successful and failed payments
        // let successfulPayments = data.data.successfulPayments;
        // let failedPayments = data.data.failedPayments;
        // setSuccessfulPayments({
        //   headings: headings.successfulPaymentHeadings,
        //   records: successfulPayments.map((transaction: any) => {
        //     return formatSuccessfulPayments(transaction);
        //   }),
        // });
        // setFailedPayments({
        //   headings: headings.failedPaymentHeadings,
        //   records: failedPayments.map((transaction: any) => {
        //     return formatFailedPayments(transaction);
        //   }),
        // });
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  };

  //adds subscription data properties to successful and failed payments - used a 'lookup table
  const addSubscriptionDataToPayments = (data: any) => {
    const subscriptions = {};
    data.subscriptionDetails.forEach((subscription: any) => {
      //@ts-ignore
      subscriptions[
        `${subscription.contractAddress}-${subscription.subscriber}`
      ] = subscription;
    });
    console.log("subscriptions");
    console.log("SUBSCRIPTIONS: ", subscriptions);

    const detailedSuccessfulPaymentsData = data.successfulPayments.map(
      (payment: any) => {
        let subscriptionIdentifier = `${payment.contractAddress}-${payment.accountProcessed}`;
        //@ts-ignore
        if (subscriptions[subscriptionIdentifier]) {
          //@ts-ignore
          console.log("FOUND:", subscriptions[subscriptionIdentifier]);
          //@ts-ignore
          const {
            startDate,
            frequency,
            endDate,
            lastPaymentDate,
            paymentToken,
            subscriptionAmount,
            //@ts-ignore
          } = subscriptions[subscriptionIdentifier];
          return {
            ...payment,
            startDate,
            frequency,
            endDate,
            lastPaymentDate,
            paymentToken,
            subscriptionAmount,
          };
        }
      }
    );
    console.log("DETAILED: ", detailedSuccessfulPaymentsData);

    const detailedFailedPaymentsData = data.failedPayments.map(
      (payment: any) => {
        let subscriptionIdentifier = `${payment.contractAddress}-${payment.accountProcessed}`;
        //@ts-ignore
        if (subscriptions[subscriptionIdentifier]) {
          //@ts-ignore
          console.log("FOUNDFAILED:", subscriptions[subscriptionIdentifier]);
          //@ts-ignore
          const {
            startDate,
            frequency,
            endDate,
            lastPaymentDate,
            paymentToken,
            subscriptionAmount,
            //@ts-ignore
          } = subscriptions[subscriptionIdentifier];
          return {
            ...payment,
            startDate,
            frequency,
            endDate,
            lastPaymentDate,
            paymentToken,
            subscriptionAmount,
          };
        }
      }
    );
    console.log("DETAILEDFAILED: ", detailedFailedPaymentsData);

    return {
      successfulPayments: detailedSuccessfulPaymentsData,
      failedPayments: detailedFailedPaymentsData,
    };
  };

  //create payment batches object
  const createPaymentBatchesObject = (detailedPaymentData: any) => {
    //for each unique batchID push batch info to array(with just "id", "date", "recipient")
    // console.log("payments");
    // console.log(detailedPaymentData);
    type Obj = {
      [key: string]: number;
    };

    //build transaction batches object
    let batches: any = { successfulBatches: [], failedBatches: [] };
    let batchCount: Obj = {};
    //create successful batches array
    const createSuccessfulBatchesArray = (successfulPayments: any) => {
      successfulPayments.forEach((payment: any) => {
        let batchId = payment.transaction;
        if (!batchCount.batchId) {
          batchCount[batchId] = 1;
          batches.successfulBatches.push({
            transaction: { label: batchId, value: batchId },
            processedForDate: {
              label: payment.processedForDate,
              value: payment.processedForDate,
            },
            contractAddress: {
              label: payment.contractAddress,
              value: payment.contractAddress,
            },
          });
        }
      });
    };

    //create failed batches array
    const createFailedBatchesArray = (failedPayments: any) => {
      failedPayments.forEach((payment: any) => {
        let batchId = payment.transaction;
        if (!batchCount.batchId) {
          batchCount[batchId] = 1;
          batches.failedBatches.push({
            transaction: { label: batchId, value: batchId },
            processedForDate: {
              label: payment.createdAt, //!this is distinct for failed batches
              value: payment.createdAt, //!this is distinct for failed batches
            },
            contractAddress: {
              label: payment.contractAddress,
              value: payment.contractAddress,
            },
          });
        }
      });
    };

    createSuccessfulBatchesArray(detailedPaymentData.successfulPayments);
    createFailedBatchesArray(detailedPaymentData.failedPayments);

    //  console.log("batches");
    //  console.log(batches);
    return batches;
  };

  const formatPaymentsForTable = (batches: any, data: any) => {
    //3)map batches, and look for matches in all transactions that match the batchId (transaction)
    // when transaction found matching batchId, add it to 'transactioninfoarray', and at last iteration, add transactionInfoArray to batch object.
    //!only finding transactions from successful batches array
    let batchArray = batches.successfulBatches.map((batch: any) => {
      //!find successful transactions for a given batchId
      const foundSuccessfulTransactions = data.successfulPayments.filter(
        ({ transaction }: any) => batch.transaction.label === transaction
      );
      // console.log(foundSuccessfulTransactions);

      const formattedFoundSuccessfulTransactions =
        foundSuccessfulTransactions.map(
          ({
            accountProcessed,
            endDate,
            feeAmount,
            frequency,
            lastPaymentDate,
            netAmount,
            paymentToken,
            processor,
            startDate,
            subscriptionAmount,
            transaction,
          }: any) => {
            return [
              {
                name: "accountProcessed",
                label: accountProcessed,
                value: accountProcessed,
              },
              { name: "endDate", label: endDate, value: endDate },
              { name: "feeAmount", label: feeAmount, value: feeAmount },
              { name: "frequency", label: frequency, value: frequency },
              {
                name: "lastPaymentDate",
                label: lastPaymentDate,
                value: lastPaymentDate,
              },
              { name: "netAmount", label: netAmount, value: netAmount },
              {
                name: "paymentToken",
                label: paymentToken,
                value: paymentToken,
              },
              { name: "processor", label: processor, value: processor },
              { name: "startDate", label: startDate, value: startDate },
              {
                name: "subscriptionAmount",
                label: subscriptionAmount,
                value: subscriptionAmount,
              },
              { name: "transaction", label: transaction, value: transaction },
            ];
          }
        );
      // console.log(formattedFoundSuccessfulTransactions);

      //!find failed transactions for a given batchId
      const foundFailedTransactions = data.failedPayments.filter(
        ({ transaction }: any) => batch.transaction.label === transaction
      );
      // console.log(foundFailedTransactions);

      const formattedFoundFailedTransactions = foundFailedTransactions.map(
        ({
          accountProcessed,
          endDate,
          feeAmount,
          frequency,
          lastPaymentDate,
          netAmount,
          token, //!called 'paymentToken' in 'successfulPayment'
          processor,
          startDate,
          createdAt,
          subscriptionAmount,
          reason,
          transaction,
        }: any) => {
          return [
            {
              name: "accountProcessed",
              label: accountProcessed,
              value: accountProcessed,
            },
            { name: "endDate", label: endDate, value: endDate },
            { name: "feeAmount", label: feeAmount, value: feeAmount },
            { name: "frequency", label: frequency, value: frequency },
            {
              name: "lastPaymentDate",
              label: lastPaymentDate,
              value: lastPaymentDate,
            },
            { name: "netAmount", label: netAmount, value: netAmount },
            { name: "token", label: token, value: token }, //!called 'paymentToken' in 'successfulPayment'
            { name: "processor", label: processor, value: processor },
            { name: "startDate", label: startDate, value: startDate },
            {
              name: "subscriptionAmount",
              label: subscriptionAmount,
              value: subscriptionAmount,
            },
            { name: "reason", label: reason, value: reason },
            { name: "transaction", label: transaction, value: transaction },
          ];
        }
      );

      console.log(formattedFoundFailedTransactions);

      return foundSuccessfulTransactions || foundFailedTransactions
        ? {
            ...batch,
            payments: {
              successfulPayments: {
                heading: [
                  {
                    name: "accountProcessed",
                    label: "Subscriber Wallet",
                    sortable: "y",
                  },
                  { name: "endDate", label: "End Date", sortable: "y" },
                  { name: "feeAmount", label: "Fee", sortable: "y" },
                  { name: "frequency", label: "Frequency", sortable: "y" },
                  {
                    name: "lastPaymentDate",
                    label: "Last Payment Date",
                    sortable: "y",
                  },
                  { name: "netAmount", label: "Net Amount", sortable: "y" },
                  {
                    name: "paymentToken",
                    label: "paymentToken ",
                    sortable: "y",
                  },
                  { name: "processor", label: "Processor", sortable: "y" },
                  { name: "startDate", label: "Start Date", sortable: "y" },
                  {
                    name: "subscriptionAmount",
                    label: "Subscription Amount",
                    sortable: "y",
                  },
                  {
                    name: "transaction",
                    label: "Transaction (matches batch Id)",
                    sortable: "y",
                  }, //'transaction' not strictly needed here
                ],
                paymentsArray: formattedFoundSuccessfulTransactions,
              },
              failedPayments: {
                heading: [
                  {
                    name: "accountProcessed",
                    label: "Subscriber Wallet",
                    sortable: "y",
                  },
                  { name: "endDate", label: "End Date", sortable: "y" },
                  { name: "feeAmount", label: "Fee", sortable: "y" },
                  { name: "frequency", label: "Frequency", sortable: "y" },
                  {
                    name: "lastPaymentDate",
                    label: "Last Payment Date",
                    sortable: "y",
                  },
                  { name: "netAmount", label: "Net Amount", sortable: "y" },
                  { name: "token", label: "Token ", sortable: "y" }, //!called 'paymentToken' in 'successfulPayment'
                  { name: "processor", label: "Processor", sortable: "y" },
                  { name: "startDate", label: "Start Date", sortable: "y" },
                  {
                    name: "subscriptionAmount",
                    label: "Subscription Amount",
                    sortable: "y",
                  },
                  { name: "reason", label: "Reason", sortable: "y" },
                  {
                    name: "transaction",
                    label: "Transaction (matches batch Id)",
                    sortable: "y",
                  },
                ],
                paymentsArray: formattedFoundFailedTransactions,
              },
            },
          }
        : batch;
    });
    console.log("BATCH-ARRAY", batchArray);

    //add headings
    const dataFormattedForTable = {
      headings: {
        batchHeadings: [
          { name: "contractAddress", label: "Recipient", sortable: "y" },
          { name: "processedForDate", label: "Date", sortable: "y" },
          { name: "transaction", label: "Id", sortable: "y" },
        ],
      },
      batchData: batchArray,
    };
    console.log(dataFormattedForTable);
    return dataFormattedForTable;
  };

  //3
  const formatSuccessfulPayments = (transaction: any) => {
    //formats 'processedForDate' value
    let formattedProcessedForDate = formatDateTimeFromSeconds(
      Number(transaction.processedForDate)
    );

    return {
      id: Math.floor(Math.random() * 1000000000),
      values: [
        {
          label: `transaction`,
          value: transaction.transaction,
        },
        {
          label: `contractAddress`,
          value: transaction.contractAddress,
        },
        {
          label: `processor`,
          value: transaction.processor,
        },
        {
          label: `accountProcessed`,
          value: transaction.accountProcessed,
        },
        {
          label: `processedForDate`,
          value: formattedProcessedForDate,
        },
        {
          label: `feeAmount`,
          value: transaction.feeAmount,
        },
        {
          label: `netAmount`,
          value: transaction.netAmount,
        },
        {
          label: `paymentToken`,
          value: transaction.paymentToken,
        },
      ],
    };
  };

  //4
  const formatFailedPayments = (transaction: any) => {
    //formats 'processedForDate' value
    let formattedProcessedForDate = formatDateTimeFromSeconds(
      Number(transaction.processedForDate)
    );

    return {
      id: Math.floor(Math.random() * 1000000000),
      values: [
        {
          label: `transaction`,
          value: transaction.transaction,
        },
        {
          label: `contractAddress`,
          value: transaction.contractAddress,
        },
        {
          label: `processor`,
          value: transaction.processor,
        },
        {
          label: `accountProcessed`,
          value: transaction.accountProcessed,
        },
        {
          label: `token`,
          value: formattedProcessedForDate,
        },
        {
          label: `reason`,
          value: transaction.feeAmount,
        },
      ],
    };
  };

  const processors: string[] = [
    "0xcbda2f4d091331c5ca4c91ebbf5bd51162edd73e",
    "0x71c56de65f9c0462103c35cc4f64b160a58a9227",
    "0xb7443f7a2333497c7cdca1747a32a9b49160ac11",
    "0x0000000000000000000000000000000000000000",
  ];

  const networkURLs: NetworkInfo[] = [
    {
      name: "Polygon",
      url: "https://api.thegraph.com/subgraphs/name/loopcrypto/loop-polygon",
    },
    {
      name: "Rinkeby",
      url: "https://api.thegraph.com/subgraphs/name/loopcrypto/loop-rinkeby",
    },
  ];

  return (
    <div>
      <div>Select bot</div>
      <DropdownProcessors processors={processors} setProcessor={setProcessor} />
      <div>Select Network</div>
      <DropdownNetworks networkURLs={networkURLs} setNetwork={setNetwork} />
      <AccordionTable data={payments} />
    </div>
  );
}

export default App;

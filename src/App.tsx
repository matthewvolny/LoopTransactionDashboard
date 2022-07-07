import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Payments, NetworkInfo } from "./models";
import { formatDateTimeFromSeconds } from "./utils/dateTimeConverison";
import { Table } from "./components/Table";
import { DropdownProcessors } from "./components/DropdownProcessors";
import { DropdownNetworks } from "./components/DropdownNetworks";
import { PaymentTypeSelector } from "./components/PaymentTypeSelector";
import "./App.css";
import { createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";
// import { Container } from "./components/Container.styled";

// let batchDataArray = [
//   {
//     batchInfo: {
//       id: { label: "x", value: "y" },
//       date: { label: "x", value: "y" },
//       recipient: { label: "x", value: "y" },
//       transactionInfo: [
//         {
//           subscriber: { label: "x", value: "y" },
//           amountTransferred: { label: "x", value: "y" },
//           fee: { label: "x", value: "y" },
//           tokenId: { label: "x", value: "y" },
//         },
//         {
//           subscriber: { label: "x", value: "y" },
//           amountTransferred: { label: "x", value: "y" },
//           fee: { label: "x", value: "y" },
//           tokenId: { label: "x", value: "y" },
//         },
//       ],
//     },
//   },
//   {
//     batchInfo: {
//       id: { label: "x", value: "y" },
//       date: { label: "x", value: "y" },
//       recipient: { label: "x", value: "y" },
//       transactionInfo: [
//         {
//           subscriber: { label: "x", value: "y" },
//           amountTransferred: { label: "x", value: "y" },
//           fee: { label: "x", value: "y" },
//           tokenId: { label: "x", value: "y" },
//         },
//       ],
//     },
//   },
// ];

// const successfulPaymentsDataForTable = {
//   batchHeadings: {
//     id: { label: "x", sortable: "y" },
//     date: { label: "x", sortable: "y" },
//     recipient: { label: "x", sortable: "y" },
//   },
//   transactionHeadings: {
//     subscriber: { label: "x", value: "y" },
//     amountTransferred: { label: "x", value: "y" },
//     fee: { label: "x", value: "y" },
//     tokenId: { label: "x", value: "y" },
//   },
//   batchDataArray: [
//     {
//       batchInfo: {
//         id: { label: "x", value: "y" },
//         date: { label: "x", value: "y" },
//         recipient: { label: "x", value: "y" },
//         transactionInfo: [
//           {
//             subscriber: { label: "x", value: "y" },
//             amountTransferred: { label: "x", value: "y" },
//             fee: { label: "x", value: "y" },
//             tokenId: { label: "x", value: "y" },
//           },
//           {
//             subscriber: { label: "x", value: "y" },
//             amountTransferred: { label: "x", value: "y" },
//             fee: { label: "x", value: "y" },
//             tokenId: { label: "x", value: "y" },
//           },
//         ],
//       },
//     },
//     {
//       batchInfo: {
//         id: { label: "x", value: "y" },
//         date: { label: "x", value: "y" },
//         recipient: { label: "x", value: "y" },
//         transactionInfo: [
//           {
//             subscriber: { label: "x", value: "y" },
//             amountTransferred: { label: "x", value: "y" },
//             fee: { label: "x", value: "y" },
//             tokenId: { label: "x", value: "y" },
//           },
//           {
//             subscriber: { label: "x", value: "y" },
//             amountTransferred: { label: "x", value: "y" },
//             fee: { label: "x", value: "y" },
//             tokenId: { label: "x", value: "y" },
//           },
//         ],
//       },
//     },
//   ],
// };

//Rinkeby contract address =  "0xc11c7719689562be72c867e573bd7a84e2777dc3"
//Polygon contract addresses = "0x6790242ca72e488e43d388947667ad207f5094c5", "0xa20867f95822561eedc81fdea7faf8b965348417"

// example query from shane
// {
//   subscriptionDetails (where:{contractAddress: "0x6790242ca72e488e43d388947667ad207f5094c5", subscriber:"0x38487e6147928c014a749795a04b67ccc95efe61"}) {
//     paymentTokenSymbol
//   }
// }

//!for getting specific tokenid for contract address:
//1)loop through all account addresses, push each unique address to object(as key)
//2)make fetch requests for each key, tokenId is value for key(address).
//3)loop through all account addresses adding appropriate tokenId

function App() {
  const [successfulPayments, setSuccessfulPayments] = useState<Payments>();
  const [failedPayments, setFailedPayments] = useState<Payments>();
  const [payments, setPayments] = useState();
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

  const headings = {
    successfulPaymentHeadings: [
      { label: `Batch Id (transaction)`, sortable: true },
      { label: `Recipient (contractAddress)`, sortable: true },
      { label: `processor`, sortable: true },
      { label: `Subscriber (accountProcessed)`, sortable: true },
      { label: `Date (processedForDate)`, sortable: true },
      { label: `feeAmount`, sortable: true },
      { label: `Total Amount Transferred (netAmount)`, sortable: true },
      { label: `paymentToken`, sortable: true },
    ],
    failedPaymentHeadings: [
      { label: `Batch Id (transaction)`, sortable: true },
      { label: `Recipient (contractAddress)`, sortable: true },
      { label: `processor`, sortable: true },
      { label: `Subscriber (accountProcessed)`, sortable: true },
      { label: `token`, sortable: true },
      { label: `reason`, sortable: true },
    ],
  };

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
        console.log(data.data);
        setPayments(addSubscriptionDataToPayments(data.data));

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

  const addSubscriptionDataToPayments = (data: any) => {
    // Loop through the objects in data.successfulPayments...
    const detailedSuccessfulPaymentsData = data.successfulPayments.map(
      (payment: any) => {
        // Search for an object in data.subscriptionDetails with the same contractAddress and accountProcessed/subscriber
        const found = data.subscriptionDetails.find(
          ({ contractAddress, subscriber }: any) =>
            payment.contractAddress === contractAddress &&
            payment.accountProcessed === subscriber
        );
        // If you find an object that matches, copy all properties from the original object and overwrite some
        // If you didn't find a match, just return the original object as is
        return found
          ? {
              ...payment,
              startDate: found.startDate,
              frequency: found.frequency,
              endDate: found.endDate,
              lastPaymentDate: found.lastPaymentDate,
              paymentToken: found.paymentToken,
              subscriptionAmount: found.subscriptionAmount,
            }
          : payment;
      }
    );

    const detailedFailedPaymentsData = data.failedPayments.map(
      (payment: any) => {
        // Search for an object in data.subscriptionDetails with the same contractAddress and accountProcessed/subscriber
        const found = data.subscriptionDetails.find(
          ({ contractAddress, subscriber }: any) =>
            payment.contractAddress === contractAddress &&
            payment.accountProcessed === subscriber
        );
        // If you find an object that matches, copy all properties from the original object and overwrite some
        // If you didn't find a match, just return the original object as is
        return found
          ? {
              ...payment,
              startDate: found.startDate,
              frequency: found.frequency,
              endDate: found.endDate,
              lastPaymentDate: found.lastPaymentDate,
              paymentToken: found.paymentToken,
              subscriptionAmount: found.subscriptionAmount,
            }
          : payment;
      }
    );
    return {
      SuccessfulPayments: detailedSuccessfulPaymentsData,
      failedPayments: detailedFailedPaymentsData,
    };
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
      <div>Successful Payments</div>
      <Table data={successfulPayments} />
      <div>Failed Payments</div>
      <Table data={failedPayments} />
    </div>
  );
}

export default App;

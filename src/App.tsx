import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import "./App.css";
import { SuccessfulPayments } from "./models";
import { formatDateTimeFromSeconds } from "./utils/dateTimeConverison";
import { Table } from "./components/Table";

function App() {
  const [successfulPayments, setSuccessfulPayments] =
    useState<SuccessfulPayments>();
  // const [transactions, setTransactions] = useState<Transactions>();

  //1
  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  const headings = [
    { label: `transaction`, sortable: true },
    { label: `contractAddress`, sortable: true },
    { label: `processor`, sortable: true },
    { label: `accountProcessed`, sortable: true },
    { label: `processedForDate`, sortable: true },
    { label: `feeAmount`, sortable: true },
    { label: `netAmount`, sortable: true },
    { label: `paymentToken`, sortable: true },
  ];

  //2
  const fetchSubscriptionInfo = () => {
    const APIURL =
      "https://api.thegraph.com/subgraphs/name/loopcrypto/loop-polygon";

    const tokensQuery = `
  query {
    successfulPayments (where: { processor: "0xcbda2f4d091331c5ca4c91ebbf5bd51162edd73e" }) {
    transaction
    contractAddress
    processor
    accountProcessed
    processedForDate
    feeAmount
    netAmount
    paymentToken
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
        console.log(data.data.successfulPayments);
        let successfulPayments = data.data.successfulPayments;
        let formattedSuccessfulPayments = successfulPayments.map(
          (transaction: any) => {
            return formatSuccessfulPaymentsDataForTable(transaction);
          }
        );

        setSuccessfulPayments({
          headings: headings,
          records: formattedSuccessfulPayments,
        });
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  };

  //3
  const formatSuccessfulPaymentsDataForTable = (transaction: any) => {
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

  // const headings = [
  //   { label: `transaction`, sortable: true },
  //   { label: `contractAddress`, sortable: true },
  //   { label: `processor`, sortable: true },
  //   { label: `accountProcessed`, sortable: true },
  //   { label: `processedForDate`, sortable: true },
  //   { label: `feeAmount`, sortable: true },
  //   { label: `netAmount`, sortable: true },
  //   { label: `paymentToken`, sortable: true },
  // ];

  // useEffect(() => {
  //   console.log({ headings: headings, records: successfulPayments });
  //   setTransactions({ headings: headings, records: successfulPayments });
  // }, [successfulPayments]);

  return (
    <div>
      <div>Transaction Data</div>
      <div>Polygon Network</div>
      <Table data={successfulPayments} />;
    </div>
  );
}

export default App;

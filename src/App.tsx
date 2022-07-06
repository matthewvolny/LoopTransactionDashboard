import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import "./App.css";
import { SuccessfulPayments } from "./models";
import { formatDateTimeFromSeconds } from "./utils/dateTimeConverison";
import { Table } from "./components/Table";
import { Dropdown } from "./components/Dropdown";

function App() {
  const [successfulPayments, setSuccessfulPayments] =
    useState<SuccessfulPayments>();
  const [processor, setProcessor] = useState<string>(
    "0xcbda2f4d091331c5ca4c91ebbf5bd51162edd73e"
  );

  //1
  useEffect(() => {
    fetchSubscriptionInfo(processor);
  }, [processor]);

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
  const fetchSubscriptionInfo = (processor: string) => {
    const APIURL =
      "https://api.thegraph.com/subgraphs/name/loopcrypto/loop-polygon";

    const tokensQuery = `
  query {
    successfulPayments (where: { processor: "${processor}" }) {
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

  return (
    <div>
      <div>
        <span>Choose processor</span>
        <Dropdown setProcessor={setProcessor} />
        <span>from</span>
        <span>Network (Polygon)</span>
      </div>
      {processor ? (
        <Table data={successfulPayments} />
      ) : (
        <div>Enter processor and network</div>
      )}
    </div>
  );
}

export default App;
